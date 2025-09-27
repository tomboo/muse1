import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { SidebarProvider } from '@/components/ui/sidebar';
import { config } from '@/lib/config';
import { ClientLayout } from '@/components/layout/client-layout';

// Metadata can now be safely exported because this is a pure Server Component.
export const metadata: Metadata = {
  title: config.appName,
  description: 'A modern, contemporary, minimalist web app.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen bg-background text-foreground flex flex-col")}>
        <SidebarProvider>
          <ClientLayout>{children}</ClientLayout>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
