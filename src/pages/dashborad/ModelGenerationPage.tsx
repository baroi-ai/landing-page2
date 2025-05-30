// src/pages/dashboard/ModelGenerationPage.tsx
import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout"; // Import the layout
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Import necessary icons
import {
  BoxIcon,
  Settings2,
  AlertCircle,
  Loader2,
  Box,
  Download,
  Image as ImageIcon,
} from "lucide-react"; // Using Cube and Box

// --- Configuration Data (Replace/Fetch from API) ---
const available3dModels = [
  { id: "shaper-e", name: "Shaper-E (Fast)" },
  { id: "triposr", name: "TripoSR (Image-to-3D focus)" },
  { id: "stable-zero123", name: "Stable Zero123 (View Synthesis)" },
  { id: "dreamfusion-like", name: "DreamFusion Style (Hypothetical)" },
];

// Example styles - highly dependent on the model's capabilities
const available3dStyles = [
  { id: "realistic", name: "Realistic" },
  { id: "stylized", name: "Stylized / Cartoon" },
  { id: "low-poly", name: "Low Poly" },
  { id: "voxel", name: "Voxel Art" },
];

const outputFormats = [
  { id: "glb", name: ".glb (Recommended for Web)" },
  { id: "obj", name: ".obj + .mtl" },
  { id: "fbx", name: ".fbx" },
  // { id: "usd", name: ".usd / .usdz" }, // If supported
];

const polyCounts = [
  { id: "low", name: "Low (~5k Polygons)" },
  { id: "medium", name: "Medium (~20k Polygons)" },
  { id: "high", name: "High (~100k+ Polygons)" },
];

const default3dSettings = {
  prompt: "",
  negativePrompt: "",
  model: available3dModels[0].id,
  style: available3dStyles[0].id,
  outputFormat: outputFormats[0].id, // Default to glb
  polyCount: polyCounts[1].id, // Default to medium
  seed: "",
  // Add input image for image-to-3d if needed later
};
// --- End Configuration Data ---

// Interface for the expected result data
interface GeneratedModelData {
  modelUrl: string; // URL to the 3D model file (.glb, .obj, etc.)
  previewImageUrl?: string; // Optional URL to a 2D preview image
  format: string; // e.g., 'glb', 'obj'
}

const ModelGenerationPage = () => {
  // --- State Variables ---
  const [prompt, setPrompt] = useState(default3dSettings.prompt);
  const [negativePrompt, setNegativePrompt] = useState(
    default3dSettings.negativePrompt
  );
  const [selectedModel, setSelectedModel] = useState(default3dSettings.model);
  const [selectedStyle, setSelectedStyle] = useState(default3dSettings.style);
  const [outputFormat, setOutputFormat] = useState(
    default3dSettings.outputFormat
  );
  const [polyCount, setPolyCount] = useState(default3dSettings.polyCount);
  const [seed, setSeed] = useState<string | number>(default3dSettings.seed);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedModelData, setGeneratedModelData] =
    useState<GeneratedModelData | null>(null);

  // --- Handlers ---
  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedModelData(null); // Clear previous model data

    if (!prompt.trim()) {
      setError("Please enter a prompt to generate the 3D model.");
      setIsLoading(false);
      return;
    }

    const generationSettings = {
      prompt,
      negativePrompt: negativePrompt || undefined,
      model: selectedModel,
      style: selectedStyle,
      outputFormat,
      polyCount,
      seed: seed === "" ? undefined : Number(seed),
    };

    console.log("Generating 3D model with settings:", generationSettings);

    // --- TODO: Replace with actual API call to your 3D model generation backend ---
    try {
      // Simulate API call delay (3D generation is usually slow)
      await new Promise((resolve) => setTimeout(resolve, 8000));

      // Simulate success with placeholder data
      const resultData: GeneratedModelData = {
        modelUrl: `/placeholder-models/generated_model.${outputFormat}`, // Fake path
        previewImageUrl:
          "https://via.placeholder.com/300x300.png?text=3D+Preview", // Placeholder preview
        format: outputFormat,
      };
      setGeneratedModelData(resultData);

      // Simulate potential error
      // throw new Error("3D Model generation failed. Complexity too high?");
    } catch (err: any) {
      console.error("3D Model generation failed:", err);
      setError(
        err.message || "An unknown error occurred during 3D model generation."
      );
    } finally {
      setIsLoading(false);
    }
    // --- End API call placeholder ---
  };

  // Calculate estimated cost (example logic - 3D cost can vary wildly)
  const calculateCost = () => {
    let baseCost = 150; // 3D is expensive
    if (polyCount === "high") baseCost *= 2;
    if (polyCount === "low") baseCost *= 0.75;
    // Adjust based on model if needed
    return Math.round(baseCost);
  };

  const estimatedCost = calculateCost();

  // Consistent card styling
  const cardClasses = "border border-border/50 bg-muted/20 backdrop-blur-sm";

  // Helper to get suggested download filename
  const getDownloadFilename = (url: string, format: string): string => {
    // Basic slugify prompt + timestamp
    const slug =
      prompt
        .substring(0, 20)
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase() || "model";
    return `${slug}_${Date.now()}.${format}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
          <BoxIcon className="h-8 w-8 text-cyan-500" /> {/* Icon updated */}
          Generate 3D Models
        </h1>

        {/* Main Grid: Settings on Left, Results on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* --- Settings Column --- */}
          <Card className={`lg:col-span-1 ${cardClasses}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Generation Settings
              </CardTitle>
              <CardDescription>
                Configure your 3D model parameters (Text-to-3D).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Prompt */}
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., A cute red panda wearing a small backpack"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                  disabled={isLoading}
                />
              </div>

              {/* Negative Prompt */}
              <div className="space-y-2">
                <Label htmlFor="negative-prompt">
                  Negative Prompt (Optional)
                </Label>
                <Textarea
                  id="negative-prompt"
                  placeholder="e.g., deformed, blurry, extra limbs, text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  rows={2}
                  className="resize-none"
                  disabled={isLoading}
                />
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <Label htmlFor="model">Generation Model</Label>
                <Select
                  value={selectedModel}
                  onValueChange={setSelectedModel}
                  disabled={isLoading}
                >
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select a 3D model" />
                  </SelectTrigger>
                  <SelectContent>
                    {available3dModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Style Preset Selection */}
              <div className="space-y-2">
                <Label htmlFor="style">Style Preset</Label>
                <Select
                  value={selectedStyle}
                  onValueChange={setSelectedStyle}
                  disabled={isLoading}
                >
                  <SelectTrigger id="style">
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                  <SelectContent>
                    {available3dStyles.map((style) => (
                      <SelectItem key={style.id} value={style.id}>
                        {style.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Polygon Count & Output Format */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="poly-count">Polygon Count</Label>
                  <Select
                    value={polyCount}
                    onValueChange={setPolyCount}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="poly-count">
                      <SelectValue placeholder="Select detail" />
                    </SelectTrigger>
                    <SelectContent>
                      {polyCounts.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="output-format">Output Format</Label>
                  <Select
                    value={outputFormat}
                    onValueChange={setOutputFormat}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="output-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {outputFormats.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Seed */}
              <div className="space-y-2 pt-2">
                <Label htmlFor="seed">Seed (Optional)</Label>
                <Input
                  id="seed"
                  type="text"
                  placeholder="Leave empty for random"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-3">
              <div className="text-sm text-muted-foreground text-center">
                Estimated Cost: {estimatedCost} Coins
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating 3D Model...
                  </>
                ) : (
                  <>
                    <BoxIcon className="mr-2 h-4 w-4" />
                    Generate Model
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* --- Results Column --- */}
          <Card className={`lg:col-span-2 ${cardClasses}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                Generated Model
              </CardTitle>
              <CardDescription>
                Your generated 3D model preview and download link will appear
                here.
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[300px] lg:min-h-[400px] flex flex-col items-center justify-center p-4">
              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Model Generation Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center text-muted-foreground">
                  <Loader2 className="h-10 w-10 animate-spin mb-4 text-cyan-500" />
                  <p>Creating 3D geometry...</p>
                  <p className="text-sm">(This can take several minutes)</p>
                </div>
              )}

              {/* No Model Yet / Initial State */}
              {!isLoading && !error && !generatedModelData && (
                <div className="text-center text-muted-foreground">
                  <BoxIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter your prompt and settings to generate a 3D model.</p>
                </div>
              )}

              {/* Display Generated Model Preview & Download */}
              {!isLoading && !error && generatedModelData && (
                <div className="w-full max-w-md flex flex-col items-center space-y-4">
                  {/* Preview Image (if available) */}
                  {generatedModelData.previewImageUrl ? (
                    <div className="aspect-square w-full rounded-lg overflow-hidden border border-border/20 bg-muted/30">
                      <img
                        src={generatedModelData.previewImageUrl}
                        alt="3D Model Preview"
                        className="object-contain w-full h-full" // contain is usually better for previews
                      />
                    </div>
                  ) : (
                    // Placeholder if no preview image
                    <div className="aspect-square w-full rounded-lg bg-muted/30 flex items-center justify-center border border-dashed border-border/30">
                      <ImageIcon className="h-16 w-16 text-muted-foreground opacity-50" />
                      <span className="absolute text-xs text-muted-foreground bottom-2">
                        No Preview Available
                      </span>
                    </div>
                  )}

                  {/* Model Info */}
                  <p className="text-sm text-muted-foreground">
                    Format:{" "}
                    <span className="font-semibold text-foreground uppercase">
                      {generatedModelData.format}
                    </span>
                  </p>

                  {/* Download Button */}
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    asChild
                  >
                    <a
                      href={generatedModelData.modelUrl}
                      // The browser might not be able to directly display .obj or .fbx,
                      // so 'download' attribute is important.
                      download={getDownloadFilename(
                        generatedModelData.modelUrl,
                        generatedModelData.format
                      )}
                      // If the URL is relative, make sure it's correctly served from your /public folder or backend
                    >
                      <Download className="mr-2 h-4 w-4" /> Download Model (
                      {generatedModelData.format.toUpperCase()})
                    </a>
                  </Button>

                  {/* TODO: Add a 3D Viewer component here */}
                  {/* <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                        [Interactive 3D Viewer Placeholder]
                   </div> */}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ModelGenerationPage;
