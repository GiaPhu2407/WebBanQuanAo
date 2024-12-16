import React, { useEffect, useState } from "react";
import { CreditCard, Trash2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";

// TypeScript interfaces for type safety
interface Payment {
  idthanhtoan: number;
  iddonhang: number | null;
  phuongthucthanhtoan: string | null;
  sotien: number | null;
  trangthai: string | null;
  ngaythanhtoan: string | null;
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

const PaymentStatusBadge: React.FC<{ status: string | null }> = ({
  status,
}) => {
  const getStatusConfig = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "thành công":
        return {
          label: "Thành Công",
          className: "bg-green-100 text-green-800 border border-green-300",
        };
      case "pending":
      case "đang chờ":
        return {
          label: "Đang Chờ",
          className: "bg-yellow-100 text-yellow-800 border border-yellow-300",
        };
      case "failed":
      case "thất bại":
        return {
          label: "Thất Bại",
          className: "bg-red-100 text-red-800 border border-red-300",
        };
      default:
        return {
          label: "Chưa Xác Định",
          className: "bg-gray-100 text-gray-800 border border-gray-300",
        };
    }
  };

  const { label, className } = getStatusConfig(status);

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
};

const PaymentTable: React.FC<PaymentTableProps> = ({
  onDelete,
  onEdit,
  refreshTrigger,
}) => {
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
      // Optional: Add toast or error notification
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

  const renderPaginationControls = () => {
    const { page, totalPages } = pagination;
    const pageNumbers = [];

    // Generate page numbers
    for (let i = 1; i <= Math.min(totalPages, 3); i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant={page === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Trang {page} / {totalPages} (Tổng: {pagination.totalRecords} bản ghi)
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Trước
          </Button>
          {pageNumbers}
          {totalPages > 3 && <span>...</span>}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Tiếp
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Danh Sách Thanh Toán</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPayments}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tải Lại
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã Thanh Toán</TableHead>
              <TableHead>Đơn Hàng</TableHead>
              <TableHead>Phương Thức</TableHead>
              <TableHead className="text-right">Số Tiền</TableHead>
              <TableHead>Trạng Thái</TableHead>
              <TableHead>Ngày Thanh Toán</TableHead>
              {(onDelete || onEdit) && <TableHead>Thao Tác</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  <div className="flex justify-center items-center">
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Đang tải dữ liệu...
                  </div>
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  Không có thanh toán nào
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.idthanhtoan}>
                  <TableCell>{payment.idthanhtoan}</TableCell>
                  <TableCell>{payment.iddonhang ?? "N/A"}</TableCell>
                  <TableCell>
                    {payment.phuongthucthanhtoan ?? "Không xác định"}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(payment.sotien ?? 0)}
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={payment.trangthai} />
                  </TableCell>
                  <TableCell>{formatDate(payment.ngaythanhtoan)}</TableCell>
                  {(onDelete || onEdit) && (
                    <TableCell>
                      <div className="flex space-x-2">
                        {onEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(payment)}
                          >
                            <CreditCard className="h-4 w-4 mr-2" /> Sửa
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDelete(payment.idthanhtoan)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Xóa
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
        {renderPaginationControls()}
      </CardContent>
    </Card>
  );
};

export default PaymentTable;
