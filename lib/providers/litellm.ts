import { createOpenAI } from '@ai-sdk/openai';

/**
 * Factory for an AI-SDK provider that talks to a LiteLLM deployment.
 *
 * LiteLLM behaves like an OpenAI-compatible proxy, so we simply wrap the
 * built-in OpenAI provider while overriding the `baseURL`.
 *
 * Example
 * -------
 * ```ts
 * const litellm = createLiteLLM({
 *   apiKey: '<optional-key>',
 *   baseURL: 'https://my-litellm.example.com'
 * });
 *
 * const model = litellm('gpt-4o-mini');
 * const result = await streamText({ model, messages });
 * ```
 */
export function createLiteLLM({
  apiKey,
  baseURL,
}: {
  apiKey: string;
  baseURL?: string;
}) {
  // The OpenAI provider already supports a `baseURL` override.
  const openai = createOpenAI({ apiKey, baseURL });

  /**
   * Returns an AI-SDK `LanguageModel` bound to `modelId`.
   *
   * Usage mirrors the canonical OpenAI provider:
   * ```ts
   * const model = litellm('gpt-3.5-turbo');
   * ```
   */
  return (modelId: string) => openai(modelId);
}

export type LiteLLMProvider = ReturnType<ReturnType<typeof createLiteLLM>>;