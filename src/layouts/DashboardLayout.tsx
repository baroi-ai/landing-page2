import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import { cn } from "@/lib/utils";

import AnnouncementBanner from "./AnnouncementBanner";
import type { BannerType } from "./AnnouncementBanner";
import { publicApiGet } from "@/lib/api";

// Define the shape of the data from the API
interface AnnouncementData {
  id: number;
  message: string;
  type: BannerType;
  link?: string;
  link_text?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// ✅ 1. Define video sources and poster in a structured way
const videoSources = {
  desktop: {
    webm: "/videos/hero-background.webm",
    mp4: "/videos/hero-background.mp4",
  },
  mobile: {
    webm: "/videos/hero-background-mobile.webm",
    mp4: "/videos/hero-background-mobile.mp4",
  },
};
const POSTER_IMAGE = "/videos/hero-poster.webp";
const MOBILE_BREAKPOINT = 768;

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Default to desktop sources to prevent flash of content on initial render
  const [currentVideoSources, setCurrentVideoSources] = useState(
    videoSources.desktop
  );
  // This state is primarily to ensure client-side logic has run
  const [isClient, setIsClient] = useState(false);

  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(
    null
  );
  const [isLoadingAnnouncement, setIsLoadingAnnouncement] = useState(true);

  // Effect for setting the correct video source based on screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      setCurrentVideoSources(
        isMobile ? videoSources.mobile : videoSources.desktop
      );
    };

    // Run on initial mount (client-side only)
    checkScreenSize();
    setIsClient(true); // Mark that client-side logic has run

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Effect for fetching announcement data
  useEffect(() => {
    const fetchActiveAnnouncement = async () => {
      try {
        const data = await publicApiGet("/api/announcements/active");
        if (data) {
          setAnnouncement(data);
        }
      } catch (error) {
        console.error("Could not fetch active announcement:", error);
      } finally {
        setIsLoadingAnnouncement(false);
      }
    };
    fetchActiveAnnouncement();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={cn("flex h-screen text-foreground relative")}>
      {/* --- Background Video Layer (OPTIMIZED) --- */}
      <div
        className="fixed inset-0 z-[-2] overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {/* The key forces a re-mount when the source changes between mobile/desktop */}
        <video
          key={isClient ? currentVideoSources.mp4 : "initial"}
          autoPlay
          loop
          muted
          playsInline
          // ✅ 2. The poster provides an instant background, improving LCP
          poster={POSTER_IMAGE}
          className="w-full h-full object-cover"
        >
          {/* ✅ 3. Provide modern WebM format with MP4 as a fallback */}
          <source src={currentVideoSources.webm} type="video/webm" />
          <source src={currentVideoSources.mp4} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div
        className="fixed inset-0 z-[-1] bg-black/70 pointer-events-none"
        aria-hidden="true"
      ></div>

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <div className="flex flex-1 flex-col overflow-hidden z-10">
        {!isLoadingAnnouncement && announcement && (
          <AnnouncementBanner
            id={`server-announcement-${announcement.id}`}
            type={announcement.type}
            message={announcement.message}
            link={announcement.link}
            linkText={announcement.link_text}
          />
        )}

        <DashboardNavbar toggleSidebar={toggleSidebar} />

        <main
          className={cn(
            "flex-1 overflow-y-auto p-4 md:p-6 lg:p-8",
            "pb-20 md:pb-6 lg:pb-8"
          )}
        >
          {children}
        </main>

        <MobileBottomNav />
      </div>
    </div>
  );
};

export default DashboardLayout;
