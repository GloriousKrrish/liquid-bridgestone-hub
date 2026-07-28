import React from "react";
import type { BridyMessage } from "../../lib/bridy-ai/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { StreamingText } from "./StreamingText";
import { Copy, Check, RotateCcw } from "lucide-react";

interface ChatMessageProps {
  message: BridyMessage;
  isLatest?: boolean;
  onRetry?: () => void;
  onStreamComplete?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLatest = false,
  onRetry,
  onStreamComplete,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (message.role === "user") {
    return (
      <div className="flex justify-end group">
        <div className="max-w-[75%] bg-[#CC0000]/90 text-white rounded-2xl rounded-tr-md px-4 py-3 shadow-lg shadow-[#CC0000]/10">
          <p className="text-[12.5px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
          <div className="flex justify-end mt-1.5">
            <time className="text-[9px] text-white/50">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex items-start gap-3 group max-w-full">
      {/* Bridy AI Avatar */}
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#CC0000] to-[#8B0000] flex items-center justify-center shrink-0 shadow-lg shadow-[#CC0000]/20 mt-0.5">
        <span className="text-[10px] font-black text-white tracking-tight">B</span>
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        {/* Message content */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl rounded-tl-md px-4 py-3.5 backdrop-blur-md">
          {message.isStreaming && isLatest ? (
            <div className="text-[12.5px] leading-relaxed text-white/85">
              <StreamingText
                content={message.content}
                onComplete={onStreamComplete}
                speed={8}
              />
            </div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {/* Action bar — appears on hover */}
        {!message.isStreaming && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-[9px] text-white/30 hover:text-white/70 px-2 py-1 rounded-md hover:bg-white/5 transition-all cursor-pointer"
            >
              {copied ? <Check size={10} /> : <Copy size={10} />}
              {copied ? "Copied" : "Copy"}
            </button>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center gap-1 text-[9px] text-white/30 hover:text-white/70 px-2 py-1 rounded-md hover:bg-white/5 transition-all cursor-pointer"
              >
                <RotateCcw size={10} />
                Retry
              </button>
            )}
            <time className="text-[9px] text-white/20 ml-auto">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
        )}

        {/* Suggested follow-up prompts */}
        {message.suggestedPrompts &&
          message.suggestedPrompts.length > 0 &&
          !message.isStreaming &&
          isLatest && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {message.suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  data-suggestion={prompt}
                  className="bridy-suggestion-chip text-[10px] text-white/50 hover:text-white/90 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] rounded-full px-3 py-1.5 transition-all cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};
