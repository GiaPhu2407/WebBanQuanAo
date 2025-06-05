"use client";

import { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  RefreshCw,
  Loader2,
  Eye,
  X,
  Package,
  MapPin,
  Calendar,
  CreditCard,
  Tag,
  User,
  Phone,
  Mail,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

// TypeScript interfaces for type safety
interface Payment {
  idthanhtoan: number;
  iddonhang: number | null;
  phuongthucthanhtoan: string | null;
  sotien: number | null;
  trangthai: string | null;
  ngaythanhtoan: string | null;
  hinhanhthanhtoan: string | null;
  donhang?: {
    iddonhang: number;
    tongsotien: number | null;
    trangthai: string | null;
    discountValue?: number | null;
    idDiscount?: number | null;
    idDiaChi?: number | null;
    users?: {
      idUsers: number;
      Email: string;
      Hoten: string;
    };
    chitietdonhang?: Array<{
      idsanpham: number;
      soluong: number;
      dongia: number;
      sanpham?: {
        tensanpham: string;
        hinhanh: string;
        gia: number;
        giamgia?: number | null;
      };
      size?: {
        idSize: number;
        tenSize: string;
      };
    }>;
    discount?: {
      idDiscount: number;
      code: string;
      discountType: string;
      value: number;
    };
    diaChiGiaoHang?: {
      idDiaChi: number;
      tenNguoiNhan: string;
      soDienThoai: string;
      diaChiChiTiet: string;
      phuongXa: string;
      quanHuyen: string;
      thanhPho: string;
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
      case "pending confirmation":
      case "waiting for payment confirmation":
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
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

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

  const fetchPaymentDetails = async (payment: Payment) => {
    setDetailsLoading(true);
    setSelectedPayment(payment);
    setDetailsOpen(true);

    try {
      // Nếu đã có thông tin đơn hàng chi tiết, không cần fetch lại
      if (payment.donhang?.chitietdonhang) {
        setPaymentDetails(payment);
        return;
      }

      // Fetch chi tiết đơn hàng nếu có iddonhang
      if (payment.iddonhang) {
        const response = await fetch(`/api/donhang/${payment.iddonhang}`);
        if (!response.ok) throw new Error("Không thể tải chi tiết đơn hàng");

        const orderData = await response.json();
        const orderDetails = orderData.data || orderData;

        // Kết hợp thông tin thanh toán với chi tiết đơn hàng
        setPaymentDetails({
          ...payment,
          donhang: orderDetails,
        });
      } else {
        setPaymentDetails(payment);
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
    } finally {
      setDetailsLoading(false);
    }
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
              <TableHead className="font-semibold text-center">
                Hình Ảnh Thanh Toán
              </TableHead>
              <TableHead className="text-center font-semibold">
                Thao Tác
              </TableHead>
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
                  <TableCell>
                    <Skeleton className="h-[80px] w-[80px] mx-auto" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center space-x-2">
                      <Skeleton className="h-9 w-9" />
                      <Skeleton className="h-9 w-9" />
                      <Skeleton className="h-9 w-9" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
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
                  <TableCell className="text-center">
                    {payment.hinhanhthanhtoan ? (
                      <div className="flex justify-center">
                        <Image
                          src={payment.hinhanhthanhtoan || "/placeholder.svg"}
                          alt="Hình ảnh thanh toán"
                          width={80}
                          height={80}
                          className="rounded-md object-cover border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                          onClick={() =>
                            window.open(payment.hinhanhthanhtoan!, "_blank")
                          }
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Không có</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => fetchPaymentDetails(payment)}
                              className="h-9 w-9 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Xem chi tiết</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {onEdit && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onEdit(payment)}
                                className="h-9 w-9 text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Sửa thanh toán</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {onDelete && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDelete(payment.idthanhtoan)}
                                className="h-9 w-9 text-red-600 hover:text-red-800 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Xóa thanh toán</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
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

      {/* Chi tiết thanh toán Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Chi tiết thanh toán #{selectedPayment?.idthanhtoan}
            </DialogTitle>
            <DialogDescription>
              {selectedPayment?.iddonhang
                ? `Đơn hàng #${selectedPayment.iddonhang}`
                : "Thông tin thanh toán"}
            </DialogDescription>
          </DialogHeader>

          {detailsLoading ? (
            <div className="flex flex-col space-y-4 items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p>Đang tải thông tin chi tiết...</p>
            </div>
          ) : (
            <Tabs defaultValue="payment" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="payment">Thanh toán</TabsTrigger>
                <TabsTrigger value="order">Đơn hàng</TabsTrigger>
                <TabsTrigger value="shipping">Địa chỉ & Giao hàng</TabsTrigger>
              </TabsList>

              {/* Tab Thanh toán */}
              <TabsContent value="payment" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Thông tin thanh toán
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Mã thanh toán:</span>
                        <span className="font-medium">
                          {paymentDetails?.idthanhtoan}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Phương thức:</span>
                        <span className="font-medium">
                          {paymentDetails?.phuongthucthanhtoan}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Số tiền:</span>
                        <span className="font-medium">
                          {formatCurrency(paymentDetails?.sotien)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Trạng thái:</span>
                        <PaymentStatusBadge
                          status={paymentDetails?.trangthai}
                        />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ngày thanh toán:</span>
                        <span>{formatDate(paymentDetails?.ngaythanhtoan)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Hình ảnh thanh toán */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Hình ảnh thanh toán
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center p-4">
                      {paymentDetails?.hinhanhthanhtoan ? (
                        <Image
                          src={
                            paymentDetails.hinhanhthanhtoan ||
                            "/placeholder.svg"
                          }
                          alt="Hình ảnh thanh toán"
                          width={200}
                          height={200}
                          className="rounded-md object-cover border border-gray-200 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() =>
                            window.open(
                              paymentDetails.hinhanhthanhtoan,
                              "_blank"
                            )
                          }
                        />
                      ) : (
                        <div className="text-gray-400 text-center py-8 border rounded-md w-full">
                          <p>Không có hình ảnh thanh toán</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Thông tin giảm giá */}
                {paymentDetails?.donhang?.discountValue &&
                  paymentDetails.donhang.discountValue > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Tag className="h-5 w-5" />
                          Thông tin giảm giá
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Mã giảm giá:</span>
                          <span className="font-medium">
                            {paymentDetails.donhang.discount?.code || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Loại giảm giá:</span>
                          <span className="font-medium">
                            {paymentDetails.donhang.discount?.discountType ===
                            "percentage"
                              ? "Phần trăm"
                              : "Số tiền cố định"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">
                            Giá trị giảm giá:
                          </span>
                          <span className="font-medium">
                            {paymentDetails.donhang.discount?.discountType ===
                            "percentage"
                              ? `${paymentDetails.donhang.discount.value}%`
                              : formatCurrency(
                                  paymentDetails.donhang.discount?.value
                                )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Số tiền giảm:</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(
                              paymentDetails.donhang.discountValue
                            )}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
              </TabsContent>

              {/* Tab Đơn hàng */}
              <TabsContent value="order" className="space-y-4">
                {paymentDetails?.donhang ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Thông tin đơn hàng #{paymentDetails.donhang.iddonhang}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Ngày đặt:</span>
                          <span>
                            {formatDate(paymentDetails.donhang.ngaydat)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">
                            Trạng thái đơn hàng:
                          </span>
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800 border-blue-200"
                          >
                            {paymentDetails.donhang.trangthai || "N/A"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tổng số lượng:</span>
                          <span>
                            {paymentDetails.donhang.tongsoluong || 0} sản phẩm
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tổng tiền gốc:</span>
                          <span>
                            {formatCurrency(
                              Number(paymentDetails.donhang.tongsotien) +
                                Number(
                                  paymentDetails.donhang.discountValue || 0
                                )
                            )}
                          </span>
                        </div>
                        {paymentDetails.donhang.discountValue &&
                          paymentDetails.donhang.discountValue > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Giảm giá:</span>
                              <span className="text-green-600">
                                -
                                {formatCurrency(
                                  paymentDetails.donhang.discountValue
                                )}
                              </span>
                            </div>
                          )}
                        <div className="flex justify-between font-medium">
                          <span className="text-gray-700">Thành tiền:</span>
                          <span className="text-blue-600">
                            {formatCurrency(paymentDetails.donhang.tongsotien)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Chi tiết sản phẩm */}
                    {paymentDetails.donhang.chitietdonhang &&
                    paymentDetails.donhang.chitietdonhang.length > 0 ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Chi tiết sản phẩm
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Sản phẩm</TableHead>
                                <TableHead>Kích thước</TableHead>
                                <TableHead className="text-right">
                                  Đơn giá
                                </TableHead>
                                <TableHead className="text-center">
                                  Số lượng
                                </TableHead>
                                <TableHead className="text-right">
                                  Thành tiền
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {paymentDetails.donhang.chitietdonhang.map(
                                (item: any, index: number) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      <div className="flex items-center gap-3">
                                        {item.sanpham?.hinhanh && (
                                          <Image
                                            src={
                                              item.sanpham.hinhanh ||
                                              "/placeholder.svg"
                                            }
                                            alt={
                                              item.sanpham?.tensanpham ||
                                              "Sản phẩm"
                                            }
                                            width={40}
                                            height={40}
                                            className="rounded-md object-cover"
                                          />
                                        )}
                                        <span>
                                          {item.sanpham?.tensanpham ||
                                            `Sản phẩm #${item.idsanpham}`}
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {item.size?.tenSize || "N/A"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {formatCurrency(item.dongia)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {item.soluong}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {formatCurrency(
                                        Number(item.dongia) *
                                          Number(item.soluong)
                                      )}
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="py-8 text-center text-gray-500">
                          Không có thông tin chi tiết sản phẩm
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-gray-500">
                      Không có thông tin đơn hàng
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Tab Địa chỉ & Giao hàng */}
              <TabsContent value="shipping" className="space-y-4">
                {/* Thông tin khách hàng */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Thông tin khách hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {paymentDetails?.donhang?.users ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Mã khách hàng:</span>
                          <span>{paymentDetails.donhang.users.idUsers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Họ tên:</span>
                          <span>
                            {paymentDetails.donhang.users.Hoten || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Email:</span>
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>
                              {paymentDetails.donhang.users.Email || "N/A"}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500 text-center py-2">
                        Không có thông tin khách hàng
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Địa chỉ giao hàng */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Địa chỉ giao hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {paymentDetails?.donhang?.diaChiGiaoHang ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Người nhận:</span>
                          <span className="font-medium">
                            {paymentDetails.donhang.diaChiGiaoHang.tenNguoiNhan}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Số điện thoại:</span>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>
                              {
                                paymentDetails.donhang.diaChiGiaoHang
                                  .soDienThoai
                              }
                            </span>
                          </div>
                        </div>
                        <div className="border-t pt-3">
                          <p className="text-gray-500 mb-1">
                            Địa chỉ chi tiết:
                          </p>
                          <p className="font-medium">
                            {
                              paymentDetails.donhang.diaChiGiaoHang
                                .diaChiChiTiet
                            }
                            ,{paymentDetails.donhang.diaChiGiaoHang.phuongXa},
                            {paymentDetails.donhang.diaChiGiaoHang.quanHuyen},
                            {paymentDetails.donhang.diaChiGiaoHang.thanhPho}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Không có thông tin địa chỉ giao hàng
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Lịch giao hàng */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Lịch giao hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {paymentDetails?.donhang?.lichgiaohang &&
                    paymentDetails.donhang.lichgiaohang.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mã sản phẩm</TableHead>
                            <TableHead>Ngày giao dự kiến</TableHead>
                            <TableHead>Trạng thái</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paymentDetails.donhang.lichgiaohang.map(
                            (item: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell>{item.idsanpham}</TableCell>
                                <TableCell>
                                  {formatDate(item.NgayGiao)}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-100 text-blue-800 border-blue-200"
                                  >
                                    {item.TrangThai}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Chưa có thông tin lịch giao hàng
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="gap-1">
                <X className="h-4 w-4" /> Đóng
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentTable;
