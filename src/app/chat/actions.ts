'use server';

import { revalidatePath } from 'next/cache';
import { addMessage as addMessageToStore, createConversation } from '@/lib/store';
import type { Message } from '@/lib/types';
import { chat } from '@/ai/flows/chat-flow';

export async function sendMessage(conversationId: string | null, prevState: any, formData: FormData) {
  const content = formData.get('message') as string;
  
  if (!content?.trim()) {
    return { error: 'Message cannot be empty.' };
  }

  let newConversationId = conversationId;
  let isNewConversation = false;

  try {
    // If there's no conversationId, it means this is the first message.
    // We need to create a new conversation.
    if (!newConversationId) {
      const newConversation = createConversation();
      newConversationId = newConversation.id;
      isNewConversation = true;
    }

    const userMessage: Omit<Message, 'id' | 'timestamp'> = {
      role: 'user',
      content: content.trim(),
    };
    
    // Add the user's message to the store.
    addMessageToStore(newConversationId, userMessage.content, userMessage.role);

    // Get the assistant's response.
    const assistantResponse = await chat(userMessage.content);
    addMessageToStore(newConversationId, assistantResponse, 'assistant');

    revalidatePath('/');
    revalidatePath(`/chat/${newConversationId}`);
    revalidatePath('/admin');
    
    if (isNewConversation) {
      return { success: true, newConversationId: newConversationId };
    }

    return { success: true };

  } catch (error) {
    console.error('Error adding message:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send message.';
    return { error: errorMessage };
  }
}
