import type { Conversation, Message } from './types';
import { config } from './config';

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

function dispatchStorageEvent() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage-change'));
  }
}

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

export function createConversation(title?: string): Conversation {
  let newTitle = title;
  if (!newTitle) {
    const newChatCount = conversations.filter(c => c.title.startsWith(config.newChatName)).length + 1;
    newTitle = `${config.newChatName} ${newChatCount}`;
  }

  const newConversation: Conversation = {
    id: generateId(),
    title: newTitle,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  conversations.push(newConversation);
  messages[newConversation.id] = [];
  dispatchStorageEvent();
  return newConversation;
}

export function renameConversation(id: string, newTitle: string): Conversation | undefined {
  const conversation = getConversation(id);
  if (conversation) {
    conversation.title = newTitle;
    conversation.updatedAt = new Date();
    dispatchStorageEvent();
    return conversation;
  }
  return undefined;
}

export function deleteConversation(id: string): boolean {
  const index = conversations.findIndex(c => c.id === id);
  if (index !== -1) {
    conversations.splice(index, 1);
    delete messages[id];
    dispatchStorageEvent();
    return true;
  }
  return false;
}

export function clearAllConversations(): void {
  conversations.length = 0;
  for (const key in messages) {
    delete messages[key];
  }
  dispatchStorageEvent();
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

  // Update the conversation's updatedAt timestamp
  conversation.updatedAt = new Date();

  const userMessages = messages[conversationId].filter(m => m.role === 'user');
  
  // If it's the first user message and the title is still the default, update the title.
  if (userMessages.length === 1 && role === 'user' && conversation.title.startsWith(config.newChatName)) {
     const newTitle = content.substring(0, 30);
     conversation.title = newTitle.length < 30 ? newTitle : `${newTitle}...`;
  }
  
  dispatchStorageEvent();
  return newMessage;
}
