import { ChatInterface } from '@/components/chat/chat-interface';

export default function NewChatPage() {
  return (
    <div className="flex-1 flex flex-col h-full">
      {/* This page now only shows the welcome screen.
          New chats are created via a server action. */}
      <ChatInterface conversationId={null} initialMessages={[]} />
    </div>
  );
}
