import React from 'react';
import { FileIcon } from '@/components/FileIcon';
import { parseIpfsData } from '@/utils/uploadUtils';

interface DocumentListProps {
  documentsId: string;
}

export const DocumentList = ({ documentsId }: DocumentListProps) => {
  const { urls, fileNames } = parseIpfsData(documentsId);

  const getFileExtension = (fileName: string) => {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop()?.toLowerCase() : '';
  };

  const formatFileName = (fileName: string) => {
    // Remove file extension and replace hyphens/underscores with spaces
    return fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-2">
      {urls.map((url, index) => {
        const fileName = fileNames[index];
        const extension = getFileExtension(fileName);
        const displayName = formatFileName(fileName);

        return (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-2 space-x-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FileIcon extension={extension || ''} />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">{displayName}</p>
              <p className="text-xs text-gray-500">{extension?.toUpperCase()}</p>
            </div>
          </a>
        );
      })}
    </div>
  );
};