
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeatureCard from '@/components/FeatureCard';
import AIModels from '@/components/AIModels';
import GenerationSection from '@/components/GenerationSection';
import Footer from '@/components/Footer';
import { ArrowRight, Brain, Cpu, Lock, Globe, Zap, Clock, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  // Add an intersection observer for animations when scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
          }
        });
      },
      { threshold: 0.1 }
    );

    const hiddenElements = document.querySelectorAll('.reveal');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-dark-500 text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      
      {/* Features Section */}
      <section id="features" className="py-24 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent"></div>
        <div className="absolute top-40 left-20 w-72 h-72 bg-cyan/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Powered by <span className="glow-text">Open Source</span> Innovation
            </h2>
            <p className="text-lg text-gray-400">
              We've integrated the most advanced open source AI models to give you unparalleled creative freedom without restrictions or hidden costs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
            {[
              {
                icon: Brain,
                title: "Local Processing",
                description: "All AI processing happens directly on your device. Your data never leaves your computer.",
                glowPosition: "top-right"
              },
              {
                icon: Lock,
                title: "Privacy-First",
                description: "No cloud processing, no data collection, and no tracking. Your creations remain 100% private.",
                glowPosition: "top-left"
              },
              {
                icon: Cpu,
                title: "Optimized Models",
                description: "Our models are optimized to run efficiently on consumer hardware without sacrificing quality.",
                glowPosition: "bottom-right"
              },
              {
                icon: Globe,
                title: "No API Limits",
                description: "No usage quotas, rate limits, or surprise bills. Generate as much content as you need.",
                glowPosition: "bottom-left"
              },
            ].map((feature, idx) => (
              <FeatureCard
                key={idx}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                glowPosition={feature.glowPosition as any}
              />
            ))}
          </div>
          
          {/* Advanced Features */}
          <div className="mt-20 grid md:grid-cols-3 gap-8 reveal">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized inference engines deliver results in seconds, not minutes.",
              },
              {
                icon: Clock,
                title: "Work Offline",
                description: "Once downloaded, our models work without an internet connection.",
              },
              {
                icon: Palette,
                title: "Full Control",
                description: "Adjust every parameter to get exactly the results you want.",
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
      
      {/* AI Models Section */}
      <AIModels />
      
      {/* Generation Demo Section */}
      <GenerationSection />
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-cyan/5 to-transparent opacity-70"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 reveal">
              Ready to Create with <span className="glow-text">AI Freedom</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8 reveal">
              Join thousands of creators using our platform to push the boundaries of what's possible with AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center reveal">
              <Button className="bg-cyan hover:bg-cyan-dark text-dark-500 font-medium btn-glow px-8 py-6 text-lg">
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-cyan/30 hover:border-cyan-light px-8 py-6 text-lg hover-glow">
                View Documentation
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
