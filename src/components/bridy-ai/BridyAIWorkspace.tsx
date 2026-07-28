import React, { useState, useCallback, useEffect } from "react";
import { Menu, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { BridyMessage, Conversation } from "../../lib/bridy-ai/types";
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
      const { conversation: withUser, message: userMsg } =
        addMessageToConversation(conv, {
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

      console.log(`[Bridy Chat UI] Triggering single LLM call. Message: "${message.trim()}"`);

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
              ? "⚠️ **API Key Required** — Bridy AI needs a valid `VITE_LLM_API_KEY` environment variable to connect to Google Gemini. Please configure this in your `.env` file and in Vercel Environment Variables.\n\nIn the meantime, I can share Bridgestone product information from our built-in catalog. Try asking about **Turanza 6i**, **Dueler A/T002**, or **Ecopia EP150**."
              : (result.message && (result.message.includes("429") || result.message.includes("RESOURCE_EXHAUSTED")))
                ? "⚠️ **AI Service Busy (Quota Exceeded)** — The configured API key has exceeded its daily or per-minute request limit (429 Resource Exhausted).\n\nTo restore full service, please verify your API billing plan or supply a different key. In the meantime, I can still share Bridgestone product information from our built-in local catalog. Try asking about **Turanza 6i**, **Dueler A/T002**, or **Ecopia EP150**."
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
    // Remove streaming flag from the last message
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
    <div className="flex h-screen bg-[#080a12] text-white overflow-hidden">
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

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-12 border-b border-white/[0.06] bg-[#0a0c14]/80 backdrop-blur-xl flex items-center px-4 gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-white/40 hover:text-white p-1 rounded-md hover:bg-white/5 transition-all cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>

          <Link
            to="/"
            className="text-white/30 hover:text-white/60 p-1 rounded-md hover:bg-white/5 transition-all"
          >
            <ArrowLeft size={16} />
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#CC0000] to-[#8B0000] flex items-center justify-center">
              <span className="text-[8px] font-black text-white">B</span>
            </div>
            <h2 className="text-[12px] font-semibold text-white/70 truncate">
              {activeConversation?.title || "Bridy AI"}
            </h2>
          </div>

          {/* Status indicator */}
          <div className="ml-auto flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-[9px] text-white/30 uppercase tracking-wider font-semibold hidden sm:inline">
              Online
            </span>
          </div>
        </header>

        {/* Messages or Welcome */}
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

        {/* Input bar */}
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