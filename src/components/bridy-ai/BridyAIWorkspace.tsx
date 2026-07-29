import React, { useState, useCallback, useEffect } from "react";
import { Menu, ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Conversation } from "../../lib/bridy-ai/types";
import {
  loadConversations,
  saveConversations,
  createConversation,
  addMessageToConversation,
  getConversationHistory,
  deleteConversation as removeConversation,
} from "../../lib/bridy-ai/conversation-store";
import { bridyAIChat } from "../../lib/api/bridy-ai.functions";
import { ChatSidebar } from "./ChatSidebar";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { WelcomeScreen } from "./WelcomeScreen";

export function BridyAIWorkspace() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [requestCount, setRequestCount] = useState(0);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const loaded = loadConversations();
    setConversations(loaded);
  }, []);

  // Get active conversation
  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  // Is this a fresh empty state (welcome screen)
  const isWelcomeState =
    !activeConversation ||
    activeConversation.messages.length <= 1; // Only welcome message

  // ── Create New Chat ──
  const handleNewChat = useCallback(() => {
    const newConv = createConversation();
    const updated = [newConv, ...conversations];
    setConversations(updated);
    saveConversations(updated);
    setActiveConversationId(newConv.id);
    setIsSidebarOpen(false);
  }, [conversations]);

  // ── Select Conversation ──
  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    setIsSidebarOpen(false);
  }, []);

  // ── Delete Conversation ──
  const handleDeleteConversation = useCallback(
    (id: string) => {
      const updated = removeConversation(conversations, id);
      setConversations(updated);
      saveConversations(updated);
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
    },
    [activeConversationId, conversations]
  );

  // ── Send Message ──
  const handleSend = useCallback(
    async (message: string) => {
      if (!message.trim() || isTyping) return; // Stop accidental double clicks

      // Create conversation if none active
      let conv = activeConversation;
      let currentConversations = [...conversations];

      if (!conv) {
        conv = createConversation();
        currentConversations = [conv, ...currentConversations];
      }

      // Add user message
      const { conversation: withUser } = addMessageToConversation(conv, {
        role: "user",
        content: message.trim(),
      });

      // Update local state right away
      const stateWithUser = currentConversations.map((c) => (c.id === withUser.id ? withUser : c));
      setConversations(stateWithUser);
      saveConversations(stateWithUser);
      setActiveConversationId(withUser.id);
      setIsTyping(true);

      const currentRequestNum = requestCount + 1;
      setRequestCount(currentRequestNum);

      console.log(`[Bridy Chat UI] Triggering LLM call. Message: "${message.trim()}"`);

      try {
        let replyText = "";
        let suggestedPrompts: string[] | undefined = undefined;
        let detectedIntent: any = undefined;

        // Build history for context
        const history = getConversationHistory(withUser);

        // Call the AI
        const result = await bridyAIChat({
          data: {
            message: message.trim(),
            conversationId: withUser.id,
            history,
          },
        });

        if (result.success) {
          replyText = result.text || "";
          suggestedPrompts = result.suggestedPrompts;
          detectedIntent = result.detectedIntent;
        } else {
          setIsTyping(false);
          // Handle error
          const errorContent =
            result.error === "NO_API_KEY"
              ? "API Key Required — Birdy AI needs a valid `VITE_LLM_API_KEY` environment variable to connect to Google Gemini. Please configure this in your `.env` file.\n\nIn the meantime, I can share Bridgestone product information from our built-in catalog. Try asking about **Turanza 6i**, **Dueler A/T002**, or **Ecopia EP150**."
              : (result.message && (result.message.includes("429") || result.message.includes("RESOURCE_EXHAUSTED")))
                ? "AI Service Busy (Quota Exceeded) — The configured API key has exceeded its rate limit (429 Resource Exhausted).\n\nIn the meantime, I can still share Bridgestone product information from our built-in catalog. Try asking about **Turanza 6i**, **Dueler A/T002**, or **Ecopia EP150**."
                : `I encountered an error: ${result.message || "Unknown error"}. Please try again.`;

          const { conversation: withError } = addMessageToConversation(
            withUser,
            {
              role: "assistant",
              content: errorContent,
              suggestedPrompts: [
                "Tell me about Turanza 6i",
                "Compare Bridgestone tyres for SUVs",
                "What tyres suit a Hyundai Creta?",
              ],
            }
          );

          const stateWithError = stateWithUser.map((c) => (c.id === withError.id ? withError : c));
          setConversations(stateWithError);
          saveConversations(stateWithError);
          return;
        }

        setIsTyping(false);

        // Add AI response
        const { conversation: withAI } = addMessageToConversation(withUser, {
          role: "assistant",
          content: replyText,
          isStreaming: true,
          suggestedPrompts,
          detectedIntent,
        });

        setIsStreaming(true);
        const stateWithAI = stateWithUser.map((c) => (c.id === withAI.id ? withAI : c));
        setConversations(stateWithAI);
        saveConversations(stateWithAI);
      } catch (error) {
        console.error("[Bridy AI] Send error:", error);
        setIsTyping(false);

        const { conversation: withError } = addMessageToConversation(
          withUser,
          {
            role: "assistant",
            content:
              "I encountered a connection error. Please check your network and try again.",
          }
        );

        const stateWithNetworkError = stateWithUser.map((c) => (c.id === withError.id ? withError : c));
        setConversations(stateWithNetworkError);
        saveConversations(stateWithNetworkError);
      }
    },
    [activeConversation, conversations, requestCount, isTyping]
  );

  // ── Handle stream complete ──
  const handleStreamComplete = useCallback(() => {
    setIsStreaming(false);
    setConversations((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== activeConversationId) return c;
        const messages = c.messages.map((m, i) =>
          i === c.messages.length - 1 ? { ...m, isStreaming: false } : m
        );
        return { ...c, messages };
      });
      saveConversations(updated);
      return updated;
    });
  }, [activeConversationId]);

  // ── Handle retry ──
  const handleRetry = useCallback(() => {
    if (!activeConversation) return;
    const lastUserMsg = [...activeConversation.messages]
      .reverse()
      .find((m) => m.role === "user");
    if (!lastUserMsg) return;

    const trimmedMessages = activeConversation.messages.slice(0, -1);
    const trimmedConv = {
      ...activeConversation,
      messages: trimmedMessages,
    };

    const updated = conversations.map((c) => (c.id === trimmedConv.id ? trimmedConv : c));
    setConversations(updated);
    saveConversations(updated);

    handleSend(lastUserMsg.content);
  }, [activeConversation, conversations, handleSend]);

  // ── Handle suggestion click ──
  const handleSuggestionClick = useCallback(
    (prompt: string) => {
      handleSend(prompt);
    },
    [handleSend]
  );

  // ── Handle welcome prompt ──
  const handleWelcomePrompt = useCallback(
    (prompt: string) => {
      if (!activeConversation) {
        const newConv = createConversation();
        const updated = [newConv, ...conversations];
        setConversations(updated);
        saveConversations(updated);
        setActiveConversationId(newConv.id);
        setTimeout(() => handleSend(prompt), 50);
      } else {
        handleSend(prompt);
      }
    },
    [activeConversation, conversations, handleSend]
  );

  return (
    <div className="flex h-screen bg-[#FFFDFC] text-[#2D2D2D] overflow-hidden font-sans">
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        isOpen={isSidebarOpen}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Mobility Assistant Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#FFFDFC]">
        {/* Top Header Navigation */}
        <header className="h-14 border-b border-[#EFE6E8] bg-[#FFFFFF] flex items-center px-4 sm:px-6 gap-3 shrink-0 shadow-xs">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-[#707070] hover:text-[#2D2D2D] p-1.5 rounded-lg hover:bg-[#FAF5F6] transition-colors cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link
            to="/"
            className="text-[#707070] hover:text-[#2D2D2D] p-1.5 rounded-lg hover:bg-[#FAF5F6] transition-colors"
            title="Return to Bridgestone Hub"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

            <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/bridgestone-logo-photoroom.png" alt="Bridgestone" className="w-full h-full object-contain" draggable={false} />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-semibold text-[#2D2D2D] truncate">
                {activeConversation?.title || "Bridgestone Mobility Assistant"}
              </h2>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="ml-auto flex items-center gap-2 bg-[#FAF5F6] border border-[#EFE6E8] px-3 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E8B57] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2E8B57]" />
            </span>
            <span className="text-[11px] text-[#2D2D2D] font-medium hidden sm:inline">
              Concierge Online
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E8B57] hidden sm:inline" />
          </div>
        </header>

        {/* Messages / Welcome View */}
        {isWelcomeState ? (
          <WelcomeScreen onPromptSelect={handleWelcomePrompt} />
        ) : (
          <ChatMessageList
            messages={activeConversation?.messages || []}
            isTyping={isTyping}
            onRetry={handleRetry}
            onStreamComplete={handleStreamComplete}
            onSuggestionClick={handleSuggestionClick}
          />
        )}

        {/* Input Bar */}
        <ChatInput
          onSend={handleSend}
          isDisabled={isTyping}
          isStreaming={isStreaming}
          onStopStreaming={handleStreamComplete}
        />
      </div>
    </div>
  );
}