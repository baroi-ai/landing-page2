// src/pages/ExploreToolsPage.tsx

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import {
  Box,
  AudioLines,
  Video,
  ImagePlus,
  Music,
  MicVocal,
  Text,
  Search,
  Loader2,
  ImageUp,
  AlertTriangle,
} from "lucide-react";

// --- Interface for Raw API Data ---
interface ApiAiTool {
  id: number | string;
  name: string;
  icon: string;
  model_type: string;
  category: string[];
  description: string;
  link?: string;
  actiontext: string;
  badge?: string; // API might provide a primary badge like "New", "Popular"
}

// --- Interface for Data Used in Rendering This Page ---
interface DisplayModel {
  id: number | string;
  name: string;
  type: string;
  description: string;
  badges: string[];
  usse: string;
  iconKey: keyof typeof iconComponents;
  isHighlighted: boolean; // Added back for conditional styling
}

// --- Helper Map for Icons ---
const iconComponents = {
  ImagePlus: ImagePlus,
  Video: Video,
  AudioLines: AudioLines,
  Box: Box,
  Music: Music,
  MicVocal: MicVocal,
  Text: Text,
  Default: Box,
};

// --- Helper Function to Map API data to DisplayModel ---
const mapApiToolToDisplayModel = (apiTool: ApiAiTool): DisplayModel => {
  let displayIconKey: keyof typeof iconComponents = "Default";
  let displayType = "General";
  const modelTypeLower = apiTool.model_type?.toLowerCase() || "";

  if (modelTypeLower.includes("image")) {
    displayIconKey = "ImagePlus";
    displayType = "Image";
  } else if (modelTypeLower.includes("video")) {
    displayIconKey = "Video";
    displayType = "Video";
  } else if (modelTypeLower.includes("3d")) {
    displayIconKey = "Box";
    displayType = "3D Model";
  } else if (modelTypeLower.includes("music")) {
    displayIconKey = "Music";
    displayType = "Music";
  } else if (
    modelTypeLower.includes("voice") ||
    modelTypeLower.includes("speech") ||
    modelTypeLower.includes("tts")
  ) {
    displayIconKey = "MicVocal";
    displayType = "Voice";
  } else if (modelTypeLower.includes("text")) {
    displayIconKey = "Text";
    displayType = "Text";
  }

  const badges = Array.isArray(apiTool.category) ? apiTool.category : [];

  // --- Determine Highlighting Logic ---
  // Example: Highlight if the API badge is 'Popular' OR 'New',
  // OR if the type is Image/Video, OR if the category array contains "Popular" or "New".
  // Adjust this logic based on your API data and desired highlighting rules.
  const apiBadgeLower = apiTool.badge?.toLowerCase();
  if (
    apiBadgeLower === "popular" ||
    apiBadgeLower === "new" ||
    displayType === "Image" || // Highlight all Image models
    displayType === "Video" || // Highlight all Video models
    badges.some(
      (b) => b.toLowerCase() === "popular" || b.toLowerCase() === "new"
    )
  ) {
  }
  // --- End Highlighting Logic ---

  const isHighlighted = true;

  return {
    id: apiTool.id,
    name: apiTool.name,
    type: displayType,
    description: apiTool.description,
    badges: badges,
    usse: apiTool.actiontext,
    iconKey: displayIconKey,
    isHighlighted: isHighlighted, // Assign the determined highlight status
  };
};

// --- Component ---
const ExploreToolsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allDisplayModels, setAllDisplayModels] = useState<DisplayModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<DisplayModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch and Map Data (useEffect remains the same) ---
  useEffect(() => {
    const fetchAndMapModels = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/ai-tools/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiData: ApiAiTool[] = await response.json();
        const mappedData = apiData.map(mapApiToolToDisplayModel);
        setAllDisplayModels(mappedData);
        setFilteredModels(mappedData);
      } catch (err) {
        console.error("Failed to fetch or map AI models:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndMapModels();
  }, []);

  // --- Filter Models (useEffect remains the same) ---
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    if (!lowerCaseSearchTerm) {
      setFilteredModels(allDisplayModels);
      return;
    }
    const results = allDisplayModels.filter(
      (model) =>
        model.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        model.type.toLowerCase().includes(lowerCaseSearchTerm) ||
        model.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        model.badges.some((badge) =>
          badge.toLowerCase().includes(lowerCaseSearchTerm)
        )
    );
    setFilteredModels(results);
  }, [searchTerm, allDisplayModels]);

  // --- Render Logic ---
  return (
    <div className="flex flex-col min-h-screen bg-dark-500 text-white overflow-x-hidden">
      <Navbar />

      <Helmet>
        <title>Explore AI Tools - Shakaal AI</title>
      </Helmet>

      <div className="absolute inset-0 hero-gradient z-0"></div>

      <main className="flex-grow flex flex-col items-center px-4 pt-24 pb-16 relative z-10">
        {/* Header and Search Bar remain the same */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore AI Tools
          </h1>
          <p className="text-lg text-gray-300">
            Discover the range of AI capabilities available on Shakaal AI to
            power your creativity and productivity.
          </p>
        </div>
        <div className="w-full max-w-xl mx-auto mb-12 relative">
          <Input
            type="text"
            placeholder="Search tool by name, type, description, or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-black/30 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-cyan-500 focus-visible:ring-offset-0 focus-visible:border-cyan-500 text-lg rounded-full"
            disabled={isLoading || !!error}
            aria-label="Search AI models"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {/* Loading and Error states remain the same */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center mt-16 text-gray-300">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-500 mb-4" />
            <p className="text-lg">Loading AI Models...</p>
          </div>
        )}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center mt-16 text-red-400 bg-red-900/20 border border-red-600/50 p-6 rounded-lg max-w-md mx-auto">
            <AlertTriangle className="h-10 w-10 mb-3" />
            <p className="text-lg font-semibold mb-1">Failed to Load Models</p>
            <p className="text-center text-sm text-red-300">{error}</p>
            <p className="text-center text-sm text-red-300 mt-2">
              Please check the API connection or try again later.
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {filteredModels.length > 0 ? (
              <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {filteredModels.map((model) => {
                  const IconComponent =
                    iconComponents[model.iconKey] || iconComponents.Default;

                  // --- Conditional Card Styling ---
                  const cardClasses = `
                    bg-transparent backdrop-blur-md border rounded-xl overflow-hidden
                    transition-all duration-300 flex flex-col h-full
                    ${
                      model.isHighlighted // Apply styles based on the flag
                        ? "border-cyan-600/50 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:border-cyan-500/70" // Cyan Highlighted style
                        : "border-white/20 shadow-md hover:border-white/40 hover:shadow-lg" // Default subtle style
                    }`;

                  return (
                    <div
                      key={model.id}
                      className={cardClasses} // Use the dynamically generated classes
                    >
                      {/* Card Content (structure remains the same) */}
                      <div className="p-5 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <IconComponent
                              className={`h-7 w-7 flex-shrink-0 mt-1 ${
                                model.isHighlighted
                                  ? "text-cyan-400"
                                  : "text-cyan-light"
                              }`}
                            />{" "}
                            {/* Optional: slightly brighter icon when highlighted */}
                            <div>
                              <span className="text-xs text-gray-400 uppercase tracking-wider">
                                {model.type}
                              </span>
                              <h3 className="text-lg font-semibold text-white">
                                {model.name}
                              </h3>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm mb-4 flex-grow">
                          {model.description}
                        </p>
                        {model.badges && model.badges.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {model.badges.map((badge) => (
                              <span
                                key={badge}
                                className="text-xs bg-white/10 text-cyan-light rounded-full px-2.5 py-0.5"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer with Conditional Styling */}
                      <div
                        className={`p-4 flex justify-center items-center gap-3 border-t ${
                          model.isHighlighted
                            ? "bg-black/20 border-cyan-600/30" // Highlighted footer style
                            : "bg-black/10 border-white/10" // Default footer style
                        }`}
                      >
                        {/* Main Action Button with Conditional Styling */}
                        <Button
                          className={`w-full font-semibold transition-all duration-200 ${
                            model.isHighlighted
                              ? "bg-cyan hover:bg-cyan-400 text-black btn-glow" // Highlighted button style
                              : "bg-white/10 text-gray-200 hover:bg-white/20 border border-white/20" // Default subtle button style
                          }`}
                          size="sm"
                        >
                          <IconComponent className="h-4 w-4 mr-2 flex-shrink-0" />
                          {model.usse}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // No results message remains the same
              <div className="text-center text-gray-400 mt-10">
                <p className="text-lg">
                  {allDisplayModels.length === 0
                    ? "No AI models found."
                    : `No models found matching "${searchTerm}".`}
                </p>
                {allDisplayModels.length > 0 && (
                  <p>Try searching for a different keyword or model type.</p>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ExploreToolsPage;
