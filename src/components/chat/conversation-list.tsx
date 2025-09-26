'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenuItem } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ConversationActions } from '@/components/chat/conversation-actions';
import type { Conversation } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ConversationListProps {
  conversations: Conversation[];
}

export function ConversationList({ conversations }: ConversationListProps) {
  const pathname = usePathname();

  return (
    <>
      {conversations.map(convo => {
        const isActive = pathname === `/chat/${convo.id}`;
        return (
          <SidebarMenuItem key={convo.id}>
            <div className="flex items-center justify-between w-full">
              <Button
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start flex-1 overflow-hidden",
                  isActive && "bg-accent text-accent-foreground"
                )}
              >
                <Link href={`/chat/${convo.id}`} className="truncate">
                  {convo.title}
                </Link>
              </Button>
              <ConversationActions conversation={convo} />
            </div>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}
