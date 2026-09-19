import React from "react";
import { X } from "lucide-react";

export function VideoPreviewModal({ isOpen, videoUrl, onClose }) {
  if (!isOpen || !videoUrl) return null;

  const embedUrl = videoUrl
    .replace("watch?v=", "embed/")
    .replace("shorts/", "embed/");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="max-w-4xl w-full bg-[#0d0d0d] border border-white/15 rounded-[24px] p-6 space-y-4 relative shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[#B3FFC9] font-semibold">Video Preview Player</span>
          <button onClick={onClose} className="p-1 text-white/60 hover:text-white cursor-pointer">
            <X size={20} />
          </button>
        </div>
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
          <iframe
            src={embedUrl}
            title="Video Preview"
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </div>
    </div>
  );
}
