/**
 * Fetch the list of available models from a LiteLLM proxy.
 *
 * LiteLLM exposes an OpenAI-compatible `/v1/models` endpoint that returns:
 * ```json
 * { "data": [ { "id": "gpt-3.5-turbo" }, … ] }
 * ```
 *
 * @param baseUrl Base URL of the LiteLLM deployment (e.g. https://llm.mycompany.com)
 * @param apiKey  Optional API key sent as `Authorization: Bearer <key>`
 * @returns An array of model IDs or `[]` on failure
 */
export async function fetchCustomModels(
  baseUrl: string,
  apiKey: string
): Promise<string[]> {
  if (!baseUrl) {
    return [];
  }

  try {
    const url = `${baseUrl.replace(/\/$/, '')}/v1/models`;
    const response = await fetch(url, {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
    });

    if (!response.ok) {
      console.error('Failed to fetch LiteLLM models:', response.statusText);
      return [];
    }

    const json = (await response.json()) as { data?: { id: string }[] };

    return Array.isArray(json.data) ? json.data.map((m) => m.id) : [];
  } catch (err) {
    console.error('Error fetching LiteLLM models:', err);
    return [];
  }
}