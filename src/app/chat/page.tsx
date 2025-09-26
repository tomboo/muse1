import { ChatInterface } from '@/components/chat/chat-interface';

export default function NewChatPage() {
  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatInterface conversationId={null} initialMessages={[]} />
    </div>
  );
}
