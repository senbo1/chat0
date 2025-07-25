import { Provider } from "@/frontend/stores/APIKeyStore";

export const MODEL_PROVIDERS: {
  [key: string]: Provider;
} = {
  GOOGLE: "google",
  OPEN_ROUTER: "openrouter",
  OPEN_AI: "openai",
} as const;
