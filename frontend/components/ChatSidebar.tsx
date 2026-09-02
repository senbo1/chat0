import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/frontend/components/ui/sidebar';
import { deleteThread, getThreads } from '@/frontend/dexie/queries';
import { cn } from '@/lib/utils';
import { useLiveQuery } from 'dexie-react-hooks';
import { X } from 'lucide-react';
import { memo, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import APIKeyForm from './APIKeyForm';
import { Button, buttonVariants } from './ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';

export default function ChatSidebar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const threads = useLiveQuery(() => getThreads(), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === 'o'
      ) {
        e.preventDefault();
        navigate('/chat');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <Sidebar>
      <div className='flex flex-col h-full p-2'>
        <Header />
        <SidebarContent className='no-scrollbar'>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {threads?.map((thread) => {
                  return (
                    <SidebarMenuItem key={thread.id}>
                      <div
                        className={cn(
                          'cursor-pointer group/thread h-9 flex items-center px-2 py-1 rounded-[8px] overflow-hidden w-full hover:bg-secondary',
                          id === thread.id && 'bg-secondary'
                        )}
                        onClick={() => {
                          if (id === thread.id) {
                            return;
                          }
                          navigate(`/chat/${thread.id}`);
                        }}
                      >
                        <span className='truncate block'>{thread.title}</span>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='flex ml-auto h-7 w-7 opacity-100 md:opacity-0 md:group-hover/thread:opacity-100 transition-opacity'
                          aria-label={`Delete ${thread.title}`}
                          onClick={async (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            await deleteThread(thread.id);
                            navigate(`/chat`);
                          }}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <Footer />
      </div>
    </Sidebar>
  );
}

function PureHeader() {
  return (
    <SidebarHeader className='flex justify-between items-center gap-4 relative'>
      <SidebarTrigger className='absolute right-1 top-2.5' />
      <h1 className='text-2xl font-bold'>
        Chat<span className=''>0</span>
      </h1>
      <Link
        to='/chat'
        className={buttonVariants({
          variant: 'default',
          className: 'w-full',
        })}
      >
        New Chat
      </Link>
    </SidebarHeader>
  );
}

const Header = memo(PureHeader);

const PureFooter = () => {
  return (
    <SidebarFooter>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>Settings</Button>
        </DialogTrigger>
        <DialogTitle />
        <DialogContent className='p-0'>
          <APIKeyForm />
        </DialogContent>
      </Dialog>
    </SidebarFooter>
  );
};

const Footer = memo(PureFooter);
