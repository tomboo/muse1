'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addMessage as addMessageToStore, createConversation } from '@/lib/store';
import type { Message } from '@/lib/types';
import { chat } from '@/ai/flows/chat-flow';

/**
 * Starts a new conversation with the user's first message.
 */
export async function startNewConversation(prevState: any, formData: FormData) {
  const content = formData.get('message') as string;
  if (!content?.trim()) {
    return { error: 'Message cannot be empty.' };
  }

  try {
    const newConversation = createConversation();
    const newConversationId = newConversation.id;

    // Add user message
    addMessageToStore(newConversationId, content.trim(), 'user');

    // Get assistant response
    const assistantResponse = await chat(content.trim());
    addMessageTo-store(newConversationId, assistantResponse, 'assistant');

    // Revalidate paths
    revalidatePath('/');
    revalidatePath(`/chat/${newConversationId}`);
    revalidatePath('/admin');
    
    // Return the new ID so the client can redirect
    return { success: true, newConversationId: newConversationId };

  } catch (error) {
    console.error('Error creating new conversation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to start conversation.';
    return { error: errorMessage };
  }
}

/**
 * Sends a message to an existing conversation.
 */
export async function sendMessage(conversationId: string, prevState: any, formData: FormData) {
  const content = formData.get('message') as string;
  if (!content?.trim()) {
    return { error: 'Message cannot be empty.' };
  }
  if (!conversationId) {
    return { error: 'Conversation ID is missing.' };
  }

  try {
    // Add user message
    addMessageToStore(conversationId, content.trim(), 'user');

    // Get assistant response
    const assistantResponse = await chat(content.trim());
    addMessageToStore(conversationId, assistantResponse, 'assistant');

    // Revalidate paths
    revalidatePath('/');
    revalidatePath(`/chat/${conversationId}`);
    revalidatePath('/admin');
    
    return { success: true };

  } catch (error) {
    console.error('Error adding message:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send message.';
    return { error: errorMessage };
  }
}
