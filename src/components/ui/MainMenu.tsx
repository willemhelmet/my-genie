import { useLocation } from "wouter";
import { useMyStore } from "../../store/store.ts";
import { Instructions } from "./Instructions.tsx";

export const MainMenu = () => {
  const isMobile = useMyStore((state) => state.isMobile);
  const [, setLocation] = useLocation();

  const handleStart = () => {
    setLocation("/generate");
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-black text-white p-4 font-mono">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold tracking-tighter text-white">
          MY GENIE
        </h1>
        <p className="text-xl text-blue-400">AI-Powered World Creation</p>
      </div>

      {/* Main Action */}
      <button
        className="px-8 py-4 text-xl font-bold text-black bg-white rounded-none hover:bg-blue-400 hover:text-white transition-colors cursor-pointer border-2 border-white"
        onClick={handleStart}
      >
        INITIALIZE NEW WORLD
      </button>

      {/* Gallery Placeholder */}
      <div className="mt-12 w-full max-w-4xl">
        <h2 className="text-sm text-gray-500 mb-4 uppercase tracking-widest">
          Community Worlds
        </h2>
        <div className="grid grid-cols-3 gap-4 opacity-50">
          {/* Placeholders */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-video bg-gray-900 border border-gray-800 flex items-center justify-center text-xs text-gray-700"
            >
              WORLD_DATA_0{i}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 right-4">
        <Instructions isMobile={isMobile} />
      </div>
    </div>
  );
};

