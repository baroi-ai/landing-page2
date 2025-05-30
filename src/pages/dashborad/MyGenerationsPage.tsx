// src/pages/dashboard/MyGenerationsPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import Masonry from "react-masonry-css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Image as ImageIcon,
  Video,
  AudioLines,
  Box,
  LayoutGrid,
  Loader2,
  AlertCircle,
  MoreHorizontal,
  Download,
  Trash2,
  Info,
  Package,
  X as XIcon,
  CalendarDays,
  Tags,
  FileText,
} from "lucide-react";
import { format } from "date-fns";

// --- Define Generation Item Structure ---
interface GenerationItem {
  id: string;
  type: "image" | "video" | "audio" | "3d";
  prompt: string;
  previewUrl: string;
  downloadUrl?: string;
  createdAt: string;
  modelName?: string;
  details?: Record<string, any>;
}

// --- Mock Data ---
const MOCK_GENERATIONS: GenerationItem[] = [
  {
    id: "img1",
    type: "image",
    prompt: "A neon-lit cyberpunk cityscape at rainy night, high detail",
    previewUrl: "https://images.unsplash.com/photo-1741850826386-9cb8e5543c73",
    downloadUrl: "https://images.unsplash.com/photo-1741850826386-9cb8e5543c73",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    modelName: "Flux Dev",
    details: { resolution: "1024x1024", steps: 30 },
  },
  {
    id: "vid1",
    type: "video",
    prompt: "A cat riding a skateboard, cinematic",
    previewUrl:
      "https://cdn.hailuoai.video/moss/prod/2025-03-21-19/official/pgc_bot_avatar/1742556390483537285-迪士尼旋转.mp4",
    downloadUrl:
      "https://cdn.hailuoai.video/moss/prod/2025-03-21-19/official/pgc_bot_avatar/1742556390483537285-迪士尼旋转.mp4",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    modelName: "Hunyuan",
    details: { duration: "5s", fps: 24 },
  },
  {
    id: "img2",
    type: "image",
    prompt: "Impressionist painting of a sunflower field under a blue sky",
    previewUrl: "https://images.unsplash.com/photo-1742268350465-35d7baae61fa",
    downloadUrl: "https://images.unsplash.com/photo-1742268350465-35d7baae61fa",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    modelName: "Stable Diffusion XL",
  },
  {
    id: "aud1",
    type: "audio",
    prompt: "Generate calm ambient background music",
    previewUrl: "https://source.unsplash.com/random/800x200?waveform,sound",
    downloadUrl: "/placeholder-audio.mp3",
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    modelName: "MusicGen",
    details: { duration: "30s", format: "MP3" },
  },
  {
    id: "3d1",
    type: "3d",
    prompt: "A low-poly stylized treasure chest",
    previewUrl: "https://source.unsplash.com/random/600x600?3d,chest,lowpoly",
    downloadUrl: "/placeholder-model.glb",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    modelName: "3D Genesis",
    details: { format: "GLB", polygons: 1500 },
  },
  {
    id: "img3",
    type: "image",
    prompt:
      "Photorealistic portrait of an astronaut looking at Earth from the moon",
    previewUrl: "https://images.unsplash.com/photo-1741988766604-04b6f1b3236d",
    downloadUrl: "https://images.unsplash.com/photo-1741988766604-04b6f1b3236d",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    modelName: "Flux Dev",
  },
  {
    id: "img4",
    type: "image",
    prompt: "Watercolor illustration of a red panda sleeping on a branch",
    previewUrl:
      "https://plus.unsplash.com/premium_photo-1727456264011-fb8d5f547c6d",
    downloadUrl:
      "https://plus.unsplash.com/premium_photo-1727456264011-fb8d5f547c6d",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    modelName: "Stable Diffusion XL",
  },
];

// --- Masonry Breakpoints ---
const breakpointColumnsObj = {
  default: 5,
  1536: 4,
  1280: 3,
  1024: 3,
  768: 2,
  640: 1,
};

// --- Helper to get Icon based on type ---
const getTypeIcon = (
  type: GenerationItem["type"]
): React.ReactElement | null => {
  // Explicitly return ReactElement or null
  switch (type) {
    case "image":
      return <ImageIcon className="h-4 w-4" />;
    case "video":
      return <Video className="h-4 w-4" />;
    case "audio":
      return <AudioLines className="h-4 w-4" />;
    case "3d":
      return <Box className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />; // Return default icon directly
  }
};

// --- Tab Definitions ---
type GenerationType = GenerationItem["type"];
type TabValue = "image" | "video" | "audio" | "others";
const PRIMARY_TABS: TabValue[] = ["image", "video", "audio"];

const MyGenerationsPage = () => {
  const [allGenerations, setAllGenerations] = useState<GenerationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>("image");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GenerationItem | null>(null);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAllGenerations(MOCK_GENERATIONS);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Filter Generations ---
  const filteredGenerations = useMemo(() => {
    if (activeTab === "others") {
      return allGenerations.filter(
        (item) => !PRIMARY_TABS.includes(item.type as TabValue)
      );
    }
    return allGenerations.filter((item) => item.type === activeTab);
  }, [activeTab, allGenerations]);

  // --- Action Handlers ---
  const handleDownload = (item: GenerationItem | null) => {
    if (!item || !item.downloadUrl || item.downloadUrl === "#") {
      console.warn("No download URL for item:", item?.id);
      return;
    }
    console.log("Downloading:", item.id, item.downloadUrl);
    window.open(item.downloadUrl, "_blank");
  };

  const handleDelete = (itemId: string | null) => {
    if (!itemId) return;
    console.log("Deleting:", itemId);
    setAllGenerations((prev) => prev.filter((item) => item.id !== itemId));
    if (selectedItem?.id === itemId) {
      setIsModalOpen(false);
      setSelectedItem(null);
    }
  };

  const handleViewDetails = (item: GenerationItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // --- Render Grid or Messages ---
  const renderGridOrMessages = (items: GenerationItem[]) => {
    if (items.length === 0) {
      const typeText = activeTab === "others" ? "other" : activeTab;
      return (
        <div className="text-center py-20 text-muted-foreground">
          <LayoutGrid className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No {typeText} generations found.</p>
        </div>
      );
    }

    return (
      <TooltipProvider>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid flex w-auto -ml-4"
          columnClassName="my-masonry-grid_column bg-clip-padding px-2"
        >
          {items.map((item) => {
            const itemIcon = getTypeIcon(item.type); // Get icon once

            return (
              <Card
                key={item.id}
                className="mb-4 overflow-hidden group relative bg-dark-600 border border-dark-400 hover:border-dark-300 shadow-sm hover:shadow-md transition-all"
              >
                <CardContent className="p-0">
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <div
                        className="block w-full cursor-pointer"
                        onClick={() => handleViewDetails(item)}
                      >
                        {item.type === "image" && (
                          <img
                            src={item.previewUrl}
                            alt={item.prompt.substring(0, 50)}
                            className="w-full h-auto block object-cover"
                            loading="lazy"
                          />
                        )}
                        {item.type === "video" && (
                          <div className="relative aspect-video bg-black">
                            <video
                              poster={item.previewUrl}
                              src={item.downloadUrl || item.previewUrl}
                              className="w-full h-full object-cover"
                              loop
                              muted
                              playsInline
                              preload="metadata"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              {itemIcon &&
                                React.cloneElement(itemIcon, {
                                  className: "h-12 w-12 text-white/80",
                                })}
                            </div>
                          </div>
                        )}
                        {(item.type === "audio" || item.type === "3d") && (
                          <div className="relative aspect-video bg-dark-500 flex items-center justify-center">
                            {item.previewUrl ? (
                              <img
                                src={item.previewUrl}
                                alt={`${item.type} preview`}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
                                loading="lazy"
                              />
                            ) : (
                              // Render placeholder icon directly
                              itemIcon && (
                                <div className="h-16 w-16 text-muted-foreground/50 flex items-center justify-center">
                                  {React.cloneElement(itemIcon, {
                                    className: "h-16 w-16",
                                  })}
                                </div>
                              )
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              {/* Render hover icon */}
                              {itemIcon &&
                                React.cloneElement(itemIcon, {
                                  className: "h-12 w-12 text-white/80",
                                })}
                            </div>
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="max-w-xs bg-black text-white border-slate-700"
                    >
                      <p className="text-xs">{item.prompt}</p>
                    </TooltipContent>
                  </Tooltip>
                </CardContent>
                <CardFooter className="p-2 bg-dark-500/30 flex justify-between items-center">
                  <Badge
                    variant="secondary"
                    className="capitalize flex items-center gap-1 text-xs py-0.5 px-1.5 border border-transparent"
                  >
                    {itemIcon} {/* Render the icon directly */}
                    {item.type}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:bg-dark-400 hover:text-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" />{" "}
                        <span className="sr-only">Options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-dark-600 border-dark-400 text-foreground"
                    >
                      <DropdownMenuItem
                        onClick={() => handleDownload(item)}
                        disabled={!item.downloadUrl || item.downloadUrl === "#"}
                        className="cursor-pointer hover:bg-dark-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="mr-2 h-4 w-4" />{" "}
                        <span>Download</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:!bg-red-900/50 hover:!text-red-400 cursor-pointer focus:!bg-red-900/60 focus:!text-red-300"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            );
          })}
        </Masonry>
      </TooltipProvider>
    );
  }; // <--- Make sure this closing brace and semicolon are correct

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-10">
        {/* --- Header --- */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
          <LayoutGrid className="h-8 w-8 text-cyan-500" />
          My Generations
        </h1>

        {/* --- Loading / Error State --- */}
        {isLoading && (
          <div className="flex justify-center items-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mr-2" /> Loading...
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center py-20 text-destructive">
            <AlertCircle className="h-10 w-10 mb-2" />
            <p>Error: {error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        )}

        {/* --- Tabs and Content --- */}
        {!isLoading && !error && (
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as TabValue)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-dark-700 border border-dark-500">
              <TabsTrigger
                value="image"
                className="data-[state=active]:bg-dark-500 data-[state=active]:text-foreground flex items-center gap-1.5"
              >
                <ImageIcon size={16} /> Image
              </TabsTrigger>
              <TabsTrigger
                value="video"
                className="data-[state=active]:bg-dark-500 data-[state=active]:text-foreground flex items-center gap-1.5"
              >
                <Video size={16} /> Video
              </TabsTrigger>
              <TabsTrigger
                value="audio"
                className="data-[state=active]:bg-dark-500 data-[state=active]:text-foreground flex items-center gap-1.5"
              >
                <AudioLines size={16} /> Audio
              </TabsTrigger>
              <TabsTrigger
                value="others"
                className="data-[state=active]:bg-dark-500 data-[state=active]:text-foreground flex items-center gap-1.5"
              >
                <Package size={16} /> Others
              </TabsTrigger>
            </TabsList>
            {renderGridOrMessages(filteredGenerations)}
          </Tabs>
        )}
      </div>

      {/* --- Details Modal --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col sm:flex-row p-0 gap-0 bg-dark-700 border-dark-500 text-foreground">
          {selectedItem && (
            <>
              {/* Preview Area */}
              <div className="flex-[3] bg-black flex items-center justify-center overflow-hidden relative sm:rounded-l-lg">
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-gray-400 hover:text-white bg-black/30 hover:bg-black/60 z-10 rounded-full h-8 w-8"
                    aria-label="Close"
                  >
                    <XIcon size={18} />
                  </Button>
                </DialogClose>

                {selectedItem.type === "image" && (
                  <img
                    src={selectedItem.downloadUrl || selectedItem.previewUrl}
                    alt={selectedItem.prompt}
                    className="max-w-full max-h-full h-auto w-auto object-contain"
                  />
                )}
                {selectedItem.type === "video" && (
                  <video
                    src={selectedItem.downloadUrl || selectedItem.previewUrl}
                    controls
                    autoPlay
                    className="max-w-full max-h-full h-auto w-auto object-contain"
                    poster={selectedItem.previewUrl}
                  />
                )}
                {selectedItem.type === "audio" && (
                  <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center">
                    {selectedItem.previewUrl && (
                      <img
                        src={selectedItem.previewUrl}
                        alt="Audio waveform"
                        className="max-w-full h-auto mb-4 opacity-80 max-h-[50%]"
                      />
                    )}
                    <AudioLines size={48} className="text-cyan-400 mb-4" />
                    <p className="text-lg font-semibold mb-4">Audio Preview</p>
                    {selectedItem.downloadUrl &&
                    selectedItem.downloadUrl !== "#" ? (
                      <audio
                        src={selectedItem.downloadUrl}
                        controls
                        className="w-full max-w-md"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Preview unavailable
                      </p>
                    )}
                  </div>
                )}
                {selectedItem.type === "3d" && (
                  <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center">
                    {selectedItem.previewUrl ? (
                      <img
                        src={selectedItem.previewUrl}
                        alt={`${selectedItem.type} preview`}
                        className="max-w-full h-auto mb-4 max-h-[70%]"
                      />
                    ) : (
                      // Render placeholder icon
                      getTypeIcon(selectedItem.type) && (
                        <div className="h-24 w-24 text-muted-foreground/50 mb-4 flex items-center justify-center">
                          {React.cloneElement(getTypeIcon(selectedItem.type)!, {
                            className: "h-24 w-24",
                          })}
                        </div>
                      )
                    )}
                    <p className="text-lg font-semibold capitalize">
                      {selectedItem.type} Preview
                    </p>
                    {/* Add 3D viewer component here if available */}
                    {!selectedItem.downloadUrl ||
                    selectedItem.downloadUrl === "#" ? (
                      <p className="text-sm text-muted-foreground mt-2">
                        Download not available
                      </p>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleDownload(selectedItem)}
                        className="mt-4"
                      >
                        {" "}
                        <Download className="mr-2 h-4 w-4" /> Download{" "}
                        {selectedItem.type}{" "}
                      </Button>
                    )}
                  </div>
                )}
                {/* Add rendering for other types under 'others' if necessary */}
              </div>

              {/* Details Sidebar */}
              <div className="flex-[1] p-4 sm:p-6 flex flex-col overflow-y-auto border-l border-dark-500/50">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-xl flex items-center gap-2 capitalize">
                    {getTypeIcon(selectedItem.type)} {/* Use helper */}
                    {selectedItem.type} Details
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 text-sm flex-grow">
                  {/* Prompt */}
                  <div className="space-y-1">
                    <div className="font-medium text-muted-foreground flex items-center gap-1.5">
                      <FileText size={14} /> Prompt
                    </div>
                    <p className="text-foreground bg-dark-600/50 p-2 rounded border border-dark-400/50 text-xs leading-relaxed">
                      {selectedItem.prompt}
                    </p>
                  </div>
                  {/* Model */}
                  {selectedItem.modelName && (
                    <div className="space-y-1">
                      <div className="font-medium text-muted-foreground flex items-center gap-1.5">
                        <Tags size={14} /> Model
                      </div>
                      <p>{selectedItem.modelName}</p>
                    </div>
                  )}
                  {/* Created Date */}
                  <div className="space-y-1">
                    <div className="font-medium text-muted-foreground flex items-center gap-1.5">
                      <CalendarDays size={14} /> Created
                    </div>
                    <p>{format(new Date(selectedItem.createdAt), "PPpp")}</p>
                  </div>
                  {/* Extra Details */}
                  {selectedItem.details &&
                    Object.keys(selectedItem.details).length > 0 && (
                      <div className="space-y-1 pt-2 border-t border-dark-500/30">
                        <div className="font-medium text-muted-foreground mb-1">
                          Parameters
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                          {Object.entries(selectedItem.details).map(
                            ([key, value]) => (
                              <div key={key}>
                                <span className="text-muted-foreground capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}:{" "}
                                </span>{" "}
                                {/* Trim added */}
                                <span className="text-foreground">
                                  {String(value)}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {/* Actions Footer */}
                <DialogFooter className="mt-6 pt-4 border-t border-dark-500/30 flex flex-col sm:flex-row sm:justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(selectedItem)}
                    disabled={
                      !selectedItem.downloadUrl ||
                      selectedItem.downloadUrl === "#"
                    }
                  >
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(selectedItem.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}; // <--- Make sure this closing brace and semicolon are correct

export default MyGenerationsPage;
