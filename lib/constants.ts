import { Provider } from '@/frontend/stores/APIKeyStore';

const GOOGLE = 'google';
const OPEN_ROUTER = 'openrouter';
const OPEN_AI = 'openai';

export const MODEL_PROVIDERS: {
  [key: string]: Provider;
} = {
  GOOGLE,
  OPEN_ROUTER,
  OPEN_AI,
} as const;

export const MODEL_HEADER_KEYS: Record<Provider, string> = {
  [OPEN_ROUTER]: 'X-OpenRouter-API-Key',
  [GOOGLE]: 'X-Google-API-Key',
  [OPEN_AI]: 'X-OpenAI-API-Key',
} as const;
