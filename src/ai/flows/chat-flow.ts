'use server';
/**
 * @fileOverview A simple chat flow that responds to user messages.
 *
 * - chat - A function that takes a message and returns a response from an AI model.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatInputSchema = z.string();
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.string();
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(message: ChatInput): Promise<ChatOutput> {
  return chatFlow(message);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (prompt) => {
    const llmResponse = await ai.generate({
      prompt: prompt,
    });
    return llmResponse.text;
  }
);
