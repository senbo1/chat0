import { ChatSidebar } from '@/components/ChatSidebar';
import {
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export function ChatShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ChatSidebar />
      <ShellSidebarTrigger />
      <div className="relative min-w-0 flex-1">{children}</div>
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
