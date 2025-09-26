'use server';

import { createConversation } from '@/lib/store';
import { redirect } from 'next/navigation';

// This is an Action, but as a Server Component it can run server-side code before rendering.
// We use this to create a new chat and redirect.
export default async function NewChatPage() {
  const conversation = createConversation('New Conversation');
  // The redirect must happen outside of the try...catch block to avoid NEXT_REDIRECT errors.
  redirect(`/chat/${conversation.id}`);
}
