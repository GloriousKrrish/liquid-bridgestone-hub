import React from "react";
import type { BridyMessage } from "../../lib/bridy-ai/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { StreamingText } from "./StreamingText";
import {
  Copy,
  Check,
  RotateCcw,
  Star,
  ShieldCheck,
  Calendar,
  MapPin,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface ChatMessageProps {
  message: BridyMessage;
  isLatest?: boolean;
  onRetry?: () => void;
  onStreamComplete?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = React.memo(({
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

  // User Message Rendering
  if (message.role === "user") {
    return (
      <div className="flex justify-end group">
        <div className="max-w-[85%] sm:max-w-[75%] bg-[#F8EDEE] border border-[#EFE6E8] text-[#2D2D2D] rounded-[20px] rounded-tr-[4px] px-5 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal">
            {message.content}
          </p>
          <div className="flex justify-end mt-2">
            <time className="text-[10px] text-[#707070]">
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

  // Detect product recommendations or bookings in response
  const tyreCards = extractTyreCards(message.content);
  const bookingCard = extractBookingCard(message.content);

  // Assistant Message Rendering
  return (
    <div className="flex items-start gap-3.5 group max-w-full">
      {/* Bridgestone Mobility Avatar */}
      <div className="w-9 h-9 shrink-0 mt-1 flex items-center justify-center">
        <img src="/bridgestone-logo.png" alt="Bridgestone" className="w-full h-full object-contain" draggable={false} />
      </div>

      <div className="flex-1 min-w-0 space-y-4">
        {/* Main Response Container */}
        <div className="bg-[#FFFFFF] border border-[#EFE6E8] rounded-[20px] rounded-tl-[4px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
          {message.isStreaming && isLatest ? (
            <div className="text-xs sm:text-sm leading-relaxed text-[#2D2D2D]">
              <StreamingText
                content={message.content}
                onComplete={onStreamComplete}
                speed={8}
              />
            </div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}

          {/* Render Tyre Product Cards if present */}
          {tyreCards.length > 0 && !message.isStreaming && (
            <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#EFE6E8]">
              {tyreCards.map((tyre, idx) => (
                <div
                  key={idx}
                  className="bg-[#FFF8F8] border border-[#EFE6E8] rounded-[18px] p-4.5 space-y-3 shadow-xs hover:border-[#D71920]/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D71920] bg-[#F8EDEE] px-2 py-0.5 rounded-full border border-[#EFE6E8]">
                        {tyre.category}
                      </span>
                      <h4 className="text-sm font-semibold text-[#2D2D2D] mt-1.5">
                        {tyre.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1 bg-[#FFFFFF] px-2 py-1 rounded-lg border border-[#EFE6E8] text-xs font-medium text-[#2D2D2D]">
                      <Star className="w-3.5 h-3.5 fill-[#D71920] text-[#D71920]" />
                      {tyre.rating}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#707070]">
                    <p className="flex items-center justify-between">
                      <span>Perfect For:</span>
                      <span className="font-medium text-[#2D2D2D]">{tyre.perfectFor}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Expected Life:</span>
                      <span className="font-medium text-[#2E8B57]">{tyre.expectedLife}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Price Est:</span>
                      <span className="font-semibold text-[#2D2D2D]">{tyre.price}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => alert(`Comparing ${tyre.name}`)}
                      className="flex-1 text-center py-2 px-3 rounded-xl bg-[#FFFFFF] border border-[#EFE6E8] hover:bg-[#F4EFF0] text-xs font-medium text-[#2D2D2D] transition-colors cursor-pointer"
                    >
                      Compare
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Booking ${tyre.name}`)}
                      className="flex-1 text-center py-2 px-3 rounded-xl bg-[#D71920] hover:bg-[#B51218] text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs"
                    >
                      Book Fitment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Render Booking Card if present */}
          {bookingCard && !message.isStreaming && (
            <div className="pt-3 border-t border-[#EFE6E8]">
              <div className="bg-[#FAF5F6] border border-[#EFE6E8] rounded-[18px] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#2D2D2D]">
                    <Calendar className="w-4 h-4 text-[#D71920]" />
                    Service Appointment Card
                  </div>
                  <span className="text-[10px] font-semibold bg-[#2E8B57]/10 text-[#2E8B57] px-2.5 py-1 rounded-full border border-[#2E8B57]/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B57]" />
                    {bookingCard.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#EFE6E8]">
                    <p className="text-[#707070] text-[10px] uppercase font-semibold">Selected Tyre</p>
                    <p className="font-semibold text-[#2D2D2D] mt-0.5">{bookingCard.tyre}</p>
                  </div>
                  <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#EFE6E8]">
                    <p className="text-[#707070] text-[10px] uppercase font-semibold">Store Location</p>
                    <p className="font-semibold text-[#2D2D2D] mt-0.5">{bookingCard.store}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#707070]">Next Steps: {bookingCard.nextSteps}</span>
                  <button
                    type="button"
                    onClick={() => alert("Appointment Saved to Calendar")}
                    className="text-[#D71920] font-semibold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    View Directions <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Utilities Bar */}
        {!message.isStreaming && (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1 text-xs text-[#707070]">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 hover:text-[#2D2D2D] px-2.5 py-1 rounded-lg hover:bg-[#FAF5F6] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#2E8B57]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center gap-1 hover:text-[#2D2D2D] px-2.5 py-1 rounded-lg hover:bg-[#FAF5F6] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            )}
            <time className="text-[11px] text-[#707070]/60 ml-auto">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
        )}

        {/* Follow-up Suggestion Chips */}
        {message.suggestedPrompts &&
          message.suggestedPrompts.length > 0 &&
          !message.isStreaming &&
          isLatest && (
            <div className="flex flex-wrap gap-2 pt-1">
              {message.suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  data-suggestion={prompt}
                  className="bridy-suggestion-chip text-xs text-[#707070] hover:text-[#D71920] bg-[#FFFFFF] hover:bg-[#F8EDEE] border border-[#EFE6E8] hover:border-[#D71920]/40 rounded-full px-4 py-2 transition-all cursor-pointer shadow-xs flex items-center gap-1.5 font-medium"
                >
                  <Sparkles className="w-3 h-3 text-[#D71920]" />
                  {prompt}
                </button>
              ))}
            </div>
          )}
      </div>
    </div>
  );
});

// Helper: Extract Tyre Recommendation Cards from text
function extractTyreCards(text: string) {
  const cards = [];
  if (text.includes("Turanza") || (text.toLowerCase().includes("sedan") && text.toLowerCase().includes("recommend"))) {
    cards.push({
      name: "Bridgestone Turanza 6i",
      category: "Premium Touring",
      rating: "4.9",
      perfectFor: "Luxury Sedans & EVs",
      expectedLife: "65,000 km",
      price: "₹8,450",
    });
  }
  if (text.includes("Dueler") || (text.toLowerCase().includes("suv") && text.toLowerCase().includes("recommend"))) {
    cards.push({
      name: "Bridgestone Dueler A/T002",
      category: "All-Terrain SUV",
      rating: "4.8",
      perfectFor: "SUVs & Crossovers",
      expectedLife: "60,000 km",
      price: "₹9,800",
    });
  }
  return cards;
}

// Helper: Extract Booking Card details if appointment/booking is explicitly confirmed
function extractBookingCard(text: string) {
  if (text.toLowerCase().includes("appointment scheduled") || text.toLowerCase().includes("booking confirmed")) {
    return {
      status: "Confirmed",
      tyre: "Bridgestone Turanza 6i (215/55 R17)",
      store: "Bridgestone Select Fitment Center",
      nextSteps: "Bring vehicle to store at scheduled time",
    };
  }
  return null;
}
