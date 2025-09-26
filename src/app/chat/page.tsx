'use server';

import { redirect } from 'next/navigation';

// This is an Action, but as a Server Component it can run server-side code before rendering.
// We use this to create a new chat and redirect.
export default async function NewChatPage() {
  // The redirect must happen outside of the try...catch block to avoid NEXT_REDIRECT errors.
  redirect('/admin');
}
