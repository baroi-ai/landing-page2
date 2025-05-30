// src/pages/dashboard/VideoGenerationPage.tsx
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Loader2,
  Clapperboard,
  UploadCloud,
  XCircle,
  Sparkles,
  // ListVideo, // REMOVED - Input Type Icon no longer needed
  Video, // For placeholder
  Ratio,
  Image as ImageIcon, // For placeholder & image operations
  // Text as TextIcon, // REMOVED - Input Type Icon no longer needed
  Clock,
  RectangleHorizontal,
  Square,
  RectangleVertical,
} from "lucide-react";

// --- Configuration Data ---

interface ModelParams {
  prompt?: boolean;
  aspect_ratio?: boolean;
  image?: { apiName: string };
  duration?: {
    apiName: string;
    default: number;
    min: number;
    max: number;
    unit: string;
    label: string;
  };
  prompt_optimizer?: boolean;
}

interface VideoModelConfig {
  id: string;
  name: string;
  iconPath: string;
  params: ModelParams;
  fixedPayload?: Record<string, any>;
}

const availableVideoModels: VideoModelConfig[] = [
  {
    id: "google/veo-2",
    name: "Google Veo 2",
    iconPath: "/icons/google.png",
    params: {
      image: { apiName: "image" },
      duration: {
        apiName: "duration",
        default: 5,
        min: 5,
        max: 8,
        unit: "s",
        label: "Duration",
      },
    },
  },
  {
    id: "minimax/video-01",
    name: "Minimax Video-01",
    iconPath: "/icons/minimax.png",
    params: { prompt_optimizer: true },
  },
  {
    id: "minimax/video-01-director",
    name: "Minimax Video-01 Director",
    iconPath: "/icons/minimax.png",
    params: { image: { apiName: "first_frame_image" }, prompt_optimizer: true },
  },
  {
    id: "kwaivgi/kling-v2.0",
    name: "Kling V2.0",
    iconPath: "/icons/kling.png",
    params: {
      image: { apiName: "start_image" },
      duration: {
        apiName: "duration",
        default: 5,
        min: 5,
        max: 10,
        unit: "s",
        label: "Duration",
      },
    },
  },
  {
    id: "tencent/hunyuan-video",
    name: "Hunyuan Video",
    iconPath: "/icons/hunyuan.png",
    params: {
      duration: {
        apiName: "video_length",
        default: 4,
        min: 2,
        max: 8,
        unit: "s",
        label: "Length",
      },
    },
  },
  {
    id: "luma/ray-flash-2-720p",
    name: "Luma Ray Flash 2 (720p)",
    iconPath: "/icons/luma.png",
    params: {
      duration: {
        apiName: "duration",
        default: 3,
        min: 1,
        max: 10,
        unit: "s",
        label: "Duration",
      },
    },
  },
  {
    id: "wavespeedai/wan-2.1-t2v-720p",
    name: "Wan 2.1 (720p)",
    iconPath: "/icons/wan.png",
    params: {},
  },
  {
    id: "pixverse/pixverse-v4",
    name: "Pixverse V4",
    iconPath: "/icons/pixverser.png",
    params: {
      image: { apiName: "image" },
      duration: {
        apiName: "duration",
        default: 3,
        min: 2,
        max: 15,
        unit: "s",
        label: "Duration",
      },
    },
  },
];

// inputTypes REMOVED

const aspectRatios = [
  { id: "16:9", name: "16:9", IconComponent: RectangleHorizontal },
  { id: "9:16", name: "9:16", IconComponent: RectangleVertical },
];

const initialDefaultModelId = availableVideoModels[0].id;

const defaultVideoSettings = {
  // inputType REMOVED
  prompt: "",
  model: initialDefaultModelId,
  aspectRatio: aspectRatios[0].id,
};
// --- End Configuration Data ---

const VideoGenerationPage = () => {
  // inputType state REMOVED
  const [prompt, setPrompt] = useState(defaultVideoSettings.prompt);
  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(
    defaultVideoSettings.model
  );
  const [aspectRatio, setAspectRatio] = useState(
    defaultVideoSettings.aspectRatio
  );
  const [duration, setDuration] = useState<number | undefined>(
    availableVideoModels.find((m) => m.id === initialDefaultModelId)?.params
      .duration?.default
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(
    null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentModel = useMemo(
    () => availableVideoModels.find((m) => m.id === selectedModel),
    [selectedModel]
  );

  // Effect to handle model changes
  useEffect(() => {
    const modelConfig = availableVideoModels.find(
      (m) => m.id === selectedModel
    );

    if (modelConfig?.params.duration) {
      setDuration(modelConfig.params.duration.default);
    } else {
      setDuration(undefined);
    }

    // If new model doesn't support image, clear any existing image
    if (!modelConfig?.params.image) {
      setSourceImageFile(null);
      setImagePreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    // Reset prompt for a cleaner state when model changes, unless an image is kept for an image-supporting model
    if (!(modelConfig?.params.image && sourceImageFile)) {
      setPrompt("");
    }
    setError(null); // Clear errors on model change
  }, [selectedModel, sourceImageFile]); // Added sourceImageFile dependency for prompt reset logic

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
      const fileTypeError =
        "Invalid file type. Please select PNG, JPG, or WEBP.";
      const sizeError = `File size exceeds 10MB limit.`;
      if (!allowedTypes.includes(file.type)) {
        setError(fileTypeError);
        setSourceImageFile(null);
        setImagePreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setError(sizeError);
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
    setError(null);
  };

  const calculateCost = useCallback(() => {
    let baseCost = 50;
    if (currentModel?.id.startsWith("google/")) baseCost = 80;
    else if (currentModel?.id.startsWith("minimax/")) baseCost = 70;
    else if (currentModel?.id.startsWith("luma/")) baseCost = 75;
    else if (currentModel?.id.startsWith("kwaivgi/")) baseCost = 65;
    if (currentModel?.params.duration && duration !== undefined) {
      baseCost += duration * 2;
    }
    return Math.round(baseCost);
  }, [currentModel, duration]);

  const estimatedCost = calculateCost();

  const handleGenerate = async () => {
    if (!currentModel) {
      setError("No model selected.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedVideoUrl(null);

    const modelSupportsImage = !!currentModel.params.image;

    // Validation:
    // If model supports image AND an image is uploaded, prompt is optional.
    // Otherwise (model doesn't support image OR no image uploaded), prompt is required.
    if (!prompt.trim() && !(modelSupportsImage && sourceImageFile)) {
      setError("Prompt is required for this generation type.");
      setIsLoading(false);
      return;
    }

    const backendUrl = `http://127.0.0.1:8000/api/video/generate/${currentModel.id}/`;
    const headers: HeadersInit = {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    };
    let body: BodyInit;
    const useFormData = modelSupportsImage && sourceImageFile;

    if (useFormData) {
      const formData = new FormData();
      if (prompt.trim()) formData.append("prompt", prompt.trim());
      formData.append("aspect_ratio", aspectRatio);
      if (currentModel.params.duration && duration !== undefined) {
        formData.append(currentModel.params.duration.apiName, String(duration));
      }
      if (currentModel.params.image && sourceImageFile) {
        formData.append(
          currentModel.params.image.apiName,
          sourceImageFile,
          sourceImageFile.name
        );
      }
      if (currentModel.fixedPayload) {
        for (const key in currentModel.fixedPayload) {
          formData.append(key, String(currentModel.fixedPayload[key]));
        }
      }
      if (currentModel.params.prompt_optimizer) {
        formData.append("prompt_optimizer", "true");
      }
      body = formData;
    } else {
      const payload: Record<string, any> = {
        ...(prompt.trim() && { prompt: prompt.trim() }),
        aspect_ratio: aspectRatio,
        ...(currentModel.fixedPayload || {}),
      };
      if (currentModel.params.duration && duration !== undefined) {
        payload[currentModel.params.duration.apiName] = duration;
      }
      if (currentModel.params.prompt_optimizer) {
        payload.prompt_optimizer = true;
      }
      body = JSON.stringify(payload);
      headers["Content-Type"] = "application/json";
    }

    try {
      console.log(
        "Sending request to:",
        backendUrl,
        "using",
        useFormData ? "FormData" : "JSON",
        "Body/Payload:",
        body
      );
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
      if (data.video_url && typeof data.video_url === "string") {
        setGeneratedVideoUrl(data.video_url);
      } else if (
        Array.isArray(data.video_urls) &&
        data.video_urls.length > 0 &&
        typeof data.video_urls[0] === "string"
      ) {
        setGeneratedVideoUrl(data.video_urls[0]);
      } else {
        throw new Error("Invalid video data from server.");
      }
    } catch (err: any) {
      console.error("Video generation failed:", err);
      setError(err.message || "Generation error.");
    } finally {
      setIsLoading(false);
    }
  };

  const isGenerateDisabled = useMemo(() => {
    if (isLoading || !currentModel) return true;
    const modelSupportsImage = !!currentModel.params.image;
    if (modelSupportsImage && sourceImageFile) return false; // Image provided, prompt optional
    return !prompt.trim(); // No image involved (or model doesn't support it), prompt required
  }, [isLoading, prompt, sourceImageFile, currentModel]);

  const showImageUpload = !!currentModel?.params.image;

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full text-gray-300">
        {/* Video Display Area */}
        <div className="flex-grow overflow-y-auto p-6 flex flex-col items-center justify-center relative">
          {isLoading && (
            <div className="flex flex-col items-center text-muted-foreground text-center">
              {" "}
              <Loader2 className="h-10 w-10 animate-spin mb-4 text-cyan-500" />{" "}
              <p>Generating your video sequence...</p>{" "}
              <p className="text-sm">(This can take some time)</p>{" "}
            </div>
          )}
          {!isLoading && !error && !generatedVideoUrl && (
            <div className="text-center text-gray-600">
              {" "}
              {showImageUpload ? (
                <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              ) : (
                <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
              )}{" "}
              <h2 className="text-xl font-semibold mb-2 text-gray-400">
                {" "}
                Video Generation{" "}
              </h2>{" "}
              <p className="text-sm">Generated video will appear here</p>{" "}
            </div>
          )}
          {!isLoading &&
            error &&
            !generatedVideoUrl &&
            !error.toLowerCase().includes("file size") &&
            !error.toLowerCase().includes("file type") && (
              <div className="w-full max-w-3xl my-auto">
                {" "}
                <Alert
                  variant="destructive"
                  className="bg-red-900/50 border-red-700 text-red-200"
                >
                  {" "}
                  <AlertCircle className="h-4 w-4" />{" "}
                  <AlertTitle>Generation Failed</AlertTitle>{" "}
                  <AlertDescription>{error}</AlertDescription>{" "}
                </Alert>{" "}
              </div>
            )}
          {!isLoading && generatedVideoUrl && (
            <div
              className="w-full max-w-3xl rounded-lg overflow-hidden border border-gray-700 bg-black shadow-lg"
              style={{ aspectRatio: aspectRatio.replace(":", "/") || "16 / 9" }}
            >
              {" "}
              <video
                key={generatedVideoUrl}
                controls
                loop
                autoPlay
                muted
                className="w-full h-full object-contain"
                preload="metadata"
              >
                {" "}
                <source src={generatedVideoUrl} type="video/mp4" /> Your browser
                does not support the video tag.{" "}
              </video>{" "}
            </div>
          )}
        </div>

        {/* Controls Area */}
        <div className="w-full px-4 pb-4 pt-2">
          {/* Settings Bar */}
          <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-xs max-w-xl mx-auto mb-3 px-2">
            {/* Input Type Selector REMOVED */}
            {/* Model Selector */}
            <div className="flex items-center">
              <Select
                value={selectedModel}
                onValueChange={setSelectedModel}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-transparent border-none text-gray-400 hover:text-gray-200 focus:ring-0 p-0 h-auto text-xs pr-2">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="top"
                  align="center"
                  className="bg-gray-800 border-gray-700 text-gray-300 max-h-60 overflow-y-auto"
                >
                  {availableVideoModels.map((model) => (
                    <SelectItem
                      key={model.id}
                      value={model.id}
                      className="focus:bg-gray-700 text-xs"
                    >
                      {" "}
                      <div className="flex items-center gap-2">
                        {" "}
                        <img
                          src={model.iconPath}
                          alt={`${model.name} logo`}
                          className="w-4 h-4 object-contain flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const fallback = document.createElement("div");
                            fallback.className =
                              "w-4 h-4 bg-gray-600 rounded-sm flex-shrink-0";
                            e.currentTarget.parentNode?.insertBefore(
                              fallback,
                              e.currentTarget
                            );
                          }}
                        />{" "}
                        <span>{model.name}</span>{" "}
                      </div>{" "}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Aspect Ratio Selector */}
            <div className="flex items-center">
              <Select
                value={aspectRatio}
                onValueChange={setAspectRatio}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-transparent border-none text-gray-400 hover:text-gray-200 focus:ring-0 p-0 h-auto text-xs pr-2">
                  <SelectValue placeholder="Ratio" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="top"
                  align="center"
                  className="bg-gray-800 border-gray-700 text-gray-300"
                >
                  {aspectRatios.map((ratio) => (
                    <SelectItem
                      key={ratio.id}
                      value={ratio.id}
                      className="focus:bg-gray-700 text-xs"
                    >
                      {" "}
                      <div className="flex items-center gap-2">
                        {" "}
                        <ratio.IconComponent className="w-4 h-4 text-gray-400 flex-shrink-0" />{" "}
                        <span>{ratio.name}</span>{" "}
                      </div>{" "}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Duration Input (Conditional) */}
            {currentModel?.params.duration && (
              <div className="flex items-center gap-1 text-gray-400">
                {" "}
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />{" "}
                <Input
                  id="duration-input"
                  type="number"
                  value={duration === undefined ? "" : duration}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setDuration(undefined);
                    } else {
                      const numVal = parseFloat(value);
                      if (!isNaN(numVal)) {
                        setDuration(numVal);
                      }
                    }
                  }}
                  onBlur={() => {
                    if (currentModel?.params.duration) {
                      const {
                        min,
                        max,
                        default: defVal,
                      } = currentModel.params.duration;
                      let currentVal = duration;
                      if (currentVal === undefined || isNaN(currentVal)) {
                        currentVal = defVal;
                      }
                      currentVal = Math.max(min, Math.min(max, currentVal));
                      if (currentModel.params.duration.unit === "s") {
                        currentVal = Math.round(currentVal);
                      }
                      setDuration(currentVal);
                    }
                  }}
                  min={currentModel.params.duration.min}
                  max={currentModel.params.duration.max}
                  step={currentModel.params.duration.unit === "s" ? 1 : 0.1}
                  className="bg-transparent border-b border-gray-700 focus:border-cyan-500 focus:ring-0 p-0 h-auto text-xs w-10 text-center tabular-nums text-gray-300 focus:text-white"
                  disabled={isLoading}
                  aria-label={`${currentModel.params.duration.label} (${currentModel.params.duration.unit})`}
                />{" "}
                <span className="text-xs text-gray-500">
                  {currentModel.params.duration.unit}
                </span>{" "}
              </div>
            )}
          </div>

          {/* Main Input Area */}
          <div
            className={`relative w-full max-w-4xl mx-auto p-1 rounded-xl flex items-start gap-2 ${
              showImageUpload && sourceImageFile
                ? "items-stretch"
                : "items-center"
            }`}
          >
            {/* Conditional Image Upload Section */}
            {showImageUpload && (
              <div className="flex-shrink-0 relative">
                <Input
                  ref={fileInputRef}
                  id="source-image-upload-video"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isLoading}
                />
                {!imagePreviewUrl ? (
                  <Label
                    htmlFor="source-image-upload-video"
                    className={`${buttonVariants({
                      variant: "outline",
                      size: "icon",
                    })} cursor-pointer h-12 w-12 md:h-14 md:w-14 flex flex-col items-center justify-center text-xs hover:border-cyan-500 hover:text-cyan-400 border-gray-700 bg-gray-800/50 rounded-lg`}
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
                id="prompt-video-main"
                placeholder={
                  showImageUpload && sourceImageFile
                    ? "Optional: Describe animation, changes, or keep empty to animate image..."
                    : "Describe your video..."
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={1}
                className="flex-grow bg-transparent border border-gray-700 focus:border-cyan-500 focus:ring-0 rounded-lg resize-none text-base text-gray-200 placeholder-gray-500 pl-4 pr-36 py-2.5 self-center min-h-[50px] md:min-h-[54px]"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!isGenerateDisabled) handleGenerate();
                  }
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerateDisabled}
                  className={`h-9 md:h-10 px-4 rounded-full flex items-center justify-center gap-1.5 text-white text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-cyan-500 flex-shrink-0 ${
                    isGenerateDisabled
                      ? "cursor-not-allowed opacity-60"
                      : "bg-gradient-to-br from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-700 shadow-lg"
                  }`}
                  aria-label="Generate Video"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {" "}
                      <Sparkles className="h-4 w-4" />{" "}
                      <span className="text-xs font-medium whitespace-nowrap">
                        {" "}
                        {estimatedCost > 0
                          ? `${estimatedCost} Coins`
                          : "Generate"}{" "}
                      </span>{" "}
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

export default VideoGenerationPage;
