
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Download, Github } from 'lucide-react';

const AIModels = () => {
  const models = [
    {
      name: "StableXL",
      type: "Image",
      description: "State-of-the-art diffusion model for photorealistic image generation",
      stats: { rating: 4.9, users: "85K+", size: "2.1GB" },
      badges: ["Popular", "Offline-Ready"],
      isHighlighted: true,
    },
    {
      name: "SVD-XT",
      type: "Video",
      description: "Stable Video Diffusion for creating smooth motion from static images",
      stats: { rating: 4.7, users: "52K+", size: "1.8GB" },
      badges: ["New", "High FPS"],
      isHighlighted: false,
    },
    {
      name: "WhisperClone",
      type: "Voice",
      description: "Fast and accurate voice cloning with minimal sample requirements",
      stats: { rating: 4.8, users: "73K+", size: "1.2GB" },
      badges: ["Fast", "Multi-lingual"],
      isHighlighted: false,
    },
  ];

  return (
    <section id="ai models" className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan/10 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-cyan/5 rounded-full blur-3xl opacity-20"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-xl mx-auto text-center mb-16">
          <Badge variant="outline" className="mb-4 border-cyan/30 text-cyan-light px-3 py-1">
            Open Source Models
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Cutting-Edge AI Models, <span className="glow-text">Locally</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Access powerful AI models that run directly on your device, with no data sent to the cloud and no API limits.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {models.map((model, index) => (
            <div 
              key={model.name}
              className={`glass-panel rounded-xl overflow-hidden transition-all duration-300 ${
                model.isHighlighted 
                  ? 'border border-cyan/30 shadow-neon transform-gpu md:-translate-y-4' 
                  : 'border border-white/10 hover:border-white/20'
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-sm text-gray-400">{model.type}</span>
                    <h3 className="text-xl font-semibold">{model.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 bg-dark-400/80 px-2 py-1 rounded-md">
                    <Star className="h-3.5 w-3.5 fill-cyan text-cyan" />
                    <span className="text-sm font-medium">{model.stats.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-5">
                  {model.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-5">
                  {model.badges.map((badge) => (
                    <span 
                      key={badge} 
                      className="text-xs bg-dark-400/80 text-gray-300 rounded-full px-2.5 py-1"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>{model.stats.users} users</span>
                  <span>{model.stats.size}</span>
                </div>
              </div>
              
              <div className={`p-4 flex justify-between items-center gap-3 ${
                model.isHighlighted ? 'bg-dark-400/90' : 'bg-dark-400/50'
              }`}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-300 hover:text-gray-100 p-2"
                >
                  <Github className="h-5 w-5" />
                </Button>
                
                <Button 
                  className={
                    model.isHighlighted 
                      ? "bg-cyan hover:bg-cyan-dark text-dark-500 w-full btn-glow" 
                      : "bg-dark-300 text-gray-200 hover:bg-dark-200 w-full"
                  }
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Model
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" className="border-cyan/30 hover:border-cyan-light hover-glow">
            Browse All Models
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AIModels;
