import React, { useState } from "react";
import { Shimmer } from "@/components/ui/shimmer";
import { parseImagesData } from "@/utils/imageUtils";
import { Loader2 } from "lucide-react";

interface ImageGalleryProps {
  imagesId: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ imagesId }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { imageUrls } = parseImagesData(imagesId);

  console.log("[ImageGallery] Rendering with images:", imageUrls);

  if (!imageUrls.length) {
    return (
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden group h-48">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      <img
        src={imageUrls[currentImageIndex]}
        alt={`Property ${currentImageIndex + 1}`}
        className={`w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
      {imageUrls.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {imageUrls.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                currentImageIndex === index ? 'bg-white' : 'bg-white/50'
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