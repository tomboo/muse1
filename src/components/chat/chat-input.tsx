'use client';

import { useRef, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { addMessage } from '@/app/chat/[id]/actions';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending} aria-label="Send message">
      <Send className="h-5 w-5" />
    </Button>
  );
}

export function ChatInput({ conversationId }: { conversationId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, formAction] = useFormState(addMessage.bind(null, conversationId), null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      inputRef.current?.focus();
    }
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state, toast]);

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
            disabled={useFormStatus().pending}
          />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
