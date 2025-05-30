// src/pages/AIModelsPage.tsx

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Star,
  Github,
  Box,
  AudioLines,
  Video,
  ImagePlus,
  Search,
  Loader2,
  AlertTriangle,
  LinkIcon,
  ImageUp,
} from "lucide-react";

// --- Interfaces (Copied from AIModelExplorerPage) ---
interface APIModel {
  id: number; // Assuming API provides numeric ID
  icon: string | null; // Logo URL
  name: string;
  model_type: string;
  category: string[]; // Used for badges
  description: string;
  rating: number;
  github: string | null;
  link: string; // Navigation link for action button
  actiontext: string;
}

interface DisplayModel extends APIModel {
  displayBadges: string[];
  typeIconKey: keyof typeof typeIconComponents;
}

// --- Helper Map for Small Button Icons (Copied from AIModelExplorerPage) ---
const typeIconComponents = {
  image: ImagePlus,
  video: Video,
  voice: AudioLines,
  audio: AudioLines,
  "3d model": Box,
  "3d": Box,
  text: Search, // Using Search for text type example
  default: LinkIcon,
};

// --- Helper Function to Map API data (Copied from AIModelExplorerPage) ---
const mapApiToDisplayModel = (apiModel: APIModel): DisplayModel => {
  const modelTypeLower = apiModel.model_type?.toLowerCase() || "default";
  let typeIconKey: keyof typeof typeIconComponents = "default";
  // Simple matching logic (adjust if needed for more complex types)
  for (const key in typeIconComponents) {
    if (modelTypeLower.includes(key)) {
      typeIconKey = key as keyof typeof typeIconComponents;
      break;
    }
  }
  const displayBadges = Array.isArray(apiModel.category)
    ? apiModel.category
    : [];
  return {
    ...apiModel,
    displayBadges: displayBadges,
    typeIconKey: typeIconKey,
  };
};

// --- Component ---
const AIModelsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allApiModels, setAllApiModels] = useState<APIModel[]>([]); // Store raw API data
  const [filteredModels, setFilteredModels] = useState<DisplayModel[]>([]); // Store mapped data for display
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook for navigation

  // --- Fetch Data ---
  useEffect(() => {
    const fetchAllModels = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/ai-models/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: APIModel[] = await response.json();
        setAllApiModels(data); // Store raw data
        // Initial map and set for display before filtering
        setFilteredModels(data.map(mapApiToDisplayModel));
      } catch (err) {
        console.error("Failed to fetch AI models:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An unknown error occurred while fetching models."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllModels();
  }, []); // Empty dependency array fetches once on mount

  // --- Filter Data ---
  useEffect(() => {
    // Map the raw data *then* filter based on search term
    const mappedModels = allApiModels.map(mapApiToDisplayModel);
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    if (!lowerCaseSearchTerm) {
      setFilteredModels(mappedModels); // Show all mapped models if search is empty
      return;
    }

    const results = mappedModels.filter(
      (model) =>
        model.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        model.model_type.toLowerCase().includes(lowerCaseSearchTerm) ||
        model.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        model.displayBadges.some(
          (
            badge // Filter using displayBadges
          ) => badge.toLowerCase().includes(lowerCaseSearchTerm)
        )
    );
    setFilteredModels(results);
  }, [searchTerm, allApiModels]); // Re-run when search term or raw data changes

  // --- Handle Action Button Click (Navigation - Copied from ExplorerPage) ---
  const handleActionClick = (link: string | undefined) => {
    if (link && link !== "#") {
      console.log(`AIModelsPage navigating to: ${link}`);
      navigate(link);
    } else {
      console.warn(`Action link is invalid or not defined: ${link}`);
      alert("This model's page or action is not available yet.");
    }
  };

  // --- Render Logic ---
  return (
    <div className="flex flex-col min-h-screen bg-dark-500 text-white overflow-x-hidden">
      <Navbar />

      <Helmet>
        <title>Explore AI Models - Shakaal AI</title> {/* Updated Title */}
      </Helmet>

      <div className="absolute inset-0 hero-gradient z-0"></div>

      <main className="flex-grow flex flex-col items-center px-4 pt-24 pb-16 relative z-10">
        {/* Header Section - Remains largely the same */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore AI Models
          </h1>
          <p className="text-lg text-gray-300">
            Discover and search through the cutting-edge AI models available on
            Shakaal AI.
          </p>
        </div>
        {/* Search Bar - Remains the same */}
        <div className="w-full max-w-xl mx-auto mb-12 relative">
          <Input
            type="text"
            placeholder="Search models by name, type, description, or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-black/30 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-cyan-500 focus-visible:ring-offset-0 focus-visible:border-cyan-500 text-lg rounded-full"
            disabled={isLoading || !!error} // Disable on load/error
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        {/* --- Content Area (Loading, Error, Grid) --- */}
        <div className="w-full max-w-6xl mx-auto min-h-[400px]">
          {" "}
          {/* Ensure space */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center mt-16 text-gray-300">
              <Loader2 className="h-12 w-12 animate-spin text-cyan-500 mb-4" />
              <p className="text-lg">Loading AI Models...</p>
            </div>
          )}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center mt-16 text-red-400 bg-red-900/20 border border-red-600/50 p-6 rounded-lg max-w-md mx-auto">
              <AlertTriangle className="h-10 w-10 mb-3" />
              <p className="text-lg font-semibold mb-1">
                Failed to Load Models
              </p>
              <p className="text-center text-sm text-red-300">{error}</p>
            </div>
          )}
          {!isLoading && !error && (
            <>
              {filteredModels.length > 0 ? (
                // --- Render Grid using ExplorerPage Card Style ---
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                  {filteredModels.map((model) => {
                    // Iterate over filtered DisplayModels
                    const TypeIconComponent =
                      typeIconComponents[model.typeIconKey] ||
                      typeIconComponents.default;
                    // Use the exact card classes from ExplorerPage
                    const cardClasses = `
                      bg-transparent backdrop-blur-md border rounded-xl overflow-hidden
                      transition-all duration-300 flex flex-col
                      border-cyan-400/50 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20
                      hover:border-cyan-500/70`;

                    return (
                      // --- Card structure copied from ExplorerPage ---
                      <div key={model.id} className={cardClasses}>
                        {/* Logo Area */}
                        <div className="relative h-24 flex justify-center items-center border-b border-cyan-200/30">
                          {model.icon ? (
                            <img
                              src={model.icon} // Use API icon URL
                              alt={`${model.name} Logo`}
                              className="max-h-16 max-w-full object-contain rounded-sm p-1"
                              onError={(e) => {
                                e.currentTarget.src = ""; // Clear src on error
                                e.currentTarget.style.display = "none"; // Hide img
                                // Optionally display fallback initials container here
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  const fallback =
                                    parent.querySelector(".fallback-initials");
                                  if (fallback)
                                    (fallback as HTMLElement).style.display =
                                      "flex";
                                }
                              }}
                            />
                          ) : null}
                          {/* Fallback Initials Container */}
                          {!model.icon && ( // Render fallback if no logo URL
                            <div className="fallback-initials h-12 w-12 rounded-md bg-gradient-to-br from-cyan-700 to-blue-800 flex items-center justify-center text-white text-xl font-semibold">
                              {model.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Card Content Below Logo */}
                        <div className="p-5 flex-grow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-white mb-1">
                                {model.name}
                              </h3>
                              <span className="text-xs text-gray-400 uppercase tracking-wider">
                                {model.model_type}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-md flex-shrink-0 border border-white/10">
                              <Star className="h-3.5 w-3.5 fill-cyan text-cyan" />
                              <span className="text-sm font-medium text-gray-200">
                                {model.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                            {" "}
                            {/* Adjust clamp if needed */}
                            {model.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {/* Use displayBadges */}
                            {model.displayBadges.map((badge) => (
                              <span
                                key={badge}
                                className="text-xs bg-white/10 text-cyan-light rounded-full px-2.5 py-0.5"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="p-4 flex justify-between items-center gap-3 border-t bg-black/20 border-cyan-600/30">
                          {/* GitHub Button */}
                          {model.github ? (
                            <a
                              href={model.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${model.name} GitHub Link`}
                              className="flex-shrink-0"
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-gray-100 p-2"
                              >
                                <Github className="h-5 w-5" />
                              </Button>
                            </a>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-600 p-2 flex-shrink-0 cursor-not-allowed"
                              disabled
                              aria-label={`${model.name} GitHub Link (Not Available)`}
                            >
                              <Github className="h-5 w-5" />
                            </Button>
                          )}
                          {/* Action Button */}
                          <Button
                            className="w-full bg-cyan hover:bg-cyan-dark text-black font-semibold btn-glow transition-colors duration-200" // ExplorerPage style
                            size="sm"
                            onClick={() => handleActionClick(model.link)} // Navigate on click
                          >
                            <TypeIconComponent className="h-4 w-4 mr-2" />
                            {model.actiontext}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // --- No Results Message ---
                <div className="text-center text-gray-400 mt-10">
                  <p className="text-lg">
                    No models found matching "{searchTerm}".
                  </p>
                  <p>Try searching for a different keyword or model type.</p>
                </div>
              )}
            </>
          )}
        </div>{" "}
        {/* End Content Area */}
      </main>

      <Footer />
    </div>
  );
};

export default AIModelsPage;
