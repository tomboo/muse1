'use server';

import { revalidatePath } from 'next/cache';
import { addMessage as addMessageToStore } from '@/lib/store';
import { chat } from '@/ai/flows/chat-flow';

/**
 * Sends a message to an existing conversation.
 */
export async function sendMessage(conversationId: string, formData: FormData) {
  const content = formData.get('message') as string;
  if (!content?.trim()) {
    return { error: 'Message cannot be empty.' };
  }
  if (!conversationId) {
    // This case should ideally not be hit if the UI is correct.
    // New conversations are started with startChat action.
    return { error: 'Conversation ID is missing.' };
  }

  try {
    // Add user message
    addMessageToStore(conversationId, content.trim(), 'user');
    revalidatePath(`/chat/${conversationId}`);
    revalidatePath('/admin');
    
    // Get assistant response
    const assistantResponse = await chat(content.trim());
    addMessageToStore(conversationId, assistantResponse, 'assistant');

    // Revalidate paths again to show assistant message
    revalidatePath(`/chat/${conversationId}`);
    revalidatePath('/admin');
    
    return { success: true };

  } catch (error) {
    console.error('Error adding message:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send message.';
    return { error: errorMessage };
  }
}
