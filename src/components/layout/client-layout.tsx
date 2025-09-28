'use client';

import Link from 'next/link';
import type { Conversation, SafeConversation } from '@/lib/types';
import { Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarFooter, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { Bot, MessageSquarePlus, User } from 'lucide-react';
import { ConversationList } from '@/components/chat/conversation-list';
import { Suspense, useEffect, useState } from 'react';
import { ClearConversations } from '@/components/chat/clear-conversations';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { startChat } from '@/app/conversations/actions';
import { config } from '@/lib/config';
import { getConversations as getConversationsFromStore } from '@/lib/store';

// This function needs to exist outside the component to be callable from the new `useConversations` hook effect.
function getSafeConversations(): Conversation[] {
  return getConversationsFromStore();
}

// Custom hook to fetch conversations on the client
function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    // We fetch conversations on the client.
    // This part of the component is not SSR'd, so this is safe.
    function loadConversations() {
      const convos = getSafeConversations();
      setConversations(convos);
    }
    loadConversations();
    
    // This is a simple event listener to re-fetch conversations when they change.
    // In a real-world app, you might use a more robust state management solution
    // like Zustand or Redux, or React Query for server state.
    const handleStorageChange = () => {
      loadConversations();
    };
    
    window.addEventListener('storage-change', handleStorageChange);

    return () => {
       window.removeEventListener('storage-change', handleStorageChange);
    }

  }, []);

  return conversations;
}


export function ClientLayout({ children }: { children: React.ReactNode }) {
  const conversations = useConversations();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleNewChat = async () => {
    // We can't use a form action here directly because it causes a full page reload
    // which we want to avoid for a smoother UX.
    await startChat();
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  return (
    <>
        <div className="flex flex-1">
          <Sidebar>
            <SidebarHeader>
               <h2 className="text-lg font-semibold md:hidden">Menu</h2>
               <SidebarMenuButton onClick={handleNewChat} variant="ghost" className="w-full justify-start" tooltip="New Chat">
                 <MessageSquarePlus />
                 <span>New Chat</span>
               </SidebarMenuButton>
            </SidebarHeader>
            <SidebarContent className="p-2">
              <SidebarMenu>
                <Suspense fallback={<>Loading...</>}>
                  <ConversationList conversations={conversations} />
                </Suspense>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                 <SidebarMenuItem>
                  <ClearConversations />
                </SidebarMenuItem>
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild variant="ghost" className="w-full justify-start" tooltip="Admin">
                      <Link href="/admin" onClick={handleLinkClick}>
                        <User />
                        <span>Admin</span>
                      </Link>
                   </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                   <SidebarMenuButton asChild variant="ghost" className="w-full justify-start" tooltip="User Profile">
                      <div className="flex items-center gap-3">
                         <Avatar className="h-8 w-8">
                            <AvatarFallback>
                               <User />
                            </AvatarFallback>
                         </Avatar>
                         <span className="text-sm font-medium">User</span>
                      </div>
                   </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <div className="flex flex-col flex-1">
            <header className="border-b bg-card">
              <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                  <SidebarTrigger />
                  <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
                    <Bot className="h-6 w-6" />
                    <span className="font-headline">{config.appName}</span>
                  </Link>
                </div>
              </div>
            </header>
            <main className="flex-1 flex flex-col">{children}</main>
          </div>
        </div>
    </>
  );
}
