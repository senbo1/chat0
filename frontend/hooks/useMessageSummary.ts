import { useCompletion } from '@ai-sdk/react';
import { useAPIKeyStore } from '@/frontend/stores/APIKeyStore';
import { useModelStore } from '@/frontend/stores/ModelStore';
import { toast } from 'sonner';
import { createMessageSummary, updateThread } from '@/frontend/dexie/queries';

interface MessageSummaryPayload {
  title: string;
  isTitle?: boolean;
  messageId: string;
  threadId: string;
}

export const useMessageSummary = () => {
  const getKey = useAPIKeyStore((state) => state.getKey);
  const { summaryModel, getLiteLLMBaseUrl } = useModelStore();

  const { complete: baseComplete, isLoading } = useCompletion({
    api: '/api/completion',
    headers: Object.fromEntries(
      Object.entries({
        'X-Google-API-Key': getKey('google'),
        'X-OpenAI-API-Key': getKey('openai'),
        'X-OpenRouter-API-Key': getKey('openrouter'),
        'X-LiteLLM-API-Key': getKey('litellm'),
        'X-LiteLLM-Base-Url': getLiteLLMBaseUrl(),
      }).filter(([, value]) => value) as [string, string][]
    ),
    onResponse: async (response) => {
      try {
        const payload: MessageSummaryPayload = await response.json();

        if (response.ok) {
          const { title, isTitle, messageId, threadId } = payload;

          if (isTitle) {
            await updateThread(threadId, title);
            await createMessageSummary(threadId, messageId, title);
          } else {
            await createMessageSummary(threadId, messageId, title);
          }
        } else {
          toast.error('Failed to generate a summary for the message');
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  // Wrap complete to always include the summaryModel in the payload
  const complete = (prompt: string, options?: any) => {
    const body = { ...options?.body, model: summaryModel };
    return baseComplete(prompt, { ...options, body });
  };

  return {
    complete,
    isLoading,
  };
};
