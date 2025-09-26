import { Skeleton } from '@/components/ui/skeleton';
import { Bot, User } from 'lucide-react';
import { ChatInput } from '@/components/chat/chat-input';

function ChatMessageSkeleton({ role }: { role: 'user' | 'assistant' }) {
    return (
        <div className={`flex items-start gap-4 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bot className="h-5 w-5" />
                </div>
            )}
            <div className={`max-w-prose space-y-2 rounded-lg p-3 text-sm ${role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border'}`}>
                 <Skeleton className={`h-4 ${role === 'user' ? 'bg-primary-foreground/20' : ''} w-64`} />
                 <Skeleton className={`h-4 ${role === 'user' ? 'bg-primary-foreground/20' : ''} w-48`} />
            </div>
            {role === 'user' && (
                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <User className="h-5 w-5" />
                </div>
            )}
        </div>
    );
}

export default function ChatLoading() {
  return (
     <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="container mx-auto max-w-3xl space-y-6">
            <ChatMessageSkeleton role="assistant" />
            <ChatMessageSkeleton role="user" />
            <ChatMessageSkeleton role="assistant" />
        </div>
      </div>
      <ChatInput conversationId={null} />
    </div>
  );
}
