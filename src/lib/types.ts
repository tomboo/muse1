
export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * A "safe" version of the Conversation type that can be serialized from Server Components
 * to Client Components. Dates are converted to strings.
 */
export type SafeConversation = Omit<Conversation, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

/**
 * A "safe" version of the Message type that can be serialized from Server Components
 * to Client Components. Dates are converted to strings.
 */
export type SafeMessage = Omit<Message, 'timestamp'> & {
  timestamp: string;
};
