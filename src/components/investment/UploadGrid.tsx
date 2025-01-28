import React from "react";
import FileUploadSection from "./FileUploadSection";

interface UploadGridProps {
  selectedFiles: File[];
  selectedDocs: File[];
  isUploading: boolean;
  uploadProgress: number;
  uploadedFiles: number;
  uploadedSize: number;
  totalUploadSize: number;
  handleFileSelect: (
    event: React.ChangeEvent<HTMLInputElement>,
    isDocument: boolean
  ) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, isDocument: boolean) => void;
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setSelectedDocs: React.Dispatch<React.SetStateAction<File[]>>;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setShowPreviewModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadGrid: React.FC<UploadGridProps> = (props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <FileUploadSection
        {...props}
        selectedFiles={props.selectedFiles}
        selectedDocs={[]}
        type="images"
      />
      <FileUploadSection
        {...props}
        selectedFiles={[]}
        selectedDocs={props.selectedDocs}
        type="documents"
      />
    </div>
  );
};

export default UploadGrid;