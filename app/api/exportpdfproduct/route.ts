import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  try {
    const { data, title } = await req.json();
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    // Generate product rows HTML
    const productRows = data.map((item: any, index: number) => {
      // Properly format size information
      const sizes =
        item.ProductSizes && item.ProductSizes.length > 0
          ? item.ProductSizes.map(
              (ps: any) =>
                `${ps.size?.tenSize || `Size ${ps.idSize}`}: ${ps.soluong}`
            ).join(", ")
          : "Không có thông tin";

      return `
        <tr>
          <td style="text-align: center">${index + 1}</td>
          <td style="text-align: center">${item.idsanpham}</td>
          <td>${item.tensanpham || ""}</td>
          <td>${item.loaisanpham?.tenloai || ""}</td>
          <td style="text-align: right">${Number(item.gia).toLocaleString(
            "vi-VN"
          )} VNĐ</td>
          <td style="text-align: center">${item.giamgia || 0}%</td>
          <td>${item.mausac || ""}</td>
          <td style="text-align: center">${item.gioitinh ? "Nam" : "Nữ"}</td>
          <td>${sizes}</td>
          <td>${item.mota || ""}</td>
        </tr>
      `;
    });

    // Generate product images HTML
    const productImages = data.map((item: any) => {
      // Properly format size information
      const sizes =
        item.ProductSizes && item.ProductSizes.length > 0
          ? item.ProductSizes.map(
              (ps: any) =>
                `${ps.size?.tenSize || `Size ${ps.idSize}`}: ${ps.soluong}`
            ).join(", ")
          : "Không có thông tin";

      return `
        <div class="product-image">
          <h3>${item.tensanpham || ""}</h3>
          <div class="image-container">
            <img src="${item.hinhanh || ""}" alt="${
        item.tensanpham || ""
      }" style="max-width: 200px; max-height: 200px; object-fit: contain;">
          </div>
          <p>Giá: ${Number(item.gia).toLocaleString("vi-VN")} VNĐ</p>
          <p>Giảm giá: ${item.giamgia || 0}%</p>
          <p>Màu sắc: ${item.mausac || ""}</p>
          <p>Loại: ${item.loaisanpham?.tenloai || ""}</p>
          <p>Size: ${sizes}</p>
        </div>
      `;
    });

    const htmlContent = `
    <html>
    <head>
      <style>
        body {
          font-family: Times New Roman, serif;
          margin: 20px;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 16px;
          margin-bottom: 15px;
        }
        .divider {
          border-top: 1px solid #000;
          width: 60%;
          margin: 15px auto;
        }
        .date {
          text-align: right;
          font-style: italic;
          margin: 20px 20px;
        }
        .report-title {
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          margin: 20px 0;
          text-transform: uppercase;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 12px;
        }
        th {
          border: 1.5px solid #000;
          padding: 8px 4px;
          text-align: center;
          background-color: #f5f5f5;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 11px;
        }
        td {
          border: 1px solid #000;
          padding: 6px 4px;
          text-align: left;
          vertical-align: top;
        }
        .terms {
          margin: 30px 0;
        }
        .terms h3 {
          font-size: 14px;
          margin-bottom: 10px;
        }
        .terms p {
          margin: 5px 0;
          text-align: justify;
        }
        .signature-section {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
          page-break-inside: avoid;
        }
        .signature-box {
          width: 45%;
          text-align: center;
        }
        .signature-line {
          margin-top: 80px;
          border-top: 1px dashed #000;
          width: 80%;
          margin-left: auto;
          margin-right: auto;
        }
        .product-images {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin: 30px 0;
        }
        .product-image {
          width: 45%;
          margin-bottom: 30px;
          border: 1px solid #ddd;
          padding: 10px;
          page-break-inside: avoid;
        }
        .image-container {
          display: flex;
          justify-content: center;
          margin: 10px 0;
        }
        h3 {
          font-size: 14px;
          margin: 5px 0;
          text-align: center;
        }
        p {
          margin: 3px 0;
          font-size: 12px;
        }
        .page-break {
          page-break-before: always;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div class="subtitle">Độc lập - Tự do - Hạnh phúc</div>
        <div class="divider"></div>
      </div>

      <div class="date">
        Ngày ${day} tháng ${month} năm ${year}
      </div>

      <div class="report-title">
        DANH SÁCH SẢN PHẨM
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 3%">STT</th>
            <th style="width: 5%">Mã SP</th>
            <th style="width: 15%">Tên sản phẩm</th>
            <th style="width: 10%">Loại SP</th>
            <th style="width: 10%">Giá</th>
            <th style="width: 5%">Giảm giá</th>
            <th style="width: 8%">Màu sắc</th>
            <th style="width: 5%">Giới tính</th>
            <th style="width: 15%">Size</th>
            <th style="width: 24%">Mô tả</th>
          </tr>
        </thead>
        <tbody>
          ${productRows.join("")}
        </tbody>
      </table>

      <div class="page-break"></div>
      
      <div class="report-title">
        HÌNH ẢNH SẢN PHẨM
      </div>
      
      <div class="product-images">
        ${productImages.join("")}
      </div>

      <div class="terms">
        <h3>ĐIỀU KHOẢN THỎA THUẬN:</h3>
        <p>1. Các sản phẩm được liệt kê theo đúng thông tin và mô tả như đã được nêu.</p>
        <p>2. Mọi thay đổi về thông tin sản phẩm cần được cập nhật và thông báo cho các bên liên quan.</p>
        <p>3. Giá sản phẩm có thể thay đổi theo chính sách của đơn vị.</p>
        <p>4. Danh sách này có hiệu lực kể từ ngày ký và có thể được cập nhật theo nhu cầu thực tế.</p>
      </div>

      <div class="signature-section">
        <div class="signature-box">
          <h3>NGƯỜI LẬP DANH SÁCH</h3>
          <p><i>(Ký, ghi rõ họ tên)</i></p>
          <div class="signature-line"></div>
        </div>
        <div class="signature-box">
          <h3>NGƯỜI PHÊ DUYỆT</h3>
          <p><i>(Ký, ghi rõ họ tên)</i></p>
          <div class="signature-line"></div>
        </div>
      </div>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
      printBackground: true,
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=danh-sach-san-pham.pdf`,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi tạo PDF:", error);
    return NextResponse.json({ message: "Lỗi tạo PDF" }, { status: 500 });
  }
}
