import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Image, Video, Mic, Feather, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";

const MOBILE_BREAKPOINT = 768;

// Icon arrays remain the same
const leftAITools = [
  { name: "Flux", icon: "/icons/flux.png" },
  { name: "Ideogram", icon: "/icons/ideogram.png" },
  { name: "Minimax", icon: "/icons/minimax.png" },
  { name: "Wan", icon: "/icons/wan.png" },
  { name: "Google Veo", icon: "/icons/google.png" },
];

const rightAITools = [
  { name: "Luma", icon: "/icons/luma.png" },
  { name: "Recraft", icon: "/icons/recraft.png" },
  { name: "Kling", icon: "/icons/kling.png" },
  { name: "Hunyuan", icon: "/icons/hunyuan.png" },
  { name: "Pixverser", icon: "/icons/pixverser.png" },
  { name: "Hailuo", icon: "/icons/hailuo.png" },
];

const Hero = () => {
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

  const currentSources = isMobile ? videoSources.mobile : videoSources.desktop;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Video background and overlays remain the same */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-dark-500/60 z-10"></div>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="object-cover w-full h-full opacity-50"
          key={isMobile ? "mobile-video" : "desktop-video"}
          poster="/videos/hero-poster.webp"
        >
          <source src={currentSources.webm} type="video/webm" />
          <source src={currentSources.mp4} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="absolute inset-0 hero-gradient z-10"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Text content remains the same */}
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-dark-200/80 backdrop-blur-sm border border-cyan/20 text-sm animate-in stagger-1">
              <span className="text-gray-300">AI Models & Tools</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-in stagger-2">
              <span className="block">All AI Tools</span>
              <span className="glow-text text-glow mt-2 block">
                In One Platform
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto animate-in stagger-3">
              Create AI images, videos, and more using Multiple AI models.
            </p>
          </div>

          {/* ✅ MODIFIED ANIMATION CONTAINER */}
          <div className="w-full max-w-6xl mx-auto my-12 animate-in stagger-4">
            {/* 1. This container now uses our CSS mask class for mobile fade effect */}
            <div className="flex items-center justify-center marquee-container-mobile">
              {/* 2. Marquee widths are now set to 50% to give the center logo space */}
              {/* Left Marquee */}
              <div className="w-1/2">
                <Marquee
                  gradient={false}
                  speed={30}
                  direction="right"
                  pauseOnHover={true}
                >
                  {leftAITools.map((tool, index) => (
                    <div key={index} className="mx-4 flex-shrink-0">
                      <div className="glass-panel p-3 rounded-xl flex items-center justify-center border border-white/5">
                        <img
                          src={tool.icon}
                          alt={`${tool.name} logo`}
                          className="h-10 w-10 object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </Marquee>
              </div>

              {/* Central Pulsing Logo */}
              {/* 3. Added flex-shrink-0 to prevent the logo from shrinking */}
              <div className="px-4 md:px-8 flex-shrink-0">
                <div className="glass-panel p-4 rounded-2xl border border-white/10 shadow-lg animate-pulse-glow-zoom">
                  <img
                    src="/logo.png"
                    alt="Sharky AI logo"
                    className="h-16 w-16 object-contain"
                  />
                </div>
              </div>

              {/* Right Marquee */}
              <div className="w-1/2">
                <Marquee
                  gradient={false}
                  speed={30}
                  direction="left"
                  pauseOnHover={true}
                >
                  {rightAITools.map((tool, index) => (
                    <div key={index} className="mx-4 flex-shrink-0">
                      <div className="glass-panel p-3 rounded-xl flex items-center justify-center border border-white/5">
                        <img
                          src={tool.icon}
                          alt={`${tool.name} logo`}
                          className="h-10 w-10 object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </Marquee>
              </div>
            </div>
          </div>

          {/* Buttons and Feature Cards sections remain the same */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in stagger-5">
            <Button
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-dark-500 font-medium btn-glow px-8 py-6 text-lg"
              asChild
            >
              <Link to="https://forms.gle/xYmKPZR2ZDpywKuz8">
                Notify Me
                <BellRing className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-cyan/30 hover:border-cyan/60 text-gray-100 px-8 py-6 text-lg hover-glow hidden sm:inline-flex"
              asChild
            >
              <Link to="">Coming Soon</Link>
            </Button>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl animate-in stagger-6">
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

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-dark-500 to-transparent z-20"></div>
    </section>
  );
};

export default Hero;
