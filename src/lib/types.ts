import type { Timestamp } from 'firebase/firestore';

export interface Conversation {
  id: string;
  title: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Timestamp | Date;
}
