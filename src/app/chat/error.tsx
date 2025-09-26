'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Error Loading Chat</CardTitle>
          <CardDescription>{error.message || "There was a problem loading this conversation."}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => reset()}>
            Try again
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/chat">Start a New Chat</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
