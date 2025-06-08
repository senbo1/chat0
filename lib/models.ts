import { Provider } from "@/frontend/stores/APIKeyStore";

export const AI_MODELS = [
  "Deepseek R1 0528",
  "Deepseek V3",
  "Gemini 2.5 Pro",
  "Gemini 2.5 Flash",
  "GPT-4o",
  "GPT-4.1-mini",
] as const;

export type AIModel = (typeof AI_MODELS)[number];

export type ModelConfig = {
  modelId: string;
  provider: Provider;
  headerKey: string;
};

export const MODEL_CONFIGS = {
  "Deepseek R1 0528": {
    modelId: "deepseek/deepseek-r1-0528:free",
    provider: "openrouter",
    headerKey: "X-OpenRouter-API-Key",
  },
  "Deepseek V3": {
    modelId: "deepseek/deepseek-chat-v3-0324:free",
    provider: "openrouter",
    headerKey: "X-OpenRouter-API-Key",
  },
  "Gemini 2.5 Pro": {
    modelId: "gemini-2.5-pro-preview-05-06",
    provider: "google",
    headerKey: "X-Google-API-Key",
  },
  "Gemini 2.5 Flash": {
    modelId: "gemini-2.5-flash-preview-04-17",
    provider: "google",
    headerKey: "X-Google-API-Key",
  },
  "GPT-4o": {
    modelId: "gpt-4o",
    provider: "openai",
    headerKey: "X-OpenAI-API-Key",
  },
  "GPT-4.1-mini": {
    modelId: "gpt-4.1-mini",
    provider: "openai",
    headerKey: "X-OpenAI-API-Key",
  },
} as const satisfies Record<AIModel, ModelConfig>;

export const getModelConfig = (modelName: AIModel): ModelConfig => {
  return MODEL_CONFIGS[modelName];
};

export const getProviderHeaderKey = (provider: Provider): string => {
  const config = Object.values(MODEL_CONFIGS).find(
    (c) => c.provider === provider
  );
  return (
    config?.headerKey ||
    `X-${provider.charAt(0).toUpperCase() + provider.slice(1)}-API-Key`
  );
};
