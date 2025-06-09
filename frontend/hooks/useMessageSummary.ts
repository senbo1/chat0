import { useCompletion } from '@ai-sdk/react';
import { useAPIKeyStore } from '@/frontend/stores/APIKeyStore';
import { createMessageSummary, updateThread } from '@/frontend/dexie/queries';

interface MessageSummaryPayload {
  title: string;
  isTitle?: boolean;
  messageId: string;
  threadId: string;
}

export const useMessageSummary = () => {
  const getKey = useAPIKeyStore((state) => state.getKey);

  const { complete, isLoading } = useCompletion({
    api: '/api/completion',
    ...(getKey('google') && {
      headers: { 'X-Google-API-Key': getKey('google')! },
    }),
    onResponse: async (response) => {
      try {
        const payload: MessageSummaryPayload = await response.json();

        const { title, isTitle, messageId, threadId } = payload;

          if (isTitle) {
            await updateThread(threadId, title);
            await createMessageSummary(threadId, messageId, title);
          } else {
            await createMessageSummary(threadId, messageId, title);
          }
      } catch (error) {
        console.error(error);
      }
    },
  });

  return {
    complete,
    isLoading,
  };
};
