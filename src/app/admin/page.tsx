import Link from 'next/link';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Conversation, Message } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

async function getConversations(): Promise<Conversation[]> {
  const conversationsRef = collection(db, 'conversations');
  const q = query(conversationsRef, orderBy('updatedAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as unknown as Conversation;
  });
}

async function getMessages(conversationId: string): Promise<Message[]> {
  if (!conversationId) return [];
  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
     const data = doc.data();
     return {
      id: doc.id,
      ...data,
      timestamp: data.timestamp.toDate(),
    } as unknown as Message;
  });
}


export default async function AdminPage({ searchParams }: { searchParams: { conversationId?: string } }) {
  const conversations = await getConversations();
  const selectedConversationId = searchParams.conversationId;
  const messages = await getMessages(selectedConversationId || '');
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 font-headline">Admin Dashboard</h1>
      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
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
                      Updated {formatDistanceToNow(new Date(convo.updatedAt as any), { addSuffix: true })}
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
                          {formatDistanceToNow(new Date(message.timestamp as any), { addSuffix: true })}
                        </p>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
