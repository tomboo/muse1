'use server';

import { revalidatePath } from 'next/cache';
import { addMessage as addMessageToStore, createConversation } from '@/lib/store';
import type { Message } from '@/lib/types';
import { chat } from '@/ai/flows/chat-flow';
import { redirect } from 'next/navigation';

export async function sendMessage(conversationId: string | null, prevState: any, formData: FormData) {
  const content = formData.get('message') as string;
  
  if (!content?.trim()) {
    return { error: 'Message cannot be empty.' };
  }

  let newConversationId = conversationId;

  try {
    // If there's no conversationId, it means this is the first message.
    // We need to create a new conversation.
    if (!newConversationId) {
      const newConversation = createConversation();
      newConversationId = newConversation.id;
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
    
    // If we created a new conversation, we need to redirect to its new URL.
    if (!conversationId) {
       redirect(`/chat/${newConversationId}`);
    }

    return { success: true };

  } catch (error) {
    console.error('Error adding message:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send message.';
    return { error: errorMessage };
  }
}
