import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

interface Image {
  idImage: number;
  url: string;
  altText: string | null;
  createdAt: string;
  updatedAt: string;
  idSanpham: number | null;
  sanpham?: {
    idsanpham: number;
  };
}

interface Meta {
  page: number;
  limit_size: number;
  totalRecords: number;
  totalPages: number;
}

interface ImageTableProps {
  onEdit: (image: Image) => void;
  onDelete: (id: number) => void;
  reloadKey: number;
}

const ImageTable: React.FC<ImageTableProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  const [images, setImages] = useState<Image[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit_size: 10,
    totalRecords: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/phantrangimage?page=${meta.page}&limit_size=${meta.limit_size}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      if (result.data) {
        setImages(result.data);
        setMeta({
          page: result.meta.page,
          limit_size: result.meta.limit_size,
          totalRecords: result.meta.totalRecords,
          totalPages: result.meta.totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [meta.page, meta.limit_size, reloadKey]);

  const handlePageChange = (newPage: number) => {
    setMeta((prev) => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Generate pagination numbers
  const generatePaginationNumbers = () => {
    const pages = [];
    const maxButtons = 3;
    let start = Math.max(1, meta.page - Math.floor(maxButtons / 2));
    let end = Math.min(start + maxButtons - 1, meta.totalPages);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="space-y-4">
      <div className="w-full rounded-lg shadow">
        <table className="w-full divide-gray-200 bg-gradient-to-r from-red-500 to-pink-400">
          <thead>
            <tr>
              <th className="px-6 py-3 text-white">ID</th>
              <th className="px-6 py-3 text-white">Hình Ảnh</th>
              <th className="px-6 py-3 text-white">Mô tả Alt</th>
              <th className="px-6 py-3 text-white">Sản phẩm</th>
              <th className="px-6 py-3 text-white">Ngày tạo</th>
              <th className="px-6 py-3 text-white">Cập nhật</th>
              <th className="px-6 py-3 text-white">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                    <span className="ml-2">Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : images && images.length > 0 ? (
              images.map((image, index) => (
                <tr
                  key={image.idImage}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition-colors duration-200`}
                >
                  <td className="px-6 py-4">{image.idImage}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <img
                        src={image.url || "/default-image.png"}
                        alt={image.altText || ""}
                        className="w-16 h-16 object-cover rounded-md shadow-sm"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {image.altText || "Không có mô tả"}
                  </td>
                  <td className="px-6 py-4">{image.idSanpham}</td>

                  <td className="px-6 py-4">{formatDate(image.createdAt)}</td>
                  <td className="px-6 py-4">{formatDate(image.updatedAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onEdit(image)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(image.idImage)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Không có hình ảnh nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4">
        <div className="text-sm text-gray-700">
          Kết quả: {(meta.page - 1) * meta.limit_size + 1} -{" "}
          {Math.min(meta.page * meta.limit_size, meta.totalRecords)} của{" "}
          {meta.totalRecords}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(meta.page - 1)}
            disabled={meta.page === 1}
            className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {generatePaginationNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`min-w-[40px] h-[40px] flex items-center justify-center rounded-lg border text-sm
                ${
                  pageNum === meta.page
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white hover:bg-gray-50"
                }`}
            >
              {pageNum}
            </button>
          ))}

          {meta.totalPages > 3 && meta.page < meta.totalPages - 1 && (
            <>
              <span className="px-2">...</span>
              <button
                onClick={() => handlePageChange(meta.totalPages)}
                className={`min-w-[40px] h-[40px] flex items-center justify-center rounded-lg border text-sm bg-white hover:bg-gray-50`}
              >
                {meta.totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(meta.page + 1)}
            disabled={meta.page >= meta.totalPages}
            className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="relative ml-2">
            <select
              value={meta.limit_size}
              onChange={(e) =>
                setMeta((prev) => ({
                  ...prev,
                  limit_size: Number(e.target.value),
                  page: 1,
                }))
              }
              className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 cursor-pointer text-sm"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageTable;
