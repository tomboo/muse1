import type { Conversation, Message } from './types';

let conversations: Conversation[] = [];
let messages: { [conversationId: string]: Message[] } = {};
let idCounter = 0;

function generateId(): string {
  idCounter++;
  return idCounter.toString();
}

export function getConversations(): Conversation[] {
  return conversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export function getConversation(id: string): Conversation | undefined {
  return conversations.find(c => c.id === id);
}

export function createConversation(title: string): Conversation {
  const newConversation: Conversation = {
    id: generateId(),
    title,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  conversations.push(newConversation);
  messages[newConversation.id] = [];
  return newConversation;
}

export function getMessages(conversationId: string): Message[] {
  return messages[conversationId] || [];
}

export function addMessage(conversationId: string, content: string, role: 'user' | 'assistant'): Message {
  const conversation = getConversation(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  const newMessage: Message = {
    id: generateId(),
    role,
    content,
    timestamp: new Date(),
  };

  if (!messages[conversationId]) {
    messages[conversationId] = [];
  }
  messages[conversationId].push(newMessage);

  conversation.updatedAt = new Date();

  return newMessage;
}
