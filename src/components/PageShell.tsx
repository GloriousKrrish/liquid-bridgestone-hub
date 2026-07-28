import { type ReactNode } from "react";
import { BridgestoneNav } from "./BridgestoneNav";
import { BridgestoneFooter } from "./BridgestoneFooter";
import { HeroVideoBackdrop } from "./PremiumMotionMesh";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#121212] text-white overflow-hidden relative font-sans selection:bg-[#D71920] selection:text-white flex flex-col">
      {/* Full-Bleed Background Video Backdrop */}
      <HeroVideoBackdrop />

      <BridgestoneNav />
      <main className="relative z-10 flex-1 w-full px-6 md:px-12 lg:px-16">{children}</main>
      <BridgestoneFooter />
    </div>
  );
}
