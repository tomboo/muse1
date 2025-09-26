import type { Conversation, Message } from './types';

// In a real app, you'd use a database.
// For this starter, we'll use a simple in-memory store.
// We use the global object to persist the data across hot reloads in development.
declare global {
  var __conversations: Conversation[] | undefined;
  var __messages: { [conversationId: string]: Message[] } | undefined;
  var __idCounter: number | undefined;
}

if (global.__conversations === undefined) {
  const initialConversations: Conversation[] = [];
  global.__conversations = initialConversations;
}
if (global.__messages === undefined) {
  global.__messages = {};
}
if (global.__idCounter === undefined) {
  global.__idCounter = global.__conversations.length;
}


const conversations: Conversation[] = global.__conversations;
const messages: { [conversationId: string]: Message[] } = global.__messages;


function generateId(): string {
  global.__idCounter!++;
  return global.__idCounter.toString();
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

export function renameConversation(id: string, newTitle: string): Conversation | undefined {
  const conversation = getConversation(id);
  if (conversation) {
    conversation.title = newTitle;
    conversation.updatedAt = new Date();
    return conversation;
  }
  return undefined;
}

export function deleteConversation(id: string): boolean {
  const index = conversations.findIndex(c => c.id === id);
  if (index !== -1) {
    conversations.splice(index, 1);
    delete messages[id];
    return true;
  }
  return false;
}

export function clearAllConversations(): void {
  conversations.length = 0;
  for (const key in messages) {
    delete messages[key];
  }
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
