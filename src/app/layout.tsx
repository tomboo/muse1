import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { getConversations } from '@/lib/store';
import type { SafeConversation } from '@/lib/types';
import { Sidebar, SidebarProvider, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarFooter, SidebarMenuButton } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bot, MessageSquarePlus, User, PanelLeft } from 'lucide-react';
import { ConversationList } from '@/components/chat/conversation-list';
import { Suspense } from 'react';
import { ClearConversations } from '@/components/chat/clear-conversations';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { startChat } from '@/app/conversations/actions';
import { config } from '@/lib/config';


export const metadata: Metadata = {
  title: config.appName,
  description: 'A modern, contemporary, minimalist web app.',
};

async function getSafeConversations(): Promise<SafeConversation[]> {
  const conversations = getConversations();
  return conversations.map(convo => ({
    ...convo,
    createdAt: convo.createdAt.toISOString(),
    updatedAt: convo.updatedAt.toISOString(),
  }));
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const conversations = await getSafeConversations();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen bg-background text-foreground flex flex-col")}>
        <SidebarProvider>
          <div className="flex flex-1">
            <Sidebar>
              <SidebarHeader>
                 <form action={startChat} className='w-full'>
                    <SidebarMenuButton type="submit" variant="ghost" className="w-full justify-start" tooltip="New Chat">
                      <MessageSquarePlus />
                      <span>New Chat</span>
                    </SidebarMenuButton>
                 </form>
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
                        <Link href="/admin">
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
                    <SidebarTrigger className="md:hidden" />
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
                      <Bot className="h-6 w-6" />
                      <span className="font-headline">{config.appName}</span>
                    </Link>
                  </div>
                  <Button variant="ghost" size="icon">
                    <PanelLeft/>
                  </Button>
                </div>
              </header>
              <main className="flex-1 flex flex-col">{children}</main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
