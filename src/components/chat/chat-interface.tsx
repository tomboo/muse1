'use client';

import type { Message } from '@/lib/types';
import { ChatInput } from './chat-input';
import { ChatMessages } from './chat-messages';

interface ChatInterfaceProps {
  conversationId: string;
  initialMessages: Message[];
}

export function ChatInterface({ conversationId, initialMessages }: ChatInterfaceProps) {
  return (
    <div className="flex flex-col h-full">
      <ChatMessages messages={initialMessages} />
      <ChatInput conversationId={conversationId} />
    </div>
  );
}
