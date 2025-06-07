import {
  SidebarProvider,
  SidebarTrigger, // Import SidebarTrigger for the Sidebar opening and closing
  Sidebar, 
  SidebarInset, //Import SidebarInset as the main content wrapper
  useSidebar, // Import useSidebar to conditionally render the trigger
} from '@/frontend/components/ui/sidebar';

import ChatSidebar from '@/frontend/components/ChatSidebar';
import { Outlet } from 'react-router';
import { Button } from '@/frontend/components/ui/button'; 
import { PanelLeftIcon } from 'lucide-react'; 
import { cn } from '@/lib/utils'; 

export default function ChatLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <ChatSidebar />
        <SidebarInset className="relative flex-1">
          {/*
            This is the global toggle button.
            It's placed *outside* the ChatSidebar, ensuring it's always visible
            even when the main sidebar is off-screen.
          */}
          <GlobalSidebarToggleButton />

          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

/**
 * A standalone component for the sidebar toggle button.
 * It uses the sidebar context to determine its visibility and action.
 * Renders fixed, ensuring it's always accessible.
 */
function GlobalSidebarToggleButton() {
  const { toggleSidebar, open, isMobile } = useSidebar();

  const isButtonVisible = isMobile || !open;

  if (!isButtonVisible) {
    return null; 
  }

  return (
    <Button
      variant="ghost" 
      size="icon"     
      onClick={toggleSidebar} // Calls the context function to toggle
      className={cn(
        'fixed top-4 z-50', 
        'left-4',
      )}
      aria-label="Toggle Sidebar" 
    >
      <PanelLeftIcon className="h-5 w-5" /> 
    </Button>
  );
}