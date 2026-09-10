'use client';

import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export function ChatSidebar() {
  return (
    <Sidebar>
      <div className="flex h-full flex-col p-2">
        <SidebarHeader className="relative gap-4">
          <div className="flex h-8 items-center justify-between px-2">
            <h1 className="text-2xl font-bold">Chat0</h1>
            <SidebarTrigger />
          </div>
          <Link className={buttonVariants({ className: 'w-full' })} href="/chat">
            <PlusIcon size={16} />
            New chat
          </Link>
        </SidebarHeader>
        <SidebarContent />
      </div>
    </Sidebar>
  );
}
