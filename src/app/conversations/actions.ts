
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { deleteConversation as deleteConversationFromStore, renameConversation as renameConversationInStore, clearAllConversations as clearAllConversationsFromStore, createConversation } from '@/lib/store';

export async function startChat() {
  const newConversation = createConversation();
  redirect(`/chat/${newConversation.id}`);
}

export async function renameConversation(conversationId: string, newTitle: string) {
  if (!newTitle.trim()) {
    return { error: 'Title cannot be empty.' };
  }

  try {
    renameConversationInStore(conversationId, newTitle.trim());
    revalidatePath('/');
    revalidatePath(`/chat/${conversationId}`);
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error renaming conversation:', error);
    return { error: 'Failed to rename conversation.' };
  }
}

export async function deleteConversation(conversationId: string, currentPath: string) {
  try {
    deleteConversationFromStore(conversationId);
    revalidatePath('/');
    revalidatePath('/admin');
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return { error: 'Failed to delete conversation.' };
  }

  // If the user is currently on the page of the conversation they are deleting,
  // redirect them to the home page.
  if (currentPath.startsWith(`/chat/${conversationId}`)) {
    redirect('/chat');
  }
}

export async function clearAllConversations() {
  try {
    clearAllConversationsFromStore();
    revalidatePath('/');
    revalidatePath('/admin');
  } catch (error) {
    console.error('Error clearing conversations:', error);
    return { error: 'Failed to clear conversations.' };
  }
  redirect('/chat');
}
