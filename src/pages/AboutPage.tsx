// src/pages/AboutPage.tsx (or your preferred path)

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // Assuming react-router-dom
import {
  Sparkles,
  Cloud,
  Cpu,
  Image as ImageIcon, // Renamed to avoid conflict with HTML tag
  Video,
  AudioLines,
  Box,
  ShoppingBag, // For Virtual Try-On (concept)
  Smile, // For Face Swap (concept)
  DollarSign, // For Pay-as-you-go
  Zap, // For Ease of Use / Speed
} from "lucide-react";

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-dark-500 text-white overflow-x-hidden">
      <Navbar />

      {/* Gradient Overlay - Behind the content */}
      <div className="absolute inset-0 hero-gradient z-0"></div>

      {/* Content Area */}
      <main className="flex-grow flex flex-col items-center px-4 pt-24 pb-16 relative z-10">
        {" "}
        {/* Adjusted padding */}
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Sparkles className="h-10 w-10 text-cyan-400 inline-block" />
            About Shakaal AI
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Empowering creativity through accessible, powerful, cloud-based AI
            generation tools. No installs, no limits, just pure creation.
          </p>
        </div>
        {/* Core Mission Section */}
        <div className="w-full max-w-4xl mx-auto bg-transparent backdrop-blur-md border border-white/15 rounded-lg p-6 md:p-8 mb-12 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center text-cyan-light">
            Our Mission
          </h2>
          <p className="text-gray-200 text-center md:text-lg">
            We believe that the power of artificial intelligence to create
            stunning digital content should be available to everyone. Shakaal AI
            was built to break down barriers – eliminating the need for
            expensive hardware, complex software installations, and restrictive
            subscriptions. Our mission is to provide an intuitive, powerful, and
            flexible platform where your imagination is the only limit.
          </p>
        </div>
        {/* What We Offer Section */}
        <div className="w-full max-w-5xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-10">
            What You Can Create
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Feature Card */}
            <FeatureCard
              icon={ImageIcon}
              title="AI Image Generation"
              description="Bring your wildest ideas to life with photorealistic or stylized images from text prompts."
            />
            <FeatureCard
              icon={Video}
              title="AI Video Synthesis"
              description="Animate static images or generate captivating short videos using advanced AI models."
            />
            <FeatureCard
              icon={AudioLines}
              title="Realistic Voice Cloning"
              description="Clone voices with remarkable accuracy from short audio samples for various applications."
            />
            <FeatureCard
              icon={Box}
              title="Intelligent 3D Models"
              description="Generate detailed 3D assets from text descriptions or simple sketches, ready for your projects."
            />
          </div>
        </div>
        {/* Why Shakaal AI Section */}
        <div className="w-full max-w-4xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-10">
            Why Choose Shakaal AI?
          </h2>
          <div className="space-y-6">
            <BenefitItem
              icon={Cloud}
              title="Purely Cloud-Based"
              description="Access powerful AI from any device with an internet connection. No downloads, no installations, no hardware limitations."
            />
            <BenefitItem
              icon={DollarSign}
              title="Pay As You Use"
              description="Our flexible coin system means you only pay for the resources you consume. Perfect for projects big and small, without hefty upfront costs."
            />
            <BenefitItem
              icon={Zap}
              title="Intuitive & Fast"
              description="We focus on a clean, user-friendly interface so you can start creating in minutes, not hours. Get high-quality results quickly."
            />
            <BenefitItem
              icon={Cpu}
              title="Cutting-Edge AI"
              description="We integrate state-of-the-art open-source and proprietary AI models, constantly updated to provide the best possible generation quality."
            />
          </div>
        </div>
        {/* The Future Section */}
        <div className="w-full max-w-4xl mx-auto bg-transparent backdrop-blur-md border border-white/15 rounded-lg p-6 md:p-8 mb-12 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center text-cyan-light">
            Always Evolving
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 grid grid-cols-2 gap-4">
              <ShoppingBag className="h-10 w-10 text-cyan-400 opacity-70" />
              <Smile className="h-10 w-10 text-cyan-400 opacity-70" />
              {/* Add more icons for future features */}
            </div>
            <p className="text-gray-200 md:text-lg text-center md:text-left">
              Shakaal AI is constantly growing. Our dedicated team is hard at
              work developing exciting new features. Soon, you'll be able to
              explore{" "}
              <span className="font-medium text-cyan-400">Virtual Try-On</span>{" "}
              capabilities, experiment with advanced{" "}
              <span className="font-medium text-cyan-400">Face Swapping</span>{" "}
              tools, and much more – all delivered through our seamless cloud
              platform. Stay tuned!
            </p>
          </div>
        </div>
        {/* Call to Action Section */}
        <div className="text-center">
          <p className="text-lg text-gray-300 mb-6">
            Ready to bring your ideas to life?
          </p>
          <Button
            size="lg"
            className="bg-cyan hover:bg-cyan-dark text-dark-500 font-medium btn-glow"
            asChild
          >
            <Link to="/signup">Start Creating For Free</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Helper component for feature cards
const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="bg-transparent backdrop-blur-sm border border-white/10 rounded-lg p-5 text-center hover:border-cyan-500/50 transition-colors">
    <Icon className="h-10 w-10 text-cyan-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-300 text-sm">{description}</p>
  </div>
);

// Helper component for benefit items
const BenefitItem = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="flex items-start gap-4 p-4 bg-transparent backdrop-blur-sm border border-white/10 rounded-lg">
    <Icon className="h-8 w-8 text-cyan-400 flex-shrink-0 mt-1" />
    <div>
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  </div>
);

export default AboutPage;
