
'use server';

/**
 * @fileOverview A Genkit flow for finding relevant government agricultural schemes for farmers.
 *
 * - findGovtSchemes - A function that takes a farmer's profile and query and returns a list of schemes.
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
  prompt: `You are an expert agricultural advisor specializing in Indian government schemes for farmers.
A farmer has provided their profile and a query. Your task is to identify and explain relevant government schemes.

Farmer's Profile:
- State: {{{state}}}
{{#if crop}}- Primary Crop: {{{crop}}}{{/if}}
{{#if landHolding}}- Land Holding: {{{landHolding}}} acres{{/if}}
{{#if category}}- Category: {{{category}}}{{/if}}

Farmer's Query: "{{{query}}}"

Based on this information, provide a list of the most relevant schemes. For each scheme, you must provide:
1. The official name of the scheme.
2. A simple, easy-to-understand summary of the scheme and its purpose.
3. A list of key eligibility criteria.
4. A description of the benefits provided (e.g., subsidy amount, equipment provided).
5. The direct official URL to the scheme's application portal or information page.

Focus on schemes that are highly relevant to the farmer's specific query and profile. If the query is broad, provide general schemes applicable to their profile.

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
