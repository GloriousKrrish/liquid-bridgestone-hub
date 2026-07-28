// Bridy AI — Constants & Configuration

export const BRIDY_AI_CONFIG = {
  name: "Bridy AI",
  tagline: "Bridgestone Digital Intelligence",
  version: "1.0.0",
  maxHistoryMessages: 20,
  maxInputLength: 4000,
  storageKey: "bridy-ai-conversations",
  debounceMs: 150,
} as const;

export const WELCOME_MESSAGE =
  "Hello, I'm Bridy AI — your intelligent Bridgestone assistant. I can help with tyre recommendations, dealer locations, fleet solutions, warranty support, product information, and Bridgestone services. How may I assist you today?";

export const SUGGESTED_PROMPTS = {
  welcome: [
    {
      icon: "🔍",
      title: "Find the Right Tyre",
      description: "Get personalized recommendations for your vehicle",
      prompt: "I need help finding the right tyre for my car. Can you recommend options?",
    },
    {
      icon: "📍",
      title: "Locate a Dealer",
      description: "Find Bridgestone dealers and service centers near you",
      prompt: "Find Bridgestone dealers near me",
    },
    {
      icon: "🚛",
      title: "Fleet Solutions",
      description: "Optimize your fleet tyre management and reduce TCO",
      prompt: "I manage a fleet of vehicles and need help with tyre optimization",
    },
    {
      icon: "📋",
      title: "Warranty Support",
      description: "Check warranty status and file claims",
      prompt: "I need help with a tyre warranty claim",
    },
  ],
  followUp: {
    tyre_recommendation: [
      "Compare this with other options",
      "Where can I buy this tyre near me?",
      "What's the expected tyre life?",
      "Is this tyre good for monsoon driving?",
    ],
    dealer_search: [
      "Show me directions to the nearest one",
      "Do they have my tyre size in stock?",
      "What are their service charges?",
      "Can I book an appointment?",
    ],
    fleet_consultation: [
      "Calculate my fleet TCO savings",
      "Recommend a maintenance schedule",
      "Compare retreading vs new tyres",
      "What fleet management tools do you offer?",
    ],
    general_support: [
      "Tell me about Bridgestone's latest products",
      "What makes Bridgestone tyres different?",
      "How do I check my tyre pressure correctly?",
      "What are the signs I need new tyres?",
    ],
  },
} as const;

export const INTENT_LABELS: Record<string, string> = {
  tyre_recommendation: "Tyre Recommendation",
  dealer_search: "Dealer Locator",
  fleet_consultation: "Fleet Solutions",
  warranty_support: "Warranty Support",
  product_inquiry: "Product Information",
  lead_generation: "Sales Inquiry",
  general_support: "General Support",
  document_analysis: "Document Analysis",
  corporate_info: "Corporate Information",
};
