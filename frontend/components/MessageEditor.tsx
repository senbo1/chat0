import {
  createMessage,
  deleteTrailingMessages,
  createMessageSummary,
} from '@/frontend/dexie/queries';
import { UseChatHelpers, useCompletion } from '@ai-sdk/react';
import { useState } from 'react';
import { UIMessage } from 'ai';
import { Dispatch, SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useAPIKeyStore } from '@/frontend/stores/APIKeyStore';
import { toast } from 'sonner';
import { useModelStore } from '../stores/ModelStore';
import { MODEL_PROVIDERS } from '@/lib/constants';
import { getModelConfig } from '@/lib/models';

export default function MessageEditor({
  threadId,
  message,
  content,
  setMessages,
  reload,
  setMode,
  stop,
}: {
  threadId: string;
  message: UIMessage;
  content: string;
  setMessages: UseChatHelpers['setMessages'];
  setMode: Dispatch<SetStateAction<'view' | 'edit'>>;
  reload: UseChatHelpers['reload'];
  stop: UseChatHelpers['stop'];
}) {
  const [draftContent, setDraftContent] = useState(content);
  const getKey = useAPIKeyStore((state) => state.getKey);
  const { selectedModel } = useModelStore();

  const { complete } = useCompletion({
    api: '/api/completion',
    ...(getKey(MODEL_PROVIDERS.GOOGLE) && {
      headers: { 'X-Google-API-Key': getKey(MODEL_PROVIDERS.GOOGLE)! },
    }),
    onResponse: async (response) => {
      try {
        const payload = await response.json();

        if (response.ok) {
          const { title, messageId, threadId } = payload;
          await createMessageSummary(threadId, messageId, title);
        } else {
          toast.error(
            payload.error || 'Failed to generate a summary for the message'
          );
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleSave = async () => {
    try {
      await deleteTrailingMessages(threadId, message.createdAt as Date);

      const updatedMessage = {
        ...message,
        id: uuidv4(),
        content: draftContent,
        parts: [
          {
            type: 'text' as const,
            text: draftContent,
          },
        ],
        createdAt: new Date(),
      };

      await createMessage(threadId, updatedMessage);

      setMessages((messages) => {
        const index = messages.findIndex((m) => m.id === message.id);

        if (index !== -1) {
          return [...messages.slice(0, index), updatedMessage];
        }

        return messages;
      });

      if (getModelConfig(selectedModel).provider === MODEL_PROVIDERS.GOOGLE) {
        complete(draftContent, {
          body: {
            messageId: updatedMessage.id,
            threadId,
          },
        });
      }
      setMode('view');

      // stop the current stream if any
      stop();

      setTimeout(() => {
        reload();
      }, 0);
    } catch (error) {
      console.error('Failed to save message:', error);
      toast.error('Failed to save message');
    }
  };

  return (
    <div>
      <Textarea
        value={draftContent}
        onChange={(e) => setDraftContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
          }
        }}
      />
      <div className="flex gap-2 mt-2">
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={() => setMode('view')}>Cancel</Button>
      </div>
    </div>
  );
}
