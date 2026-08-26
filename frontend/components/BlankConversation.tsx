import { ArrowUpIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function BlankConversation() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col justify-end px-4">
      <div className="rounded-t-[20px] bg-secondary p-2 pb-0 shadow-sm">
        <Textarea
          aria-describedby="chat-input-description"
          aria-label="Chat message input"
          className="min-h-18 resize-none border-none bg-transparent px-4 py-3 shadow-none focus-visible:ring-0 dark:bg-transparent"
          defaultValue=""
          name="message"
          placeholder="What can I do for you?"
        />
        <span id="chat-input-description" className="sr-only">
          Start a new conversation
        </span>
        <div className="flex h-14 items-center justify-end px-2">
          <Button
            aria-label="Send message"
            disabled
            size="icon"
            title="Send message"
            type="button"
          >
            <ArrowUpIcon size={18} />
          </Button>
        </div>
      </div>
    </main>
  );
}
