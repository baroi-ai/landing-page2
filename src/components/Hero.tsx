import React, { useEffect, useRef, useState } from "react"; // Added useState
import { ArrowRight, Image, Video, Mic, Feather } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MOBILE_BREAKPOINT = 768; // Define your mobile breakpoint (e.g., 768px for md)

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false); // State to track mobile view

  useEffect(() => {
    // Function to check screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []); // This effect can remain separate as it only depends on videoRef

  const backgroundVideoSrc = isMobile ? "/bgs.mp4" : "/bg3.mp4"; // Choose video based on state
  // Make sure you have a /public/bg_mobile.mp4 video file

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-dark-500/60 z-10"></div>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="object-cover w-full h-full opacity-50"
          key={backgroundVideoSrc} // Add key to force re-render if src changes
        >
          <source src={backgroundVideoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 hero-gradient z-10"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-dark-200/80 backdrop-blur-sm border border-cyan/20 text-sm animate-in stagger-1">
              <span className="text-gray-300">Run AI Models • Online</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-in stagger-2">
              <span className="block">Limitless AI Creation</span>
              <span className="glow-text text-glow mt-2 block">
                With Freedom
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto animate-in stagger-3">
              Create stunning AI images, videos, and more using Open source AI
              models.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-in stagger-4">
              <Button
                className="bg-cyan hover:bg-cyan-dark text-dark-500 font-medium btn-glow px-8 py-6 text-lg"
                asChild
              >
                <Link to="/signup">
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                className="border-cyan/30 hover:border-cyan/60 text-gray-100 px-8 py-6 text-lg hover-glow"
                asChild
              >
                <Link to="/ai-tools">Explore Tools</Link>
              </Button>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl animate-in stagger-5">
            {[
              {
                icon: Image,
                title: "Image Generation",
                desc: "Create photorealistic images with just text prompts",
              },
              {
                icon: Video,
                title: "Video Generation",
                desc: "Transform images into fluid, natural videos",
              },
              {
                icon: Mic,
                title: "Voice Cloning",
                desc: "Clone any voice with just seconds of audio",
              },
              {
                icon: Feather,
                title: "More",
                desc: "Find even more AI tools for your projects",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-panel p-6 rounded-xl flex flex-col items-center text-center border border-white/5 hover-scale"
              >
                <div className="glass-icon rounded-full mb-4">
                  <feature.icon className="h-6 w-6 text-cyan-light" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-dark-500 to-transparent z-20"></div>
    </section>
  );
};

export default Hero;
