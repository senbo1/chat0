'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ChatSidebar } from '@/components/ChatSidebar';
import ThemeToggler from '@/components/ui/ThemeToggler';
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

export function ChatShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [conversationKey, setConversationKey] = useState(0);

  const startNewConversation = useCallback(() => {
    setConversationKey((key) => key + 1);
    router.push('/chat');
  }, [router]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.shiftKey &&
        event.key.toLowerCase() === 'o'
      ) {
        event.preventDefault();
        startNewConversation();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [startNewConversation]);

  return (
    <SidebarProvider>
      <ChatSidebar onNewConversation={startNewConversation} />
      <ShellSidebarTrigger />
      <div className="relative min-w-0 flex-1" key={conversationKey}>
        {children}
      </div>
      <ThemeToggler />
    </SidebarProvider>
  );
}

function ShellSidebarTrigger() {
  const { state } = useSidebar();

  return (
    <>
      <SidebarTrigger className="fixed left-4 top-4 z-20 md:hidden" />
      {state === 'collapsed' ? (
        <SidebarTrigger className="fixed left-4 top-4 z-20 hidden md:inline-flex" />
      ) : null}
    </>
  );
}
