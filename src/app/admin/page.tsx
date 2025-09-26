import Link from 'next/link';
import { getConversations, getMessages } from '@/lib/store';
import type { Conversation, Message } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// This is a type used for serialization to the client.
type SafeMessage = Omit<Message, 'timestamp'> & { timestamp: string };
type SafeConversation = Omit<Conversation, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string };


async function getSafeConversations(): Promise<SafeConversation[]> {
  const conversations = getConversations();
  return conversations.map(convo => ({
    ...convo,
    createdAt: convo.createdAt.toISOString(),
    updatedAt: convo.updatedAt.toISOString(),
  }));
}

async function getSafeMessages(conversationId: string): Promise<SafeMessage[]> {
  if (!conversationId) return [];
  const messages = getMessages(conversationId);
  return messages.map(message => ({
     ...message,
     timestamp: message.timestamp.toISOString(),
  }));
}


export default async function AdminPage({ searchParams }: { searchParams: { conversationId?: string } }) {
  const conversations = await getSafeConversations();
  const selectedConversationId = searchParams.conversationId;
  const messages = await getSafeMessages(selectedConversationId || '');
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">View and manage user conversations.</p>
      </div>
      <div className="mt-6 grid lg:grid-cols-[300px_1fr] gap-6 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[60vh]">
              <div className="flex flex-col">
                {conversations.map(convo => (
                  <Link
                    key={convo.id}
                    href={`/admin?conversationId=${convo.id}`}
                    className={cn(
                      "block p-4 border-b transition-colors",
                      selectedConversationId === convo.id ? 'bg-primary/10' : 'hover:bg-accent/50'
                    )}
                  >
                    <p className="font-semibold truncate">{convo.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Updated {formatDistanceToNow(new Date(convo.updatedAt), { addSuffix: true })}
                    </p>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {selectedConversation ? `Messages: ${selectedConversation.title}` : 'Select a conversation'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh] -mx-6 px-6">
              <div className="space-y-4">
                {messages.length > 0 ? (
                  messages.map(message => (
                    <div key={message.id} className="p-4 bg-card rounded-lg border">
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant={message.role === 'user' ? 'secondary' : 'default'} className="capitalize">
                          {message.role}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                      {message.role === 'assistant' ? (
                        <article className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </article>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-10 h-[60vh] flex items-center justify-center">
                    <p>{selectedConversationId ? 'No messages in this conversation.' : 'Select a conversation to see messages.'}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
