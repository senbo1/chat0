import { ChatShell } from '@/components/ChatShell';

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ChatShell>{children}</ChatShell>;
}
