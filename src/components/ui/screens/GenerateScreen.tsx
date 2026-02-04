import { useState } from "react";
import { useLocation } from "wouter";
import { useMyStore } from "../../../store/store.ts";
import { generateImage } from "../../../services/aiPipeline.ts";
import { ImageUploadZone } from "../ImageUploadZone.tsx";

export const GenerateScreen = () => {
  const [inputPrompt, setInputPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setPrompt = useMyStore((state) => state.setPrompt);
  const setGeneratedImage = useMyStore((state) => state.setGeneratedImage);
  const generatedImage = useMyStore((state) => state.generatedImage);
  const [, setLocation] = useLocation();

  const handleGenerate = async () => {
    if (!inputPrompt) return;

    setIsGenerating(true);
    setError(null);
    setPrompt(inputPrompt);

    try {
      const imageUrl = await generateImage(inputPrompt);
      setGeneratedImage(imageUrl);
      setLocation("/review");
    } catch (error: any) {
      console.error("Generation failed:", error);
      setError(error.message || "Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageSelect = (file: File) => {
    console.log("File selected:", file.name, file.size, file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setGeneratedImage(dataUrl);
        setPrompt("User uploaded image"); 
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProceed = () => {
    setLocation("/review");
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black text-white p-8 font-mono overflow-y-auto">
      <div className="w-full max-w-4xl bg-gray-900/50 backdrop-blur-md border border-gray-800 p-8 rounded-lg shadow-2xl flex flex-col md:flex-row gap-8">
        
        {/* Left: AI Generation */}
        <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-blue-400">OPTION A: GENERATE</h2>
            <textarea
                className="w-full bg-black border border-gray-700 p-4 text-sm text-white focus:border-blue-500 focus:outline-none h-32 resize-none rounded-none"
                placeholder="Describe the world you want to create..."
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                disabled={isGenerating}
            />
            <button
                onClick={handleGenerate}
                disabled={isGenerating || !inputPrompt}
                className={`
                w-full py-3 text-sm font-bold uppercase tracking-wider
                ${isGenerating 
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"}
                transition-all border border-blue-600
                `}
            >
                {isGenerating ? "Processing..." : "Initiate Generation"}
            </button>
             {isGenerating && (
                <div className="mt-4 text-xs text-gray-500 font-mono animate-pulse">
                    {'>'} Nano Banana Protocol: ACTIVE
                    <br/>
                    {'>'} Synthesizing pixels...
                </div>
            )}
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-800 hidden md:block"></div>
        <div className="h-px w-full bg-gray-800 md:hidden"></div>

        {/* Right: Upload */}
        <div className="flex-1 flex flex-col gap-4">
             <h2 className="text-xl font-bold text-gray-400">OPTION B: UPLOAD</h2>
             
             {!generatedImage ? (
                 <ImageUploadZone onImageSelect={handleImageSelect} />
             ) : (
                 <div className="flex flex-col gap-4">
                     <div className="aspect-video w-full bg-black border border-gray-700 relative overflow-hidden group">
                         <img src={generatedImage} alt="Preview" className="w-full h-full object-cover opacity-80" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                                onClick={() => setGeneratedImage(null)}
                                className="text-xs border border-white px-3 py-1 hover:bg-white hover:text-black transition-colors cursor-pointer"
                             >
                                REPLACE
                             </button>
                         </div>
                     </div>
                     <button
                        onClick={handleProceed}
                        className="w-full py-3 bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-all border border-white cursor-pointer"
                     >
                        Proceed to Review
                     </button>
                 </div>
             )}
        </div>

      </div>
      
      {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-500 text-red-400 text-sm max-w-2xl w-full">
            {error}
          </div>
        )}
    </div>
  );
};