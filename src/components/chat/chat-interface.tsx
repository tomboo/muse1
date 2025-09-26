'use client';

import { useMemo } from 'react';
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
  // Rehydrate the messages with Date objects on the client
  const messages = useMemo(() => {
    return initialMessages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  }, [initialMessages]);

  return (
    <div className="flex flex-col h-full">
      <ChatMessages messages={messages} />
      <ChatInput conversationId={conversationId} />
    </div>
  );
}
