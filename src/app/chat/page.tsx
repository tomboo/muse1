'use server';

import { redirect } from 'next/navigation';
import { createConversation } from '@/lib/store';

// This is an Action, but as a Server Component it can run server-side code before rendering.
// We use this to create a new chat and redirect.
export default async function NewChatPage() {
  let newConversation;
  try {
    newConversation = createConversation('New Conversation');
  } catch (error) {
    console.error("Error creating new conversation:", error);
    // If conversation creation fails, redirect to a safe page to prevent a loop.
    redirect('/admin');
    return; // Stop execution if there's an error
  }

  // The redirect must happen outside of the try...catch block to avoid NEXT_REDIRECT errors.
  redirect(`/chat/${newConversation.id}`);
}
