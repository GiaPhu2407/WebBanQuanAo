import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileText, Calendar, Users } from "lucide-react";

interface QRScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrData?: any;
}

const QRInfoModal: React.FC<QRScannerModalProps> = ({
  open,
  onOpenChange,
  qrData,
}) => {
  // Kiểm tra xem dữ liệu QR có hợp lệ không
  const isValidData = qrData && qrData.tieuDe && qrData.danhSach;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isValidData ? qrData.tieuDe : "Thông tin tài liệu"}
          </DialogTitle>
          <DialogDescription>
            {isValidData
              ? `Ngày xuất: ${qrData.ngayXuat} - Tổng số mục: ${qrData.tongSoMuc}`
              : "Không tìm thấy thông tin hợp lệ trong mã QR"}
          </DialogDescription>
        </DialogHeader>

        {!isValidData ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi đọc dữ liệu</AlertTitle>
            <AlertDescription>
              Mã QR không chứa thông tin hợp lệ hoặc định dạng không đúng. Vui lòng kiểm tra lại mã QR.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="py-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Calendar className="h-4 w-4" />
                <span>Thời gian tạo: {new Date(qrData.thongTinThem.thoiGianTao).toLocaleString('vi-VN')}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Users className="h-4 w-4" />
                <span>Người tạo: {qrData.thongTinThem.nguoiTao}</span>
              </div>

              <Table className="border">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] text-center">STT</TableHead>
                    <TableHead className="w-[100px] text-center">ID</TableHead>
                    <TableHead>Tên loại</TableHead>
                    <TableHead>Mô tả</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qrData.danhSach.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">{item.id}</TableCell>
                      <TableCell>{item.ten}</TableCell>
                      <TableCell>{item.moTa}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <DialogFooter>
              <Button onClick={() => onOpenChange(false)}>Đóng</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QRInfoModal;