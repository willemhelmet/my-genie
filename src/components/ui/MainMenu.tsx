import { useState } from "react";
import { useLocation } from "wouter";
import { useMyStore } from "../../store/store.ts";
import { Instructions } from "./Instructions.tsx";
import { communityTemplates, type WorldTemplate } from "../../data/templates.ts";
import { loadTemplateWorld } from "../../services/aiPipeline.ts";

export const MainMenu = () => {
  const isMobile = useMyStore((state) => state.isMobile);
  const setSceneUrl = useMyStore((state) => state.setSceneUrl);
  const setPrompt = useMyStore((state) => state.setPrompt);
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState<string | null>(null); // Stores ID of loading template

  const handleCreateNew = () => {
    setLocation("/generate");
  };

  const handleSelectTemplate = async (template: WorldTemplate) => {
    setIsLoading(template.id);
    try {
      const splatUrl = await loadTemplateWorld(template.id);
      
      // Update Store
      setSceneUrl(splatUrl);
      setPrompt(template.defaultPrompt);
      
      // Set status to intro for the "Click to Begin" overlay
      useMyStore.getState().setGameStatus("intro");
      
      // Navigate
      setLocation("/world");
    } catch (e) {
      console.error("Failed to load template:", e);
      setIsLoading(null);
      // Optional: Show error toast
    }
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-12 bg-black text-white p-8 font-mono overflow-y-auto">
      
      {/* Hero Section */}
      <div className="text-center space-y-4 mt-8">
        <h1 className="text-7xl font-bold tracking-tighter text-white">GYRE</h1>
        <p className="text-xl text-blue-400 uppercase tracking-widest">AI-Powered World Creation</p>
      </div>

      {/* Split Layout */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Creation Path */}
        <div className="flex flex-col items-center justify-center border border-gray-800 p-8 bg-gray-900/30 backdrop-blur-sm gap-6">
            <div className="text-2xl font-bold">CREATE NEW</div>
            <p className="text-center text-gray-400 text-sm h-12">
                Generate a world from scratch using Nano Banana AI or upload your own image.
            </p>
            <button
                className="px-8 py-4 text-lg font-bold text-black bg-white hover:bg-blue-400 hover:text-white transition-all cursor-pointer border-2 border-white w-full max-w-xs"
                onClick={handleCreateNew}
            >
                INITIALIZE
            </button>
        </div>

        {/* Community Templates */}
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">COMMUNITY WORLDS</h2>
                <div className="text-xs text-gray-500 uppercase">SELECT TO JOIN</div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {communityTemplates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template)}
                        disabled={!!isLoading}
                        className={`
                            group flex items-center gap-4 p-2 border border-gray-800 hover:border-blue-500 bg-gray-900/50 transition-all text-left
                            ${isLoading === template.id ? "opacity-50 cursor-wait" : "cursor-pointer"}
                        `}
                    >
                        <div className="w-24 h-16 bg-gray-800 overflow-hidden flex-shrink-0">
                            <img src={template.thumbnailUrl} alt={template.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-blue-400 group-hover:text-white transition-colors">{template.name}</h3>
                            <p className="text-xs text-gray-500 line-clamp-1">{template.defaultPrompt}</p>
                        </div>
                        {isLoading === template.id && (
                            <div className="text-xs text-blue-400 animate-pulse mr-2">LOADING...</div>
                        )}
                    </button>
                ))}
            </div>
        </div>

      </div>

      <div className="mt-auto pb-4 text-xs text-gray-700">
         v0.1.0 • POWERED BY MARBLE & DECART
      </div>

      <div className="absolute bottom-4 right-4">
         <Instructions isMobile={isMobile} />
      </div>
    </div>
  );
};