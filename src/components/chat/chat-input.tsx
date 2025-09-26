'use client';

import { Send, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button type="submit" size="icon" disabled={isLoading} aria-label="Send message">
      {isLoading ? <Loader2 className="animate-spin" /> : <Send className="h-5 w-5" />}
    </Button>
  );
}

interface ChatInputProps {
  input: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export function ChatInput({ input, handleSubmit, handleInputChange, isLoading }: ChatInputProps) {
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
            disabled={isLoading}
          />
          <SubmitButton isLoading={isLoading} />
        </form>
      </div>
    </div>
  );
}
