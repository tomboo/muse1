'use client';

import { useChat } from '@/hooks/use-chat';
import type { Message } from '@/lib/types';
import { ChatInput } from './chat-input';
import { ChatMessages } from './chat-messages';

// The message type coming from the server has a string timestamp
type SafeMessage = Omit<Message, 'timestamp'> & { timestamp: string };

interface ChatInterfaceProps {
  conversationId: string | null;
  initialMessages: SafeMessage[];
}

export function ChatInterface({ conversationId, initialMessages }: ChatInterfaceProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    initialMessages,
    conversationId,
  });

  return (
    <div className="flex flex-col h-full">
      <ChatMessages messages={messages} />
      <ChatInput
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        input={input}
        isLoading={isLoading}
      />
    </div>
  );
}
