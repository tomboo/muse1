import { redirect } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// This is an Action, but as a Server Component it can run server-side code before rendering.
// We use this to create a new chat and redirect.
export default async function NewChatPage() {
  const newConversation = {
    title: 'New Conversation',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    const docRef = await addDoc(collection(db, 'conversations'), newConversation);
    redirect(`/chat/${docRef.id}`);
  } catch (error) {
    console.error("Error creating new conversation:", error);
    // Redirect to home page to allow user to try again.
    redirect('/');
  }
}
