'use client';

import { useState, useMemo, useTransition, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { Message } from '@/lib/types';
import { startNewConversation, sendMessage } from '@/app/chat/actions';

// The message type coming from the server has a string timestamp
type SafeMessage = Omit<Message, 'timestamp'> & { timestamp: string };

type UseChatOptions = {
  initialMessages: SafeMessage[];
  conversationId: string | null;
};

export function useChat({ initialMessages, conversationId }: UseChatOptions) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const messages = useMemo(() => {
    return initialMessages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  }, [initialMessages]);

  const [input, setInput] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const messageContent = input.trim();
    if (!messageContent) return;

    setInput('');

    startTransition(async () => {
      const formData = new FormData();
      formData.append('message', messageContent);

      let result;
      if (conversationId) {
        result = await sendMessage(conversationId, formData);
      } else {
        result = await startNewConversation(formData);
      }

      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else if (result?.newConversationId) {
        router.push(`/chat/${result.newConversationId}`);
        router.refresh();
      } else {
        router.refresh();
      }
    });
  };

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isPending,
  };
}
