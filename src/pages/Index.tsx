import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
// ✅ 1. Import Helmet for SEO management
import { Helmet } from "react-helmet-async";
import {
  Hourglass,
  Lock,
  Zap,
  MonitorSmartphone,
  Palette,
  DollarSign,
  GitBranch,
  Feather,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type GlowPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const Index = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeIn");
          }
        });
      },
      { threshold: 0.1 }
    );

    const hiddenElements = document.querySelectorAll(".reveal");
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // ✅ 2. Define SEO variables for clarity
  const pageTitle = "Deepshark AI: All in one AI Platform";
  const pageDescription =
    "Explore AI with Deepshark AI. Access powerful open & closed source models for AI image generation, video creation, and voice synthesis. Pay-per-use, privacy-first, and cross-platform.";
  const canonicalUrl = "https://deepsharkai.art/";
  const ogImageUrl = "https://deepsharkai.art/og-image.png"; // IMPORTANT: Create and upload this image

  return (
    <div className="min-h-screen bg-dark-500 text-white overflow-x-hidden">
      {/* ✅ 3. Comprehensive SEO Block */}
      <Helmet>
        {/* Standard SEO */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImageUrl} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImageUrl} />

        {/* Schema.org for Google */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Deepshark AI",
            url: "https://sharkyai.xyz",
            logo: "https://deepsharkai.art/logo.png", // Ensure your logo is at this path
            description: pageDescription,
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer support",
              url: "https://deepsharkai.art/contact", // Add your contact page URL
            },
          })}
        </script>
      </Helmet>

      <Navbar />
      <Hero />
      <section id="features" className="py-20 md:py-24 relative">
        <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent"></div>
        <div className="absolute top-40 left-20 w-72 h-72 bg-cyan/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
              Powered by <span className="glow-text">Open & Closed Source</span>{" "}
              Innovation
            </h2>
            <p className="text-lg text-gray-400">
              We've integrated the most advanced open & Closed source AI models
              to give you unparalleled creative freedom without restrictions or
              hidden costs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 md:mb-20 reveal">
            {[
              {
                icon: Feather,
                title: "Simple Interface",
                description:
                  "Experience AI models with Simple UI/UX, WIth  a wider range of AI  Models.",
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
                  "Access a curated selection of powerful, up-to-date open & closed source models.",
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
                glowPosition={feature.glowPosition as GlowPosition}
              />
            ))}
          </div>

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
                  "Access Deepshark AI seamlessly on Web, Android, and iOS. Create wherever you are.",
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
      </section>

      <section id="access" className="py-20 md:py-24 relative">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/10 to-transparent"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 reveal">
              Access Deepshark AI <span className="glow-text">Anywhere</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8 md:mb-10 reveal">
              Use Deepshark AI's powerful tools directly in your browser, or
              download our dedicated apps. Stay creative on the go.
            </p>
            <div className="flex flex-wrap gap-4 justify-center reveal">
              <Button
                className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-black font-medium btn-glow px-8 py-3 md:py-4 text-base md:text-lg"
                asChild
              >
                <Link to="">
                  <Hourglass className="ml-2 h-5 w-5" /> Comming Soon
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Index;
