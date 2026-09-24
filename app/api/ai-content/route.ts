import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Models khả dụng theo thứ tự ưu tiên
const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-3-flash-preview",
  "gemini-pro-latest",
];

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { message: "GEMINI_API_KEY chưa được cấu hình trong .env" },
        { status: 500 },
      );
    }

    const { tensanpham, mota, gia, tenloai } = await req.json();

    if (!tensanpham) {
      return NextResponse.json(
        { message: "Vui lòng nhập tên sản phẩm" },
        { status: 400 },
      );
    }

    // Prompt rõ ràng, yêu cầu JSON schema cụ thể
    const prompt = `Bạn là chuyên gia marketing thời trang Việt Nam. Tạo nội dung marketing cho sản phẩm:
- Tên: ${tensanpham}
- Mô tả: ${mota || "Không có"}
- Giá: ${gia ? Number(gia).toLocaleString("vi-VN") + "đ" : "Chưa có"}
- Loại: ${tenloai || "Quần áo thời trang"}

Tạo nội dung tiếng Việt hấp dẫn cho 8 trường sau.`;

    // JSON Schema cho response
    const responseSchema = {
      type: "OBJECT",
      properties: {
        tenSanPhamHapDan: {
          type: "STRING",
          description: "Tên sản phẩm hấp dẫn dưới 80 ký tự",
        },
        seoTitle: {
          type: "STRING",
          description: "SEO title tối ưu Google 50-60 ký tự",
        },
        seoKeywords: {
          type: "STRING",
          description: "Ít nhất 8 từ khóa tiếng Việt, cách nhau bằng dấu phẩy",
        },
        captionTiktok: {
          type: "STRING",
          description: "Caption TikTok viral Gen Z 150-200 ký tự",
        },
        captionFacebook: {
          type: "STRING",
          description: "Caption Facebook chuyên nghiệp 200-300 ký tự",
        },
        noiDungShopee: {
          type: "STRING",
          description: "Mô tả sản phẩm Shopee chi tiết 300-400 ký tự",
        },
        hashtag: {
          type: "STRING",
          description: "Ít nhất 15 hashtag tiếng Việt về thời trang",
        },
        traLoiKhachHang: {
          type: "STRING",
          description: "5 câu hỏi thường gặp và câu trả lời",
        },
      },
      required: [
        "tenSanPhamHapDan",
        "seoTitle",
        "seoKeywords",
        "captionTiktok",
        "captionFacebook",
        "noiDungShopee",
        "hashtag",
        "traLoiKhachHang",
      ],
    };

    let lastErrorMsg = "";

    for (const model of GEMINI_MODELS) {
      try {
        console.log(`[AI-Content] Trying: ${model}`);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
              responseMimeType: "application/json",
              responseSchema: responseSchema,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errMsg = errorData?.error?.message || `HTTP ${response.status}`;
          console.error(`[AI-Content] ${model} failed: ${errMsg}`);
          lastErrorMsg = errMsg;

          // Nếu model không support responseSchema, thử không có schema
          if (
            errMsg.includes("responseSchema") ||
            errMsg.includes("response_schema") ||
            errMsg.includes("400")
          ) {
            console.log(`[AI-Content] Retrying ${model} without schema...`);
            const response2 = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text:
                          prompt +
                          `\n\nTrả về JSON với các field: tenSanPhamHapDan, seoTitle, seoKeywords, captionTiktok, captionFacebook, noiDungShopee, hashtag, traLoiKhachHang`,
                      },
                    ],
                  },
                ],
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 2048,
                  responseMimeType: "application/json",
                },
              }),
            });

            if (!response2.ok) {
              const e2 = await response2.json().catch(() => ({}));
              lastErrorMsg = e2?.error?.message || `HTTP ${response2.status}`;
              continue;
            }

            const data2 = await response2.json();
            const text2 =
              data2?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (text2) {
              try {
                const parsed = JSON.parse(
                  text2
                    .replace(/```json\n?/g, "")
                    .replace(/```\n?/g, "")
                    .trim(),
                );
                console.log(`[AI-Content] Success (no-schema): ${model}`);
                return NextResponse.json(
                  { success: true, data: parsed, model },
                  { status: 200 },
                );
              } catch {
                lastErrorMsg = "Parse JSON thất bại";
                continue;
              }
            }
          }
          continue;
        }

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        if (!rawText) {
          lastErrorMsg = "Gemini trả về kết quả rỗng";
          console.error(`[AI-Content] Empty response from ${model}`);
          continue;
        }

        console.log(
          `[AI-Content] Raw response (first 300 chars): ${rawText.substring(0, 300)}`,
        );

        // Parse JSON - responseMimeType đã đảm bảo là JSON
        try {
          const cleaned = rawText
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();
          const aiContent = JSON.parse(cleaned);
          console.log(`[AI-Content] ✅ Success with model: ${model}`);
          return NextResponse.json(
            { success: true, data: aiContent, model },
            { status: 200 },
          );
        } catch (parseErr) {
          // Thử tìm JSON object trong text
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              const aiContent = JSON.parse(jsonMatch[0]);
              console.log(
                `[AI-Content] ✅ Success (regex extract) with model: ${model}`,
              );
              return NextResponse.json(
                { success: true, data: aiContent, model },
                { status: 200 },
              );
            } catch {}
          }
          lastErrorMsg = `Parse JSON thất bại. Raw: ${rawText.substring(0, 100)}`;
          console.error(
            `[AI-Content] Parse failed for ${model}:`,
            rawText.substring(0, 200),
          );
          continue;
        }
      } catch (fetchErr: any) {
        lastErrorMsg = fetchErr.message;
        console.error(`[AI-Content] Fetch error ${model}:`, fetchErr.message);
        continue;
      }
    }

    return NextResponse.json(
      { message: `Lỗi tạo nội dung AI: ${lastErrorMsg}` },
      { status: 500 },
    );
  } catch (error: any) {
    console.error("[AI-Content] Server error:", error.message);
    return NextResponse.json(
      { message: "Lỗi server: " + error.message },
      { status: 500 },
    );
  }
}
