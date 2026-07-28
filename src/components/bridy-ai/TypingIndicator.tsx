import React from "react";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 max-w-[85%]">
      {/* Avatar */}
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#CC0000] to-[#8B0000] flex items-center justify-center shrink-0 shadow-lg shadow-[#CC0000]/20">
        <span className="text-[10px] font-black text-white tracking-tight">B</span>
      </div>

      {/* Typing bubble */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl rounded-tl-md px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-white/40 mr-1">Bridy AI is thinking</span>
          <div className="flex gap-1 items-center">
            <div
              className="w-1.5 h-1.5 bg-[#CC0000] rounded-full animate-bounce"
              style={{ animationDelay: "0ms", animationDuration: "1s" }}
            />
            <div
              className="w-1.5 h-1.5 bg-[#CC0000]/70 rounded-full animate-bounce"
              style={{ animationDelay: "150ms", animationDuration: "1s" }}
            />
            <div
              className="w-1.5 h-1.5 bg-[#CC0000]/40 rounded-full animate-bounce"
              style={{ animationDelay: "300ms", animationDuration: "1s" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
