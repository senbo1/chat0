import { Provider } from '@/frontend/stores/APIKeyStore';
import { MODEL_HEADER_KEYS, MODEL_PROVIDERS } from '@/lib/constants';

export const AI_MODELS = [
  'Deepseek R1 0528',
  'Deepseek V3',
  'Gemini 2.5 Pro',
  'Gemini 2.5 Flash',
  'GPT-4o',
  'GPT-4.1-mini',
] as const;

export type AIModel = (typeof AI_MODELS)[number];

export type ModelConfig = {
  modelId: string;
  provider: Provider;
  headerKey: string;
};

export const MODEL_CONFIGS = {
  'Deepseek R1 0528': {
    modelId: 'deepseek/deepseek-r1-0528:free',
    provider: MODEL_PROVIDERS.OPEN_ROUTER,
    headerKey: MODEL_HEADER_KEYS[MODEL_PROVIDERS.OPEN_ROUTER],
  },
  'Deepseek V3': {
    modelId: 'deepseek/deepseek-chat-v3-0324:free',
    provider: MODEL_PROVIDERS.OPEN_ROUTER,
    headerKey: MODEL_HEADER_KEYS[MODEL_PROVIDERS.OPEN_ROUTER],
  },
  'Gemini 2.5 Pro': {
    modelId: 'gemini-2.5-pro-preview-05-06',
    provider: MODEL_PROVIDERS.GOOGLE,
    headerKey: MODEL_HEADER_KEYS[MODEL_PROVIDERS.GOOGLE],
  },
  'Gemini 2.5 Flash': {
    modelId: 'gemini-2.5-flash-preview-04-17',
    provider: MODEL_PROVIDERS.GOOGLE,
    headerKey: MODEL_HEADER_KEYS[MODEL_PROVIDERS.GOOGLE],
  },
  'GPT-4o': {
    modelId: 'gpt-4o',
    provider: MODEL_PROVIDERS.OPEN_AI,
    headerKey: MODEL_HEADER_KEYS[MODEL_PROVIDERS.OPEN_AI],
  },
  'GPT-4.1-mini': {
    modelId: 'gpt-4.1-mini',
    provider: MODEL_PROVIDERS.OPEN_AI,
    headerKey: MODEL_HEADER_KEYS[MODEL_PROVIDERS.OPEN_AI],
  },
} as const satisfies Record<AIModel, ModelConfig>;

export const getModelConfig = (modelName: AIModel): ModelConfig => {
  return MODEL_CONFIGS[modelName];
};
