// src/pages/dashboard/DashboardOverviewPage.tsx
import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout"; // Import the layout
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Coins,
  ImageIcon,
  Video,
  AudioLines,
  Music,
  Box,
  MicVocal,
  GalleryHorizontalEnd,
} from "lucide-react";
import { motion, Transition } from "framer-motion";
import { Helmet } from "react-helmet";

interface OverviewCardProps {
  title: string;
  value?: string | number;
  description: string;
  icon: React.ElementType;
  iconColor?: string;
}

const DashboardOverviewPage = () => {
  // --- Redesigned Card Styles (Focus on Clarity & Contrast) ---
  const cardClasses = `
    bg-neutral-900/80 // Slightly transparent dark base, less complex than gradient
    border border-neutral-700/80 // More solid border for definition
    rounded-lg // Standard rounding
    shadow-lg shadow-black/40 // Clearer shadow
    overflow-hidden // Keep this
    transition-all duration-300 ease-in-out
    group // For hover effects on children

    // --- Hover State ---
    hover:bg-neutral-800/90 // Slightly lighten background
    hover:border-cyan-500 // Bright accent border on hover
    hover:shadow-xl // Slightly larger shadow
    hover:shadow-cyan-500/20 // Subtle accent glow shadow

    // --- Layout ---
    flex flex-col h-full
    cursor-pointer
  `;

  // --- Animation Variants (remain the same) ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  // --- Swimming Logo Animation (remain the same) ---
  const swimAnimation = {
    x: ["-10%", "110%"],
  };
  const swimTransition: Transition = {
    x: {
      duration: 10,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    },
  };

  // --- Card Data (remain the same) ---
  const overviewCards: OverviewCardProps[] = [
    {
      title: "Image Generation",
      description: "Create stunning visuals from text prompts.",
      icon: ImageIcon,
      iconColor: "text-blue-400",
    },
    {
      title: "Video Generation",
      description: "Bring your ideas to life with AI videos.",
      icon: Video,
      iconColor: "text-red-400",
    },
    {
      title: "Lip Sync Generation",
      description: "Sync character lip movements to audio.",
      icon: MicVocal,
      iconColor: "text-pink-400",
    },
    {
      title: "View All Generations",
      description: "Browse your previously generated content.",
      icon: GalleryHorizontalEnd,
      iconColor: "text-gray-400", // Adjusted for potentially better contrast
    },
  ];

  // --- Navigation Logic (remains the same) ---
  const handleCardClick = (title: string) => {
    const basePath = "/dashboard/generations";
    if (title === "View All Generations") {
      console.log(`Navigating to ${basePath}/all`);
      // navigate(`${basePath}/all`);
    } else if (title.includes("Generation")) {
      const generationType = title
        .replace(" Generation", "")
        .toLowerCase()
        .replace(" ", "-");
      console.log(`Navigating to ${basePath}/${generationType}`);
      // navigate(`${basePath}/${generationType}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="relative min-h-full flex flex-col">
        <Helmet>
          <title>Shakaal AI | Dashboard Overview</title>
          <meta
            name="description"
            content="Overview of your Shakaal AI generation capabilities, credits, and generated content."
          />
        </Helmet>

        {/* --- Animated Swimming Logo (remain the same) --- */}
        <motion.div
          className="h-24 md:h-32 lg:h-40 xl:h-48 overflow-hidden absolute inset-x-0 top-1/2 -translate-y-1/2 z-0 pointer-events-none"
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
              src="/logo.png"
              alt=""
              className="h-full w-auto object-contain glow-text" // Ensure glow-text class is defined if needed
              loading="lazy"
            />
          </motion.div>
        </motion.div>

        {/* --- Main Content Area --- */}
        <div className="relative z-10 space-y-8 p-0 md:p-0 lg:space-y-12 lg:p-0 flex-grow">
          <motion.div
            className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {overviewCards.map((card) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                onClick={() => handleCardClick(card.title)}
                className="h-full"
                whileHover={{ y: -5, scale: 1.02 }} // Slightly adjusted hover animation
                transition={{ type: "spring", stiffness: 300, damping: 20 }} // Adjusted spring
              >
                {/* --- Applying Redesigned Card --- */}
                <Card className={`${cardClasses} h-full`}>
                  {/* Card Header: Ensure text contrast */}
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3 p-5">
                    {" "}
                    {/* Adjusted padding/pb */}
                    <CardTitle className="text-base font-medium text-neutral-100 group-hover:text-white transition-colors">
                      {" "}
                      {/* Slightly less bold, good contrast */}
                      {card.title}
                    </CardTitle>
                    {/* Icon: Clearer color, subtle hover effect */}
                    <card.icon
                      className={`h-5 w-5 flex-shrink-0 ${
                        card.iconColor ?? "text-cyan-400"
                      } ml-4 transition-transform duration-300 group-hover:scale-110`} // Added margin, smaller size
                      aria-hidden="true"
                    />
                  </CardHeader>
                  {/* Card Content: Ensure text contrast */}
                  <CardContent className="flex-grow flex flex-col justify-start p-5 pt-0">
                    {" "}
                    {/* justify-start aligns content top */}
                    {card.value !== undefined && (
                      <div className="text-2xl font-semibold text-white mb-2">
                        {" "}
                        {/* Slightly smaller value */}
                        {card.value}
                      </div>
                    )}
                    {/* Description: Better contrast */}
                    <p
                      className={`text-sm text-neutral-400 ${
                        // Brighter than neutral-300
                        card.value !== undefined ? "mt-1" : "mt-1" // Consistent margin
                      }`}
                    >
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* --- Bottom Fade Gradient (remain the same) --- */}
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none"></div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardOverviewPage;
