'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ConversationActions } from '@/components/chat/conversation-actions';
import type { Conversation } from '@/lib/types';

interface ConversationListProps {
  conversations: Conversation[];
}

export function ConversationList({ conversations }: ConversationListProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

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
                className="w-full justify-start flex-1 overflow-hidden"
                data-active={isActive}
              >
                <Link href={`/chat/${convo.id}`} className="truncate" onClick={handleLinkClick}>
                  {convo.title?.trim() || 'Untitled'}
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
