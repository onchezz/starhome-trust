import React from "react";
import * as Icons from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

interface FileIconProps {
  filename: string;
  className?: string;
  showTooltip?: boolean;
}

export const FileIcon: React.FC<FileIconProps> = ({
  filename,
  className = "",
  showTooltip = true,
}) => {
  const getFileInfo = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return {
          Icon: Icons.FileTextIcon,
          color: "text-red-500",
          label: "PDF Document",
        };
      case "doc":
      case "docx":
        return {
          Icon: Icons.FileTextIcon,
          color: "text-blue-500",
          label: "Word Document",
        };
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return {
          Icon: Icons.ImageIcon,
          color: "text-green-500",
          label: "Image File",
        };
      case "xls":
      case "xlsx":
        return {
          Icon: Icons.TableIcon,
          color: "text-emerald-500",
          label: "Excel Spreadsheet",
        };
      case "zip":
      case "rar":
        return {
          Icon: Icons.ArchiveIcon,
          color: "text-amber-500",
          label: "Archive File",
        };
      default:
        return {
          Icon: Icons.FileIcon,
          color: "text-gray-500",
          label: "Document",
        };
    }
  };

  const { Icon, color, label } = getFileInfo(filename);

  const iconElement = <Icon className={`${color} ${className}`} />;

  if (!showTooltip) return iconElement;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{iconElement}</TooltipTrigger>
        <TooltipContent
          side="top"
          className="px-3 py-2 text-sm bg-slate-900 text-white rounded-md"
        >
          {label} ({filename.split(".").pop()?.toUpperCase()})
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FileIcon;
