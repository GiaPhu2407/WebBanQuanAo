import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, Upload, AlertTriangle } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import QRInfoModal from "./QRCoreModal";


const QRScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("camera");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const cameraContainerRef = useRef<HTMLDivElement>(null);

  // Cleanup scanner when component unmounts
  useEffect(() => {
    return () => {
      if (scannerRef.current && scanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [scanning]);

  const startScanner = async () => {
    try {
      if (!cameraContainerRef.current) return;

      // Create scanner instance if not already created
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("camera-reader");
      }

      setScanning(true);

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        handleQrCodeSuccess,
        undefined
      );
    } catch (error) {
      console.error("Lỗi khi bắt đầu quét:", error);
      toast({
        title: "Lỗi camera",
        description: "Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập hoặc thử tải lên hình ảnh.",
        variant: "destructive",
      });
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        setScanning(false);
      } catch (error) {
        console.error("Lỗi khi dừng quét:", error);
      }
    }
  };

  const handleQrCodeSuccess = (decodedText: string) => {
    try {
      // Stop scanner after successful scan
      stopScanner();
      
      // Parse the decoded QR data
      const parsedData = JSON.parse(decodedText);
      setQrData(parsedData);
      setShowModal(true);
      
      toast({
        title: "Thành công",
        description: "Đã quét thành công mã QR",
        variant: "success",
      });
    } catch (error) {
      console.error("Lỗi khi xử lý dữ liệu QR:", error);
      toast({
        title: "Lỗi dữ liệu",
        description: "Không thể đọc dữ liệu từ mã QR. Định dạng không hợp lệ.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("file-reader");
      }

      const result = await scannerRef.current.scanFile(file, true);
      
      try {
        const parsedData = JSON.parse(result);
        setQrData(parsedData);
        setShowModal(true);
        
        toast({
          title: "Thành công",
          description: "Đã quét thành công mã QR từ hình ảnh",
          variant: "success",
        });
      } catch {
        toast({
          title: "Định dạng không hợp lệ",
          description: "Mã QR không chứa dữ liệu hợp lệ.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Không tìm thấy mã QR",
        description: "Không thể tìm thấy mã QR trong hình ảnh này.",
        variant: "destructive",
      });
    } finally {
      e.target.value = ""; // Reset file input
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Quét mã QR báo cáo</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera">
              <Camera className="mr-2 h-4 w-4" />
              Camera
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="mr-2 h-4 w-4" />
              Tải lên
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera">
            <div className="flex flex-col items-center gap-4">
              <div 
                id="camera-reader" 
                ref={cameraContainerRef}
                className="w-full aspect-square bg-muted rounded-md overflow-hidden flex items-center justify-center"
              >
                {!scanning && (
                  <div className="text-center p-4">
                    <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Nhấn nút bắt đầu để quét mã QR</p>
                  </div>
                )}
              </div>

              <div className="flex justify-center w-full">
                {!scanning ? (
                  <Button onClick={startScanner}>Bắt đầu quét</Button>
                ) : (
                  <Button variant="destructive" onClick={stopScanner}>Dừng quét</Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <div className="flex flex-col items-center gap-4">
              <div className="w-full">
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Tải lên hình ảnh chứa mã QR để xem thông tin.
                  </AlertDescription>
                </Alert>
                
                <div className="flex items-center justify-center w-full">
                  <label 
                    htmlFor="qr-file-upload" 
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Nhấp để tải lên</span> hoặc kéo thả
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG hoặc GIF</p>
                    </div>
                    <input 
                      id="qr-file-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
                
                <div id="file-reader" className="hidden"></div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <QRInfoModal 
        open={showModal} 
        onOpenChange={setShowModal} 
        qrData={qrData}
      />
    </Card>
  );
};

export default QRScanner;