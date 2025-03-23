import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [mode, setMode] = useState<"camera" | "upload">("camera");

  // Initialize the camera when component mounts and mode is camera
  useEffect(() => {
    if (mode !== "camera") return;

    const startCamera = async () => {
      try {
        // Clear any previous errors
        setError(null);
        setScanning(true);

        // Request camera access with better options for barcode scanning
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError(
          "Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập camera hoặc thử tải hình ảnh lên."
        );
        setScanning(false);
      }
    };

    startCamera();

    // Clean up function to stop the camera when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      setScanning(false);
    };
  }, [mode]);

  // Set up the scanning loop for camera mode
  useEffect(() => {
    if (!scanning || mode !== "camera") return;

    let animationFrameId: number;

    const scanCode = () => {
      if (!videoRef.current || !canvasRef.current) {
        animationFrameId = requestAnimationFrame(scanCode);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) {
        animationFrameId = requestAnimationFrame(scanCode);
        return;
      }

      // Only process if we have video data
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Set canvas dimensions to match video
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;

        // Draw the current video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get the image data from the canvas
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        try {
          // Try to find a QR code in the image
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          // If a code was found, call the callback with the code data
          if (code) {
            console.log("Barcode detected:", code.data);
            onDetected(code.data);
            // Pause scanning briefly after detection to prevent multiple rapid detections
            setTimeout(() => {
              animationFrameId = requestAnimationFrame(scanCode);
            }, 2000);
            return;
          }
        } catch (err) {
          console.error("Error processing image data:", err);
        }
      }

      // Continue scanning
      animationFrameId = requestAnimationFrame(scanCode);
    };

    // Start the scanning loop
    animationFrameId = requestAnimationFrame(scanCode);

    // Clean up the animation frame when component unmounts or scanning stops
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [onDetected, scanning, mode]);

  // Handle image upload and processing
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas to draw the image for processing
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setError("Không thể xử lý hình ảnh");
          return;
        }

        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image to canvas
        ctx.drawImage(img, 0, 0);

        // Get image data for QR processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        try {
          // Detect QR code in the image
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code) {
            console.log("Barcode detected from image:", code.data);
            onDetected(code.data);
          } else {
            setError(
              "Không tìm thấy mã vạch trong hình ảnh. Vui lòng thử lại với hình ảnh khác."
            );
          }
        } catch (err) {
          console.error("Error processing image:", err);
          setError("Lỗi khi xử lý hình ảnh. Vui lòng thử lại.");
        }
      };

      img.onerror = () => {
        setError("Không thể tải hình ảnh. Vui lòng thử lại với hình ảnh khác.");
      };

      // Set image source to the loaded file
      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      setError("Lỗi khi đọc file. Vui lòng thử lại.");
    };

    // Read the file as data URL
    reader.readAsDataURL(file);
  };

  const toggleMode = () => {
    // If switching from camera mode, stop the stream
    if (mode === "camera" && streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      setScanning(false);
    }

    setMode(mode === "camera" ? "upload" : "camera");
    setError(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative w-full">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-3">
          {error}
        </div>
      )}

      <div className="mb-4 flex justify-center">
        <button
          onClick={toggleMode}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {mode === "camera"
            ? "Chuyển sang tải ảnh lên"
            : "Chuyển sang dùng camera"}
        </button>
      </div>

      {mode === "camera" ? (
        <div className="relative bg-black rounded-lg overflow-hidden">
          {/* The video element that shows the camera feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onCanPlay={() => setScanning(true)}
            className="w-full h-64 object-cover"
          />

          {/* The canvas element is used for processing frames but is hidden */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Scanning overlay with target area */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="h-full w-full flex items-center justify-center">
              <div className="border-2 border-green-500 w-3/4 h-32 rounded-md relative">
                {/* Scan line animation */}
                <div className="absolute left-0 right-0 h-0.5 bg-green-500 animate-scan-line"></div>

                {/* Corner markers for scan area */}
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-green-500"></div>
                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-green-500"></div>
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-green-500"></div>
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-green-500"></div>
              </div>
            </div>
          </div>

          {/* Scanning status indicator */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center">
            <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              Đang quét...
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={triggerFileInput}
            className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4"
          >
            Tải ảnh chứa mã vạch lên
          </button>
          <div className="text-center text-gray-600">
            <p>Tải lên hình ảnh có chứa mã vạch để quét.</p>
            <p className="text-sm">Hình ảnh cần rõ nét và mã vạch dễ đọc.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
