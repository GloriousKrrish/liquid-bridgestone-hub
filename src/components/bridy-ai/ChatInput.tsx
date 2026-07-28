import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Mic, Square } from "lucide-react";
import { BRIDY_AI_CONFIG } from "../../lib/bridy-ai/constants";

interface ChatInputProps {
  onSend: (message: string) => void;
  isDisabled?: boolean;
  isStreaming?: boolean;
  onStopStreaming?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isDisabled = false,
  isStreaming = false,
  onStopStreaming,
}) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [input]);

  // Focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isDisabled) return;
    onSend(trimmed);
    setInput("");
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const charCount = input.length;
  const isOverLimit = charCount > BRIDY_AI_CONFIG.maxInputLength;

  return (
    <div className="border-t border-white/[0.06] bg-[#0a0c14]/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-3xl mx-auto">
        <div
          className={`relative flex items-end gap-2 bg-white/[0.04] border rounded-2xl px-4 py-3 transition-all duration-200 ${
            isOverLimit
              ? "border-red-500/50 focus-within:border-red-500"
              : "border-white/[0.08] focus-within:border-[#CC0000]/40 focus-within:shadow-[0_0_0_1px_rgba(204,0,0,0.15)]"
          }`}
        >
          {/* Attachment button (visual placeholder for Phase 8) */}
          <button
            type="button"
            className="text-white/20 hover:text-white/50 p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer shrink-0 mb-0.5"
            aria-label="Attach file"
            title="File upload — coming soon"
          >
            <Paperclip size={16} />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Bridy AI…"
            disabled={isDisabled}
            rows={1}
            className="flex-1 bg-transparent text-white text-[13px] leading-relaxed resize-none outline-none placeholder:text-white/25 min-h-[24px] max-h-[160px] disabled:opacity-40"
            style={{ scrollbarWidth: "none" }}
          />

          {/* Right side actions */}
          <div className="flex items-center gap-1 shrink-0 mb-0.5">
            {/* Voice input (visual placeholder) */}
            <button
              type="button"
              className="text-white/20 hover:text-white/50 p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
              aria-label="Voice input"
              title="Voice input — coming soon"
            >
              <Mic size={16} />
            </button>

            {/* Send / Stop button */}
            {isStreaming ? (
              <button
                type="button"
                onClick={onStopStreaming}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-all cursor-pointer"
                aria-label="Stop generating"
              >
                <Square size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!input.trim() || isDisabled || isOverLimit}
                className="bg-[#CC0000] hover:bg-[#AA0000] disabled:bg-white/[0.06] disabled:text-white/20 text-white p-2 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-[#CC0000]/20 disabled:shadow-none"
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between mt-2 px-2">
          <p className="text-[9px] text-white/20">
            Bridy AI can make mistakes. Verify critical information with Bridgestone India.
          </p>
          {charCount > BRIDY_AI_CONFIG.maxInputLength * 0.8 && (
            <span
              className={`text-[9px] font-mono ${
                isOverLimit ? "text-red-400" : "text-white/30"
              }`}
            >
              {charCount}/{BRIDY_AI_CONFIG.maxInputLength}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
