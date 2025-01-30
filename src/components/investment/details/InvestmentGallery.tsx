import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ImageGallery } from "@/components/investment/ImageGallery";
import { FileIcon } from "@/components/FileIcon";
import { parseImagesData } from "@/utils/imageUtils";

interface InvestmentGalleryProps {
  imagesId: string;
  documentsId: string;
}

export const InvestmentGallery = ({ imagesId, documentsId }: InvestmentGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { imageUrls } = parseImagesData(imagesId);
  const { imageUrls: documentUrls } = parseImagesData(documentsId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageUrls.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square cursor-pointer group"
                onClick={() => setSelectedImage(url)}
              >
                <img
                  src={url}
                  alt={`Property ${index + 1}`}
                  className="object-cover w-full h-full rounded-lg transition-transform group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

     

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected property"
              className="w-full h-auto"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};