
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Image, Video, Mic, Wand2, Sparkles, Loader2 } from 'lucide-react';

const GenerationSection = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  
  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-radial from-dark-200/5 to-transparent opacity-40"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Experience <span className="glow-text">AI Generation</span> Live
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Try our AI generation tools with a simple prompt. No account required.
            </p>
          </div>
          
          <div className="glass-panel rounded-xl border border-white/10 shadow-lg overflow-hidden">
            <Tabs defaultValue="image" className="w-full">
              <div className="border-b border-white/10 p-4">
                <TabsList className="grid grid-cols-3 bg-dark-400/50">
                  <TabsTrigger value="image" className="data-[state=active]:bg-dark-200 data-[state=active]:text-cyan">
                    <Image className="h-4 w-4 mr-2" />
                    Image
                  </TabsTrigger>
                  <TabsTrigger value="video" className="data-[state=active]:bg-dark-200 data-[state=active]:text-cyan">
                    <Video className="h-4 w-4 mr-2" />
                    Video
                  </TabsTrigger>
                  <TabsTrigger value="voice" className="data-[state=active]:bg-dark-200 data-[state=active]:text-cyan">
                    <Mic className="h-4 w-4 mr-2" />
                    Voice
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2 text-sm font-medium">Your Prompt</label>
                  <div className="relative">
                    <textarea 
                      className="w-full h-24 bg-dark-400/50 border border-white/10 rounded-lg p-3 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan/50"
                      placeholder="Describe what you want to generate..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    <button 
                      className="absolute right-3 bottom-3 text-gray-400 hover:text-cyan-light"
                      onClick={() => setPrompt("")}
                    >
                      {prompt && "Clear"}
                    </button>
                  </div>
                </div>
                
                <TabsContent value="image" className="mt-0">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-300 mb-2 text-sm font-medium">Style</label>
                          <select className="w-full bg-dark-400/50 border border-white/10 rounded-lg p-2.5 text-gray-200">
                            <option>Photorealistic</option>
                            <option>Artistic</option>
                            <option>3D Render</option>
                            <option>Anime</option>
                            <option>Sketch</option>
                          </select>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-gray-300 text-sm font-medium">Detail Level</label>
                            <span className="text-gray-400 text-xs">High</span>
                          </div>
                          <Slider defaultValue={[75]} max={100} step={1} />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-gray-300 text-sm font-medium">Creativity</label>
                            <span className="text-gray-400 text-xs">Medium</span>
                          </div>
                          <Slider defaultValue={[50]} max={100} step={1} />
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full mt-6 bg-cyan hover:bg-cyan-dark text-dark-500 font-medium btn-glow py-6"
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt.trim()}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-5 w-5" />
                            Generate Image
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="relative w-full aspect-square bg-dark-400/30 rounded-lg border border-white/5 flex items-center justify-center overflow-hidden">
                        {isGenerating ? (
                          <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-300/50 mb-4">
                              <Sparkles className="h-8 w-8 text-cyan animate-pulse-slow" />
                            </div>
                            <p className="text-gray-400 text-sm">Generating your masterpiece...</p>
                          </div>
                        ) : (
                          <div className="text-center p-6">
                            <Image className="h-12 w-12 text-gray-500 mx-auto mb-4 opacity-40" />
                            <p className="text-gray-500">Your generated image will appear here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="video" className="mt-0">
                  <div className="text-center py-12">
                    <Video className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">Video Generation</h3>
                    <p className="text-gray-400 mb-6">Transform your images into fluid videos</p>
                    <Button className="bg-cyan hover:bg-cyan-dark text-dark-500 font-medium btn-glow">
                      <Wand2 className="mr-2 h-5 w-5" />
                      Upload Image
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="voice" className="mt-0">
                  <div className="text-center py-12">
                    <Mic className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">Voice Cloning</h3>
                    <p className="text-gray-400 mb-6">Clone any voice with just seconds of audio</p>
                    <Button className="bg-cyan hover:bg-cyan-dark text-dark-500 font-medium btn-glow">
                      <Wand2 className="mr-2 h-5 w-5" />
                      Upload Audio Sample
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenerationSection;
