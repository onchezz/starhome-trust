import React from "react";
import { FileIcon } from "@/components/FileIcon";
import { parseImagesData } from "@/utils/imageUtils";

interface DocumentListProps {
  documentsId: string;
}

export const DocumentList = ({ documentsId }: DocumentListProps) => {
  const { imageUrls, imageNames } = parseImagesData(documentsId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {imageUrls.map((url, index) => (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-4 space-x-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FileIcon filename={url} />
          <span className="text-sm font-medium">{imageNames[index] || `Document ${index + 1}`}</span>
        </a>
      ))}
    </div>
  );
};