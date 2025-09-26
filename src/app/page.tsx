'use server';

import { redirect } from 'next/navigation';

export default async function NewChatPage() {
  redirect(`/chat`);
}
