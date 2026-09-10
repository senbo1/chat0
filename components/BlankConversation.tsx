import { ChatInput } from '@/components/ChatInput';

export function BlankConversation() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col justify-end px-4">
      <ChatInput />
    </main>
  );
}
