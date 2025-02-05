import React, { useState, memo } from "react";
import { Shimmer } from "@/components/ui/shimmer";
import { parseImagesData } from "@/utils/imageUtils";
import { Loader2 } from "lucide-react";

interface ImageGalleryProps {
  imagesId: string;
}

const ImageGalleryComponent = ({ imagesId }: ImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { imageUrls } = parseImagesData(imagesId);

  if (!imageUrls.length) {
    return (
      <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-t-lg flex items-center justify-center">
        <Shimmer className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="relative group aspect-video">
      <img
        src={imageUrls[currentImageIndex]}
        alt={`Property image ${currentImageIndex + 1}`}
        className="w-full h-full object-cover rounded-t-lg"
        onLoad={() => setIsLoading(false)}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      )}

      {imageUrls.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {imageUrls.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentImageIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export const ImageGallery = memo(ImageGalleryComponent);
ImageGallery.displayName = 'ImageGallery';