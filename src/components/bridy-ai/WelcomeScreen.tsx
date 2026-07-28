import React from "react";
import {
  SlidersHorizontal,
  MapPin,
  Calendar,
  ShieldCheck,
  Wrench,
  Car,
  ChevronRight,
} from "lucide-react";

interface WelcomeScreenProps {
  onPromptSelect: (prompt: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onPromptSelect,
}) => {
  const featureCards = [
    {
      icon: <SlidersHorizontal className="w-5 h-5 text-[#D71920]" />,
      title: "Compare Tyres",
      description: "Compare specs, wet grip, and wear durability across models",
      prompt: "Compare Bridgestone Turanza 6i vs Ecopia EP150 for my sedan",
    },
    {
      icon: <MapPin className="w-5 h-5 text-[#D71920]" />,
      title: "Find Dealer",
      description: "Locate certified Bridgestone stores & service centers nearby",
      prompt: "Find certified Bridgestone tyre dealers and service centers near me",
    },
    {
      icon: <Calendar className="w-5 h-5 text-[#D71920]" />,
      title: "Book Installation",
      description: "Schedule professional fitment, wheel alignment, and balancing",
      prompt: "I want to book a tyre installation appointment at a local dealer",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#D71920]" />,
      title: "Warranty Support",
      description: "Register new tyres and check coverage or file claims",
      prompt: "How do I register my new Bridgestone tyres for warranty coverage?",
    },
    {
      icon: <Wrench className="w-5 h-5 text-[#D71920]" />,
      title: "Tyre Care & Health",
      description: "Recommended pressure, rotation schedules, and tread checks",
      prompt: "What is the recommended tyre pressure and rotation interval for my vehicle?",
    },
    {
      icon: <Car className="w-5 h-5 text-[#D71920]" />,
      title: "Vehicle Compatibility",
      description: "Find precision OEM fitments for your make, model, and rim size",
      prompt: "Recommend the best Bridgestone tyres for a Hyundai Creta 17-inch rim",
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-10 overflow-y-auto bg-[#FFFDFC]">
      <div className="max-w-3xl w-full space-y-10 text-center">
        {/* Concierge Brand Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8EDEE] border border-[#EFE6E8] text-[#D71920] text-xs font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#D71920] animate-pulse" />
            Bridgestone Mobility Assistant
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold text-[#2D2D2D] tracking-tight leading-tight">
            How can Birdy assist your drive today?
          </h1>

          <p className="text-sm text-[#707070] leading-relaxed max-w-lg mx-auto font-normal">
            Personalized tyre recommendations, precision vehicle matching, dealer reservations, and enterprise fleet intelligence.
          </p>
        </div>

        {/* Quick Action Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
          {featureCards.map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={() => onPromptSelect(card.prompt)}
              className="group flex flex-col justify-between bg-[#FFFFFF] border border-[#EFE6E8] hover:border-[#D71920]/40 rounded-[20px] p-5 transition-all duration-200 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(215,25,32,0.06)] hover:bg-[#FAF5F6]"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#F8EDEE] flex items-center justify-center group-hover:scale-105 transition-transform">
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#2D2D2D] group-hover:text-[#D71920] transition-colors flex items-center justify-between">
                    {card.title}
                    <ChevronRight className="w-4 h-4 text-[#707070] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </h3>
                  <p className="text-xs text-[#707070] leading-relaxed mt-1">
                    {card.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Trust & Guarantee Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#707070]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B57]" />
            Official Bridgestone Intelligence
          </span>
          <span className="hidden sm:inline text-[#EFE6E8]">|</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B57]" />
            Certified Dealer Network
          </span>
          <span className="hidden sm:inline text-[#EFE6E8]">|</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B57]" />
            End-to-End Encrypted
          </span>
        </div>
      </div>
    </div>
  );
};
