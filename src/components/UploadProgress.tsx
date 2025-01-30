import React from "react";
import * as Progress from "@radix-ui/react-progress";
import * as Separator from "@radix-ui/react-separator";
import { LoaderCircle, CheckCircle2, XCircle, UploadCloud } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UploadStatus {
  isUploading: boolean;
  progress: number;
}

interface UploadProgressProps {
  progress: number;
  totalFiles: number;
  uploadedFiles: number;
  totalSize: number;
  uploadedSize: number;
  onCancel?: () => void;
  status?: "uploading" | "processing" | "error" | "success";
  uploadStatus: {
    images: UploadStatus;
    documents: UploadStatus;
  };
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  progress,
  totalFiles,
  uploadedFiles,
  totalSize,
  uploadedSize,
  onCancel,
  status = "uploading",
  uploadStatus,
}) => {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getStatusColor = (type: "images" | "documents") => {
    if (uploadStatus[type].isUploading) return "bg-blue-500";
    if (uploadStatus[type].progress === 100) return "bg-green-500";
    return "bg-gray-200";
  };

  const getStatusIcon = (type: "images" | "documents") => {
    if (uploadStatus[type].isUploading) {
      return <LoaderCircle className="h-4 w-4 text-blue-500 animate-spin" />;
    }
    if (uploadStatus[type].progress === 100) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    return <UploadCloud className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="w-full space-y-4">
      {/* Images Upload Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon("images")}
            <span className="text-sm font-medium">Images</span>
          </div>
          <span className="text-sm text-gray-500">
            {uploadStatus.images.progress}%
          </span>
        </div>
        <Progress.Root
          className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2"
          value={uploadStatus.images.progress}
        >
          <Progress.Indicator
            className={`h-full transition-transform duration-500 ease-out ${getStatusColor(
              "images"
            )}`}
            style={{ transform: `translateX(-${100 - uploadStatus.images.progress}%)` }}
          />
        </Progress.Root>
      </div>

      {/* Documents Upload Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon("documents")}
            <span className="text-sm font-medium">Documents</span>
          </div>
          <span className="text-sm text-gray-500">
            {uploadStatus.documents.progress}%
          </span>
        </div>
        <Progress.Root
          className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2"
          value={uploadStatus.documents.progress}
        >
          <Progress.Indicator
            className={`h-full transition-transform duration-500 ease-out ${getStatusColor(
              "documents"
            )}`}
            style={{
              transform: `translateX(-${100 - uploadStatus.documents.progress}%)`,
            }}
          />
        </Progress.Root>
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatSize(totalSize - uploadedSize)} remaining</span>
        <span>
          {uploadedFiles} of {totalFiles} files
        </span>
      </div>

      {onCancel && (status === "uploading" || status === "processing") && (
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="text-sm text-red-500 hover:text-red-700 focus:outline-none"
          >
            Cancel Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadProgress;