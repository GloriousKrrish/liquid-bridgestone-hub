import React from "react";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3.5 max-w-[85%]">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-xl bg-[#D71920] flex items-center justify-center shrink-0 shadow-sm shadow-[#D71920]/20">
        <span className="text-xs font-bold text-white tracking-tight">B</span>
      </div>

      {/* Typing Bubble */}
      <div className="bg-[#FFFFFF] border border-[#EFE6E8] rounded-[20px] rounded-tl-[4px] px-5 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#707070]">Birdy is thinking</span>
          <div className="flex gap-1.5 items-center">
            <div
              className="w-2 h-2 bg-[#D71920] rounded-full animate-bounce"
              style={{ animationDelay: "0ms", animationDuration: "1s" }}
            />
            <div
              className="w-2 h-2 bg-[#D71920]/70 rounded-full animate-bounce"
              style={{ animationDelay: "150ms", animationDuration: "1s" }}
            />
            <div
              className="w-2 h-2 bg-[#D71920]/40 rounded-full animate-bounce"
              style={{ animationDelay: "300ms", animationDuration: "1s" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
