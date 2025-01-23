<div>
  <div className="grid grid-cols-2 md:grid-row-2 gap-6">
    {/* Image Preview */}
    <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-900">Selected Images</h3>
          {selectedFiles.length > 0 && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedFiles([])}
                className="text-red-500 hover:text-red-700"
              >
                Remove All
              </Button>
              <span className="text-sm text-gray-500">
                {selectedFiles.length} file(s) selected
              </span>
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
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
                <p className="mt-1 text-xs text-gray-500 truncate">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Uploading files to IPFS...
          </p>
        </div>
      )}
    </div>
  </div>
  {/* Document Preview */}
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-1 lg:grid-cols-1">
    <h3 className="text-sm font-medium text-gray-900">Selected Documents</h3>
    {selectedDocs.length > 0 && (
      <div className="mt-4 md:grid md">
        {selectedDocs.length > 0 && (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedDocs([])}
              className="text-red-500 hover:text-red-700"
            >
              Remove All
            </Button>
            <span className="text-sm text-gray-500">
              {selectedDocs.length} document(s) selected
            </span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Total size:{" "}
            {(
              selectedDocs.reduce((acc, file) => acc + file.size, 0) /
              1024 /
              1024
            ).toFixed(2)}{" "}
            MB
          </span>
        </div>
        <div className="mt-4 space-y-2">
          {selectedDocs.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FileIcon filename={file.name} className="h-6 w-6" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                  <div className="flex space-x-2 text-xs text-gray-500">
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
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
      </div>
    )}
  </div>
</div>;
