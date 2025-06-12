import { Provider } from "@/frontend/stores/APIKeyStore";

export interface APIValidationResult {
  isValid: boolean;
  error?: string;
}

async function validateOpenAI(apiKey: string): Promise<APIValidationResult> {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      return { isValid: true };
    } else {
      return { isValid: false, error: "OpenAI key not valid" };
    }
  } catch {
    return { isValid: false, error: "Unable to validate OpenAI key" };
  }
}

async function validateGoogle(apiKey: string): Promise<APIValidationResult> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
      {
        method: "GET",
      }
    );

    if (response.ok) {
      return { isValid: true };
    } else {
      return { isValid: false, error: "Google key not valid" };
    }
  } catch {
    return { isValid: false, error: "Unable to validate Google key" };
  }
}

async function validateOpenRouter(
  apiKey: string
): Promise<APIValidationResult> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/auth/key", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      return { isValid: true };
    } else {
      return { isValid: false, error: "OpenRouter key not valid" };
    }
  } catch {
    return { isValid: false, error: "Unable to validate OpenRouter key" };
  }
}

export async function validateAPIKey(
  provider: Provider,
  apiKey: string
): Promise<APIValidationResult> {
  if (!apiKey || apiKey.trim().length === 0) {
    return { isValid: false, error: "API key is required" };
  }

  switch (provider) {
    case "openai":
      return validateOpenAI(apiKey);
    case "google":
      return validateGoogle(apiKey);
    case "openrouter":
      return validateOpenRouter(apiKey);
    default:
      return { isValid: false, error: "Unknown provider" };
  }
}
