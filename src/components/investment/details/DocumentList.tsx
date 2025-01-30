import React from "react";
import { FileIcon } from "@/components/FileIcon";
import { parseImagesData } from "@/utils/imageUtils";

interface DocumentListProps {
  documentsId: string;
}

export const DocumentList = ({ documentsId }: DocumentListProps) => {
  const { imageUrls } = parseImagesData(documentsId);

  const extractFileName = (url: string): string => {
    try {
      // Split the URL by '/' and get the last segment
      const segments = url.split('/');
      const fileName = segments[segments.length - 1];
      // URL decode to handle any encoded characters
      return decodeURIComponent(fileName);
    } catch (error) {
      console.error("[DocumentList] Error extracting filename:", error);
      return "Unknown Document";
    }
  };

  console.log("[DocumentList] Rendering with URLs:", imageUrls);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {imageUrls.map((url, index) => {
        const fileName = extractFileName(url);
        const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
        
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 space-x-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FileIcon filename={fileName} />
            <span className="text-sm font-medium truncate">{fileName}</span>
          </a>
        );
      })}
    </div>
  );
};