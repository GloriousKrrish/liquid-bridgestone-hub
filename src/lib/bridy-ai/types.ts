// Bridy AI — Core Type Definitions

export interface BridyMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  /** Sources cited in this response */
  citations?: Citation[];
  /** Whether the message is currently being streamed */
  isStreaming?: boolean;
  /** Suggested follow-up prompts */
  suggestedPrompts?: string[];
  /** Attached files metadata */
  attachments?: FileAttachment[];
  /** Intent detected by the AI */
  detectedIntent?: ConversationIntent;
}

export interface Citation {
  id: string;
  title: string;
  source: string;
  snippet: string;
  url?: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

export type ConversationIntent =
  | "tyre_recommendation"
  | "dealer_search"
  | "fleet_consultation"
  | "warranty_support"
  | "product_inquiry"
  | "lead_generation"
  | "general_support"
  | "document_analysis"
  | "corporate_info";

export interface Conversation {
  id: string;
  title: string;
  messages: BridyMessage[];
  createdAt: number;
  updatedAt: number;
  /** Primary intent of the conversation */
  intent?: ConversationIntent;
  /** Whether a lead was created from this conversation */
  leadId?: string;
}

export interface BridyAIState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isSidebarOpen: boolean;
  isStreaming: boolean;
}

export type AIProvider = "openai" | "gemini" | "claude";

export interface AIConfig {
  provider: AIProvider;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export interface StreamChunk {
  type: "token" | "done" | "error" | "citations" | "suggestions";
  content?: string;
  citations?: Citation[];
  suggestions?: string[];
  error?: string;
}

export interface ChatRequest {
  message: string;
  conversationId: string;
  history: { role: "user" | "assistant"; content: string }[];
}

export interface ChatResponse {
  success: boolean;
  text?: string;
  citations?: Citation[];
  suggestedPrompts?: string[];
  error?: string;
  detectedIntent?: ConversationIntent;
}
