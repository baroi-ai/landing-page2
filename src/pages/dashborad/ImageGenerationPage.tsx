// src/pages/dashboard/ImageGenerationPage.tsx
import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react"; // Added useRef
import DashboardLayout from "@/layouts/DashboardLayout";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button"; // Added buttonVariants
import { Input } from "@/components/ui/input"; // Added Input
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Sparkles,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  Ratio,
  Palette,
  RectangleHorizontal,
  Square,
  RectangleVertical,
  Camera,
  Pencil,
  Image as LucideImage,
  Download,
  UploadCloud, // For image upload
  XCircle, // For clearing image
} from "lucide-react";
import { Label } from "@/components/ui/label";
// --- Configuration Data ---

interface AvailableModel {
  id: string;
  name: string;
  cost: number;
  iconPath: string;
  supportsAspectRatio: boolean;
  supportsNumImages?: {
    paramNameBackend: "num_outputs" | "number_of_images";
    min: number;
    max: number;
    default: number;
  };
  fixedPayload?: Record<string, any>;
  supportsImageInput?: {
    // New property for image input capability
    paramNameBackend: string; // e.g., "image", "init_image"
  };
}

const availableModels: AvailableModel[] = [
  {
    id: "flux-dev",
    name: "Flux Dev",
    cost: 7,
    iconPath: "/flux.png",
    supportsAspectRatio: true,
    supportsNumImages: {
      paramNameBackend: "num_outputs",
      min: 1,
      max: 4,
      default: 1,
    },
    supportsImageInput: { paramNameBackend: "image" }, // Example: Flux Dev supports image input
  },
  {
    id: "google-imagen-3",
    name: "Imagen 3 (Google)",
    cost: 7,
    iconPath: "/google.png",
    supportsAspectRatio: true,
    fixedPayload: { safety_filter_level: "BLOCK_ONLY_HIGH" },
    // Does not support image input in this basic config
  },
  {
    id: "recraft-v3",
    name: "Recraft V3",
    cost: 7,
    iconPath: "/icons/recraft.png",
    supportsAspectRatio: true,
  },
  {
    id: "minimax-image-01",
    name: "Minimax Image-01",
    cost: 7,
    iconPath: "/icons/minimax.png",
    supportsAspectRatio: true,
    supportsNumImages: {
      paramNameBackend: "number_of_images",
      min: 1,
      max: 4,
      default: 1,
    },
  },
  {
    id: "ideogram-v3-quality",
    name: "Ideogram V3 Quality",
    cost: 7,
    iconPath: "/icons/ideogram.png",
    supportsAspectRatio: true,
    supportsImageInput: { paramNameBackend: "image_url" }, // Ideogram often takes image_url or init_image
    // If it takes a file, change to "image" or "init_image"
  },
  {
    id: "luma-photon",
    name: "Luma Photon",
    cost: 7,
    iconPath: "/icons/luma.png",
    supportsAspectRatio: true,
    supportsImageInput: { paramNameBackend: "image" }, // Luma Photon supports image input
  },
];

const aspectRatios = [
  { id: "16:9", name: "16:9", IconComponent: RectangleHorizontal },
  { id: "1:1", name: "1:1", IconComponent: Square },
  { id: "9:16", name: "9:16", IconComponent: RectangleVertical },
  { id: "4:3", name: "4:3", IconComponent: RectangleHorizontal },
];

const defaultSettings = {
  prompt: "",
  model: availableModels[0].id,
  aspectRatio: aspectRatios[0].id,
  numImages:
    availableModels.find((m) => m.id === availableModels[0].id)
      ?.supportsNumImages?.default ?? 1,
};
// --- End Configuration Data ---

const ImageGenerationPage = () => {
  const [prompt, setPrompt] = useState(defaultSettings.prompt);
  const [selectedModel, setSelectedModel] = useState(defaultSettings.model);
  const [aspectRatio, setAspectRatio] = useState(defaultSettings.aspectRatio);
  const [numImages, setNumImages] = useState<number | string>(
    defaultSettings.numImages
  );

  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null); // New state for uploaded image file
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); // New state for image preview

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

  const currentModel = useMemo(
    () => availableModels.find((m) => m.id === selectedModel),
    [selectedModel]
  );

  // Reset image if model changes and new model doesn't support image input
  useEffect(() => {
    if (!currentModel?.supportsImageInput) {
      setSourceImageFile(null);
      setImagePreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [currentModel]);

  const handleModelChange = useCallback(
    (newModelId: string) => {
      setSelectedModel(newModelId);
      const newModel = availableModels.find((m) => m.id === newModelId);

      // Handle numImages reset
      if (newModel?.supportsNumImages) {
        const currentN = Number(numImages);
        if (
          isNaN(currentN) ||
          currentN < newModel.supportsNumImages.min ||
          currentN > newModel.supportsNumImages.max
        ) {
          setNumImages(newModel.supportsNumImages.default);
        }
      } else {
        setNumImages(1);
      }
    },
    [numImages]
  );

  const calculateCost = useCallback(() => {
    // ... (cost calculation logic remains the same)
    if (!currentModel) return 0;
    const baseCost = currentModel.cost;
    let count = 1;
    if (currentModel.supportsNumImages) {
      const num = Number(numImages);
      count = Math.max(
        currentModel.supportsNumImages.min,
        Math.min(
          isNaN(num) || num < currentModel.supportsNumImages.min
            ? currentModel.supportsNumImages.default
            : num,
          currentModel.supportsNumImages.max
        )
      );
    }
    return Math.round(baseCost * count);
  }, [currentModel, numImages]);

  const estimatedCost = calculateCost();

  const handleNumImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... (logic remains the same)
    const value = e.target.value;
    const modelConfig = currentModel?.supportsNumImages;
    if (!modelConfig) return;
    if (
      value === "" ||
      (/^\d+$/.test(value) &&
        Number(value) >= 0 &&
        Number(value) <= modelConfig.max + 5)
    ) {
      setNumImages(value);
    } else if (/^\d+$/.test(value) && Number(value) > modelConfig.max + 5) {
      setNumImages(modelConfig.max);
    }
  };

  const handleNumImagesBlur = () => {
    // ... (logic remains the same)
    const modelConfig = currentModel?.supportsNumImages;
    if (!modelConfig) return;
    let currentN = Number(numImages);
    if (
      String(numImages).trim() === "" ||
      isNaN(currentN) ||
      currentN < modelConfig.min
    ) {
      currentN = modelConfig.min;
    } else if (currentN > modelConfig.max) {
      currentN = modelConfig.max;
    }
    setNumImages(currentN);
  };

  // --- Image Upload Handlers ---
  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError(null); // Clear previous errors
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB limit (adjust as needed)

      if (!allowedTypes.includes(file.type)) {
        setError("Invalid file type. Please select PNG, JPG, or WEBP.");
        setSourceImageFile(null);
        setImagePreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (file.size > maxSize) {
        setError(`File size exceeds ${maxSize / (1024 * 1024)}MB limit.`);
        setSourceImageFile(null);
        setImagePreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setSourceImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSourceImageFile(null);
      setImagePreviewUrl(null);
    }
  };

  const clearImage = () => {
    setSourceImageFile(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError(null); // Clear file-related errors
  };
  // --- End Image Upload Handlers ---

  const handleGenerate = async () => {
    if (
      (!prompt.trim() &&
        !(currentModel?.supportsImageInput && sourceImageFile)) ||
      isLoading ||
      !currentModel
    ) {
      // Require prompt if no image input is supported or no image is provided for image-supporting models
      if (!currentModel?.supportsImageInput || !sourceImageFile) {
        setError("Prompt is required for generation.");
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setDownloadingIndex(null);

    const backendUrl = `http://127.0.0.1:8000/api/image/generate/${currentModel.id}/`;
    const headers: HeadersInit = {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    };
    let body: BodyInit;

    const commonPayload: Record<string, any> = {
      prompt: prompt.trim() || undefined, // Send prompt even if empty if an image is present for img2img
      ...(currentModel.fixedPayload || {}),
    };
    if (currentModel.supportsAspectRatio) {
      commonPayload.aspect_ratio = aspectRatio;
    }
    if (currentModel.supportsNumImages) {
      const modelNumConfig = currentModel.supportsNumImages;
      const finalNumImgs = Math.max(
        modelNumConfig.min,
        Math.min(
          Number(numImages) || modelNumConfig.default,
          modelNumConfig.max
        )
      );
      if (String(numImages) !== String(finalNumImgs))
        setNumImages(finalNumImgs);
      commonPayload[modelNumConfig.paramNameBackend] = finalNumImgs;
    }

    if (currentModel.supportsImageInput && sourceImageFile) {
      const formData = new FormData();
      // Append common payload fields to FormData
      Object.keys(commonPayload).forEach((key) => {
        if (commonPayload[key] !== undefined) {
          formData.append(key, String(commonPayload[key]));
        }
      });
      formData.append(
        currentModel.supportsImageInput.paramNameBackend,
        sourceImageFile,
        sourceImageFile.name
      );
      body = formData;
      // Content-Type is set automatically by browser for FormData
    } else {
      body = JSON.stringify(commonPayload);
      headers["Content-Type"] = "application/json";
    }

    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers,
        body,
      });
      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: "Failed to parse error." }));
        throw new Error(
          errData.error ||
            errData.detail ||
            `Request failed: ${response.status}`
        );
      }
      const data = await response.json();
      if (
        !Array.isArray(data.image_urls) ||
        !data.image_urls.every((url: any) => typeof url === "string")
      ) {
        throw new Error("Invalid image data from server.");
      }
      setGeneratedImages(data.image_urls);
    } catch (err: any) {
      console.error("Image generation failed:", err);
      setError(err.message || "Generation error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (imageUrl: string, index: number) => {
    // ... (download logic remains the same)
    setDownloadingIndex(index);
    try {
      const response = await fetch(imageUrl);
      if (!response.ok)
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileExtension = imageUrl.split(".").pop()?.split("?")[0] || "png";
      const filename = `generated-image-${index + 1}.${fileExtension}`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      setError(`Failed to download image ${index + 1}.`);
    } finally {
      setDownloadingIndex(null);
    }
  };

  const showImageUpload = !!currentModel?.supportsImageInput;

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full text-gray-300">
        {/* Main Content Area */}
        <div className="flex-grow overflow-y-auto p-6 flex flex-col items-center justify-start relative">
          {!isLoading && !error && generatedImages.length === 0 && (
            <div className="text-center text-gray-600 mt-20">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2 text-gray-400">
                Image Generation
              </h2>
              <p className="text-sm">Generated images will appear here</p>
            </div>
          )}
          {/* ... (isLoading, error, generatedImages grid remains mostly the same) ... */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/30 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
          )}
          {error &&
            !isLoading &&
            !error.toLowerCase().includes("file size") &&
            !error.toLowerCase().includes("file type") && ( // Only show general errors here
              <div className="w-full max-w-3xl my-auto">
                <Alert
                  variant="destructive"
                  className="bg-red-900/50 border-red-700 text-red-200"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}
          {!isLoading && generatedImages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl mx-auto mt-4">
              {generatedImages.map((imgSrc, index) => {
                let paddingBottom = "56.25%";
                if (aspectRatio === "1:1") paddingBottom = "100%";
                else if (aspectRatio === "9:16") paddingBottom = "177.78%";
                else if (aspectRatio === "4:3") paddingBottom = "75%";
                const isDownloading = downloadingIndex === index;
                return (
                  <div
                    key={index}
                    className="rounded-lg overflow-hidden border border-gray-700 bg-gray-800 relative group"
                    style={{ paddingBottom }}
                  >
                    <img
                      src={imgSrc}
                      alt={`Generated Image ${index + 1}`}
                      className="absolute top-0 left-0 w-full h-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.alt = `Failed to load image ${
                          index + 1
                        }`;
                        e.currentTarget.src = "";
                      }}
                    />
                    <button
                      onClick={() => handleDownload(imgSrc, index)}
                      disabled={isDownloading || isLoading}
                      className={`absolute bottom-2 right-2 z-10 p-1.5 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 transition-opacity duration-200 ${
                        isDownloading
                          ? "cursor-wait"
                          : "opacity-0 group-hover:opacity-100 focus:opacity-100"
                      }`}
                      aria-label={`Download image ${index + 1}`}
                    >
                      {isDownloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="w-full px-4 pb-4 pt-2 border-t border-gray-800 bg-transparent">
          <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-xs max-w-4xl mx-auto mb-3">
            {/* Model Selector */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Select
                value={selectedModel}
                onValueChange={handleModelChange}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-transparent border-none text-gray-400 hover:text-gray-200 focus:ring-0 p-0 h-auto text-xs pr-2">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center gap-2">
                        <img
                          src={model.iconPath}
                          alt={`${model.name} logo`}
                          className="w-4 h-4 object-contain flex-shrink-0"
                        />
                        <span>{model.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Aspect Ratio Selector */}
            {currentModel?.supportsAspectRatio && (
              <div className="flex items-center gap-1 sm:gap-2">
                <Select
                  value={aspectRatio}
                  onValueChange={setAspectRatio}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-transparent border-none text-gray-400 hover:text-gray-200 focus:ring-0 p-0 h-auto text-xs pr-2">
                    <SelectValue placeholder="Aspect Ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    {aspectRatios.map((ratio) => (
                      <SelectItem key={ratio.id} value={ratio.id}>
                        <div className="flex items-center gap-2">
                          <ratio.IconComponent className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span>{ratio.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {/* Number of Images Input */}
            {currentModel?.supportsNumImages && (
              <div className="flex items-center gap-1 text-gray-400">
                <label htmlFor="numImagesInput" className="text-xs">
                  Images:
                </label>
                <input
                  id="numImagesInput"
                  type="number"
                  min={currentModel.supportsNumImages.min}
                  max={currentModel.supportsNumImages.max}
                  value={numImages}
                  onChange={handleNumImagesChange}
                  onBlur={handleNumImagesBlur}
                  disabled={isLoading}
                  className="w-12 bg-transparent border-gray-600 rounded px-1 py-0.5 text-center text-xs h-auto leading-tight text-gray-200"
                  aria-label="Number of images"
                />
              </div>
            )}
          </div>

          {/* Prompt Input and Generate Button Area */}
          <div className="relative w-full max-w-4xl mx-auto p-1 rounded-xl flex items-start gap-2">
            {" "}
            {/* Changed to items-start and added gap */}
            {/* Conditional Image Upload Section */}
            {showImageUpload && (
              <div className="flex-shrink-0 relative">
                <Input
                  ref={fileInputRef}
                  id="source-image-upload-genpage"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                  disabled={isLoading}
                />
                {!imagePreviewUrl ? (
                  <Label
                    htmlFor="source-image-upload-genpage"
                    className={`${buttonVariants({
                      variant: "outline",
                      size: "icon",
                    })} 
                                cursor-pointer h-12 w-12 md:h-14 md:w-14 flex flex-col items-center justify-center 
                                text-xs hover:border-cyan-500 hover:text-cyan-400 
                                border-gray-700 bg-gray-800/50 rounded-lg`}
                  >
                    <UploadCloud className="h-5 w-5 md:h-6 md:w-6" />
                  </Label>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreviewUrl}
                      alt="Preview"
                      className="h-12 w-12 md:h-14 md:w-14 rounded-lg border border-gray-700 object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearImage}
                      className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-gray-700/80 backdrop-blur-sm text-gray-300 hover:bg-red-600 hover:text-white z-10"
                      aria-label="Remove image"
                      disabled={isLoading}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
                {/* Display file-specific errors near the upload button */}
                {error &&
                  (error.toLowerCase().includes("file size") ||
                    error.toLowerCase().includes("file type")) && (
                    <p className="absolute bottom-[-18px] left-0 text-[10px] text-red-400 whitespace-nowrap">
                      {error}
                    </p>
                  )}
              </div>
            )}
            {/* Prompt Textarea and Generate Button */}
            <div className="flex-grow relative flex items-center">
              <Textarea
                id="prompt"
                placeholder={
                  showImageUpload && sourceImageFile
                    ? "Optional: Describe changes or elements to add..."
                    : "Describe your image..."
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={1}
                className="flex-grow bg-transparent border border-gray-700 focus:border-cyan-500 focus:ring-0 rounded-lg resize-none text-base text-gray-200 placeholder-gray-500 pl-4 pr-32 py-2 self-center min-h-[46px] md:min-h-[54px]" // Adjusted min-height
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                {" "}
                {/* Ensure button is vertically centered */}
                <Button
                  onClick={handleGenerate}
                  disabled={
                    isLoading ||
                    (!prompt.trim() && !(showImageUpload && sourceImageFile))
                  }
                  className={`h-9 md:h-10 px-3 rounded-full flex items-center justify-center gap-1.5 text-white text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 flex-shrink-0 ${
                    isLoading ||
                    (!prompt.trim() && !(showImageUpload && sourceImageFile))
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-br from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-600 shadow-lg"
                  }`}
                  aria-label="Generate Image"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span className="text-xs font-medium whitespace-nowrap">
                        {estimatedCost > 0
                          ? `${estimatedCost} Credits`
                          : "Generate"}
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ImageGenerationPage;
