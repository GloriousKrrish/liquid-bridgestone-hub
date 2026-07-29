import React, { useState } from "react";
import type { Conversation } from "../../lib/bridy-ai/types";
import {
  Plus,
  MessageSquare,
  Trash2,
  ChevronLeft,
  Sparkles,
  Bookmark,
  Calendar,
  ShieldCheck,
  MapPin,
  Settings,
} from "lucide-react";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  isOpen: boolean;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onClose: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = React.memo(({
  conversations,
  activeConversationId,
  isOpen,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<string>("chats");
  const grouped = groupByDate(conversations);

  const mainNavItems = [
    {
      id: "welcome",
      label: "Welcome",
      icon: <Sparkles className="w-4 h-4" />,
      onClick: () => {
        onNewChat();
        setActiveSection("welcome");
      },
    },
    {
      id: "saved",
      label: "Saved Recommendations",
      icon: <Bookmark className="w-4 h-4" />,
      badge: "3",
    },
    {
      id: "bookings",
      label: "Bookings & Appointments",
      icon: <Calendar className="w-4 h-4" />,
      badge: "1",
    },
    {
      id: "warranty",
      label: "Warranty & Protection",
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      id: "dealers",
      label: "Preferred Dealers",
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      id: "settings",
      label: "Concierge Settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#2D2D2D]/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 z-50 lg:z-auto
          h-full w-[300px] lg:w-[280px] bg-[#FFF8F8] border-r border-[#EFE6E8]
          flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          shrink-0 shadow-sm
        `}
      >
        {/* Header Branding */}
        <div className="p-5 border-b border-[#EFE6E8] flex items-center justify-between bg-[#FFFFFF]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center">
              <img src="/bridgestone-logo-photoroom.png" alt="Bridgestone" className="w-full h-full object-contain" draggable={false} />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-[#2D2D2D] tracking-wide">
                Bridgestone Birdy AI
              </h2>
              <p className="text-[11px] text-[#707070]">Mobility Concierge</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-[#707070] hover:text-[#2D2D2D] p-1.5 rounded-lg hover:bg-[#FAF5F6] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Start New Consultation Button */}
        <div className="p-4 bg-[#FFF8F8]">
          <button
            type="button"
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 bg-[#FFFFFF] hover:bg-[#F8EDEE] border border-[#EFE6E8] hover:border-[#D71920]/40 rounded-xl px-4 py-3 text-xs font-semibold text-[#2D2D2D] hover:text-[#D71920] transition-all cursor-pointer shadow-sm group"
          >
            <Plus className="w-4 h-4 text-[#D71920] group-hover:scale-110 transition-transform" />
            New Consultation
          </button>
        </div>

        {/* Navigation Sections */}
        <div
          className="flex-1 overflow-y-auto px-3 py-2 space-y-6"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Quick Hub Navigation */}
          <div className="space-y-1">
            <h4 className="text-[10px] uppercase tracking-wider text-[#707070] font-bold px-3 mb-2">
              Concierge Hub
            </h4>
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.onClick) item.onClick();
                  else setActiveSection(item.id);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeSection === item.id && activeConversationId === null
                    ? "bg-[#F8EDEE] text-[#D71920] font-semibold"
                    : "text-[#707070] hover:bg-[#FAF5F6] hover:text-[#2D2D2D]"
                }`}
              >
                <span className={activeSection === item.id ? "text-[#D71920]" : "text-[#707070]"}>
                  {item.icon}
                </span>
                <span className="flex-1 text-left truncate">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] bg-[#F8EDEE] text-[#D71920] font-semibold px-2 py-0.5 rounded-full border border-[#EFE6E8]">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Recent Conversations */}
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-[#707070] font-bold px-3 mb-2">
              Recent Consultations
            </h4>

            {Object.keys(grouped).length === 0 ? (
              <div className="px-3 py-6 text-center rounded-xl border border-dashed border-[#EFE6E8] bg-[#FFFFFF]/50">
                <MessageSquare className="w-5 h-5 mx-auto text-[#707070]/40 mb-1.5" />
                <p className="text-xs text-[#707070]">No recent consultations</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(grouped).map(([label, convos]) => (
                  <div key={label} className="space-y-1">
                    <p className="text-[10px] text-[#707070] font-medium px-3">
                      {label}
                    </p>
                    <div className="space-y-0.5">
                      {convos.map((conv) => {
                        const isActive = conv.id === activeConversationId;
                        return (
                          <div
                            key={conv.id}
                            className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                              isActive
                                ? "bg-[#FFFFFF] text-[#2D2D2D] font-semibold border border-[#EFE6E8] shadow-sm"
                                : "text-[#707070] hover:bg-[#FAF5F6] hover:text-[#2D2D2D]"
                            }`}
                            onClick={() => {
                              onSelectConversation(conv.id);
                              setActiveSection("chats");
                            }}
                          >
                            <MessageSquare
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isActive ? "text-[#D71920]" : "text-[#707070]"
                              }`}
                            />
                            <span className="text-xs truncate flex-1 leading-snug">
                              {conv.title}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteConversation(conv.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-[#707070] hover:text-[#D71920] p-1 rounded-lg hover:bg-[#F8EDEE] transition-all cursor-pointer"
                              aria-label="Delete conversation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User Concierge Footer */}
        <div className="p-4 border-t border-[#EFE6E8] bg-[#FFFFFF]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F8EDEE] border border-[#EFE6E8] flex items-center justify-center text-[#D71920] font-semibold text-xs">
              M
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#2D2D2D] truncate">
                Mobility Guest
              </p>
              <p className="text-[11px] text-[#707070] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B57]" />
                Bridgestone Preferred
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
});

function groupByDate(conversations: Conversation[]): Record<string, Conversation[]> {
  const now = Date.now();
  const DAY = 86400000;
  const groups: Record<string, Conversation[]> = {};

  for (const conv of conversations) {
    const age = now - conv.updatedAt;
    let label: string;

    if (age < DAY) label = "Today";
    else if (age < DAY * 2) label = "Yesterday";
    else if (age < DAY * 7) label = "This Week";
    else if (age < DAY * 30) label = "This Month";
    else label = "Older";

    if (!groups[label]) groups[label] = [];
    groups[label].push(conv);
  }

  return groups;
}
