import { useCompletion } from "@ai-sdk/react";
import { useAPIKeyStore } from "@/frontend/stores/APIKeyStore";
import { toast } from "sonner";
import { createMessageSummary, updateThread } from "@/frontend/dexie/queries";
import { useTitleLoadingStore } from "@/frontend/stores/TitleLoadingStore";

interface MessageSummaryPayload {
  title: string;
  isTitle?: boolean;
  messageId: string;
  threadId: string;
}

export const useMessageSummary = () => {
  const getFirstAvailableKey = useAPIKeyStore(
    (state) => state.getFirstAvailableKey
  );
  const setLoading = useTitleLoadingStore((state) => state.setLoading);

  const availableKey = getFirstAvailableKey();

  const { complete, isLoading } = useCompletion({
    api: "/api/completion",
    headers: availableKey
      ? {
          [`X-${
            availableKey.provider === "google"
              ? "Google"
              : availableKey.provider === "openai"
              ? "OpenAI"
              : "OpenRouter"
          }-API-Key`]: availableKey.key,
        }
      : {},
    onResponse: async (response) => {
      try {
        const payload: MessageSummaryPayload = await response.json();

        if (response.ok) {
          const { title, isTitle, messageId, threadId } = payload;

          if (isTitle) {
            await updateThread(threadId, title);
            await createMessageSummary(threadId, messageId, title);
            setLoading(threadId, false);
          } else {
            await createMessageSummary(threadId, messageId, title);
          }
        } else {
          toast.error("Failed to generate a summary for the message");
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const completeWithLoading = (
    prompt: string,
    options: {
      body: { threadId: string; messageId: string; isTitle?: boolean };
    }
  ) => {
    if (options.body.isTitle) {
      setLoading(options.body.threadId, true);
    }
    return complete(prompt, options);
  };

  return {
    complete: completeWithLoading,
    isLoading,
  };
};
