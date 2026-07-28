import React from "react";
import { SUGGESTED_PROMPTS } from "../../lib/bridy-ai/constants";
import { Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  onPromptSelect: (prompt: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onPromptSelect,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full space-y-10 text-center">
        {/* Brand Header */}
        <div className="space-y-4">
          {/* Animated Logo */}
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-[#CC0000]/20 blur-[40px] rounded-full" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#CC0000] to-[#8B0000] flex items-center justify-center shadow-2xl shadow-[#CC0000]/30 border border-[#CC0000]/20">
              <span className="text-2xl font-black text-white tracking-tighter">B</span>
              <Sparkles
                size={14}
                className="absolute -top-1.5 -right-1.5 text-white/80 animate-pulse"
              />
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Bridy AI
            </h1>
            <p className="text-sm text-white/40 mt-1">
              Bridgestone Digital Intelligence
            </p>
          </div>

          <p className="text-[13px] text-white/50 leading-relaxed max-w-md mx-auto">
            Your intelligent Bridgestone assistant for tyre recommendations,
            dealer locations, fleet solutions, warranty support, and product
            information.
          </p>
        </div>

        {/* Prompt Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
          {SUGGESTED_PROMPTS.welcome.map((prompt) => (
            <button
              key={prompt.title}
              type="button"
              onClick={() => onPromptSelect(prompt.prompt)}
              className="group text-left bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] rounded-xl p-4 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{prompt.icon}</span>
                <div className="space-y-1">
                  <h3 className="text-[13px] font-semibold text-white/80 group-hover:text-white transition-colors">
                    {prompt.title}
                  </h3>
                  <p className="text-[11px] text-white/35 group-hover:text-white/50 leading-relaxed transition-colors">
                    {prompt.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 text-[9px] text-white/20 uppercase tracking-widest">
          <span>Enterprise Grade</span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span>End-to-End Encrypted</span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span>Powered by AI</span>
        </div>
      </div>
    </div>
  );
};
