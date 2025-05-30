// src/layouts/DashboardLayout.tsx

import React, { useState, useEffect } from "react"; // Import useEffect
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Define your video sources
const DESKTOP_VIDEO_SRC = "/bg3.mp4"; // Your main background video
const MOBILE_VIDEO_SRC = "/bgs.mp4"; // Your specific mobile background video
const MOBILE_BREAKPOINT = 768; // Tailwind's `md` breakpoint

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false); // To prevent layout shift or flicker
  const [currentVideoSrc, setCurrentVideoSrc] = useState(DESKTOP_VIDEO_SRC);

  useEffect(() => {
    const checkScreenSize = () => {
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      setCurrentVideoSrc(isMobile ? MOBILE_VIDEO_SRC : DESKTOP_VIDEO_SRC);
      setIsVideoReady(true); // Mark video as ready after first check
    };

    // Initial check
    checkScreenSize();

    // Listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup listener
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={cn("flex h-screen text-foreground relative")}>
      {/* --- Background Video Layer --- */}
      {isVideoReady && ( // Conditionally render video element once src is determined
        <div
          className="fixed inset-0 z-[-2] overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <video
            key={currentVideoSrc} // Add key to force re-render if src changes
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src={currentVideoSrc} // Use dynamic video source
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* --- Background Overlay Layer --- */}
      <div
        className="fixed inset-0 z-[-1] bg-black/70 pointer-events-none"
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Main content area container */}
      <div className="flex flex-1 flex-col overflow-hidden z-10">
        {/* Dashboard-specific Navbar */}
        <DashboardNavbar toggleSidebar={toggleSidebar} />

        {/* Page content */}
        <main
          className={cn(
            "flex-1 overflow-y-auto p-4 md:p-6 lg:p-8",
            "pb-20 md:pb-6 lg:pb-8" // Adjust padding-bottom for mobile nav
          )}
        >
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default DashboardLayout;
