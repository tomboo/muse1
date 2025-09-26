'use server';

import { revalidatePath } from 'next/cache';
import { addMessage as addMessageToStore } from '@/lib/store';
import type { Message } from '@/lib/types';

export async function addMessage(conversationId: string, prevState: any, formData: FormData) {
  const content = formData.get('message') as string;

  if (!content?.trim()) {
    return { error: 'Message cannot be empty.' };
  }

  const userMessage: Omit<Message, 'id' | 'timestamp'> = {
    role: 'user',
    content: content.trim(),
  };

  try {
    addMessageToStore(conversationId, userMessage.content, userMessage.role);
    
    revalidatePath(`/chat/${conversationId}`);
    revalidatePath('/admin');
    return { success: true };

  } catch (error) {
    console.error('Error adding message:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send message.';
    return { error: errorMessage };
  }
}
