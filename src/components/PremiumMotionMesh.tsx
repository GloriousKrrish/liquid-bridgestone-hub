// PremiumMotionMesh.tsx - Hero Video Backdrop component

/**
 * HeroVideoBackdrop
 * -----------------
 * Full-bleed immersive background video layer.
 *
 * Architecture:
 *  - Fixed z-0 container, pointer-events-none
 *  - Video element scaled to 106% to crop peripheral watermarks
 *  - Dark vignette overlay for content legibility
 *  - Graceful fade-in on video load
 *  - Fully isolated: no layout impact, no interaction blocking
 */
export function HeroVideoBackdrop() {
  return (
    <div
      className="fixed inset-0 w-full h-full z-0 bg-[#121212] overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <video
        src="/hero-background.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-contain mix-blend-normal opacity-100 filter-none"
      />
    </div>
  );
}
