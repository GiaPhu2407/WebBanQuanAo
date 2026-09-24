"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy, Check, Sparkles, RefreshCw } from "lucide-react";

interface AIContentData {
  tenSanPhamHapDan: string;
  seoTitle: string;
  seoKeywords: string;
  captionTiktok: string;
  captionFacebook: string;
  noiDungShopee: string;
  hashtag: string;
  traLoiKhachHang: string;
}

interface ProductAIContentProps {
  tensanpham: string;
  mota: string;
  gia: string | number;
  tenloai?: string;
  aiContent: Partial<AIContentData>;
  onAIContentChange: (content: Partial<AIContentData>) => void;
}

const AI_FIELDS: {
  key: keyof AIContentData;
  label: string;
  icon: string;
  rows: number;
  placeholder: string;
}[] = [
  {
    key: "tenSanPhamHapDan",
    label: "Tên sản phẩm hấp dẫn",
    icon: "🏷️",
    rows: 2,
    placeholder: "Tên sản phẩm được viết lại theo phong cách marketing hấp dẫn",
  },
  {
    key: "seoTitle",
    label: "SEO Title",
    icon: "🔍",
    rows: 2,
    placeholder: "Tiêu đề tối ưu cho SEO Google (50-60 ký tự)",
  },
  {
    key: "seoKeywords",
    label: "SEO Keywords",
    icon: "🔑",
    rows: 3,
    placeholder: "từ khóa 1, từ khóa 2, từ khóa 3...",
  },
  {
    key: "captionTiktok",
    label: "Caption TikTok",
    icon: "📱",
    rows: 4,
    placeholder: "Caption viral cho TikTok theo phong cách Gen Z...",
  },
  {
    key: "captionFacebook",
    label: "Caption Facebook",
    icon: "📸",
    rows: 4,
    placeholder: "Caption chuyên nghiệp cho Facebook...",
  },
  {
    key: "noiDungShopee",
    label: "Nội dung Shopee",
    icon: "🛒",
    rows: 6,
    placeholder: "Mô tả sản phẩm chi tiết cho Shopee...",
  },
  {
    key: "hashtag",
    label: "Hashtag",
    icon: "#️⃣",
    rows: 3,
    placeholder: "#thoitrang #quanao #fashion...",
  },
  {
    key: "traLoiKhachHang",
    label: "Câu trả lời khách hàng",
    icon: "💬",
    rows: 6,
    placeholder: "Q: Câu hỏi thường gặp?\nA: Câu trả lời...",
  },
];

export function ProductAIContent({
  tensanpham,
  mota,
  gia,
  tenloai,
  aiContent,
  onAIContentChange,
}: ProductAIContentProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!tensanpham) {
      setError("⚠️ Vui lòng nhập tên sản phẩm trước khi tạo nội dung AI");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tensanpham, mota, gia, tenloai }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Lỗi khi tạo nội dung");
      }

      onAIContentChange(result.data);
      setHasGenerated(true);
    } catch (err: any) {
      const msg = err.message || "Lỗi không xác định";
      setError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFieldChange = (key: keyof AIContentData, value: string) => {
    onAIContentChange({ ...aiContent, [key]: value });
  };

  return (
    <div className="space-y-5">
      {/* Header + Generate Button */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              ✨ AI Marketing Content Generator
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Được hỗ trợ bởi Google Gemini AI
            </p>
          </div>
          <div className="flex gap-2">
            {hasGenerated && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Tạo lại
              </Button>
            )}
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !tensanpham}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tạo nội dung...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {hasGenerated ? "Tạo lại tất cả" : "✨ Tạo nội dung AI"}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Product info preview */}
        {tensanpham && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm text-blue-700">
            <span className="font-medium">Sản phẩm:</span> {tensanpham}
            {tenloai && (
              <>
                {" "}
                · <span className="font-medium">Loại:</span> {tenloai}
              </>
            )}
            {gia && (
              <>
                {" "}
                · <span className="font-medium">Giá:</span>{" "}
                {Number(gia).toLocaleString("vi-VN")}đ
              </>
            )}
          </div>
        )}

        {!tensanpham && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2.5 text-sm text-yellow-700">
            ⚠️ Vui lòng nhập <strong>tên sản phẩm</strong> ở tab{" "}
            <strong>"Thông tin sản phẩm"</strong> trước
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {isGenerating && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AI_FIELDS.map((field) => (
            <div key={field.key} className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-20 bg-gray-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      )}

      {/* AI Content Fields */}
      {!isGenerating && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AI_FIELDS.map((field) => (
            <div
              key={field.key}
              className={`space-y-1.5 ${
                field.key === "noiDungShopee" ||
                field.key === "traLoiKhachHang" ||
                field.key === "hashtag"
                  ? "md:col-span-2"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <span>{field.icon}</span>
                  {field.label}
                  {aiContent[field.key] && (
                    <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                      ✓ Đã tạo
                    </span>
                  )}
                </label>
                {aiContent[field.key] && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(field.key, aiContent[field.key] as string)
                    }
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded hover:bg-gray-100"
                  >
                    {copiedKey === field.key ? (
                      <>
                        <Check className="w-3 h-3 text-green-500" />
                        <span className="text-green-500">Đã copy!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>
              <Textarea
                value={aiContent[field.key] || ""}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                rows={field.rows}
                placeholder={field.placeholder}
                className={`resize-none text-sm transition-all ${
                  aiContent[field.key]
                    ? "border-green-300 bg-green-50/30 focus:border-green-400"
                    : "border-gray-200 bg-gray-50"
                }`}
              />
              {aiContent[field.key] && (
                <p className="text-xs text-gray-400 text-right">
                  {(aiContent[field.key] as string).length} ký tự
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isGenerating && !hasGenerated && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <div className="text-4xl mb-3">🤖</div>
          <p className="text-gray-500 text-sm mb-1">
            Nhấn <strong>"✨ Tạo nội dung AI"</strong> để bắt đầu
          </p>
          <p className="text-gray-400 text-xs">
            AI sẽ tự động tạo 8 loại nội dung marketing cho sản phẩm của bạn
          </p>
        </div>
      )}
    </div>
  );
}
