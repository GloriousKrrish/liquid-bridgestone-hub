// Bridy AI — Client-side Conversation Store (localStorage persistence)

import type { Conversation, BridyMessage } from "./types";
import { BRIDY_AI_CONFIG, WELCOME_MESSAGE } from "./constants";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function generateTitle(firstMessage: string): string {
  const cleaned = firstMessage.replace(/[#*_~`]/g, "").trim();
  if (cleaned.length <= 40) return cleaned;
  return cleaned.slice(0, 37) + "…";
}

export function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(BRIDY_AI_CONFIG.storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a: Conversation, b: Conversation) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  try {
    localStorage.setItem(BRIDY_AI_CONFIG.storageKey, JSON.stringify(conversations));
  } catch {
    // Storage quota exceeded — remove oldest conversations
    const trimmed = conversations.slice(0, 50);
    localStorage.setItem(BRIDY_AI_CONFIG.storageKey, JSON.stringify(trimmed));
  }
}

export function createConversation(): Conversation {
  const now = Date.now();
  const welcomeMsg: BridyMessage = {
    id: generateId(),
    role: "assistant",
    content: WELCOME_MESSAGE,
    timestamp: now,
    suggestedPrompts: [
      "I need help finding the right tyre for my car",
      "Find Bridgestone dealers near me",
      "I manage a fleet and need optimization help",
      "Tell me about Bridgestone's warranty policy",
    ],
  };

  return {
    id: generateId(),
    title: "New Conversation",
    messages: [welcomeMsg],
    createdAt: now,
    updatedAt: now,
  };
}

export function addMessageToConversation(
  conversation: Conversation,
  message: Omit<BridyMessage, "id" | "timestamp">
): { conversation: Conversation; message: BridyMessage } {
  const fullMessage: BridyMessage = {
    ...message,
    id: generateId(),
    timestamp: Date.now(),
  };

  const updatedConversation: Conversation = {
    ...conversation,
    messages: [...conversation.messages, fullMessage],
    updatedAt: Date.now(),
  };

  // Auto-title from first user message
  if (
    conversation.title === "New Conversation" &&
    fullMessage.role === "user"
  ) {
    updatedConversation.title = generateTitle(fullMessage.content);
  }

  return { conversation: updatedConversation, message: fullMessage };
}

export function getConversationHistory(
  conversation: Conversation,
  maxMessages: number = BRIDY_AI_CONFIG.maxHistoryMessages
): { role: "user" | "assistant"; content: string }[] {
  return conversation.messages
    .filter((m) => m.role !== "system")
    .slice(-maxMessages)
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));
}

export function deleteConversation(
  conversations: Conversation[],
  conversationId: string
): Conversation[] {
  return conversations.filter((c) => c.id !== conversationId);
}

export function clearAllConversations(): void {
  localStorage.removeItem(BRIDY_AI_CONFIG.storageKey);
}
