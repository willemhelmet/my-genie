import { useState } from "react";
import { useLocation } from "wouter";
import { useMyStore } from "../../../store/store.ts";
import { generateImage } from "../../../services/aiPipeline.ts";

export const GenerateScreen = () => {
  const [inputPrompt, setInputPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setPrompt = useMyStore((state) => state.setPrompt);
  const setGeneratedImage = useMyStore((state) => state.setGeneratedImage);
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

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black text-white p-8 font-mono">
      <div className="w-full max-w-2xl bg-gray-900/50 backdrop-blur-md border border-gray-800 p-8 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-blue-400">
          Step 1: DEFINE REALITY
        </h2>

        <div className="space-y-4">
          <label className="block text-xs uppercase tracking-widest text-gray-500">
            Enter Prompt
          </label>
          <textarea
            className="w-full bg-black border border-gray-700 p-4 text-lg text-white focus:border-blue-500 focus:outline-none h-32 resize-none rounded-none"
            placeholder="Describe the world you want to create..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isGenerating}
          />
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-500 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !inputPrompt}
            className={`
              px-8 py-3 text-lg font-bold uppercase tracking-wider
              ${
                isGenerating
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
              }
              transition-all border border-blue-600
            `}
          >
            {isGenerating ? "Processing..." : "Initiate Generation"}
          </button>
        </div>

        {isGenerating && (
          <div className="mt-4 text-xs text-gray-500 font-mono animate-pulse">
            {">"} Nano Banana Protocol: ACTIVE
            <br />
            {">"} Synthesizing pixels...
          </div>
        )}
      </div>
    </div>
  );
};

