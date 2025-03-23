import React from "react";
import QRScanner from "./QRScanner";
  

export default function QRScannerPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Quét mã QR báo cáo</h1>
      <p className="text-center mb-8 text-muted-foreground max-w-lg mx-auto">
        Quét mã QR từ báo cáo PDF để xem thông tin chi tiết. Bạn có thể sử dụng camera hoặc tải lên hình ảnh chứa mã QR.
      </p>
      <QRScanner />
    </div>
  );
}