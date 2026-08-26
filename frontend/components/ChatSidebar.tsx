'use client';

import { PlusIcon } from 'lucide-react';

import { Button } from '@/frontend/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from '@/frontend/components/ui/sidebar';

type ChatSidebarProps = {
  onNewConversation: () => void;
};

export function ChatSidebar({ onNewConversation }: ChatSidebarProps) {
  return (
    <Sidebar>
      <div className="flex h-full flex-col p-2">
        <SidebarHeader className="relative gap-4">
          <div className="flex h-8 items-center justify-between px-2">
            <h1 className="text-2xl font-bold">Chat0</h1>
            <SidebarTrigger />
          </div>
          <Button className="w-full" onClick={onNewConversation}>
            <PlusIcon size={16} />
            New chat
            <kbd className="ml-auto text-xs font-normal opacity-70">⌘ ⇧ O</kbd>
          </Button>
        </SidebarHeader>
        <SidebarContent />
      </div>
    </Sidebar>
  );
}
