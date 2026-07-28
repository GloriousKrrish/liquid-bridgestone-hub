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
    <div className="border-t border-[#EFE6E8] bg-[#FFFDFC] px-4 sm:px-6 lg:px-8 py-4 shrink-0">
      <div className="max-w-3xl mx-auto space-y-2">
        <div
          className={`relative flex items-end gap-3 bg-[#FFFFFF] border rounded-[24px] px-4 py-3 transition-all duration-200 shadow-[0_4px_24px_rgba(0,0,0,0.03)] ${
            isOverLimit
              ? "border-red-400 focus-within:border-red-500"
              : "border-[#EFE6E8] focus-within:border-[#D71920]/50 focus-within:ring-4 focus-within:ring-[#D71920]/10"
          }`}
        >
          {/* Attachment Icon Button */}
          <button
            type="button"
            className="text-[#707070] hover:text-[#2D2D2D] p-2 rounded-full hover:bg-[#FAF5F6] transition-colors cursor-pointer shrink-0 mb-0.5"
            aria-label="Attach file"
            title="File upload — coming soon"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Birdy about your vehicle, tyre sizing, or dealer appointments..."
            disabled={isDisabled}
            rows={1}
            className="flex-1 bg-transparent text-[#2D2D2D] text-xs sm:text-sm leading-relaxed resize-none outline-none placeholder:text-[#707070]/60 min-h-[26px] max-h-[160px] disabled:opacity-40 font-normal"
            style={{ scrollbarWidth: "none" }}
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 mb-0.5">
            {/* Microphone Icon Button */}
            <button
              type="button"
              className="text-[#707070] hover:text-[#2D2D2D] p-2 rounded-full hover:bg-[#FAF5F6] transition-colors cursor-pointer"
              aria-label="Voice input"
              title="Voice input — coming soon"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Send / Stop Button */}
            {isStreaming ? (
              <button
                type="button"
                onClick={onStopStreaming}
                className="bg-[#2D2D2D] hover:bg-[#000000] text-white p-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                aria-label="Stop generating"
              >
                <Square className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!input.trim() || isDisabled || isOverLimit}
                className="bg-[#D71920] hover:bg-[#B51218] disabled:bg-[#EFE6E8] disabled:text-[#707070]/40 text-white p-2.5 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed shadow-md shadow-[#D71920]/20 disabled:shadow-none"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Footer Guarantee Info */}
        <div className="flex items-center justify-between px-2">
          <p className="text-[11px] text-[#707070]">
            Bridgestone Mobility Assistant — Verified Tyre & Vehicle Data.
          </p>
          {charCount > BRIDY_AI_CONFIG.maxInputLength * 0.8 && (
            <span
              className={`text-[10px] font-mono ${
                isOverLimit ? "text-red-500 font-semibold" : "text-[#707070]"
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
