"use client";

import { useState, useEffect } from "react";
import { CreditCard, Trash2, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// TypeScript interfaces for type safety
interface Payment {
  idthanhtoan: number;
  iddonhang: number | null;
  phuongthucthanhtoan: string | null;
  sotien: number | null;
  trangthai: string | null;
  ngaythanhtoan: string | null;
  donhang?: {
    iddonhang: number;
    tongsotien: number | null;
    trangthai: string | null;
    users?: {
      idUsers: number;
      Email: string;
      Hoten: string;
    };
  };
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

interface PaymentTableProps {
  onDelete?: (id: number) => void;
  onEdit?: (payment: Payment) => void;
  refreshTrigger?: number;
}

const PaymentStatusBadge = ({ status }: { status: string | null }) => {
  const getStatusConfig = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "thành công":
      case "đã thanh toán":
        return {
          label: "Thành Công",
          variant: "success" as const,
        };
      case "pending":
      case "đang chờ":
        return {
          label: "Đang Chờ",
          variant: "warning" as const,
        };
      case "failed":
      case "thất bại":
        return {
          label: "Thất Bại",
          variant: "destructive" as const,
        };
      default:
        return {
          label: status || "Chưa Xác Định",
          variant: "outline" as const,
        };
    }
  };

  const { label, variant } = getStatusConfig(status);

  // Map variant to appropriate Tailwind classes
  const variantClasses = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    destructive: "bg-red-100 text-red-800 border-red-200",
    outline: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <Badge
      className={`font-medium ${variantClasses[variant]}`}
      variant="outline"
    >
      {label}
    </Badge>
  );
};

const PaymentTable = ({
  onDelete,
  onEdit,
  refreshTrigger,
}: PaymentTableProps) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 1,
  });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/phantrangpayment?page=${pagination.page}&pageSize=${pagination.pageSize}`
      );

      if (!response.ok) throw new Error("Failed to fetch payments");

      const result = await response.json();

      setPayments(result.data || []);
      setPagination((prev) => ({
        ...prev,
        totalRecords: result.meta.totalRecords,
        totalPages: result.meta.totalPages,
      }));
    } catch (error) {
      console.error("Fetch payments error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [pagination.page, pagination.pageSize, refreshTrigger]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Danh Sách Thanh Toán</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchPayments}
          disabled={loading}
          className="flex items-center gap-1"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span>Tải lại</span>
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[100px] font-semibold">Mã TT</TableHead>
              <TableHead className="font-semibold">Đơn Hàng</TableHead>
              <TableHead className="font-semibold">Phương Thức</TableHead>
              <TableHead className="text-right font-semibold">
                Số Tiền
              </TableHead>
              <TableHead className="font-semibold">Trạng Thái</TableHead>
              <TableHead className="font-semibold">Ngày Thanh Toán</TableHead>
              {(onDelete || onEdit) && (
                <TableHead className="text-right font-semibold">
                  Thao Tác
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-5 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-28" />
                  </TableCell>
                  {(onDelete || onEdit) && (
                    <TableCell>
                      <Skeleton className="h-9 w-24 float-right" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  Không có thanh toán nào
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow
                  key={payment.idthanhtoan}
                  className="hover:bg-gray-50"
                >
                  <TableCell className="font-medium">
                    {payment.idthanhtoan}
                  </TableCell>
                  <TableCell>
                    {payment.iddonhang ? (
                      <div className="flex flex-col">
                        <span>#{payment.iddonhang}</span>
                        {payment.donhang?.users && (
                          <span className="text-xs text-gray-500 truncate max-w-[150px]">
                            {payment.donhang.users.Hoten ||
                              payment.donhang.users.Email}
                          </span>
                        )}
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center">
                      {payment.phuongthucthanhtoan === "Chuyển khoản" && (
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      )}
                      {payment.phuongthucthanhtoan === "Tiền mặt" && (
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                      {payment.phuongthucthanhtoan === "Online" && (
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                      )}
                      {payment.phuongthucthanhtoan ?? "Không xác định"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(payment.sotien)}
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={payment.trangthai} />
                  </TableCell>
                  <TableCell>{formatDate(payment.ngaythanhtoan)}</TableCell>
                  {(onDelete || onEdit) && (
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {onEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(payment)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <CreditCard className="h-4 w-4 mr-1" />
                            <span className="sr-only sm:not-sr-only sm:inline-block">
                              Sửa
                            </span>
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(payment.idthanhtoan)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span className="sr-only sm:not-sr-only sm:inline-block">
                              Xóa
                            </span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && pagination.totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  handlePageChange(Math.max(1, pagination.page - 1))
                }
                className={`${
                  pagination.page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }`}
                tabIndex={pagination.page === 1 ? -1 : undefined}
              />
            </PaginationItem>

            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                let pageToShow = pagination.page - 2 + i;
                if (pagination.page < 3) {
                  pageToShow = i + 1;
                } else if (pagination.page > pagination.totalPages - 2) {
                  pageToShow = pagination.totalPages - 4 + i;
                }

                if (pageToShow > 0 && pageToShow <= pagination.totalPages) {
                  return (
                    <PaginationItem key={pageToShow}>
                      <PaginationLink
                        isActive={pagination.page === pageToShow}
                        onClick={() => handlePageChange(pageToShow)}
                        className="cursor-pointer"
                      >
                        {pageToShow}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              }
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(
                    Math.min(pagination.totalPages, pagination.page + 1)
                  )
                }
                className={`${
                  pagination.page === pagination.totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }`}
                tabIndex={
                  pagination.page === pagination.totalPages ? -1 : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default PaymentTable;
