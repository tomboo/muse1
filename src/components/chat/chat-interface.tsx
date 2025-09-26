'use client';

import { useMemo } from 'react';
import type { Message, SafeMessage } from '@/lib/types';
import { ChatInput } from './chat-input';
import { ChatMessages } from './chat-messages';

interface ChatInterfaceProps {
  conversationId: string | null;
  initialMessages: SafeMessage[];
}

export function ChatInterface({ conversationId, initialMessages }: ChatInterfaceProps) {
  const messages: Message[] = useMemo(() => {
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
