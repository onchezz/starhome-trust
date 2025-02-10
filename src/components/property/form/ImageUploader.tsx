// import React from "react";
// import { Label } from "@/components/ui/label";
// import { FileIcon } from "@/components/FileIcon";
// import { Loader2 } from "lucide-react";

// interface ImageUploaderProps {
//   selectedFiles: File[];
//   isUploading: boolean;
//   uploadProgress: number;
//   handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
//   setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
// }

// const ImageUploader = ({
//   selectedFiles,
//   isUploading,
//   uploadProgress,
//   handleFileSelect,
//   handleDrop,
//   setSelectedFiles,
// }: ImageUploaderProps) => {
//   return (
//     <div className="rounded-lg bg-white/40 backdrop-blur-sm p-6 space-y-6 animate-fade-in delay-300">
//       <h3 className="text-lg font-semibold text-gray-900">Property Images</h3>
//       <div
//         className={`
//           border-2 border-dashed rounded-lg p-8
//           ${
//             isUploading
//               ? "border-gray-300 bg-gray-50"
//               : "border-purple-300 hover:border-purple-500 cursor-pointer"
//           }
//           transition-all duration-300 ease-in-out
//           flex flex-col items-center justify-center space-y-4
//         `}
//         onDrop={handleDrop}
//         onDragOver={(e) => e.preventDefault()}
//         onDragEnter={(e) => {
//           e.preventDefault();
//           e.currentTarget.classList.add("border-purple-500");
//         }}
//         onDragLeave={(e) => {
//           e.preventDefault();
//           e.currentTarget.classList.remove("border-purple-500");
//         }}
//       >
//         <div className="text-center">
//           <svg
//             className="mx-auto h-12 w-12 text-gray-400"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 48 48"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M8 14v20c0 4.418 3.582 8 8 8h16c4.418 0 8-3.582 8-8V14M8 14c0-4.418 3.582-8 8-8h16c4.418 0 8 3.582 8 8M8 14h32"
//             />
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M24 14v20M17 21l7-7 7 7"
//             />
//           </svg>
//           <div className="mt-4 flex text-sm text-gray-600">
//             <label
//               htmlFor="file-upload"
//               className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
//             >
//               <span>Upload files</span>
//               <input
//                 id="file-upload"
//                 name="file-upload"
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 className="sr-only"
//                 onChange={handleFileSelect}
//                 disabled={isUploading}
//               />
//             </label>
//             <p className="pl-1">or drag and drop</p>
//           </div>
//           <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB each</p>
//         </div>
//       </div>

//       {selectedFiles.length > 0 && (
//         <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
//           {selectedFiles.map((file, index) => (
//             <div key={index} className="relative group hover:scale-105 transition-transform duration-200">
//               <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
//                 <img
//                   src={URL.createObjectURL(file)}
//                   alt={`Preview ${index + 1}`}
//                   className="h-full w-full object-cover"
//                 />
//               </div>
//               <button
//                 onClick={() => {
//                   setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
//                 }}
//                 className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 <svg
//                   className="h-4 w-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//               <p className="mt-1 text-xs text-gray-500 truncate">{file.name}</p>
//             </div>
//           ))}
//         </div>
//       )}

//       {isUploading && (
//         <div className="mt-4 animate-fade-in">
//           <div className="relative w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
//             <div
//               className="bg-purple-500 h-2.5 rounded-full transition-all duration-500"
//               style={{ width: `${uploadProgress}%` }}
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 animate-pulse"></div>
//             </div>
//           </div>
//           <div className="mt-2 flex items-center justify-center gap-2">
//             <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
//             <p className="text-sm text-gray-500">Uploading images...</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageUploader;

import React from "react";
import { Label } from "@/components/ui/label";
import { FileIcon } from "@/components/FileIcon";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  selectedFiles: File[];
  isUploading: boolean;
  uploadProgress: number;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  existingImages?: string[];
  onDeleteImage?: (imageHash: string) => Promise<void>;
}

const ImageUploader = ({
  selectedFiles,
  isUploading,
  uploadProgress,
  handleFileSelect,
  handleDrop,
  setSelectedFiles,
  existingImages = [],
  onDeleteImage,
}: ImageUploaderProps) => {
  const handleDeleteClick = async (imageHash: string) => {
    try {
      if (onDeleteImage) {
        await onDeleteImage(imageHash);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="rounded-lg bg-white/40 backdrop-blur-sm p-6 space-y-6 animate-fade-in delay-300">
      <h3 className="text-lg font-semibold text-gray-900">Property Images</h3>
      <div
        className={`
          border-2 border-dashed rounded-lg p-8
          ${
            isUploading
              ? "border-gray-300 bg-gray-50"
              : "border-purple-300 hover:border-purple-500 cursor-pointer"
          }
          transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center space-y-4
        `}
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
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          <div className="mt-4 flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
            >
              <span>Upload files</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                multiple
                accept="image/*"
                className="sr-only"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, WEBP up to 10MB each
          </p>
        </div>
      </div>

      {/* Existing Images Section */}
      {existingImages && existingImages.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">
            Current Images
          </h4>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {existingImages.map((imageHash, index) => (
              <div
                key={imageHash}
                className="relative group hover:scale-105 transition-transform duration-200"
              >
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={`https://gateway.pinata.cloud/ipfs/${imageHash}`}
                    alt={`Property Image ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "placeholder-image-url";
                    }}
                  />
                </div>
                <button
                  onClick={() => handleDeleteClick(imageHash)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  title="Delete image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <p className="mt-1 text-xs text-gray-500 truncate">
                  Image {index + 1}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Selected Files Section */}
      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">
            New Images to Upload
          </h4>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  title="Remove image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <p className="mt-1 text-xs text-gray-500 truncate">
                  {file.name}
                </p>
              </div>
            ))}
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
            <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
            <p className="text-sm text-gray-500">Uploading images...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;