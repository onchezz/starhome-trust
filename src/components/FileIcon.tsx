import React from 'react';
import { 
  FileText, 
  FileImage, 
  File,
  FileCode, 
  FileArchive
} from 'lucide-react';

interface FileIconProps {
  extension: string;
  className?: string;
}

export const FileIcon = ({ extension, className = "w-6 h-6" }: FileIconProps) => {
  const getIcon = () => {
    switch (extension.toLowerCase()) {
      case 'pdf':
        return <FileText className={`${className} text-red-500`} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImage className={`${className} text-blue-500`} />;
      case 'txt':
      case 'doc':
      case 'docx':
        return <FileText className={`${className} text-gray-500`} />;
      case 'zip':
      case 'rar':
        return <FileArchive className={`${className} text-yellow-500`} />;
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
      case 'html':
      case 'css':
        return <FileCode className={`${className} text-green-500`} />;
      default:
        return <File className={`${className} text-gray-400`} />;
    }
  };

  return getIcon();
};