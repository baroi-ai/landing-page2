// src/pages/AIModelExplorerPage.tsx
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
// *** Import useNavigate for navigation ***
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
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
} from "lucide-react";

// --- Interfaces (APIModel, DisplayModel) ---
// ... (Interfaces remain the same as before) ...
interface APIModel {
  id: number;
  icon: string | null;
  name: string;
  model_type: string;
  category: string[];
  description: string;
  rating: number;
  github: string | null;
  link: string; // IMPORTANT: This link will be used for navigation
  actiontext: string;
}

interface DisplayModel extends APIModel {
  displayBadges: string[];
  typeIconKey: keyof typeof typeIconComponents;
}

// --- Helper Map for Small Icons ---
// ... (typeIconComponents remain the same as before) ...
const typeIconComponents = {
  image: ImagePlus,
  video: Video,
  voice: AudioLines,
  audio: AudioLines, // Alias for voice/audio
  "3d model": Box,
  "3d": Box, // Alias
  text: Search, // Example for text models
  default: LinkIcon, // Fallback icon
};

// --- Helper Function to Map API data ---
// ... (mapApiToDisplayModel remains the same as before) ...
const mapApiToDisplayModel = (apiModel: APIModel): DisplayModel => {
  const modelTypeLower = apiModel.model_type?.toLowerCase() || "default";
  let typeIconKey: keyof typeof typeIconComponents = "default";
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
const AIModelExplorerPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allApiModels, setAllApiModels] = useState<APIModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<DisplayModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // *** Initialize useNavigate hook ***
  const navigate = useNavigate();

  // --- Fetch Data ---
  // ... (useEffect for fetching remains the same) ...
  useEffect(() => {
    const fetchModels = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/ai-models/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: APIModel[] = await response.json();
        setAllApiModels(data);
      } catch (err: any) {
        console.error("Failed to fetch AI models:", err);
        setError(err.message || "Failed to load models. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchModels();
  }, []);

  // --- Filter Data ---
  // ... (useEffect for filtering remains the same) ...
  useEffect(() => {
    const displayModels = allApiModels.map(mapApiToDisplayModel);
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = displayModels.filter(
      (model) =>
        model.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        model.model_type.toLowerCase().includes(lowerCaseSearchTerm) ||
        model.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        model.displayBadges.some((badge) =>
          badge.toLowerCase().includes(lowerCaseSearchTerm)
        )
    );
    setFilteredModels(results);
  }, [searchTerm, allApiModels]);

  // --- Handle Action Button Click (Implement Navigation) ---
  const handleActionClick = (link: string | undefined) => {
    if (link) {
      console.log(`Navigating to: ${link}`);
      // *** Use navigate function from React Router ***
      navigate(link);
      // --- Alternative (if not using React Router/Next.js): ---
      // window.location.href = link; // Causes full page reload
      // --------------------------------------------------------
      // --- Alternative (if using Next.js): ---
      // import { useRouter } from 'next/router';
      // const router = useRouter();
      // router.push(link);
      // ---------------------------------------
    } else {
      console.warn("Action link is not defined for this model.");
      alert("Action link not available.");
    }
  };

  // --- Render Logic ---
  const renderContent = () => {
    if (isLoading) {
      // ... loading state ...
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-cyan" />
          <span className="ml-4 text-xl text-gray-300">Loading Models...</span>
        </div>
      );
    }

    if (error) {
      // ... error state ...
      return (
        <div className="flex flex-col items-center justify-center py-20 text-red-400">
          <AlertTriangle className="h-12 w-12 mb-4" />
          <p className="text-xl font-semibold">Error Loading Models</p>
          <p className="text-gray-400">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="destructive"
            className="mt-6"
          >
            Try Again
          </Button>
        </div>
      );
    }

    if (filteredModels.length === 0 && !isLoading) {
      // ... no results state ...
      if (searchTerm) {
        return (
          <div className="text-center text-gray-400 mt-10">
            <p className="text-lg">No models found matching "{searchTerm}".</p>
            <p>Try searching for a different keyword or model type.</p>
          </div>
        );
      } else {
        return (
          <div className="text-center text-gray-400 mt-10">
            <p className="text-lg">No AI models available at the moment.</p>
            <p>Please check back later.</p>
          </div>
        );
      }
    }

    // --- Render Grid ---
    return (
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {filteredModels.map((model) => {
          const TypeIconComponent =
            typeIconComponents[model.typeIconKey] || typeIconComponents.default;
          const cardClasses = `
            bg-transparent backdrop-blur-md border rounded-xl overflow-hidden
            transition-all duration-300 flex flex-col
            border-cyan-400/50 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20
            hover:border-cyan-500/70`;

          return (
            <div key={model.id} className={cardClasses}>
              {/* Logo Area - REMOVED bg-black/10 */}
              <div className="relative h-24 flex justify-center items-center border-b border-cyan-200/30">
                {" "}
                {/* Removed bg-black/10 */}
                {model.icon ? (
                  <img
                    src={model.icon}
                    alt={`${model.name} Logo`}
                    className="max-h-16 max-w-full object-contain rounded-sm p-1"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-gray-700 flex items-center justify-center text-white font-semibold">
                    {model.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Card Content Below Logo */}
              <div className="p-5 flex-grow">
                {/* ... (Name, Type, Rating, Description, Badges remain the same) ... */}
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
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {model.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
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
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-gray-100 p-2 flex-shrink-0"
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
                {/* Action Button - Calls handleActionClick */}
                <Button
                  className="w-full bg-cyan hover:bg-cyan text-black font-semibold btn-glow transition-colors duration-200"
                  size="sm"
                  onClick={() => handleActionClick(model.link)} // Uses the updated handler
                >
                  <TypeIconComponent className="h-4 w-4 mr-2" />
                  {model.actiontext}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <DashboardLayout>
      {/* ... (Helmet, Header, Search Bar remain the same) ... */}
      <Helmet>
        <title>Shakaal AI | Explore Models</title>
      </Helmet>
      <div className="space-y-8">
        <main className="flex-grow flex flex-col items-center px-4 pb-16 relative z-10">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore AI Models
            </h1>
            <p className="text-lg text-gray-300">
              Discover the cutting-edge AI models available on Shakaal AI.
            </p>
          </div>
          <div className="w-full max-w-xl mx-auto mb-12 relative">
            <Input
              type="text"
              placeholder="Search models by name, type, description, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/30 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-cyan-500 focus-visible:ring-offset-0 focus-visible:border-cyan-500 text-lg rounded-full"
              disabled={isLoading || !!error}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {renderContent()}
        </main>
      </div>
    </DashboardLayout>
  );
};

export default AIModelExplorerPage;
