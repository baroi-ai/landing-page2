// src/pages/AllToolsPage.tsx

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/DashboardLayout";
import {
  Search,
  ImagePlus,
  Video,
  AudioLines,
  Box,
  Music,
  MicVocal,
  Text,
  IterationCcw,
  Loader2,
  AlertTriangle,
  Sparkles, // Added for "New" badge
  Clock, // Added for "Coming Soon" badge
} from "lucide-react";
import { motion, Transition } from "framer-motion";

// --- Interfaces (AITool, DisplayTool) ---
interface AITool {
  id: number;
  name: string;
  icon: string;
  model_type: string;
  category: string[];
  description: string;
  link: string;
  actiontext: string;
  badge?: string; // <-- ADDED: Optional badge text
}

interface DisplayTool extends AITool {
  displayIcon: keyof typeof iconComponents;
  displayCategory: string;
  tags: string[];
  // badge is inherited from AITool
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
  IterationCcw: IterationCcw,
  Default: Box,
  // Icons for badges (optional)
  Sparkles: Sparkles,
  Clock: Clock,
};

// --- Helper Function to Map API data ---
const mapApiToolToDisplayTool = (apiTool: AITool): DisplayTool => {
  let displayIconKey: keyof typeof iconComponents = "Default";
  let displayCategory = "General";
  const modelTypeLower = apiTool.model_type?.toLowerCase() || "";

  // Icon/Category Mapping (remains same)
  if (modelTypeLower.includes("image")) {
    displayIconKey = "ImagePlus";
    displayCategory = "Image";
  } else if (modelTypeLower.includes("video")) {
    displayIconKey = "Video";
    displayCategory = "Video";
  } else if (modelTypeLower.includes("3d")) {
    displayIconKey = "Box";
    displayCategory = "3D";
  } else if (modelTypeLower.includes("music")) {
    displayIconKey = "Music";
    displayCategory = "Music";
  } else if (
    modelTypeLower.includes("voice") ||
    modelTypeLower.includes("speech")
  ) {
    displayIconKey = "MicVocal";
    displayCategory = "Audio";
  } else if (modelTypeLower.includes("text")) {
    displayIconKey = "Text";
    displayCategory = "Text";
  }

  const tags = Array.isArray(apiTool.category) ? apiTool.category : [];

  // *** SIMULATE BADGE DATA (Remove/modify when API provides it) ***
  let simulatedBadge: string | undefined = apiTool.badge;
  if (!simulatedBadge) {
    // Example: Mark specific tools as "New" or "Coming Soon"
    if (apiTool.id === 1 || apiTool.name.toLowerCase().includes("runway")) {
      // Example for "New"
      simulatedBadge = "New";
    } else if (!apiTool.link || apiTool.link === "#") {
      // Example for "Coming Soon"
      simulatedBadge = "Coming Soon";
    } else if (apiTool.name.toLowerCase().includes("beta")) {
      // Example for "Beta"
      simulatedBadge = "Beta";
    }
  }
  // *** END SIMULATION ***

  return {
    ...apiTool,
    displayIcon: displayIconKey,
    displayCategory: displayCategory,
    tags: tags,
    badge: simulatedBadge, // Pass the badge
  };
};

// --- Animation constants ---
const swimAnimation = {
  x: ["-10%", "700%"],
};
const swimTransition: Transition = {
  x: {
    duration: 15,
    ease: "linear",
    repeat: Infinity,
    repeatType: "loop",
  },
};

// --- Component ---
const AllToolsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allApiTools, setAllApiTools] = useState<AITool[]>([]);
  const [filteredTools, setFilteredTools] = useState<DisplayTool[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // --- Fetch Data ---
  useEffect(() => {
    const fetchTools = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Ensure your API endpoint sends the 'badge' field if available
        const response = await fetch("http://127.0.0.1:8000/api/ai-tools/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: AITool[] = await response.json();
        setAllApiTools(data);
      } catch (err: any) {
        console.error("Failed to fetch AI tools:", err);
        setError(
          err.message || "Failed to load tools. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchTools();
  }, []);

  // --- Filter Data ---
  useEffect(() => {
    const displayTools = allApiTools.map(mapApiToolToDisplayTool);
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = displayTools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        tool.displayCategory.toLowerCase().includes(lowerCaseSearchTerm) ||
        tool.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(lowerCaseSearchTerm))
    );
    setFilteredTools(results);
  }, [searchTerm, allApiTools]);

  // --- Handle Button Click (Navigation) ---
  const handleToolClick = (link: string | undefined) => {
    if (link && link !== "#") {
      // Check if link exists and is not '#'
      console.log(`Navigating to ${link}...`);
      navigate(link);
    } else if (link === "#") {
      console.warn("Tool link is '#', indicating 'Coming Soon' or similar.");
      alert("This tool is coming soon!"); // Simple feedback
    } else {
      console.warn("Tool link is not defined.");
      alert("Navigation link for this tool is not available.");
    }
  };

  // --- Render Badge Function (Helper) ---
  const renderBadge = (badgeText: string) => {
    let bgColor = "bg-gray-600"; // Default
    let textColor = "text-white";
    let Icon = null;

    const textLower = badgeText.toLowerCase();

    if (textLower === "new") {
      bgColor = "bg-red-500 hover:bg-red-400";
      textColor = "text-black";
      Icon = Sparkles;
    } else if (textLower === "coming soon") {
      bgColor = "bg-yellow-500 hover:bg-yellow-400";
      textColor = "text-black";
      Icon = Clock;
    } else if (textLower === "beta") {
      bgColor = "bg-purple-500 hover:bg-purple-400";
      textColor = "text-white";
      // You could add a specific icon for Beta if needed
    } else if (textLower === "updated") {
      bgColor = "bg-green-500 hover:bg-green-400";
      textColor = "text-white";
      // You could add a specific icon for Updated if needed
    }
    // Add more conditions as needed

    return (
      // Added slight negative margin to pull it over the border a bit more
      <div
        className={`absolute -top-1 -right-1 z-10 transform rotate-12 origin-top-right`}
        aria-label={`Status: ${badgeText}`}
      >
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold shadow-lg ${bgColor} ${textColor} transition-colors`}
        >
          {Icon && <Icon className="h-3 w-3 mr-1 flex-shrink-0" />}
          {badgeText}
        </span>
      </div>
    );
  };

  // --- Render Logic ---
  const renderContent = () => {
    // --- Loading State ---
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
          <span className="ml-4 text-xl text-gray-300">Loading Tools...</span>
        </div>
      );
    }

    // --- Error State ---
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-red-400">
          <AlertTriangle className="h-12 w-12 mb-4" />
          <p className="text-xl font-semibold">Error Loading Tools</p>
          <p className="text-gray-400">{error}</p>
          <Button
            onClick={() => window.location.reload()} // Simple refresh
            variant="destructive"
            className="mt-6"
          >
            Try Again
          </Button>
        </div>
      );
    }

    // --- No Results State ---
    if (filteredTools.length === 0 && !isLoading) {
      if (searchTerm) {
        return (
          <div className="text-center text-gray-400 mt-10">
            <p className="text-lg">No tools found matching "{searchTerm}".</p>
            <p>Try searching for a different keyword or tool type.</p>
          </div>
        );
      } else {
        // This state might indicate an issue if the API returned empty but no error
        return (
          <div className="text-center text-gray-400 mt-10">
            <p className="text-lg">No AI tools available at the moment.</p>
            <p>Please check back later or contact support if this persists.</p>
          </div>
        );
      }
    }

    // --- Render Grid ---
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
          ease: "easeOut",
        },
      },
    };

    return (
      <motion.div
        className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredTools.map((tool) => {
          const IconComponent =
            iconComponents[tool.displayIcon] || iconComponents.Default;
          const cardClasses = `
            bg-transparent backdrop-blur-md border rounded-xl overflow-hidden
            transition-all duration-300 flex flex-col h-full
            border-cyan-600/50 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20
            hover:border-cyan-500/70`;

          // Determine if the tool is 'coming soon' based on badge or link
          const isComingSoon =
            tool.badge?.toLowerCase() === "coming soon" ||
            !tool.link ||
            tool.link === "#";

          return (
            // --- Card Wrapper ---
            <motion.div
              key={tool.id}
              variants={itemVariants}
              className="h-full relative" // Added relative for badge positioning
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* --- Render Badge Conditionally --- */}
              {tool.badge && renderBadge(tool.badge)}

              {/* --- Original Card Structure --- */}
              <div className={cardClasses}>
                {/* Card Content */}
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-7 w-7 text-cyan-400 flex-shrink-0 mt-1" />
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">
                          {tool.displayCategory}
                        </span>
                        <h3 className="text-lg font-semibold text-white">
                          {tool.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4 flex-grow">
                    {tool.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-white/10 text-cyan-light rounded-full px-2.5 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Card Footer */}
                <div className="p-4 flex justify-end items-center gap-3 border-t bg-black/20 border-cyan-600/30">
                  <Button
                    className={`w-full font-semibold btn-glow transition-all duration-200 ${
                      isComingSoon
                        ? "bg-gray-600 hover:bg-gray-500 text-gray-300 cursor-not-allowed opacity-75" // Disabled style
                        : "bg-cyan hover:bg-cyan-400 text-black" // Active style
                    }`}
                    size="sm"
                    onClick={() => handleToolClick(tool.link)}
                    disabled={isComingSoon} // Disable button if coming soon
                    aria-disabled={isComingSoon}
                    title={
                      isComingSoon
                        ? "This tool is not yet available"
                        : tool.actiontext
                    } // Add title for usability
                  >
                    <IconComponent className="h-4 w-4 mr-2 flex-shrink-0" />
                    {isComingSoon ? "Coming Soon..." : tool.actiontext}{" "}
                    {/* Change button text */}
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    );
  };

  // --- Main Component Return ---
  return (
    <DashboardLayout>
      <div className="relative min-h-full flex flex-col flex-grow overflow-x-hidden">
        <Helmet>
          <title>Shakaal AI | All Tools</title>
          <meta
            name="description"
            content="Explore the full range of AI generation tools available on Shakaal AI."
          />
        </Helmet>

        {/* Animated Swimming Logo */}
        <motion.div
          className="h-24 md:h-32 lg:h-40 xl:h-48 overflow-hidden absolute inset-x-0 top-0 pt-4 z-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute top-0 left-0 h-full w-auto"
            animate={swimAnimation}
            transition={swimTransition}
          >
            <img
              src="/logo.png" // Make sure this path is correct
              alt=""
              className="h-full w-auto object-contain"
              loading="lazy"
            />
          </motion.div>
        </motion.div>

        {/* Main Content Area */}
        <div className="relative z-10 space-y-8 flex-grow flex flex-col">
          <main className="flex-grow flex flex-col items-center px-4 pt-12 md:pt-16 pb-16">
            {/* Header Text */}
            <div className="text-center mb-10 max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Explore AI Tools
              </h1>
              <p className="text-lg text-gray-300">
                Discover the range of AI capabilities available on Shakaal AI to
                power your creativity and productivity.
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-xl mx-auto mb-12 relative">
              <Input
                type="text"
                placeholder="Search tools by name, category, or tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/30 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-cyan-500 focus-visible:ring-offset-0 focus-visible:border-cyan-500 text-lg rounded-full disabled:opacity-50"
                disabled={isLoading || !!error} // Disable input during load/error
                aria-label="Search AI tools"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            {/* Content Grid/States */}
            {renderContent()}
          </main>
        </div>

        {/* Bottom Fade Gradient */}
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none"></div>
      </div>
    </DashboardLayout>
  );
};

export default AllToolsPage;
