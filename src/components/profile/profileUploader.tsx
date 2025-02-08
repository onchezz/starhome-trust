import React from "react";
import { Loader2 } from "lucide-react";

interface ImageUploaderProps {
  selectedFile: File;
  isUploading: boolean;
  uploadProgress: number;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLLabelElement>) => void;
  setSelectedFile: React.Dispatch<React.SetStateAction<File>>;
}
export const ProfileImageUploader = ({
  selectedFile,
  isUploading,
  uploadProgress,
  handleFileSelect,
  handleDrop,
  setSelectedFile,
}: ImageUploaderProps) => {
  return (
    <div className="rounded-sm bg-white/40 backdrop-blur-sm p-6 space-y-2 animate-fade-in delay-300">
      {!selectedFile ? (
        <h1 className="text-sm font-sans text-gray-900 text-center">
          User Profile Image
        </h1>
      ) : (
        <h1 className=" text-sm font-sans text-gray-900 text-center">
          selected image
        </h1>
      )}

      {!selectedFile ? (
        <label
          className={`
      border-2 border-dashed rounded-lg p-4
      ${
        isUploading
          ? "border-gray-300 bg-gray-50"
          : "border-purple-300 hover:border-purple-500 cursor-pointer"
      }
      transition-all duration-300 ease-in-out
      flex flex-col items-center justify-center space-y-4
    `}
          htmlFor="file-upload"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("border-purple-500");
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("border-purple-500");
          }}
        >
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
          <div className="text-center">
            <svg
              className="mx-auto h-6 w-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 14v20c0 4.418 3.582 8 8 8h16c4.418 0 8-3.582 8-8V14M8 14c0-4.418 3.582-8 8-8h16c4.418 0 8 3.582 8 8M8 14h32"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M24 14v20M17 21l7-7 7 7"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Tap to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
          </div>
        </label>
      ) : (
        //   (
        //     <div
        //       className={`
        //         border-2 border-dashed rounded-lg p-4
        //         ${
        //           isUploading
        //             ? "border-gray-300 bg-gray-50"
        //             : "border-purple-300 hover:border-purple-500 cursor-pointer"
        //         }
        //         transition-all duration-300 ease-in-out
        //         flex flex-col items-center justify-center space-y-4
        //       `}
        //       onDrop={handleDrop}
        //       onDragOver={(e) => e.preventDefault()}
        //       onDragEnter={(e) => {
        //         e.preventDefault();
        //         e.currentTarget.classList.add("border-purple-500");
        //       }}
        //       onDragLeave={(e) => {
        //         e.preventDefault();
        //         e.currentTarget.classList.remove("border-purple-500");
        //       }}
        //     >
        //       <div className="text-center">
        //         <svg
        //           className="mx-auto h-6 w-10 text-gray-400"
        //           fill="none"
        //           stroke="currentColor"
        //           viewBox="0 0 48 48"
        //         >
        //           <path
        //             strokeLinecap="round"
        //             strokeLinejoin="round"
        //             strokeWidth={2}
        //             d="M8 14v20c0 4.418 3.582 8 8 8h16c4.418 0 8-3.582 8-8V14M8 14c0-4.418 3.582-8 8-8h16c4.418 0 8 3.582 8 8M8 14h32"
        //           />
        //           <path
        //             strokeLinecap="round"
        //             strokeLinejoin="round"
        //             strokeWidth={2}
        //             d="M24 14v20M17 21l7-7 7 7"
        //           />
        //         </svg>
        //         <div className="mt-2 flex text-sm text-gray-600">
        //           <label
        //             htmlFor="file-upload"
        //             className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
        //           >
        //             <span>Upload image</span>
        //             <input
        //               id="file-upload"
        //               name="file-upload"
        //               type="file"
        //               accept="image/*"
        //               className="sr-only"
        //               onChange={handleFileSelect}
        //               disabled={isUploading}
        //             />
        //           </label>
        //           <p className="pl-1">or drag and drop</p>
        //         </div>
        //         <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
        //       </div>
        //     </div>
        //   )
        <div className="flex items-center justify-center">
          <div className="relative group">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Profile preview"
              className="w-24 h-24 rounded-full object-cover"
            />
            <button
              onClick={() => setSelectedFile(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
            <p className="mt-1 text-xs text-gray-500 text-center truncate max-w-[96px]">
              {selectedFile.name}
            </p>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="mt-4 animate-fade-in">
          <div className="relative w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-purple-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${uploadProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 animate-pulse"></div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            {/* <Loader2 className="h-4 w-4 animate-spin text-purple-500" /> */}
            <p className="text-sm text-gray-500">Uploading image...</p>
          </div>
        </div>
      )}
    </div>
  );
};

