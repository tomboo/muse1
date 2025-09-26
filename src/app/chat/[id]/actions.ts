'use server';

import { revalidatePath } from 'next/cache';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Message } from '@/lib/types';

export async function addMessage(conversationId: string, prevState: any, formData: FormData) {
  const content = formData.get('message') as string;

  if (!content?.trim()) {
    return { error: 'Message cannot be empty.' };
  }

  const userMessage: Omit<Message, 'id' | 'timestamp' | 'timestamp'> = {
    role: 'user',
    content: content.trim(),
  };

  try {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    await addDoc(messagesRef, {
      ...userMessage,
      timestamp: serverTimestamp(),
    });

    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      updatedAt: serverTimestamp(),
    });
    
    revalidatePath(`/chat/${conversationId}`);
    revalidatePath('/admin');
    return { success: true };

  } catch (error) {
    console.error('Error adding message:', error);
    return { error: 'Failed to send message.' };
  }
}
