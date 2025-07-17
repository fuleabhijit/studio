'use server';

/**
 * @fileOverview A Genkit flow for answering general farmer queries.
 *
 * - answerFarmerQuery - A function that takes a farmer's query and returns a helpful answer.
 * - AnswerFarmerQueryInputSchema - The input schema for the answerFarmerQuery flow.
 * - AnswerFarmerQueryOutputSchema - The output schema for the answerFarmerQuery flow.
 */

import { ai } from '@/ai/genkit';
import { AnswerFarmerQueryInputSchema, AnswerFarmerQueryOutputSchema } from '@/ai/schemas';
import type { AnswerFarmerQueryInput, AnswerFarmerQueryOutput } from '@/ai/schemas';


export async function answerFarmerQuery(input: AnswerFarmerQueryInput): Promise<AnswerFarmerQueryOutput> {
  return answerFarmerQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerFarmerQueryPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: { schema: AnswerFarmerQueryInputSchema },
  output: { schema: AnswerFarmerQueryOutputSchema },
  prompt: `You are an expert agricultural advisor for Indian farmers. 
  Your goal is to provide clear, simple, and actionable advice.
  A farmer has asked the following question: "{{{query}}}"
  
  Provide a helpful answer. Keep the language simple and direct. If suggesting a product or method, briefly explain why.
  Focus on practical solutions that are accessible to a small-scale farmer in India.

  Respond ONLY with a JSON object that strictly adheres to the AnswerFarmerQueryOutputSchema.`,
});

const answerFarmerQueryFlow = ai.defineFlow(
  {
    name: 'answerFarmerQueryFlow',
    inputSchema: AnswerFarmerQueryInputSchema,
    outputSchema: AnswerFarmerQueryOutputSchema,
  },
  async ({ query }) => {
    const { output } = await prompt({ query });
    if (!output) {
      throw new Error('Failed to generate an answer from the AI.');
    }
    return output;
  }
);
