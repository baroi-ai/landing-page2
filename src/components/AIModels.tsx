import React, { useState, useEffect } from "react"; // Added hooks
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import {
  ArrowRight,
  Star,
  Github,
  Box,
  AudioLines,
  Video,
  ImagePlus,
  LinkIcon,
  Search,
  Loader2, // Added loader
  AlertTriangle, // Added error icon
} from "lucide-react";

// --- Interfaces (APIModel, DisplayModel - Copied from ExplorerPage) ---
interface APIModel {
  id: number; // Expect number ID from API
  icon: string | null;
  name: string;
  model_type: string;
  category: string[];
  description: string;
  rating: number;
  github: string | null;
  link: string;
  actiontext: string;
}

interface DisplayModel extends APIModel {
  displayBadges: string[];
  typeIconKey: keyof typeof typeIconComponents;
}

// --- Helper Map for Small Icons (Copied from ExplorerPage) ---
const typeIconComponents = {
  image: ImagePlus,
  video: Video,
  voice: AudioLines,
  audio: AudioLines,
  "3d model": Box,
  "3d": Box,
  text: Search,
  default: LinkIcon,
};

// --- Helper Function to Map API data (Copied from ExplorerPage) ---
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
const AIModels = () => {
  // --- State Variables ---
  const [displayModels, setDisplayModels] = useState<DisplayModel[]>([]); // Models to display
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook for navigation

  // --- Fetch Data ---
  useEffect(() => {
    const fetchFeaturedModels = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch from the same endpoint as the explorer page
        const response = await fetch("http://127.0.0.1:8000/api/ai-models/");
        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status} ${response.statusText}`
          );
        }
        const allApiData: APIModel[] = await response.json();

        // Map all fetched data
        const allMappedData = allApiData.map(mapApiToDisplayModel);

        // --- Select Featured Models (e.g., first 4) ---
        // Ideally, your API would have an endpoint like /api/ai-models/featured/
        // If not, slice the results here.
        const featuredModels = allMappedData.slice(0, 4);
        // --- End Selection ---

        setDisplayModels(featuredModels);
      } catch (err) {
        console.error("Failed to fetch AI models for section:", err);
        setError(
          err instanceof Error ? err.message : "Could not load featured models."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedModels();
  }, []); // Empty dependency array runs once on mount

  // --- Handle Action Button Click (Navigation) ---
  const handleActionClick = (link: string | undefined) => {
    if (link && link !== "#") {
      // Added check for '#'
      console.log(`AIModels component navigating to: ${link}`);
      navigate(link);
    } else {
      console.warn(`Action link is invalid or not defined: ${link}`);
      // Optionally show a message like "Coming soon" or do nothing
      alert("This model's page is not available yet.");
    }
  };

  return (
    <section id="ai-models" className="py-24 relative overflow-hidden">
      {" "}
      {/* Corrected id */}
      {/* Background gradients */}
      <div className="absolute inset-0 hero-gradient z-10"></div>
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan/10 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-cyan/5 rounded-full blur-3xl opacity-20"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header Section */}
        <div className="max-w-xl mx-auto text-center mb-16">
          <span className="mb-4 inline-block border border-cyan/30 text-cyan-light px-3 py-1 text-sm rounded-md">
            Featured AI Models
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Explore Leading AI Models
          </h2>
          <p className="text-gray-400 text-lg">
            Discover powerful, ready-to-use models for images, video, voice, and
            3D generation.
          </p>
        </div>
        {/* --- Content Area (Loading, Error, Grid) --- */}
        <div className="min-h-[300px]">
          {" "}
          {/* Added min-height to prevent collapsing during load */}
          {isLoading && (
            <div className="flex justify-center items-center pt-10">
              <Loader2 className="h-10 w-10 animate-spin text-cyan" />
            </div>
          )}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center pt-10 text-red-400 text-center">
              <AlertTriangle className="h-10 w-10 mb-3" />
              <p className="font-semibold">Failed to Load Models</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {!isLoading && !error && displayModels.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {displayModels.map((model) => {
                const TypeIconComponent =
                  typeIconComponents[model.typeIconKey] ||
                  typeIconComponents.default;
                const cardClasses = `
                  bg-transparent backdrop-blur-md border rounded-xl overflow-hidden
                  transition-all duration-300 flex flex-col
                  border-cyan-400/50 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20
                  hover:border-cyan-500/70`;

                return (
                  // Card structure copied from previous version, using fetched data
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
                      ) : null}{" "}
                      {/* Render img only if icon exists */}
                      {/* Fallback Initials Container (initially hidden if logo exists) */}
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
                        {model.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {/* Use displayBadges from mapped data */}
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
                      {/* Action Button - Calls handleActionClick */}
                      <Button
                        className="w-full bg-cyan hover:bg-cyan-dark text-black font-semibold btn-glow transition-colors duration-200"
                        size="sm"
                        onClick={() => handleActionClick(model.link)} // Use navigation handler
                      >
                        <TypeIconComponent className="h-4 w-4 mr-2" />
                        {model.actiontext}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {!isLoading && !error && displayModels.length === 0 && (
            <div className="text-center text-gray-400 pt-10">
              <p>No featured models available at the moment.</p>
            </div>
          )}
        </div>{" "}
        {/* End Content Area */}
        {/* Browse All Button */}
        <div className="text-center mt-16">
          <Link to="/ai-models">
            {" "}
            {/* Ensure this links to your explorer page */}
            <Button
              variant="outline"
              className="border-cyan/30 hover:border-cyan-light hover-glow"
            >
              Browse All Models
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AIModels;
