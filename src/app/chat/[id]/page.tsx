import { getConversation, getMessages } from '@/lib/store';
import type { SafeMessage } from '@/lib/types';
import { ChatInterface } from '@/components/chat/chat-interface';
import { notFound } from 'next/navigation';

async function getSafeMessages(conversationId: string): Promise<SafeMessage[]> {
  const messages = getMessages(conversationId);
  if (!messages) return [];
  return messages.map(message => ({
    ...message,
    timestamp: message.timestamp.toISOString(),
  }));
}

export default async function ChatPage({ params }: { params: { id: string } }) {
  const conversation = getConversation(params.id);
  
  if (!conversation) {
    notFound();
  }

  const initialMessages = await getSafeMessages(params.id);

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatInterface conversationId={params.id} initialMessages={initialMessages} />
    </div>
  );
}
