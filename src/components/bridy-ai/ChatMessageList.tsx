import React, { useRef, useEffect } from "react";
import type { BridyMessage } from "../../lib/bridy-ai/types";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";

interface ChatMessageListProps {
  messages: BridyMessage[];
  isTyping: boolean;
  onRetry?: () => void;
  onStreamComplete?: () => void;
  onSuggestionClick?: (prompt: string) => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isTyping,
  onRetry,
  onStreamComplete,
  onSuggestionClick,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle suggestion chip clicks via event delegation
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !onSuggestionClick) return;

    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        "[data-suggestion]"
      ) as HTMLElement | null;
      if (target) {
        const suggestion = target.getAttribute("data-suggestion");
        if (suggestion) onSuggestionClick(suggestion);
      }
    };

    container.addEventListener("click", handler);
    return () => container.removeEventListener("click", handler);
  }, [onSuggestionClick]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-[#FFFDFC]"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#EFE6E8 transparent",
      }}
    >
      {/* Conversation center-constrain */}
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((msg, index) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isLatest={index === messages.length - 1}
            onRetry={
              msg.role === "assistant" && index === messages.length - 1
                ? onRetry
                : undefined
            }
            onStreamComplete={
              msg.isStreaming && index === messages.length - 1
                ? onStreamComplete
                : undefined
            }
          />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={bottomRef} className="h-2" />
      </div>
    </div>
  );
};
