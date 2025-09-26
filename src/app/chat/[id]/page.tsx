import { collection, query, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Message, Conversation } from '@/lib/types';
import { ChatInterface } from '@/components/chat/chat-interface';
import { notFound } from 'next/navigation';

async function getMessages(conversationId: string): Promise<Message[]> {
  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  const querySnapshot = await getDocs(q);
  const messages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
  return messages;
}

async function getConversation(conversationId: string): Promise<Conversation | null> {
  const docRef = doc(db, 'conversations', conversationId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Conversation;
  }
  return null;
}

export default async function ChatPage({ params }: { params: { id: string } }) {
  const conversation = await getConversation(params.id);
  
  if (!conversation) {
    notFound();
  }

  const initialMessages = await getMessages(params.id);

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatInterface conversationId={params.id} initialMessages={initialMessages} />
    </div>
  );
}
