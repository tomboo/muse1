'use client';

import { useState, useTransition, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { startNewConversation, sendMessage } from '@/app/chat/actions';
import { useToast } from '@/hooks/use-toast';

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button type="submit" size="icon" disabled={isLoading} aria-label="Send message">
      {isLoading ? <Loader2 className="animate-spin" /> : <Send className="h-5 w-5" />}
    </Button>
  );
}

interface ChatInputProps {
  conversationId: string | null;
}

export function ChatInput({ conversationId }: ChatInputProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
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

  return (
    <div className="bg-card border-t p-4 md:p-6">
      <div className="container mx-auto max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-4"
        >
          <Input
            name="message"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            disabled={isPending}
          />
          <SubmitButton isLoading={isPending} />
        </form>
      </div>
    </div>
  );
}
