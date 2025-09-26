'use client';

import { useEffect, useRef } from 'react';
import type { Message } from '@/lib/types';
import { Bot } from 'lucide-react';
import { MemoizedChatMessage } from './chat-message';
import { config } from '@/lib/config';

export function ChatMessages({ messages }: { messages: Message[] }) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">Welcome to {config.appName}</h2>
          <p className="mt-2 text-muted-foreground">Start the conversation by typing a message below.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="container mx-auto max-w-3xl space-y-6">
        {messages.map((message) => (
          <MemoizedChatMessage key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
