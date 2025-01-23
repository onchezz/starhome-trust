import React from "react";
import * as Progress from "@radix-ui/react-progress";
import * as Separator from "@radix-ui/react-separator";
import { UploadIcon, Cross2Icon, UpdateIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

interface UploadProgressProps {
  progress: number;
  totalFiles: number;
  uploadedFiles: number;
  totalSize: number;
  uploadedSize: number;
  onCancel?: () => void;
  status?: "uploading" | "processing" | "error" | "success";
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  progress,
  totalFiles,
  uploadedFiles,
  totalSize,
  uploadedSize,
  onCancel,
  status = "uploading",
}) => {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getStatusColor = () => {
    switch (status) {
      case "error":
        return "bg-red-500";
      case "success":
        return "bg-green-500";
      case "processing":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "error":
        return <Cross2Icon className="text-red-500" />;
      case "success":
        return <UploadIcon className="text-green-500" />;
      case "processing":
        return <UpdateIcon className="text-yellow-500 animate-spin" />;
      default:
        return <UploadIcon className="text-blue-500" />;
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="font-medium">
            {status === "uploading"
              ? "Uploading..."
              : status === "processing"
              ? "Processing..."
              : status === "error"
              ? "Upload failed"
              : "Upload complete"}
          </span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm text-gray-500">
                {uploadedFiles} of {totalFiles} files
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              {formatSize(uploadedSize)} of {formatSize(totalSize)}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Progress.Root
        className="relative overflow-hidden bg-slate-200 rounded-full w-full h-2"
        value={progress}
      >
        <Progress.Indicator
          className={`h-full transition-transform duration-500 ease-out ${getStatusColor()}`}
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </Progress.Root>

      <div className="flex justify-between text-xs text-gray-500">
        <span>{progress.toFixed(1)}% complete</span>
        <span>{formatSize(totalSize - uploadedSize)} remaining</span>
      </div>

      <Separator.Root className="h-[1px] bg-slate-200 my-2" />

      <div className="flex justify-end">
        {status === "uploading" && onCancel && (
          <button
            onClick={onCancel}
            className="text-sm text-red-500 hover:text-red-700 focus:outline-none"
          >
            Cancel Upload
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadProgress;
