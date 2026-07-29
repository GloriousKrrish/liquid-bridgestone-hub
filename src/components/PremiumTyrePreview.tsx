import React, { useEffect, useRef, useState, memo } from "react";

export interface PremiumTyrePreviewProps {
  seriesName?: string;
  variant?: "primary" | "alternative" | "compact";
  className?: string;
}

export const PremiumTyrePreview = memo(function PremiumTyrePreview({
  seriesName,
  variant = "primary",
  className = "",
}: PremiumTyrePreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevSeriesRef = useRef(seriesName);

  // Transition state on recommendation updates
  useEffect(() => {
    if (prevSeriesRef.current !== seriesName) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        prevSeriesRef.current = seriesName;
        setIsTransitioning(false);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
      }, 320);
      return () => clearTimeout(timer);
    }
  }, [seriesName]);

  // Tab visibility pause / resume
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        videoRef.current?.pause();
      } else {
        videoRef.current?.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // IntersectionObserver for lazy playback & viewport pausing
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {});
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Preset idle rotation rate based on card hierarchy
  const initialPlaybackRate = variant === "primary" ? 1.0 : variant === "alternative" ? 0.65 : 0.85;
  const hoverPlaybackRate = variant === "primary" ? 1.4 : 1.25;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = initialPlaybackRate;
    }
  }, [initialPlaybackRate]);

  // Dimension profiles per variant
  const dimensionClasses = {
    primary: "w-32 h-36 sm:w-40 sm:h-44 md:w-44 md:h-48",
    alternative: "w-24 h-28 sm:w-28 sm:h-32",
    compact: "w-28 h-32 sm:w-36 sm:h-40",
  }[variant];

  const shadowClasses = {
    primary: "w-20 sm:w-24 h-2 group-hover:w-28 group-hover:h-2.5",
    alternative: "w-14 sm:w-18 h-1.5 group-hover:w-22 group-hover:h-2",
    compact: "w-16 sm:w-20 h-1.5 group-hover:w-24 group-hover:h-2",
  }[variant];

  const floatAnimationName = variant === "alternative" ? "floatAlt" : "floatShowroom";

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        if (videoRef.current) videoRef.current.playbackRate = hoverPlaybackRate;
      }}
      onMouseLeave={() => {
        if (videoRef.current) videoRef.current.playbackRate = initialPlaybackRate;
      }}
      className={`${dimensionClasses} relative flex flex-col items-center justify-center group cursor-pointer select-none rounded-2xl overflow-hidden p-1 transition-all duration-500 ease-out border border-[#C4A67A]/30 bg-gradient-to-b from-[#FAF7F2] to-[#F5EFE6] hover:-translate-y-1.5 hover:border-[#C8A165]/60 hover:shadow-[0_16px_36px_rgba(200,161,101,0.20)] ${className}`}
    >
      <style>{`
        @keyframes floatShowroom {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes floatAlt {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-1.5px); }
        }
      `}</style>

      {/* Showroom Warm Ivory & Gold Radial Spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(254,250,245,0.98)_0%,rgba(235,222,200,0.42)_55%,transparent_82%)] pointer-events-none transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(201,163,93,0.25)_0%,transparent_65%)] pointer-events-none transition-all duration-500 group-hover:scale-110 group-hover:opacity-100" />

      {/* Floating Animated Video Container occupying 80-85% area */}
      <div
        className={`w-[85%] h-[85%] relative flex items-center justify-center transform-gpu transition-all duration-350 ease-out ${
          isTransitioning
            ? "opacity-0 scale-95 rotate-2"
            : "opacity-100 scale-100 rotate-0 group-hover:scale-[1.03]"
        }`}
        style={{
          animation: isTransitioning ? "none" : `${floatAnimationName} ${variant === "alternative" ? "5s" : "4s"} ease-in-out infinite`,
        }}
      >
        <video
          ref={videoRef}
          src="/can_u_plz_animate_this.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-contain pointer-events-none transform-gpu filter drop-shadow-[0_12px_22px_rgba(28,25,23,0.25)] group-hover:drop-shadow-[0_20px_34px_rgba(28,25,23,0.38)] group-hover:brightness-105 transition-all duration-500"
          style={{
            mixBlendMode: "multiply",
          }}
        />
      </div>

      {/* Soft Elliptical Ground Shadow */}
      <div className={`${shadowClasses} bg-[#1C1917]/22 rounded-full blur-[4px] mx-auto mt-0.5 transition-all duration-500 ease-out group-hover:bg-[#1C1917]/35 group-hover:blur-[6px] pointer-events-none`} />
    </div>
  );
});

export const AnimatedTyrePreview = PremiumTyrePreview;
export default PremiumTyrePreview;
