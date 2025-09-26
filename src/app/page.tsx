'use server';
import { redirect } from 'next/navigation';

export default async function Home() {
  // Redirect to the neutral chat page by default.
  redirect('/chat');
}
