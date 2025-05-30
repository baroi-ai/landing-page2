import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import AIModels from "@/components/AIModels";
import GenerationSection from "@/components/GenerationSection"; // Make sure this component exists
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  ArrowRight,
  Lock,
  Zap,
  MonitorSmartphone,
  Palette,
  DollarSign,
  GitBranch,
  Feather,
  Globe,
  // Consider adding icons for Play Store/App Store if you have them
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Define a specific type for glowPosition if possible, otherwise 'any' is a temporary fix
type GlowPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const Index = () => {
  // Add an intersection observer for animations when scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeIn");
            // Optional: Unobserve after animation to improve performance
            // observer.unobserve(entry.target);
          }
          // Optional: Add logic to remove class if element scrolls out of view
          // else {
          //   entry.target.classList.remove('animate-fadeIn');
          // }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    // Query elements *after* component mounts
    const hiddenElements = document.querySelectorAll(".reveal");
    hiddenElements.forEach((el) => observer.observe(el));

    // Cleanup function: unobserve all elements when component unmounts
    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []); // Empty dependency array means this effect runs once after initial render

  return (
    // Ensure overflow-x-hidden prevents horizontal scrollbars from animation quirks
    <div className="min-h-screen bg-dark-500 text-white overflow-x-hidden">
      <Helmet>
        <title>Shakaal AI - Uncensored Open Source AI Platform</title>
        {/* Add meta description for SEO */}
        <meta
          name="description"
          content="Explore uncensored, private, and powerful open-source AI models with Shakaal AI. Pay-per-use, cross-platform access."
        />
      </Helmet>
      <Navbar />
      <Hero />
      {/* Features Section */}
      <section id="features" className="py-20 md:py-24 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent"></div>
        <div className="absolute top-40 left-20 w-72 h-72 bg-cyan/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
              Powered by <span className="glow-text">Open Source</span>{" "}
              Innovation
            </h2>
            <p className="text-lg text-gray-400">
              We've integrated the most advanced open source AI models to give
              you unparalleled creative freedom without restrictions or hidden
              costs.
            </p>
          </div>

          {/* Core Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 md:mb-20 reveal">
            {[
              {
                icon: Feather,
                title: "Uncensored AI",
                description:
                  "Experience AI models with fewer content restrictions, allowing for a wider range of creative expression.",
                glowPosition: "top-right",
              },
              {
                icon: Lock,
                title: "Privacy-First",
                description:
                  "No data collection, no tracking. Your creations remain 100% private.",
                glowPosition: "top-left",
              },
              {
                icon: GitBranch,
                title: "Latest AI Models",
                description:
                  "Access a curated selection of powerful, up-to-date open-source models.",
                glowPosition: "bottom-right",
              },
              {
                icon: DollarSign,
                title: "Pay Per Use",
                description:
                  "Flexible coin-based system. No subscriptions, only pay for the compute you consume.",
                glowPosition: "bottom-left",
              },
            ].map((feature, idx) => (
              <FeatureCard
                key={idx}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                // Using the defined type or keeping 'as any' if FeatureCard handles it flexibly
                glowPosition={feature.glowPosition as GlowPosition}
              />
            ))}
          </div>

          {/* Advanced Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 reveal">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Optimized inference engines deliver results in seconds, not minutes.",
              },
              {
                icon: MonitorSmartphone,
                title: "Cross Platform",
                description:
                  "Access Shakaal AI seamlessly on Web, Android, and iOS. Create wherever you are.",
              },
              {
                icon: Palette,
                title: "Full Control",
                description:
                  "Fine-tune generation parameters to achieve your desired results.",
              },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="glass-icon w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-cyan" />
                </div>
                <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>{" "}
      {/* <<< END OF FEATURES SECTION */}
      {/* AI Models Section */}
      <AIModels />
      {/* Generation Demo Section (Make sure this component exists and works) */}
      {/* <GenerationSection /> */}{" "}
      {/* Uncomment this if you have this component */}
      {/* Cross-Platform Availability Section - NOW A SEPARATE SECTION */}
      <section id="access" className="py-20 md:py-24 relative">
        {/* Optional: Add decorative elements similar to other sections */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/10 to-transparent"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 reveal">
              Access Shakaal AI <span className="glow-text">Anywhere</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8 md:mb-10 reveal">
              Use Shakaal AI's powerful tools directly in your browser, or
              download our dedicated apps. Stay creative on the go.
            </p>
            <div className="flex flex-wrap gap-4 justify-center reveal">
              {/* Web App Button */}
              <Button
                className="bg-cyan hover:bg-cyan-dark text-dark-500 font-medium btn-glow px-8 py-3 md:py-4 text-base md:text-lg" // Adjusted padding/text size
                asChild
              >
                <Link to="/app">
                  {" "}
                  {/* <<< CONFIRM '/app' is your web app route */}
                  <Globe className="mr-2 h-5 w-5" />
                  Launch Web App
                </Link>
              </Button>

              {/* Google Play Button */}
              <Button
                variant="outline"
                className="border-cyan/30 hover:border-cyan/60 text-gray-100 px-8 py-3 md:py-4 text-base md:text-lg hover-glow"
                asChild
              >
                {/* <<< --- REPLACE '#' with your actual Google Play Store link --- <<< */}
                <a href="#" target="_blank" rel="noopener noreferrer">
                  {/* <YourPlayStoreIcon className="mr-2 h-5 w-5" /> */}
                  Get it on Google Play
                </a>
              </Button>

              {/* App Store Button (Coming Soon) */}
              <Button
                variant="outline"
                disabled
                className="border-gray-600/30 text-gray-500 px-8 py-3 md:py-4 text-base md:text-lg opacity-60 cursor-not-allowed" // Adjusted disabled styles
              >
                {/* <YourAppStoreIcon className="mr-2 h-5 w-5" /> */}
                App Store (Coming Soon)
              </Button>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* <<< END OF CROSS-PLATFORM SECTION */}
      <Footer />
    </div>
  );
};

export default Index;
