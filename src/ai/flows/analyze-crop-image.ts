
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing crop images to identify potential diseases or pests.
 *
 * - analyzeCropImage - A function that takes an image of a crop and returns a diagnosis.
 * - AnalyzeCropImageInput - The input type for the analyzeCropImage function.
 * - AnalyzeCropImageOutput - The return type for the analyzeCropImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AnalyzeCropImageOutputSchema } from '@/ai/schemas';

const AnalyzeCropImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
    description: z.string().optional().describe('An optional text description of the plant issue, possibly from voice input.')
});
export type AnalyzeCropImageInput = z.infer<typeof AnalyzeCropImageInputSchema>;

export type AnalyzeCropImageOutput = z.infer<typeof AnalyzeCropImageOutputSchema>;

export async function analyzeCropImage(input: AnalyzeCropImageInput): Promise<AnalyzeCropImageOutput> {
  return analyzeCropImageFlow(input);
}

const analyzeCropImagePrompt = ai.definePrompt({
  name: 'analyzeCropImagePrompt',
  input: {schema: AnalyzeCropImageInputSchema},
  output: {schema: AnalyzeCropImageOutputSchema},
  prompt: `You are an expert botanist specializing in diagnosing plant illnesses.

You will use this information to diagnose the plant, and any issues it has. You will make a determination as to whether the plant is healthy or not, and what is wrong with it. Based on the diagnosis, suggest some remedies.

Use the following as the primary source of information about the plant.

Photo: {{media url=photoDataUri}}
{{#if description}}
User's Description: {{{description}}}
{{/if}}

Respond ONLY with a JSON object that strictly adheres to the AnalyzeCropImageOutputSchema.
`,
});

const analyzeCropImageFlow = ai.defineFlow(
  {
    name: 'analyzeCropImageFlow',
    inputSchema: AnalyzeCropImageInputSchema,
    outputSchema: AnalyzeCropImageOutputSchema,
  },
  async input => {
    const {output} = await analyzeCropImagePrompt(input);
    return output!;
  }
);
