// src/pages/dashboard/BgRemoverPage.tsx
import React, { useState, useCallback, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Loader2,
  Upload, // Use Upload icon for input
  Download,
  Trash2, // For clearing image
  Image as ImageIcon, // Keep for placeholder
  Wand2, // Icon for remove background button
} from "lucide-react";
import { useDropzone } from "react-dropzone";

// Renamed component
const BgRemoverPage = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // Separate download state
  const [error, setError] = useState<string | null>(null);

  // Cleanup object URLs on unmount or when image changes
  useEffect(() => {
    // Revoke previous object URL when a new one is created or component unmounts
    return () => {
      if (originalImageUrl) {
        URL.revokeObjectURL(originalImageUrl);
      }
      // Note: We don't revoke processedImageUrl as it's likely a direct URL from the server, not a blob URL.
      // If the backend *did* return a blob reference managed client-side, you'd revoke it here too.
    };
  }, [originalImageUrl]);

  const clearState = () => {
    setError(null);
    setProcessedImageUrl(null);
    if (originalImageUrl) {
      URL.revokeObjectURL(originalImageUrl);
    }
    setOriginalImageFile(null);
    setOriginalImageUrl(null);
    setIsLoading(false);
    setIsDownloading(false);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      // Basic validation (can be expanded)
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file (PNG, JPG, WEBP, etc.).");
        return;
      }
      clearState(); // Clear previous state before setting new image
      setOriginalImageFile(file);
      setOriginalImageUrl(URL.createObjectURL(file));
    } else {
      setError("File upload failed or was cancelled.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
      // Add other image types your backend supports
    },
    multiple: false, // Only allow one file
  });

  const handleRemoveBackground = async () => {
    if (!originalImageFile || isLoading) return;

    setIsLoading(true);
    setError(null);
    setProcessedImageUrl(null); // Clear previous result
    setIsDownloading(false);

    const formData = new FormData();
    formData.append("image", originalImageFile); // Key 'image' depends on your backend API

    // *** IMPORTANT: Replace with your actual backend endpoint ***
    const backendUrl = `http://127.0.0.1:8000/api/image/remove-background/`;

    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          // Content-Type is set automatically by browser for FormData
          // 'Content-Type': 'multipart/form-data', <--- DO NOT SET MANUALLY
          Authorization: `Bearer ${localStorage.getItem("access")}`, // Keep authorization if needed
        },
        body: formData,
      });

      if (!response.ok) {
        let errorDetail = `Request failed with status ${response.status}`;
        try {
          const errData = await response.json();
          errorDetail =
            errData.error ||
            errData.detail ||
            errorDetail || // Fallback to status text if parsing fails but response not ok
            "Unknown error occurred.";
        } catch (parseError) {
          // If parsing error response fails, use the status text
          errorDetail = response.statusText || errorDetail;
        }
        throw new Error(errorDetail);
      }

      const data = await response.json();

      // *** Adjust based on your backend response structure ***
      if (
        !data.processed_image_url ||
        typeof data.processed_image_url !== "string"
      ) {
        console.error("Invalid response format from backend:", data);
        throw new Error("Received invalid processed image data from server.");
      }
      setProcessedImageUrl(data.processed_image_url);
    } catch (err: any) {
      console.error("Background removal failed:", err);
      setError(
        err.message || "An unexpected error occurred during background removal."
      );
      setProcessedImageUrl(null); // Ensure no stale processed image is shown on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadResult = async () => {
    if (!processedImageUrl || isDownloading) return;

    setIsDownloading(true);
    setError(null); // Clear previous errors

    try {
      // Fetch the processed image URL (could be direct URL or requires auth)
      const response = await fetch(processedImageUrl, {
        // Add headers if the processed image URL requires auth, e.g.:
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem("access")}`,
        // }
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch processed image: ${response.statusText}`
        );
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Create a filename (e.g., original_filename_bg_removed.png)
      const originalFilename = originalImageFile?.name || "image";
      const nameWithoutExtension =
        originalFilename.substring(0, originalFilename.lastIndexOf(".")) ||
        originalFilename;
      // Assume PNG output, adjust if backend specifies format
      const fileExtension = "png";
      const filename = `${nameWithoutExtension}_bg_removed.${fileExtension}`;
      link.setAttribute("download", filename);

      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      setError(`Failed to download the processed image.`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full text-gray-300">
        {/* Header Area (Optional) */}
        <div className="p-4 border-b border-gray-800 text-center">
          <h1 className="text-xl font-semibold text-gray-200">
            Background Remover
          </h1>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow overflow-y-auto p-6 flex flex-col items-center justify-center relative">
          {/* Conditional Rendering: Upload Prompt or Image Previews */}
          {!originalImageUrl && !isLoading && (
            <div
              {...getRootProps()}
              className={`w-full max-w-lg border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors duration-200 ease-in-out
                          ${
                            isDragActive
                              ? "border-cyan-500 bg-cyan-900/20"
                              : "border-gray-600 hover:border-gray-500 bg-gray-800/30"
                          }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              {isDragActive ? (
                <p className="text-gray-400">Drop the image here...</p>
              ) : (
                <p className="text-gray-400">
                  Drag & drop an image here, or click to select file
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                (PNG, JPG, WEBP accepted)
              </p>
            </div>
          )}

          {/* Display Area: Original and Processed Images */}
          {originalImageUrl && (
            <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6 items-start justify-center">
              {/* Original Image */}
              <div className="flex-1 w-full md:w-1/2 relative">
                <h3 className="text-lg font-medium text-center mb-2 text-gray-400">
                  Original
                </h3>
                <div className="relative aspect-w-1 aspect-h-1 border border-gray-700 rounded-lg overflow-hidden bg-gray-800">
                  <img
                    src={originalImageUrl}
                    alt="Original Upload"
                    className="absolute top-0 left-0 w-full h-full object-contain"
                  />
                  {/* Clear Button */}
                  {!isLoading && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearState}
                      className="absolute top-2 right-2 z-10 bg-black/40 text-white/80 hover:bg-black/60 hover:text-white h-7 w-7 rounded-full"
                      aria-label="Clear image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {!processedImageUrl && !isLoading && !error && (
                  <Button
                    onClick={handleRemoveBackground}
                    disabled={isLoading}
                    className="mt-4 w-full h-11 px-4 rounded-lg flex items-center justify-center gap-2 text-white text-base transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 bg-gradient-to-br from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 shadow-md"
                    aria-label="Remove Background"
                  >
                    <Wand2 className="h-5 w-5" />
                    Remove Background
                  </Button>
                )}
              </div>

              {/* Processed Image Area */}
              <div className="flex-1 w-full md:w-1/2 relative">
                <h3 className="text-lg font-medium text-center mb-2 text-gray-400">
                  Result
                </h3>
                <div className="relative aspect-w-1 aspect-h-1 border border-gray-700 rounded-lg overflow-hidden bg-grid-pattern">
                  {" "}
                  {/* Checkerboard pattern */}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10 rounded-lg">
                      <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                    </div>
                  )}
                  {!isLoading && processedImageUrl && (
                    <img
                      src={processedImageUrl}
                      alt="Background Removed"
                      className="absolute top-0 left-0 w-full h-full object-contain"
                      onError={(e) => {
                        console.warn(
                          `Failed to load processed image: ${processedImageUrl}`
                        );
                        setError("Failed to load the processed image result.");
                        e.currentTarget.style.display = "none"; // Hide broken image
                      }}
                    />
                  )}
                  {!isLoading &&
                    !processedImageUrl &&
                    !error &&
                    !originalImageUrl && ( // Show placeholder if no original image either
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                        <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Result will appear here</p>
                      </div>
                    )}
                  {!isLoading &&
                    !processedImageUrl &&
                    error && ( // Show placeholder on error too
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 px-4">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-80" />
                        <p className="text-sm text-center">
                          Could not process image
                        </p>
                      </div>
                    )}
                </div>
                {/* Download Button for Processed Image */}
                {processedImageUrl && !isLoading && (
                  <Button
                    onClick={handleDownloadResult}
                    disabled={isDownloading}
                    className="mt-4 w-full h-11 px-4 rounded-lg flex items-center justify-center gap-2 text-white text-base transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 bg-gradient-to-br from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 shadow-md"
                    aria-label="Download Processed Image"
                  >
                    {isDownloading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Download className="h-5 w-5" />
                    )}
                    Download Result
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Error Display Area */}
          {error && !isLoading && (
            <div className="w-full max-w-3xl mt-6">
              <Alert
                variant="destructive"
                className="bg-red-900/50 border-red-700 text-red-200"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearState}
                    className="ml-4 text-red-200 hover:text-white hover:bg-red-700/50 h-auto py-0.5 px-1.5"
                  >
                    Clear
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>

        {/* Footer Area (Optional - kept minimal) */}
        {/* Removed the complex control bar */}
        <div className="w-full px-4 pb-2 pt-2 border-t border-gray-800 bg-transparent text-center text-xs text-gray-500">
          Upload an image to remove its background.
        </div>
      </div>

      {/* Add CSS for the checkerboard pattern */}
      <style jsx global>{`
        .bg-grid-pattern {
          background-image: linear-gradient(45deg, #404040 25%, transparent 25%),
            linear-gradient(-45deg, #404040 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #404040 75%),
            linear-gradient(-45deg, transparent 75%, #404040 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          background-color: #2d2d2d; /* Fallback background */
        }
        /* Ensure aspect ratio boxes work (Tailwind aspect-ratio plugin might be needed if not using native CSS) */
        .aspect-w-1 {
          position: relative;
          padding-bottom: 100%;
        } /* 1:1 Aspect Ratio */
        .aspect-h-1 > * {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default BgRemoverPage;
