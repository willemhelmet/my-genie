import { useCallback, useRef, useState } from "react";

interface ImageUploadZoneProps {
  onImageSelect: (file: File) => void;
}

export const ImageUploadZone = ({ onImageSelect }: ImageUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          onImageSelect(file);
        }
      }
    },
    [onImageSelect],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        onImageSelect(e.target.files[0]);
      }
    },
    [onImageSelect],
  );

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`
        w-full p-8 border-2 border-dashed rounded-none transition-colors cursor-pointer flex flex-col items-center justify-center gap-4
        ${
          isDragging
            ? "border-blue-400 bg-blue-900/20"
            : "border-gray-700 hover:border-gray-500 bg-black/50"
        }
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept="image/*"
        className="hidden"
      />
      <div className="text-4xl text-gray-500">+</div>
      <div className="text-sm text-gray-400 font-mono text-center">
        DRAG IMAGE OR CLICK TO UPLOAD
      </div>
      <div className="text-xs text-gray-600 font-mono uppercase">
        JPG, PNG, WEBP
      </div>
    </div>
  );
};
