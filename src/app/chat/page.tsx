'use server';

import { redirect } from 'next/navigation';
import { createConversation } from '@/lib/store';

// This is an Action, but as a Server Component it can run server-side code before rendering.
// We use this to create a new chat and redirect.
export default async function NewChatPage() {
  try {
    const newConversation = createConversation('New Conversation');
    redirect(`/chat/${newConversation.id}`);
  } catch (error) {
    console.error("Error creating new conversation:", error);
    // If conversation creation fails, redirect to a safe page (e.g., home) to prevent a loop.
    redirect('/');
  }
}
