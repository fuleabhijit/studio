
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
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  geolocation: z.string().optional().describe('The geolocation of the plant.'),
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
  prompt: `You are an expert agricultural assistant and botanist, specializing in diagnosing plant diseases for farmers. Your goal is to provide a comprehensive, actionable diagnosis and treatment plan.

Given the plant image and the user's location, identify the disease or pest affecting it.

Based on the diagnosis, suggest remedies that are practical and accessible to the farmer. For each remedy, specify its type (Organic, Chemical, or Preventive), provide clear application instructions, and list the types of local stores (like 'Krishi Kendras', 'local agri-stores', 'fertilizer shops') where it might be found.

Additionally, based on the user's location ({{{geolocation}}}), the crop type (inferred from the image), and the diagnosed issue, identify and list relevant government schemes or subsidies that the farmer could be eligible for. Provide a name, a brief description, and an official link if available.

Finally, add any other important notes or preventive advice for the farmer.

User's Geolocation: {{#if geolocation}}{{geolocation}}{{else}}Not Provided{{/if}}

Plant Image: {{media url=photoDataUri}}

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
