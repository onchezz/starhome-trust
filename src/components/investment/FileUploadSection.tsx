import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/FileIcon";
import UploadProgress from "@/components/UploadProgress";

interface FileUploadSectionProps {
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
  handleDrop: (
    e: React.DragEvent<HTMLDivElement>,
    isDocument: boolean
  ) => void;
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setSelectedDocs: React.Dispatch<React.SetStateAction<File[]>>;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setShowPreviewModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  selectedFiles,
  selectedDocs,
  isUploading,
  uploadProgress,
  uploadedFiles,
  uploadedSize,
  totalUploadSize,
  handleFileSelect,
  handleDrop,
  setSelectedFiles,
  setSelectedDocs,
  setPreviewUrl,
  setShowPreviewModal,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Image Upload Section */}
      <div>
        <Label>Property Images</Label>
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 mt-2
            ${
              isUploading
                ? "border-gray-300 bg-gray-50"
                : "border-gray-300 hover:border-primary cursor-pointer"
            }
            transition-colors duration-200 ease-in-out
          `}
          onDrop={(e) => handleDrop(e, false)}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("border-primary");
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("border-primary");
          }}
        >
          <div className="text-center">
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, false)}
              disabled={isUploading}
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer text-primary hover:text-primary-dark"
            >
              Click to upload
            </label>
            <p className="text-sm text-gray-500 mt-2">
              or drag and drop images here
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, WEBP up to 10MB each
            </p>
          </div>
        </div>

        {/* Image Preview */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="relative group hover:scale-105 transition-transform duration-200"
              >
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  onClick={() => {
                    setSelectedFiles((prev) =>
                      prev.filter((_, i) => i !== index)
                    );
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Upload Section */}
      <div>
        <Label>Legal Documents</Label>
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 mt-2
            ${
              isUploading
                ? "border-gray-300 bg-gray-50"
                : "border-gray-300 hover:border-primary cursor-pointer"
            }
            transition-colors duration-200 ease-in-out
          `}
          onDrop={(e) => handleDrop(e, true)}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("border-primary");
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("border-primary");
          }}
        >
          <div className="text-center">
            <input
              id="doc-upload"
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => handleFileSelect(e, true)}
              disabled={isUploading}
            />
            <label
              htmlFor="doc-upload"
              className="cursor-pointer text-primary hover:text-primary-dark"
            >
              Click to upload
            </label>
            <p className="text-sm text-gray-500 mt-2">
              or drag and drop documents here
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PDF, DOC, DOCX up to 20MB each
            </p>
          </div>
        </div>

        {/* Document Preview */}
        {selectedDocs.length > 0 && (
          <div className="mt-4 space-y-2">
            {selectedDocs.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileIcon filename={file.name} className="h-6 w-6" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <div className="flex space-x-2 text-xs text-gray-500">
                      <span>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <span>•</span>
                      <span>{file.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {file.type === "application/pdf" && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(URL.createObjectURL(file));
                        setShowPreviewModal(true);
                      }}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDocs((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <UploadProgress
          progress={uploadProgress}
          totalFiles={selectedFiles.length + selectedDocs.length}
          uploadedFiles={uploadedFiles}
          totalSize={totalUploadSize}
          uploadedSize={uploadedSize}
        />
      )}
    </div>
  );
};

export default FileUploadSection;