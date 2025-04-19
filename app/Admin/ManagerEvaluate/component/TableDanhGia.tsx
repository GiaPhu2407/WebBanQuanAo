"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pencil,
  Trash2,
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

interface User {
  Tentaikhoan: string;
  Hoten: string;
}

interface Product {
  idsanpham: number;
  tensanpham: string;
  hinhanh?: string | null;
}

interface Review {
  iddanhgia: number;
  idsanpham: number;
  idUsers: number;
  sao: number;
  noidung: string;
  ngaydanhgia: string;
  users: {
    Tentaikhoan: string;
    Hoten: string;
  };
  sanpham?: Product;
}

interface Meta {
  page: number;
  limit_size: number;
  totalRecords: number;
  totalPages: number;
}

interface TableDanhGiaProps {
  onEdit: (review: Review) => void;
  onDelete: (id: number) => void;
  reloadKey: number;
  sidebarExpanded?: boolean;
}

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
    </div>
  );
};

// Product Image Component
const ProductImage = ({
  src,
  alt,
}: {
  src: string | null | undefined;
  alt: string;
}) => {
  if (!src) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-md w-10 h-10">
        <ImageIcon className="w-5 h-5 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="relative w-10 h-10 rounded-md overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={40}
        height={40}
        className="object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder-product.png"; // Fallback to placeholder
        }}
      />
    </div>
  );
};

// Main Table Component
const TableDanhGia: React.FC<TableDanhGiaProps> = ({
  onEdit,
  onDelete,
  reloadKey,
  sidebarExpanded = true,
}) => {
  // State for reviews data and pagination
  const [reviews, setReviews] = useState<Review[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit_size: 10,
    totalRecords: 0,
    totalPages: 0,
  });

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch reviews with filters and pagination
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Build query parameters
        const params = new URLSearchParams();
        params.append("page", meta.page.toString());
        params.append("limit", meta.limit_size.toString());

        if (searchTerm) {
          params.append("search", searchTerm);
        }

        if (filterRating && filterRating !== "all") {
          params.append("rating", filterRating);
        }

        const response = await fetch(
          `/api/phantrangdanhgia?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu đánh giá");
        }

        const data = await response.json();
        setReviews(data.evaluates || []);
        setMeta({
          page: data.meta.page,
          limit_size: data.meta.limit_size,
          totalRecords: data.meta.totalRecords,
          totalPages: data.meta.totalPages,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
        console.error("Error fetching reviews:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [meta.page, meta.limit_size, searchTerm, filterRating, reloadKey]);

  // Handlers for pagination
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= meta.totalPages) {
      setMeta((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleLimitChange = (value: string) => {
    setMeta((prev) => ({ ...prev, page: 1, limit_size: parseInt(value) }));
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setMeta((prev) => ({ ...prev, page: 1 })); // Reset to first page on new search
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Calculate pagination display
  const startItem = (meta.page - 1) * meta.limit_size + 1;
  const endItem = Math.min(meta.page * meta.limit_size, meta.totalRecords);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Search and Filter section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên người dùng hoặc sản phẩm..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <Button type="submit">Tìm kiếm</Button>
          </form>

          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">Lọc theo sao:</span>
            <Select
              value={filterRating}
              onValueChange={(value) => {
                setFilterRating(value);
                setMeta((prev) => ({ ...prev, page: 1 }));
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="1">1 sao</SelectItem>
                <SelectItem value="2">2 sao</SelectItem>
                <SelectItem value="3">3 sao</SelectItem>
                <SelectItem value="4">4 sao</SelectItem>
                <SelectItem value="5">5 sao</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người dùng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hình ảnh
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đánh giá
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nội dung
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày đánh giá
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  Không có đánh giá nào
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.iddanhgia} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {review.iddanhgia}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {review.users.Hoten || review.users.Tentaikhoan}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {review.sanpham?.tensanpham ||
                      `Sản phẩm #${review.idsanpham}`}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <ProductImage
                      src={review.sanpham?.hinhanh || null}
                      alt={
                        review.sanpham?.tensanpham ||
                        `Sản phẩm #${review.idsanpham}`
                      }
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StarRating rating={review.sao} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">
                    <div className="truncate">{review.noidung}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(review.ngaydanhgia)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(review)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Sửa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(review.iddanhgia)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <p className="text-sm text-gray-700">
              Hiển thị{" "}
              <span className="font-medium">
                {reviews.length > 0 ? startItem : 0}
              </span>{" "}
              đến{" "}
              <span className="font-medium">
                {reviews.length > 0 ? endItem : 0}
              </span>{" "}
              trong <span className="font-medium">{meta.totalRecords}</span> kết
              quả
            </p>

            <div className="ml-4">
              <Select
                value={meta.limit_size.toString()}
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className="w-16">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center">
              {/* Page number display */}
              <span className="px-3 py-1 text-sm">
                Trang {meta.page} / {meta.totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page === meta.totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableDanhGia;
