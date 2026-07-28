import React from "react";
import type { Conversation } from "../../lib/bridy-ai/types";
import {
  Plus,
  MessageSquare,
  Trash2,
  X,
  Sparkles,
  ChevronLeft,
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

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeConversationId,
  isOpen,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onClose,
}) => {
  // Group conversations by date
  const grouped = groupByDate(conversations);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 z-50 lg:z-auto
          h-full w-[280px] bg-[#0a0c14] border-r border-white/[0.06]
          flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          lg:w-[260px] shrink-0
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#CC0000] to-[#8B0000] flex items-center justify-center">
              <Sparkles size={11} className="text-white" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide">
              Bridy AI
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-white/40 hover:text-white p-1 rounded-md hover:bg-white/5 transition-all cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            type="button"
            onClick={onNewChat}
            className="w-full flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] rounded-xl px-3 py-2.5 text-[12px] text-white/70 hover:text-white transition-all cursor-pointer group"
          >
            <Plus size={14} className="text-white/40 group-hover:text-[#CC0000] transition-colors" />
            New Conversation
          </button>
        </div>

        {/* Conversation List */}
        <div
          className="flex-1 overflow-y-auto px-2 pb-4 space-y-4"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent" }}
        >
          {Object.entries(grouped).map(([label, convos]) => (
            <div key={label}>
              <h4 className="text-[9px] uppercase tracking-wider text-white/25 font-bold px-2 mb-1.5">
                {label}
              </h4>
              <div className="space-y-0.5">
                {convos.map((conv) => (
                  <div
                    key={conv.id}
                    className={`group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                      conv.id === activeConversationId
                        ? "bg-white/[0.08] text-white"
                        : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                    }`}
                    onClick={() => onSelectConversation(conv.id)}
                  >
                    <MessageSquare size={12} className="shrink-0 opacity-40" />
                    <span className="text-[11px] truncate flex-1">
                      {conv.title}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 p-0.5 rounded transition-all cursor-pointer"
                      aria-label="Delete conversation"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {conversations.length === 0 && (
            <div className="px-3 py-8 text-center">
              <MessageSquare size={20} className="mx-auto text-white/10 mb-2" />
              <p className="text-[10px] text-white/20">
                No conversations yet
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 px-2">
            <div className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center">
              <span className="text-[9px] text-white/40 font-bold">G</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-white/50 truncate">Guest User</p>
              <p className="text-[9px] text-white/25">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

/**
 * Group conversations by relative date labels
 */
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
