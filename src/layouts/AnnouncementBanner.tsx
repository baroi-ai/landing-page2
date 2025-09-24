// src/components/layout/AnnouncementBanner.tsx

import React, { useState } from "react";
import { Megaphone, X, Info, AlertTriangle, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

// Define the types of banners we can show
export type BannerType = "info" | "maintenance" | "offer" | "warning";

interface AnnouncementBannerProps {
  id: string; // A unique ID for the banner to manage its "dismissed" state
  type?: BannerType;
  message: React.ReactNode;
  link?: string;
  linkText?: string;
}

const bannerConfig = {
  info: {
    icon: Info,
    bgClass: "bg-blue-500/80 backdrop-blur-sm border-blue-400",
  },
  maintenance: {
    icon: AlertTriangle,
    bgClass: "bg-yellow-500/80 backdrop-blur-sm border-yellow-400",
  },
  offer: {
    icon: Gift,
    bgClass: "bg-green-500/80 backdrop-blur-sm border-green-400",
  },
  warning: {
    icon: AlertTriangle,
    bgClass: "bg-red-500/80 backdrop-blur-sm border-red-400",
  },
};

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  id,
  type = "info",
  message,
  link,
  linkText,
}) => {
  const [isVisible, setIsVisible] = useState(
    !localStorage.getItem(`banner_${id}_dismissed`)
  );

  const config = bannerConfig[type] || bannerConfig.info;
  const Icon = config.icon || Megaphone;

  const handleDismiss = () => {
    setIsVisible(false);
    // Remember that this specific banner was dismissed
    localStorage.setItem(`banner_${id}_dismissed`, "true");
  };

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "relative z-50 flex items-center justify-center gap-3 text-sm font-medium text-white px-4 py-2.5 border-b",
          config.bgClass
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
        <div className="text-center">
          <span>{message}</span>
          {link && (
            <a
              href={link}
              className="ml-2 inline-block font-bold underline hover:text-gray-200"
            >
              {linkText || "Learn More"} →
            </a>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnnouncementBanner;
