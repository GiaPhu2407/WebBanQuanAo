import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  PauseCircle,
  ZoomIn,
  ZoomOut,
  RefreshCw,
} from "lucide-react";

interface ClothingViewer360Props {
  itemName: string;
  totalFrames: number;
  imagePath: string;
  imageExtension?: string;
}

const ClothingViewer360: React.FC<ClothingViewer360Props> = ({
  itemName,
  totalFrames,
  imagePath,
  imageExtension = "png",
}) => {
  // State management
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zoom related states
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [zoomMode, setZoomMode] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const autoRotateRef = useRef<number | null>(null);

  // Generate image URL
  const getImageUrl = (index: number) => {
    const url = `${imagePath}/${index}.${imageExtension}`;
    console.log(`Attempting to load image: ${url}`);

    // Kiểm tra file tồn tại
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          console.error(`File not found: ${url}`);
        }
      })
      .catch((error) => {
        console.error(`Error loading image: ${url}`, error);
      });

    return url;
  };

  // Preload images
  useEffect(() => {
    setIsLoading(true);
    setImagesLoaded(0);
    setError(null);
    resetZoom();

    console.log("Loading images from path:", imagePath);

    const preloadImages = () => {
      let loadedCount = 0;
      let hasError = false;

      for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setImagesLoaded(loadedCount);
          if (loadedCount === totalFrames) setIsLoading(false);
        };
        img.onerror = () => {
          if (!hasError) {
            hasError = true;
            setError(`Failed to load image: ${getImageUrl(i)}`);
            console.error(`Failed to load image: ${getImageUrl(i)}`);
          }
          loadedCount++;
          setImagesLoaded(loadedCount);
          if (loadedCount === totalFrames) setIsLoading(false);
        };
        img.src = getImageUrl(i);
      }
    };

    preloadImages();

    // Reset auto-rotation when changing items
    if (autoRotateRef.current) {
      window.clearInterval(autoRotateRef.current);
      autoRotateRef.current = null;
    }

    setAutoRotate(false);

    // Reset current index when changing item or color
    setCurrentIndex(1);
  }, [imagePath, totalFrames, imageExtension]);

  // Auto-rotation effect
  useEffect(() => {
    if (autoRotate && !isLoading) {
      autoRotateRef.current = window.setInterval(() => {
        setCurrentIndex((prev) => (prev === totalFrames ? 1 : prev + 1));
      }, 100);
    } else if (autoRotateRef.current) {
      window.clearInterval(autoRotateRef.current);
      autoRotateRef.current = null;
    }

    return () => {
      if (autoRotateRef.current) {
        window.clearInterval(autoRotateRef.current);
        autoRotateRef.current = null;
      }
    };
  }, [autoRotate, isLoading, totalFrames]);

  // Zoom functions
  const zoomIn = () => {
    if (scale < 3) {
      setScale((prevScale) => Math.min(prevScale + 0.5, 3));
    }
  };

  const zoomOut = () => {
    if (scale > 1) {
      setScale((prevScale) => Math.max(prevScale - 0.5, 1));

      // Reset position if zooming out to original size
      if (scale - 0.5 <= 1) {
        setPosition({ x: 0, y: 0 });
      }
    }
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setZoomMode(false);
  };

  const toggleZoomMode = () => {
    setZoomMode(!zoomMode);
    if (zoomMode) {
      resetZoom();
    }
  };

  // Drag to rotate or move zoomed image handlers
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (isLoading) return;
    e.preventDefault();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    setIsDragging(true);
    setStartX(clientX);
    setStartY(clientY);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || isLoading) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    if (zoomMode && scale > 1) {
      // Handle panning when zoomed in
      setPosition((prev) => {
        // Calculate boundaries to prevent panning outside image
        const maxPanX =
          ((scale - 1) * (containerRef.current?.clientWidth || 0)) / 2;
        const maxPanY =
          ((scale - 1) * (containerRef.current?.clientHeight || 0)) / 2;

        const newX = Math.max(Math.min(prev.x + deltaX, maxPanX), -maxPanX);
        const newY = Math.max(Math.min(prev.y + deltaY, maxPanY), -maxPanY);

        return { x: newX, y: newY };
      });
    } else if (!autoRotate) {
      // Handle rotating when not in zoom mode
      if (Math.abs(deltaX) > 5) {
        const sensitivity = 0.005; // Adjust sensitivity for rotation speed
        const moveSteps = Math.max(
          1,
          Math.floor(Math.abs(deltaX) * sensitivity)
        );

        setCurrentIndex((prevIndex) => {
          let newIndex = prevIndex + (deltaX > 0 ? -moveSteps : moveSteps);

          if (newIndex < 1) newIndex = totalFrames + newIndex;
          if (newIndex > totalFrames) newIndex = newIndex - totalFrames;

          return newIndex;
        });
      }
    }

    setStartX(clientX);
    setStartY(clientY);
  };

  const handleMouseUp = () => {
    if (!isLoading) setIsDragging(false);
  };

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    if (!zoomMode) return;

    e.preventDefault();

    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  // Global mouse/touch event listeners
  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoading) return;

      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev === 1 ? totalFrames : prev - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev === totalFrames ? 1 : prev + 1));
      } else if (e.key === " ") {
        setAutoRotate((prev) => !prev);
      } else if (e.key === "+" || e.key === "=") {
        zoomIn();
      } else if (e.key === "-" || e.key === "_") {
        zoomOut();
      } else if (e.key === "0") {
        resetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [totalFrames, isLoading, scale]);

  // Navigation controls
  const goToPrevious = () => {
    if (!isLoading && !autoRotate) {
      setCurrentIndex((prev) => (prev === 1 ? totalFrames : prev - 1));
    }
  };

  const goToNext = () => {
    if (!isLoading && !autoRotate) {
      setCurrentIndex((prev) => (prev === totalFrames ? 1 : prev + 1));
    }
  };

  const toggleAutoRotate = () => {
    setAutoRotate((prev) => !prev);
    if (!autoRotate) {
      resetZoom();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">{itemName} - 360° View</h2>

      <div className="relative w-full h-[550px] bg-white rounded-lg shadow-lg overflow-hidden mb-4">
        <div
          ref={containerRef}
          className={`relative w-full h-full flex items-center justify-center select-none ${
            isLoading
              ? "cursor-default"
              : zoomMode && scale > 1
              ? "cursor-move"
              : autoRotate
              ? "cursor-default"
              : "cursor-grab"
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onWheel={handleWheel}
          style={{ touchAction: "none" }}
        >
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75">
              <div className="text-xl font-semibold mb-2 text-blue-500">
                Loading images...
              </div>
              <div className="w-64 bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${(imagesLoaded / totalFrames) * 100}%` }}
                ></div>
              </div>
              <div className="mt-2">
                {imagesLoaded} / {totalFrames}
              </div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">
              <p className="font-bold">Error loading images:</p>
              <p>{error}</p>
              <p className="mt-4 text-sm">
                Please check if the images are in the correct directory
                structure:
                <br />
                {imagePath}/1.{imageExtension} to {totalFrames}.{imageExtension}
              </p>
              <p className="mt-2 text-sm">
                Make sure you have created the following directory structure in
                your public folder:
                <br />
                /images/clothing/
                {imagePath.split("/").slice(3).join("/")}
              </p>
            </div>
          ) : (
            <>
              <div
                className="relative transition-transform duration-200 ease-out"
                style={{
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  transformOrigin: "center",
                }}
              >
                <img
                  ref={imageRef}
                  src={getImageUrl(currentIndex)}
                  alt={`${itemName} view ${currentIndex}`}
                  className="max-w-full max-h-full object-contain"
                  draggable="false"
                />
              </div>
              <div className="absolute bottom-4 left-4 text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                {autoRotate
                  ? "Auto-rotating"
                  : zoomMode
                  ? "Drag to pan"
                  : "Drag to rotate"}
                {zoomMode && scale > 1 && ` (${scale.toFixed(1)}x)`}
              </div>
              <div className="absolute bottom-4 right-4 text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                Frame: {currentIndex}/{totalFrames}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <div className="flex space-x-2">
          <button
            onClick={goToPrevious}
            disabled={isLoading || autoRotate}
            className={`p-2 rounded-full ${
              isLoading || autoRotate
                ? "text-gray-400 bg-gray-200"
                : "text-gray-700 bg-white hover:bg-gray-200"
            }`}
            aria-label="Previous view"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={toggleAutoRotate}
            disabled={isLoading || (zoomMode && scale > 1)}
            className={`p-2 rounded-full ${
              isLoading || (zoomMode && scale > 1)
                ? "text-gray-400 bg-gray-200"
                : autoRotate
                ? "text-red-600 bg-red-100 hover:bg-red-200"
                : "text-blue-600 bg-blue-100 hover:bg-blue-200"
            }`}
            aria-label={autoRotate ? "Stop auto-rotate" : "Start auto-rotate"}
            title={autoRotate ? "Stop auto-rotate" : "Start auto-rotate"}
          >
            {autoRotate ? <PauseCircle size={24} /> : <RotateCw size={24} />}
          </button>

          <button
            onClick={goToNext}
            disabled={isLoading || autoRotate}
            className={`p-2 rounded-full ${
              isLoading || autoRotate
                ? "text-gray-400 bg-gray-200"
                : "text-gray-700 bg-white hover:bg-gray-200"
            }`}
            aria-label="Next view"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-300 mx-2 self-center"></div>

        <div className="flex space-x-2">
          <button
            onClick={toggleZoomMode}
            disabled={isLoading || autoRotate}
            className={`p-2 rounded-full ${
              isLoading || autoRotate
                ? "text-gray-400 bg-gray-200"
                : zoomMode
                ? "text-purple-600 bg-purple-100 hover:bg-purple-200"
                : "text-gray-700 bg-white hover:bg-gray-200"
            }`}
            aria-label={zoomMode ? "Exit zoom mode" : "Enter zoom mode"}
            title={zoomMode ? "Exit zoom mode" : "Enter zoom mode"}
          >
            <ZoomIn size={24} />
          </button>

          <button
            onClick={zoomIn}
            disabled={isLoading || !zoomMode || scale >= 3}
            className={`p-2 rounded-full ${
              isLoading || !zoomMode || scale >= 3
                ? "text-gray-400 bg-gray-200"
                : "text-gray-700 bg-white hover:bg-gray-200"
            }`}
            aria-label="Zoom in"
            title="Zoom in"
          >
            <ZoomIn size={24} />
          </button>

          <button
            onClick={zoomOut}
            disabled={isLoading || !zoomMode || scale <= 1}
            className={`p-2 rounded-full ${
              isLoading || !zoomMode || scale <= 1
                ? "text-gray-400 bg-gray-200"
                : "text-gray-700 bg-white hover:bg-gray-200"
            }`}
            aria-label="Zoom out"
            title="Zoom out"
          >
            <ZoomOut size={24} />
          </button>

          <button
            onClick={resetZoom}
            disabled={isLoading || !zoomMode || scale === 1}
            className={`p-2 rounded-full ${
              isLoading || !zoomMode || scale === 1
                ? "text-gray-400 bg-gray-200"
                : "text-gray-700 bg-white hover:bg-gray-200"
            }`}
            aria-label="Reset zoom"
            title="Reset zoom"
          >
            <RefreshCw size={24} />
          </button>
        </div>
      </div>

      <div className="text-gray-600 text-sm max-w-md text-center">
        <p>
          <span className="font-medium">Keyboard controls:</span> Arrow keys to
          rotate, Spacebar to toggle auto-rotation
          {zoomMode && ", +/- to zoom, 0 to reset zoom"}
        </p>
        {zoomMode && (
          <p className="mt-1">
            <span className="font-medium">Mouse controls:</span> Drag to pan
            when zoomed in, scroll wheel to zoom in/out
          </p>
        )}
      </div>
    </div>
  );
};

export default ClothingViewer360;
