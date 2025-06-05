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
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

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

  // Lắng nghe sự kiện sidebar toggle để điều chỉnh kích thước bảng
  useEffect(() => {
    const handleSidebarToggle = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSidebarExpanded(customEvent.detail.expanded);
    };

    window.addEventListener("sidebarToggle", handleSidebarToggle);

    return () => {
      window.removeEventListener("sidebarToggle", handleSidebarToggle);
    };
  }, []);

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
 const handleSidebarToggle = (expanded: boolean) => {
    setSidebarExpanded(expanded);
  };

  // Tính toán lớp CSS cho vùng container chính dựa trên trạng thái sidebar
  const mainContainerClass = sidebarExpanded
    ? "ml-64 transition-all duration-300 pt-16"
    : "ml-16 transition-all duration-300 pt-16";

  return (
    <div className="space-y-4">
      <div className="w-full rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="flex items-center">
              <div className="w-6 h-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
              <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-center">Hình Ảnh</th>
                    <th className="px-4 py-3 text-left">Mô tả Alt</th>
                    <th className="px-4 py-3 text-center">ID Sản phẩm</th>
                    <th className="px-4 py-3 text-center">Ngày tạo</th>
                    <th className="px-4 py-3 text-center">Cập nhật</th>
                    <th className="px-4 py-3 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {images && images.length > 0 ? (
                    images.map((image) => (
                      <tr
                        key={image.idImage}
                        className="border-b hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-4 py-3 font-medium">
                          #{image.idImage}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <img
                              src={image.url || "/default-image.png"}
                              alt={image.altText || ""}
                              className="w-16 h-16 object-cover rounded-lg shadow-sm border"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/no-image.jpg";
                                target.onerror = null;
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700">
                            {image.altText || "Không có mô tả"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {image.idSanpham || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">
                          {formatDate(image.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">
                          {formatDate(image.updatedAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => onEdit(image)}
                              className="btn btn-sm btn-circle btn-ghost text-blue-600 hover:bg-blue-50"
                              title="Chỉnh sửa"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDelete(image.idImage)}
                              className="btn btn-sm btn-circle btn-ghost text-red-600 hover:bg-red-50"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-8 text-gray-500"
                      >
                        Không có hình ảnh nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            {meta.totalPages > 1 && (
              <div className="flex justify-between items-center px-6 py-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Hiển thị {(meta.page - 1) * meta.limit_size + 1} -{" "}
                    {Math.min(meta.page * meta.limit_size, meta.totalRecords)} /{" "}
                    {meta.totalRecords} hình ảnh
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {/* First page button */}
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={meta.page === 1}
                    className="btn btn-sm px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    «
                  </button>

                  {/* Previous page button */}
                  <button
                    onClick={() => handlePageChange(meta.page - 1)}
                    disabled={meta.page === 1}
                    className="btn btn-sm px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ‹
                  </button>

                  {/* Page numbers */}
                  {Array.from(
                    { length: Math.min(5, meta.totalPages) },
                    (_, i) => {
                      let pageToShow = meta.page - 2 + i;
                      if (meta.page < 3) {
                        pageToShow = i + 1;
                      } else if (meta.page > meta.totalPages - 2) {
                        pageToShow = meta.totalPages - 4 + i;
                      }

                      if (pageToShow > 0 && pageToShow <= meta.totalPages) {
                        return (
                          <button
                            key={pageToShow}
                            onClick={() => handlePageChange(pageToShow)}
                            className={`btn btn-sm min-w-[35px] h-[35px] border text-sm rounded ${
                              meta.page === pageToShow
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-white hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            {pageToShow}
                          </button>
                        );
                      }
                      return null;
                    }
                  )}

                  {/* Next page button */}
                  <button
                    onClick={() => handlePageChange(meta.page + 1)}
                    disabled={meta.page >= meta.totalPages}
                    className="btn btn-sm px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ›
                  </button>

                  {/* Last page button */}
                  <button
                    onClick={() => handlePageChange(meta.totalPages)}
                    disabled={meta.page === meta.totalPages}
                    className="btn btn-sm px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    »
                  </button>

                  {/* Items per page selector */}
                  <div className="relative ml-4">
                    <select
                      value={meta.limit_size}
                      onChange={(e) =>
                        setMeta((prev) => ({
                          ...prev,
                          limit_size: Number(e.target.value),
                          page: 1,
                        }))
                      }
                      className="appearance-none bg-white border rounded-lg px-3 py-2 pr-8 cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="10">10 / trang</option>
                      <option value="20">20 / trang</option>
                      <option value="50">50 / trang</option>
                      <option value="100">100 / trang</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                      <svg
                        className="w-4 h-4 text-gray-400"
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ImageTable;
