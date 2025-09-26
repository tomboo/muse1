import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { getConversations } from '@/lib/store';
import type { Conversation } from '@/lib/types';
import { Sidebar, SidebarProvider, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bot, MessageSquarePlus, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Muse1',
  description: 'A modern, contemporary, minimalist web app.',
};

type SafeConversation = Omit<Conversation, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string };

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
            <Sidebar className="md:flex flex-col hidden">
              <SidebarHeader>
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link href="/chat">
                    <MessageSquarePlus />
                    <span>New Chat</span>
                  </Link>
                </Button>
              </SidebarHeader>
              <SidebarContent className="p-2">
                <SidebarMenu>
                  {conversations.map(convo => (
                    <SidebarMenuItem key={convo.id}>
                      <SidebarMenuButton asChild variant="ghost" className="w-full justify-start">
                        <Link href={`/chat/${convo.id}`}>
                          {convo.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild variant="ghost" className="w-full justify-start">
                      <Link href="/admin">
                        <Shield />
                        <span>Admin</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>
            <div className="flex flex-col flex-1">
              <header className="border-b bg-card md:hidden">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                  <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
                    <Bot className="h-6 w-6" />
                    <span className="font-headline">Muse1</span>
                  </Link>
                  <SidebarTrigger />
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
