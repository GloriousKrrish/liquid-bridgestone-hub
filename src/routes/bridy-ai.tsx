import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/bridy-ai")({
  component: BridyAIPage,
  head: () => ({
    meta: [
      {
        title: "Liquid Support AI — Bridgestone Digital Mobility Concierge",
      },
      {
        name: "description",
        content: "Chat with Liquid Support AI — Bridgestone's official digital customer support assistant.",
      },
    ],
  }),
});

function BridyAIPage() {
  const [Workspace, setWorkspace] = useState<React.ComponentType | null>(null);

  // Lazy-load BridyAIWorkspace ONLY when /bridy-ai is visited
  useEffect(() => {
    import("../components/bridy-ai/BridyAIWorkspace").then((mod) => {
      setWorkspace(() => mod.BridyAIWorkspace);
    });
  }, []);

  if (!Workspace) {
    return (
      <div className="min-h-screen bg-[#FFFDFC] flex flex-col justify-center items-center p-6 space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-[#F8EDEE] border border-[#EFE6E8] flex items-center justify-center animate-pulse">
          <div className="w-6 h-6 rounded-full bg-[#D71920]/40" />
        </div>
        <div className="space-y-2 text-center max-w-sm">
          <div className="h-4 bg-[#FAF5F6] rounded-full w-48 mx-auto animate-pulse" />
          <div className="h-3 bg-[#FAF5F6] rounded-full w-32 mx-auto animate-pulse" />
        </div>
      </div>
    );
  }

  return <Workspace />;
}
