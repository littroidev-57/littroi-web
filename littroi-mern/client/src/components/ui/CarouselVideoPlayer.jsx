import React, { useState, useRef, useEffect, useCallback } from "react";

/**
 * CarouselVideoPlayer
 * 
 * Embeds a YouTube video within carousel cards and automatically manages playback:
 * - Plays/runs when visible in the viewport (both window scroll and horizontal slider scroll)
 * - Automatically pauses when scrolled OUT of the viewport
 * - Automatically resumes when scrolled back INTO the viewport
 * - Pauses when browser tab is inactive / hidden
 * - Pauses if another video on the page begins playing
 * - Provides a clean close button to dismiss playback
 */
export function CarouselVideoPlayer({
  videoId,
  title = "Video player",
  loadingLabel = "Loading video...",
  roundedClassName = "rounded-[22px]",
  onClose,
  sectionId = "carousel",
}) {
  const [loadingVideo, setLoadingVideo] = useState(true);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const pausedByViewportRef = useRef(false);
  const isMountedRef = useRef(true);

  // Send a postMessage command to the YouTube iframe
  const sendYouTubeCommand = useCallback((func, args = []) => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    try {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: func,
          args: args,
        }),
        "*"
      );
    } catch {
      // Cross-origin safety
    }
  }, []);

  const pauseVideo = useCallback(() => {
    sendYouTubeCommand("pauseVideo");
    // Retry to guarantee paused state even if YouTube API was buffering/initializing
    setTimeout(() => {
      if (isMountedRef.current) sendYouTubeCommand("pauseVideo");
    }, 150);
    setTimeout(() => {
      if (isMountedRef.current) sendYouTubeCommand("pauseVideo");
    }, 450);
  }, [sendYouTubeCommand]);

  const playVideo = useCallback(() => {
    sendYouTubeCommand("playVideo");
    setTimeout(() => {
      if (isMountedRef.current) sendYouTubeCommand("playVideo");
    }, 150);
  }, [sendYouTubeCommand]);

  // Check if this container is currently visible in the active viewport (vertical & horizontal)
  const isElementInViewport = useCallback(() => {
    if (!containerRef.current) return false;
    const rect = containerRef.current.getBoundingClientRect();
    const winH = window.innerHeight || document.documentElement.clientHeight;
    const winW = window.innerWidth || document.documentElement.clientWidth;

    // Must overlap both horizontal and vertical window bounds
    const vertVisible = rect.top < winH && rect.bottom > 0;
    const horizVisible = rect.left < winW && rect.right > 0;
    if (!vertVisible || !horizVisible) return false;

    // Calculate visible area ratio
    const visibleH = Math.min(rect.bottom, winH) - Math.max(rect.top, 0);
    const visibleW = Math.min(rect.right, winW) - Math.max(rect.left, 0);
    const visibleArea = Math.max(0, visibleH) * Math.max(0, visibleW);
    const totalArea = rect.width * rect.height;

    // Return true if at least 15% is visible
    return totalArea > 0 && visibleArea / totalArea >= 0.15;
  }, []);

  // Broadcast when this video starts, and listen for other videos playing
  useEffect(() => {
    isMountedRef.current = true;

    // Notify other video players that a new video started playing
    window.dispatchEvent(
      new CustomEvent("littroi:video:play", {
        detail: { videoId, sectionId },
      })
    );

    const handleOtherPlay = (e) => {
      if (e.detail?.videoId !== videoId) {
        // Another video started, pause this one
        pauseVideo();
        pausedByViewportRef.current = true;
      }
    };

    window.addEventListener("littroi:video:play", handleOtherPlay);
    return () => {
      isMountedRef.current = false;
      window.removeEventListener("littroi:video:play", handleOtherPlay);
    };
  }, [videoId, sectionId, pauseVideo]);

  // Tab visibility: pause when tab hidden, resume when tab visible (if in viewport)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        pauseVideo();
      } else if (document.visibilityState === "visible") {
        if (isElementInViewport() && pausedByViewportRef.current) {
          pausedByViewportRef.current = false;
          playVideo();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isElementInViewport, pauseVideo, playVideo]);

  // Viewport tracking (both IntersectionObserver and scroll listeners for horizontal slider)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkAndSync = () => {
      const inView = isElementInViewport();
      if (!inView) {
        if (!pausedByViewportRef.current) {
          pausedByViewportRef.current = true;
          pauseVideo();
        }
      } else {
        if (pausedByViewportRef.current) {
          pausedByViewportRef.current = false;
          playVideo();
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const inView = entry.isIntersecting && entry.intersectionRatio >= 0.15;
        if (!inView) {
          if (!pausedByViewportRef.current) {
            pausedByViewportRef.current = true;
            pauseVideo();
          }
        } else {
          if (pausedByViewportRef.current) {
            pausedByViewportRef.current = false;
            playVideo();
          }
        }
      },
      {
        threshold: [0, 0.15, 0.3, 0.6],
      }
    );

    observer.observe(container);

    // Listen to window scroll & resize
    window.addEventListener("scroll", checkAndSync, { passive: true });
    window.addEventListener("resize", checkAndSync, { passive: true });

    // Also listen to the horizontal slider track's scroll event if wrapped inside one
    let scrollParent = container.parentElement;
    while (scrollParent && scrollParent !== document.body) {
      const overflowX = window.getComputedStyle(scrollParent).overflowX;
      if (overflowX === "auto" || overflowX === "scroll") {
        scrollParent.addEventListener("scroll", checkAndSync, { passive: true });
        break;
      }
      scrollParent = scrollParent.parentElement;
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkAndSync);
      window.removeEventListener("resize", checkAndSync);
      if (scrollParent && scrollParent !== document.body) {
        scrollParent.removeEventListener("scroll", checkAndSync);
      }
    };
  }, [isElementInViewport, pauseVideo, playVideo]);

  // Iframe onLoad handler
  const handleIframeLoad = () => {
    setLoadingVideo(false);
    // Subscribe to YouTube widget events
    sendYouTubeCommand("listening");

    // If already scrolled out of viewport while loading, pause immediately!
    if (!isElementInViewport()) {
      pausedByViewportRef.current = true;
      pauseVideo();
    }
  };

  const originParam =
    typeof window !== "undefined" && window.location.origin
      ? `&origin=${encodeURIComponent(window.location.origin)}`
      : "";

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative bg-black select-none overflow-hidden isolate ${roundedClassName}`}
    >
      {/* Loading Spinner Indicator */}
      {loadingVideo && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/85 gap-3 pointer-events-none">
          <div className="video-loading-spinner" />
          <span className="text-xs text-[#B3FFC9] font-medium tracking-wide">
            {loadingLabel}
          </span>
        </div>
      )}

      {/* Embedded YouTube Player */}
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&enablejsapi=1${originParam}&modestbranding=1&rel=0`}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        frameBorder="0"
        onLoad={handleIframeLoad}
        className="w-full h-full border-none block"
        title={title}
      />

      {/* Dismiss / Close Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          pauseVideo();
          if (onClose) onClose();
        }}
        className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center text-xs hover:bg-[#B3FFC9] hover:text-black hover:border-[#B3FFC9] transition-all shadow-xl cursor-pointer"
        title="Close video"
        aria-label="Close video"
      >
        ✕
      </button>
    </div>
  );
}