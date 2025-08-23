import { memo } from 'react';
import PreviewMessage from './Message';
import { UIMessage } from 'ai';
import { UseChatHelpers } from '@ai-sdk/react';
import equal from 'fast-deep-equal';
import MessageLoading from './ui/MessageLoading';
import Error from './Error';

function PureMessages({
  threadId,
  messages,
  status,
  setMessages,
  reload,
  error,
  stop,
  registerRef,
}: {
  threadId: string;
  messages: UIMessage[];
  setMessages: UseChatHelpers['setMessages'];
  reload: UseChatHelpers['reload'];
  status: UseChatHelpers['status'];
  error: UseChatHelpers['error'];
  stop: UseChatHelpers['stop'];
  registerRef: (id: string, ref: HTMLDivElement | null) => void;
}) {
  return (
    <section
      className="max-h-screen h-screen w-full xl:px-3 m-auto pb-18 md:pb-22 overflow-y-scroll"
      style={{
        height: 'calc(100vh - 10rem)',
      }}
    >
      <div className="px-4 m-auto py-2 flex flex-col w-full md:max-w-xl lg:max-w-2xl border-y empty:hidden space-y-12">
        {messages.map((message, index) => (
          <PreviewMessage
            key={message.id}
            threadId={threadId}
            message={message}
            isStreaming={
              status === 'streaming' && messages.length - 1 === index
            }
            setMessages={setMessages}
            reload={reload}
            registerRef={registerRef}
            stop={stop}
          />
        ))}
        {status === 'submitted' && <MessageLoading />}
        {error && <Error message={error.message} />}
      </div>
    </section>
  );
}

const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.error !== nextProps.error) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;
  return true;
});

Messages.displayName = 'Messages';

export default Messages;
