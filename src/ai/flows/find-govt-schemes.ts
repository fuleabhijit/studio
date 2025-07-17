
'use server';

/**
 * @fileOverview A Genkit flow for finding relevant government schemes for Indian citizens.
 *
 * - findGovtSchemes - A function that takes a user's profile and query and returns a list of schemes.
 * - FindGovtSchemesInput - The input type for the findGovtSchemes function.
 * - FindGovtSchemesOutput - The return type for the findGovtSchemes function.
 */

import {ai} from '@/ai/genkit';
import { FindGovtSchemesInputSchema, GovtSchemesOutputSchema } from '@/ai/schemas';
import type { z } from 'zod';

export type FindGovtSchemesInput = z.infer<typeof FindGovtSchemesInputSchema>;
export type FindGovtSchemesOutput = z.infer<typeof GovtSchemesOutputSchema>;

export async function findGovtSchemes(input: FindGovtSchemesInput): Promise<FindGovtSchemesOutput> {
  return findGovtSchemesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findGovtSchemesPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: FindGovtSchemesInputSchema},
  output: {schema: GovtSchemesOutputSchema},
  prompt: `You are an expert advisor on Indian government schemes for farmers.
A user has provided their profile. Your task is to identify and explain all relevant agricultural schemes.

User's Profile:
- State: {{{state}}}
- Profession: Farmer
- Annual Income Bracket: {{{annualIncome}}}
{{#if category}}- Social Category: {{{category}}}{{/if}}
{{#if crop}}- Primary Crop: {{{crop}}}{{/if}}
{{#if landHolding}}- Land Holding: {{{landHolding}}} acres{{/if}}

Based on this comprehensive information, provide a list of the most relevant schemes for a farmer. For each scheme, you must provide:
1. The official name of the scheme.
2. A simple, easy-to-understand summary of the scheme and its purpose.
3. A list of key eligibility criteria.
4. A description of the benefits provided (e.g., subsidy amount, loan details, equipment provided).
5. The direct official URL to the scheme's application portal or information page.

Focus on schemes that are highly relevant to the user's specific profile.

Respond ONLY with a JSON object that strictly adheres to the GovtSchemesOutputSchema.`,
});

const findGovtSchemesFlow = ai.defineFlow(
  {
    name: 'findGovtSchemesFlow',
    inputSchema: FindGovtSchemesInputSchema,
    outputSchema: GovtSchemesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
