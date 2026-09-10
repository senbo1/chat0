'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ChatSidebar } from '@/components/ChatSidebar';
import ThemeToggler from '@/components/ui/ThemeToggler';
import {
  SidebarProvider,
  SidebarTrigger,
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
  return (
    <>
      <SidebarTrigger className="fixed left-4 top-4 z-20 md:hidden" />
      <SidebarTrigger className="invisible fixed left-4 top-4 z-20 hidden opacity-0 transition-[opacity,visibility] delay-0 duration-0 peer-data-[state=collapsed]:delay-100 peer-data-[state=collapsed]:visible peer-data-[state=collapsed]:opacity-100 md:inline-flex" />
    </>
  );
}
