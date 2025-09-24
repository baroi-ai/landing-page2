import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Image,
  Video,
  Mic,
  Box,
  Wand2,
  Sparkles,
  Download, // Import Download icon
} from "lucide-react";

// Define available models for each category (Keep as before)
const modelsByCategory = {
  image: ["Flux Dev", "Reve Animated", "Imagen 2", "Stable Diffusion XL"],
  video: ["Hunyuan Video", "Runway Gen-2", "Pika Labs"],
  voice: ["Kokoro TTS", "XTTS v2", "Bark TTS"],
  "3d": ["Hunyuan 3D", "Shap-E", "DreamFusion", "Cats 3D"],
};

// Define Default Prompt and Image (Keep as before)
const defaultPrompt =
  "black forest toast spelling out the words 'FLUX DEV', tasty, food photography, dynamic shot";
const defaultImageUrl = "/flux.png"; // Path relative to the public folder

const GenerationSection = () => {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    defaultImageUrl
  );
  const navigate = useNavigate();

  const [selectedImageModel, setSelectedImageModel] = useState(
    modelsByCategory.image[0]
  );
  const [selectedVideoModel, setSelectedVideoModel] = useState(
    modelsByCategory.video[0]
  );
  const [selectedVoiceModel, setSelectedVoiceModel] = useState(
    modelsByCategory.voice[0]
  );
  const [selected3dModel, setSelected3dModel] = useState(
    modelsByCategory["3d"][0]
  );

  const handleActionClick = () => {
    navigate("/login");
  };

  const handleClear = () => {
    setPrompt("");
    if (generatedImageUrl === defaultImageUrl) {
      setGeneratedImageUrl(null);
    }
  };

  // Helper function to get suggested filename
  const getFilenameFromUrl = (url: string | null): string => {
    if (!url) return "generated-image.webp";
    try {
      const pathname = new URL(url, window.location.origin).pathname;
      const parts = pathname.split("/");
      return parts[parts.length - 1] || "generated-image.webp";
    } catch (e) {
      return "generated-image.webp";
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient z-10"></div>
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-radial from-dark-200/5 to-transparent opacity-40"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header remains the same */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Experience <span className="glow-text">AI Generation</span> Live
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Try our AI generation tools with a simple prompt. Login required
              to generate.
            </p>
          </div>

          <div className="glass-panel rounded-xl border border-white/10 shadow-lg overflow-hidden">
            <Tabs defaultValue="image" className="w-full">
              {/* Tab List remains the same */}
              <div className="border-b border-white/10 p-4">
                <TabsList className="grid grid-cols-4 bg-dark-400/50">
                  <TabsTrigger
                    value="image"
                    className="data-[state=active]:bg-dark-200 data-[state=active]:text-cyan"
                  >
                    <Image className="h-4 w-4 mr-2" /> Image
                  </TabsTrigger>
                  <TabsTrigger
                    value="video"
                    className="data-[state=active]:bg-dark-200 data-[state=active]:text-cyan"
                  >
                    <Video className="h-4 w-4 mr-2" /> Video
                  </TabsTrigger>
                  <TabsTrigger
                    value="voice"
                    className="data-[state=active]:bg-dark-200 data-[state=active]:text-cyan"
                  >
                    <Mic className="h-4 w-4 mr-2" /> Voice
                  </TabsTrigger>
                  <TabsTrigger
                    value="3d"
                    className="data-[state=active]:bg-dark-200 data-[state=active]:text-cyan"
                  >
                    <Box className="h-4 w-4 mr-2" /> 3D Model
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                {/* Prompt input remains the same */}
                <div className="mb-6">
                  <label
                    htmlFor="main-prompt"
                    className="block text-gray-300 mb-2 text-sm font-medium"
                  >
                    Your Prompt
                  </label>
                  <div className="relative">
                    <textarea
                      id="main-prompt"
                      className="w-full h-24 bg-dark-400/50 border border-white/10 rounded-lg p-3 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan/50"
                      placeholder="Describe what you want to generate..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    <button
                      className="absolute right-3 bottom-3 text-gray-400 hover:text-cyan-light disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleClear}
                      disabled={!prompt}
                      aria-label="Clear prompt"
                    >
                      {prompt ? "Clear" : ""}
                    </button>
                  </div>
                </div>
                {/* --- Image Tab --- */}
                <TabsContent value="image" className="mt-0">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Image Controls (Selectors/Sliders remain the same) */}
                    <div>
                      {/* ... controls ... */}
                      <div className="space-y-4">
                        {/* Model Selector */}
                        <div>
                          <label
                            htmlFor="image-model-select"
                            className="block text-gray-300 mb-2 text-sm font-medium"
                          >
                            Select Model
                          </label>
                          <select
                            id="image-model-select"
                            value={selectedImageModel}
                            onChange={(e) =>
                              setSelectedImageModel(e.target.value)
                            }
                            className="w-full bg-dark-400/50 border border-white/10 rounded-lg p-2.5 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan/50"
                          >
                            {modelsByCategory.image.map((modelName) => (
                              <option key={modelName} value={modelName}>
                                {modelName}
                              </option>
                            ))}
                          </select>
                        </div>
                        {/* Style Selector */}
                        <div>
                          <label
                            htmlFor="image-style-select"
                            className="block text-gray-300 mb-2 text-sm font-medium"
                          >
                            Style
                          </label>
                          <select
                            id="image-style-select"
                            className="w-full bg-dark-400/50 border border-white/10 rounded-lg p-2.5 text-gray-200"
                          >
                            <option>Photorealistic</option>
                            <option>Artistic</option>
                            <option>3D Render</option>
                            <option>Anime</option>
                            <option>Sketch</option>
                          </select>
                        </div>
                        {/* Detail Slider */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-gray-300 text-sm font-medium">
                              Detail Level
                            </label>
                          </div>
                          <Slider
                            defaultValue={[75]}
                            max={100}
                            step={1}
                            className="[&>span:first-child]:h-1 [&>span:first-child>span]:bg-cyan [&>span:last-child]:bg-dark-300"
                          />
                        </div>
                        {/* Creativity Slider */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-gray-300 text-sm font-medium">
                              Creativity
                            </label>
                          </div>
                          <Slider
                            defaultValue={[50]}
                            max={100}
                            step={1}
                            className="[&>span:first-child]:h-1 [&>span:first-child>span]:bg-cyan [&>span:last-child]:bg-dark-300"
                          />
                        </div>
                      </div>
                      {/* Generate Button */}
                      <Button
                        className="w-full mt-6 bg-cyan hover:bg-cyan-dark text-dark-500 font-medium btn-glow py-6"
                        onClick={handleActionClick}
                        disabled={!prompt.trim()}
                      >
                        <Wand2 className="mr-2 h-5 w-5" /> Generate Image
                      </Button>
                    </div>

                    {/* --- Updated Image Display Area with Hover Download --- */}
                    <div className="flex items-center justify-center">
                      {/* Add relative and group classes to the container */}
                      <div className="relative group w-full aspect-square bg-dark-400/30 rounded-lg border border-white/5 flex items-center justify-center overflow-hidden">
                        {generatedImageUrl ? (
                          <>
                            <img
                              src={generatedImageUrl}
                              alt={prompt || "Generated AI image example"}
                              // Use object-contain to fit image
                              className="w-full h-full object-contain"
                              onError={() => setGeneratedImageUrl(null)}
                            />
                            {/* Download Button - Appears on Hover */}
                            <a
                              href={generatedImageUrl}
                              download={getFilenameFromUrl(generatedImageUrl)} // Suggest filename
                              className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm hover:bg-black/70 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              aria-label="Download Image"
                              // Prevent click if href is somehow empty, though handled by conditional rendering
                              onClick={(e) =>
                                !generatedImageUrl && e.preventDefault()
                              }
                            >
                              <Download className="h-5 w-5" />
                            </a>
                          </>
                        ) : (
                          // Placeholder
                          <div className="text-center p-6">
                            <Image className="h-12 w-12 text-gray-500 mx-auto mb-4 opacity-40" />
                            <p className="text-gray-500">
                              Your generated image will appear here
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* --- End Updated Image Display Area --- */}
                  </div>
                </TabsContent>
                {/* Other TabsContent (Video, Voice, 3D) remain the same */}{" "}
                {/* Video Tab */}
                <TabsContent value="video" className="mt-0">
                  <div className="text-center py-12 max-w-md mx-auto">
                    <Video className="h-16 w-16 text-gray-500 opacity-50 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      Video Generation
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Transform images or text into fluid videos
                    </p>
                    <div className="mb-6">
                      <label
                        htmlFor="video-model-select"
                        className="block text-gray-300 mb-2 text-sm font-medium"
                      >
                        Select Model
                      </label>
                      <select
                        id="video-model-select"
                        value={selectedVideoModel}
                        onChange={(e) => setSelectedVideoModel(e.target.value)}
                        className="w-full bg-dark-400/50 border border-white/10 rounded-lg p-2.5 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan/50"
                      >
                        {modelsByCategory.video.map((modelName) => (
                          <option key={modelName} value={modelName}>
                            {modelName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      className="bg-cyan hover:bg-cyan-dark text-dark-500 font-medium btn-glow"
                      onClick={handleActionClick}
                    >
                      <Wand2 className="mr-2 h-5 w-5" /> Generate Video / Upload
                      Image
                    </Button>
                  </div>
                </TabsContent>
                {/* ... (Voice Tab) ... */}
                <TabsContent value="voice" className="mt-0">
                  <div className="text-center py-12 max-w-md mx-auto">
                    <Mic className="h-16 w-16 text-gray-500 opacity-50 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">Voice Cloning</h3>
                    <p className="text-gray-400 mb-6">
                      Clone any voice with just seconds of audio
                    </p>
                    <div className="mb-6">
                      <label
                        htmlFor="voice-model-select"
                        className="block text-gray-300 mb-2 text-sm font-medium"
                      >
                        Select TTS Model
                      </label>
                      <select
                        id="voice-model-select"
                        value={selectedVoiceModel}
                        onChange={(e) => setSelectedVoiceModel(e.target.value)}
                        className="w-full bg-dark-400/50 border border-white/10 rounded-lg p-2.5 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan/50"
                      >
                        {modelsByCategory.voice.map((modelName) => (
                          <option key={modelName} value={modelName}>
                            {modelName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      className="bg-cyan hover:bg-cyan-dark text-dark-500 font-medium btn-glow"
                      onClick={handleActionClick}
                    >
                      <Wand2 className="mr-2 h-5 w-5" /> Clone Voice / Upload
                      Audio
                    </Button>
                  </div>
                </TabsContent>
                {/* ... (3D Tab) ... */}
                <TabsContent value="3d" className="mt-0">
                  <div className="text-center py-12 max-w-md mx-auto">
                    <Box className="h-16 w-16 text-gray-500 opacity-50 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      3D Model Generation
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Generate 3D assets from text prompts
                    </p>
                    <div className="mb-6">
                      <label
                        htmlFor="3d-model-select"
                        className="block text-gray-300 mb-2 text-sm font-medium"
                      >
                        Select Model
                      </label>
                      <select
                        id="3d-model-select"
                        value={selected3dModel}
                        onChange={(e) => setSelected3dModel(e.target.value)}
                        className="w-full bg-dark-400/50 border border-white/10 rounded-lg p-2.5 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan/50"
                      >
                        {modelsByCategory["3d"].map((modelName) => (
                          <option key={modelName} value={modelName}>
                            {modelName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      className="w-full max-w-xs mx-auto mt-6 bg-cyan hover:bg-cyan-dark text-dark-500 font-medium btn-glow py-6"
                      onClick={handleActionClick}
                      disabled={!prompt.trim()}
                    >
                      <Wand2 className="mr-2 h-5 w-5" /> Generate Model
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenerationSection;
