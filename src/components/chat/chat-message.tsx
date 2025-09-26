'use client';

import { memo } from 'react';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: Message;
}

function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-4',
        message.role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      {message.role === 'assistant' && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Bot className="h-5 w-5" />
        </div>
      )}
      <div
        className={cn(
          'max-w-prose rounded-lg p-3 text-sm shadow-sm',
          message.role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-card border'
        )}
      >
        {message.role === 'assistant' ? (
          <article className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </article>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
      {message.role === 'user' && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
           <User className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}

// Memoize the component to prevent re-renders of individual messages
export const MemoizedChatMessage = memo(ChatMessage);
