import { useEffect, useRef, useState } from "react";
import { captureCanvasStream, decartService } from "../services/decartService";
import { useMyStore } from "../store/store";

interface DecartStreamProps {
  canvasId: string;
}

export const DecartStream = ({ canvasId }: DecartStreamProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sourceVideoRef = useRef<HTMLVideoElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prompt = useMyStore((state) => state.prompt);
  const [currentPrompt, setCurrentPrompt] = useState(prompt || "");
  const clientRef = useRef<any>(null); // Store the realtime client

  useEffect(() => {
    if (prompt) setCurrentPrompt(prompt);
  }, [prompt]);

  useEffect(() => {
    const startStream = async () => {
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      if (!canvas) {
        setError("Canvas not found");
        return;
      }

      try {
        const stream = captureCanvasStream(canvas, 25);
        
        if (sourceVideoRef.current) {
          sourceVideoRef.current.srcObject = stream;
        }

        clientRef.current = await decartService.connect(
          stream,
          (remoteStream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = remoteStream;
              setIsConnected(true);
            }
          },
          prompt || "Cinematic lighting, high fidelity, 8k"
        );

      } catch (err: any) {
        console.error("Decart connection failed:", err);
        setError(err.message || "Failed to connect to Decart");
      }
    };

    // Small delay to ensure canvas is ready/rendered
    const timer = setTimeout(startStream, 1000);

    return () => {
      clearTimeout(timer);
      if (clientRef.current) {
        console.log("Disconnecting Decart...");
        clientRef.current.disconnect();
      }
    };
  }, [canvasId]); // Connect only once on mount

  const handlePromptSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (clientRef.current && isConnected) {
          console.log("Updating Decart prompt:", currentPrompt);
          clientRef.current.setPrompt(currentPrompt);
      }
  };

  if (error) {
    return (
      <div className="absolute top-4 left-4 bg-red-900/80 text-white p-2 text-xs font-mono border border-red-500 pointer-events-none">
        POLISH ERROR: {error}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* 
        The video sits on top of the canvas. 
        pointer-events-none ensures clicks go through to the canvas below.
      */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted // Muted to avoid autoplay blocks, though audio isn't used
        className={`w-full h-full object-cover transition-opacity duration-1000 ${isConnected ? "opacity-100" : "opacity-0"}`}
      />

      {/* Source Preview Thumbnail */}
      <div className="absolute top-4 right-4 w-48 aspect-video border border-blue-500/50 bg-black overflow-hidden pointer-events-auto">
          <div className="absolute top-0 left-0 z-20 bg-blue-600 text-[10px] px-1 font-bold">SOURCE_FEED</div>
          <video
            ref={sourceVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover opacity-60"
          />
      </div>
      
      {!isConnected && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="text-blue-400 font-mono text-sm animate-pulse">
                  ESTABLISHING NEURAL LINK...
              </div>
          </div>
      )}

      {isConnected && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-lg pointer-events-auto">
              <form onSubmit={handlePromptSubmit} className="flex gap-2">
                  <input 
                    type="text" 
                    value={currentPrompt}
                    onChange={(e) => setCurrentPrompt(e.target.value)}
                    className="flex-1 bg-black/50 backdrop-blur-md border border-gray-600 text-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none rounded-none"
                    placeholder="Describe the visual style..."
                  />
                  <button 
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 text-xs font-bold uppercase tracking-wider hover:bg-blue-500 transition-colors cursor-pointer"
                  >
                    UPDATE
                  </button>
              </form>
          </div>
      )}
    </div>
  );
};
