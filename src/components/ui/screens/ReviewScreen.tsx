import { useState } from "react";
import { useLocation } from "wouter";
import { useMyStore } from "../../../store/store.ts";
import {
  generateImage,
  convertToSplat,
  polishEnvironment,
} from "../../../services/aiPipeline.ts";

export const ReviewScreen = () => {
  const generatedImage = useMyStore((state) => state.generatedImage);
  const prompt = useMyStore((state) => state.prompt);
  const setGeneratedImage = useMyStore((state) => state.setGeneratedImage);
  const setSceneUrl = useMyStore((state) => state.setSceneUrl);

  const [refinementPrompt, setRefinementPrompt] = useState(prompt);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pipelineStatus, setPipelineStatus] = useState("");
    const [selectedModel, setSelectedModel] = useState<"Marble 0.1-mini" | "Marble 0.1-plus">("Marble 0.1-mini");
    const [, setLocation] = useLocation();

  const handleReroll = async () => {
    setIsProcessing(true);
    setPipelineStatus("> Re-initializing Nano Banana...");
    try {
      const newUrl = await generateImage(refinementPrompt);
      setGeneratedImage(newUrl);
      setPipelineStatus("");
    } catch (e: unknown) {
      console.error(e);
      setPipelineStatus(`Error: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnterWorld = async () => {
    if (!generatedImage) return;

    setIsProcessing(true);

    try {
      setPipelineStatus(
        `> Marble World Labs (${selectedModel}): Converting to Splat...`,
      );
      const splatUrl = await convertToSplat(generatedImage, selectedModel);

      setPipelineStatus("> Decart Realtime: Polishing environment...");
      const polishedUrl = await polishEnvironment(splatUrl);

      setSceneUrl(polishedUrl);
      useMyStore.getState().setGameStatus("intro");
      setLocation("/world");
    } catch (e: unknown) {
      console.error(e);
      setPipelineStatus(`Error: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!generatedImage) {
    return (
      <div className="text-white">
        No image generated. Please return to start.
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-10 flex flex-col md:flex-row bg-black text-white font-mono">
      {/* Image Preview */}
      <div className="w-full md:w-2/3 h-1/2 md:h-full relative bg-gray-900 flex items-center justify-center overflow-hidden">
        <img
          src={generatedImage}
          alt="Generated World"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/50 to-transparent" />
      </div>

      {/* Controls */}
      <div className="w-full md:w-1/3 p-8 flex flex-col justify-between border-l border-gray-800 bg-black/90 backdrop-blur-sm">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-blue-400">
            Step 2: REVIEW & MATERIALIZE
          </h2>

          <div className="space-y-4 mb-8">
            <label className="block text-xs uppercase tracking-widest text-gray-500">
              Refine Prompt
            </label>
            <textarea
              className="w-full bg-black border border-gray-700 p-3 text-sm text-white focus:border-blue-500 focus:outline-none h-24 resize-none rounded-none"
              value={refinementPrompt}
              onChange={(e) => setRefinementPrompt(e.target.value)}
              disabled={isProcessing}
            />
            <button
              onClick={handleReroll}
              disabled={isProcessing}
              className="w-full py-2 border border-gray-600 text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Regenerate (Re-roll)
            </button>
          </div>

          {/* Model Selection */}
          <div className="space-y-2 mb-8">
            <label className="block text-xs uppercase tracking-widest text-gray-500">
              Splat Model
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedModel("Marble 0.1-plus")}
                className={`flex-1 py-2 text-xs font-bold border ${selectedModel === "Marble 0.1-plus" ? "bg-blue-600 border-blue-600 text-white" : "bg-black border-gray-700 text-gray-400"}`}
                disabled={isProcessing}
              >
                PLUS (Quality)
              </button>
              <button
                onClick={() => setSelectedModel("Marble 0.1-mini")}
                className={`flex-1 py-2 text-xs font-bold border ${selectedModel === "Marble 0.1-mini" ? "bg-blue-600 border-blue-600 text-white" : "bg-black border-gray-700 text-gray-400"}`}
                disabled={isProcessing}
              >
                MINI (Speed)
              </button>
            </div>
          </div>
        </div>

        <div>
          {pipelineStatus && (
            <div className="mb-4 text-xs text-green-400 font-mono animate-pulse break-words">
              {pipelineStatus}
            </div>
          )}

          <button
            onClick={handleEnterWorld}
            disabled={isProcessing}
            className={`
                w-full py-4 text-xl font-bold uppercase tracking-widest
                ${
                  isProcessing
                    ? "bg-gray-800 text-gray-500"
                    : "bg-white text-black hover:bg-blue-400 hover:text-white"
                }
                transition-all cursor-pointer border-2 border-white
                `}
          >
            {isProcessing ? "MATERIALIZING..." : "ENTER WORLD"}
          </button>
        </div>
      </div>
    </div>
  );
};
