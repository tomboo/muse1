'use client';

import { useRef, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { Send, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { startNewConversation, sendMessage } from '@/app/chat/actions';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending} aria-label="Send message">
      {pending ? <Loader2 className="animate-spin" /> : <Send className="h-5 w-5" />}
    </Button>
  );
}

export function ChatInput({ conversationId }: { conversationId: string | null }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const formAction = async (formData: FormData) => {
    startTransition(async () => {
      const message = formData.get('message') as string;
      if (!message?.trim()) return;

      formRef.current?.reset();
      inputRef.current?.focus();

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
      }
    });
  };
  
  return (
    <div className="bg-card border-t p-4 md:p-6">
      <div className="container mx-auto max-w-3xl">
        <form
          ref={formRef}
          action={formAction}
          className="flex items-center gap-4"
        >
          <Input
            ref={inputRef}
            name="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            disabled={isPending}
          />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
