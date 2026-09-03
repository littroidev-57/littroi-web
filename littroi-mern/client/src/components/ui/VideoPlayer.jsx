import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { cn } from "../../utils/helpers";

export function VideoPlayer({
  src,
  poster,
  aspectRatio = "16/9", // "16/9", "9/16", "4/3", "1/1"
  autoPlayMuted = true,
  className = "",
  showControls = true,
  title = "Video player"
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Lazy loading with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (autoPlayMuted && videoRef.current) {
            videoRef.current.play().then(() => {
              setIsPlaying(true);
            }).catch(() => {
              setIsPlaying(false);
            });
          }
        } else {
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [autoPlayMuted, isIntersecting]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.log("Playback failed:", err));
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullScreen = (e) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen().catch(err => console.log(err));
    }
  };

  const aspectClasses = {
    "16/9": "aspect-video",
    "9/16": "aspect-[9/16] max-h-[580px]",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square"
  };

  return (
    <div
      ref={containerRef}
      onClick={togglePlay}
      className={cn(
        "relative rounded-2xl overflow-hidden bg-brand-surface border border-white/10 group cursor-pointer select-none",
        aspectClasses[aspectRatio] || "aspect-video",
        className
      )}
    >
      {/* Background Poster Image */}
      {poster && (
        <img
          src={poster}
          alt={title}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
            isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
          loading="lazy"
        />
      )}

      {/* Video Element */}
      {isIntersecting && src && !hasError && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={isMuted}
          playsInline
          loop
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      )}

      {/* Overlay & Controls */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-between p-4 transition-opacity duration-300",
        isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100 bg-black/40"
      )}>
        {/* Top bar info */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-white/70 tracking-wider uppercase bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
            {aspectRatio === "9/16" ? "Short / Reel" : "Video"}
          </span>
          {showControls && (
            <button
              onClick={toggleMute}
              title={isMuted ? "Unmute" : "Mute"}
              className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors border border-white/10"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          )}
        </div>

        {/* Center Play/Pause button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={cn(
            "w-16 h-16 rounded-full bg-brand-primary/90 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-300 transform border border-white/20",
            isPlaying ? "scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100" : "scale-100 opacity-100 animate-pulse-glow"
          )}>
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1 fill-white" />}
          </div>
        </div>

        {/* Bottom bar controls */}
        {showControls && (
          <div className="flex items-center justify-between text-white/90 text-xs mt-auto">
            <span className="font-medium truncate max-w-[70%]">{title}</span>
            <button
              onClick={handleFullScreen}
              title="Fullscreen"
              className="p-1.5 rounded-lg bg-black/40 hover:bg-black/70 text-white transition-colors"
            >
              <Maximize size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
