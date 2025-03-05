import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, RotateCw, PauseCircle } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
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

  // Drag to rotate handlers
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (autoRotate || isLoading) return;
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || autoRotate || isLoading) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startX;

    if (Math.abs(deltaX) > 5) {
      const sensitivity = 0.005; // Adjust sensitivity for rotation speed
      const moveSteps = Math.max(1, Math.floor(Math.abs(deltaX) * sensitivity));

      setCurrentIndex((prevIndex) => {
        let newIndex = prevIndex + (deltaX > 0 ? -moveSteps : moveSteps);

        if (newIndex < 1) newIndex = totalFrames + newIndex;
        if (newIndex > totalFrames) newIndex = newIndex - totalFrames;

        return newIndex;
      });

      setStartX(clientX);
    }
  };

  const handleMouseUp = () => {
    if (!isLoading) setIsDragging(false);
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [totalFrames, isLoading]);

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
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">{itemName} - 360° View</h2>

      <div className="relative w-full h-[400px] bg-white rounded-lg shadow-lg overflow-hidden mb-4">
        <div
          ref={containerRef}
          className={`relative w-full h-full flex items-center justify-center select-none ${
            isLoading || autoRotate ? "cursor-default" : "cursor-grab"
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
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
              <img
                src={getImageUrl(currentIndex)}
                alt={`${itemName} view ${currentIndex}`}
                className="max-w-full max-h-full object-contain"
                draggable="false"
              />
              <div className="absolute bottom-4 left-4 text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                {autoRotate ? "Auto-rotating" : "Drag to rotate"}
              </div>
              <div className="absolute bottom-4 right-4 text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                Frame: {currentIndex}/{totalFrames}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
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
          disabled={isLoading}
          className={`p-2 rounded-full ${
            isLoading
              ? "text-gray-400 bg-gray-200"
              : autoRotate
              ? "text-red-600 bg-red-100 hover:bg-red-200"
              : "text-blue-600 bg-blue-100 hover:bg-blue-200"
          }`}
          aria-label={autoRotate ? "Stop auto-rotate" : "Start auto-rotate"}
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

      <div className="text-gray-600 text-sm">
        <p>
          Keyboard controls: Arrow keys to rotate, Spacebar to toggle
          auto-rotation
        </p>
      </div>
    </div>
  );
};

export default ClothingViewer360;
