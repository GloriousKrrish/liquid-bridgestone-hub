import { createFileRoute } from "@tanstack/react-router";
import { BridyAIWorkspace } from "../components/bridy-ai/BridyAIWorkspace";

export const Route = createFileRoute("/bridy-ai")({
  component: BridyAIPage,
  head: () => ({
    meta: [
      {
        title: "Bridy AI — Bridgestone Digital Intelligence Assistant",
      },
      {
        name: "description",
        content: "Chat with Bridy AI — Bridgestone's enterprise digital assistant.",
      },
    ],
  }),
});

function BridyAIPage() {
  return <BridyAIWorkspace />;
}
