import { ChatShell } from '@/frontend/components/ChatShell';

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ChatShell>{children}</ChatShell>;
}
