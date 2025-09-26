'use server';

import { revalidatePath } from 'next/cache';
import { addMessage as addMessageToStore, createConversation } from '@/lib/store';
import { chat } from '@/ai/flows/chat-flow';

/**
 * Starts a new conversation with an initial message.
 * Returns the new conversation ID so the client can redirect.
 */
export async function startNewConversation(formData: FormData) {
  const content = formData.get('message') as string;
  if (!content?.trim()) {
    // This should be handled client-side, but as a fallback.
    return { error: 'Message cannot be empty.' };
  }

  try {
    // 1. Create a new conversation
    const newConversation = createConversation();
    
    // 2. Add the user's message
    addMessageToStore(newConversation.id, content.trim(), 'user');
    
    // 3. Get the assistant's response
    const assistantResponse = await chat(content.trim());
    addMessageToStore(newConversation.id, assistantResponse, 'assistant');
    
    // 4. Revalidate paths to update UI for all users
    revalidatePath('/admin');
    revalidatePath('/');
    
    // 5. Return the new ID for client-side navigation
    return { success: true, newConversationId: newConversation.id };

  } catch (error) {
    console.error('Error starting new conversation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to start chat.';
    return { error: errorMessage };
  }
}


/**
 * Sends a message to an existing conversation.
 */
export async function sendMessage(conversationId: string, formData: FormData) {
  const content = formData.get('message') as string;
  if (!content?.trim()) {
    return { error: 'Message cannot be empty.' };
  }
  if (!conversationId) {
    // This case should not be hit if the client-side logic is correct,
    // but it's a safeguard.
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
