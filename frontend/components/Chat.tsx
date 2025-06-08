"use client"

import { useEffect, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react';
import Messages from './Messages';
import ChatInput from './ChatInput';
import ChatNavigator from './ChatNavigator';
import { UIMessage } from 'ai';
import { v4 as uuidv4 } from 'uuid';
import { createMessage } from '@/frontend/dexie/queries';
import { useAPIKeyStore } from '@/frontend/stores/APIKeyStore';
import { useModelStore } from '@/frontend/stores/ModelStore';
import ThemeToggler from './ui/ThemeToggler';
import { SidebarTrigger, useSidebar } from './ui/sidebar';
import { Button } from './ui/button';
import { MessageSquareMore, ChevronDown } from 'lucide-react';
import { useChatNavigator } from '@/frontend/hooks/useChatNavigator';

interface ChatProps {
  threadId: string;
  initialMessages: UIMessage[];
}

export default function Chat({ threadId, initialMessages }: ChatProps) {
  const { getKey } = useAPIKeyStore();
  const selectedModel = useModelStore((state) => state.selectedModel);
  const modelConfig = useModelStore((state) => state.getModelConfig());
  
  const {
    isNavigatorVisible,
    handleToggleNavigator,
    closeNavigator,
    registerRef,
    scrollToMessage,
  } = useChatNavigator();

  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const isAutoScrolling = useRef(false)

  const {
    messages,
    input,
    status,
    setInput,
    setMessages,
    append,
    stop,
    reload,
    error,
  } = useChat({
    id: threadId,
    initialMessages,
    experimental_throttle: 50,
    onFinish: async ({ parts }) => {
      const aiMessage: UIMessage = {
        id: uuidv4(),
        parts: parts as UIMessage['parts'],
        role: 'assistant',
        content: '',
        createdAt: new Date(),
      };

      try {
        await createMessage(threadId, aiMessage);
      } catch (error) {
        console.error(error);
      }
    },
    headers: {
      [modelConfig.headerKey]: getKey(modelConfig.provider) || '',
    },
    body: {
      model: selectedModel,
    },
  });

  const scrollToBottom = () => {
    isAutoScrolling.current = true
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    })
    // Reset auto-scrolling flag after animation completes
    setTimeout(() => {
      isAutoScrolling.current = false
    }, 1000)
  }

  const handleScroll = () => {
    if (isAutoScrolling.current) return

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    // Show button when user is more than 200px from bottom
    const isNearBottom = documentHeight - (scrollTop + windowHeight) < 200
    setShowScrollToBottom(!isNearBottom)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (status === "streaming" && messages.length > 0) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const isNearBottom = documentHeight - (scrollTop + windowHeight) < 300

      if (isNearBottom) {
        setTimeout(() => scrollToBottom(), 100)
      }
    }
  }, [messages.length, status])

  return (
    <div className="relative w-full">
      <ChatSidebarTrigger />
      <main
        className={`flex flex-col w-full max-w-3xl pt-10 pb-44 mx-auto transition-all duration-300 ease-in-out`}
      >
        <Messages
          threadId={threadId}
          messages={messages}
          status={status}
          setMessages={setMessages}
          reload={reload}
          error={error}
          registerRef={registerRef}
          stop={stop}
        />
        <ChatInput
          threadId={threadId}
          input={input}
          status={status}
          append={append}
          setInput={setInput}
          stop={stop}
        />
      </main>
      <ThemeToggler />
      <Button
        onClick={handleToggleNavigator}
        variant="outline"
        size="icon"
        className="fixed right-16 top-4 z-20"
        aria-label={
          isNavigatorVisible
            ? 'Hide message navigator'
            : 'Show message navigator'
        }
      >
        <MessageSquareMore className="h-5 w-5" />
      </Button>

      {showScrollToBottom && (
        <Button
          onClick={scrollToBottom}
          variant="outline"
          size="icon"
          className="fixed right-4 bottom-24 z-20 shadow-lg bg-background/95 backdrop-blur-sm hover:bg-background border-2"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}

      <ChatNavigator
        threadId={threadId}
        scrollToMessage={scrollToMessage}
        isVisible={isNavigatorVisible}
        onClose={closeNavigator}
      />
    </div>
  );
}

const ChatSidebarTrigger = () => {
  const { state } = useSidebar();
  if (state === 'collapsed') {
    return <SidebarTrigger className="fixed left-4 top-4 z-100" />;
  }
  return null;
};
