import React from 'react';
import { 
  FileText, 
  FileImage, 
  FilePdf, 
  FileCode, 
  FileArchive,
  File
} from 'lucide-react';

interface FileIconProps {
  extension: string;
}

export const FileIcon = ({ extension }: FileIconProps) => {
  const getIcon = () => {
    switch (extension.toLowerCase()) {
      case 'pdf':
        return <FilePdf className="w-6 h-6 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImage className="w-6 h-6 text-blue-500" />;
      case 'txt':
      case 'doc':
      case 'docx':
        return <FileText className="w-6 h-6 text-gray-500" />;
      case 'zip':
      case 'rar':
        return <FileArchive className="w-6 h-6 text-yellow-500" />;
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
      case 'html':
      case 'css':
        return <FileCode className="w-6 h-6 text-green-500" />;
      default:
        return <File className="w-6 h-6 text-gray-400" />;
    }
  };

  return getIcon();
};