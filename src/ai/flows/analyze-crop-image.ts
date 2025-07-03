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

const AnalyzeCropImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  geolocation: z.string().optional().describe('The geolocation of the plant.'),
});
export type AnalyzeCropImageInput = z.infer<typeof AnalyzeCropImageInputSchema>;

const AnalyzeCropImageOutputSchema = z.object({
  diseaseIdentification: z.object({
    diseaseDetected: z.boolean().describe('Whether or not a disease is detected.'),
    diseaseName: z.string().describe('The name of the identified disease.'),
    pestName: z.string().describe('The name of the identified pest.'),
  }),
  remedySuggestions: z.array(z.object({
    name: z.string().describe('Name of the medicine or pesticide.'),
    type: z.string().describe('Type of remedy, e.g., Pesticide, Fungicide, Organic.'),
    description: z.string().describe('Description of how to use the remedy.'),
    buyLink: z.string().url().describe('A Google search URL to find and purchase the product. The URL should be in the format "https://www.google.com/search?q=buy+<product_name>".')
  })).describe('A list of recommended medicines or pesticides.'),
  notes: z.string().optional().describe('Other general notes or considerations.'),
});
export type AnalyzeCropImageOutput = z.infer<typeof AnalyzeCropImageOutputSchema>;

export async function analyzeCropImage(input: AnalyzeCropImageInput): Promise<AnalyzeCropImageOutput> {
  return analyzeCropImageFlow(input);
}

const analyzeCropImagePrompt = ai.definePrompt({
  name: 'analyzeCropImagePrompt',
  input: {schema: AnalyzeCropImageInputSchema},
  output: {schema: AnalyzeCropImageOutputSchema},
  prompt: `You are an expert in diagnosing plant diseases and pest infestations.

You will analyze the provided image of the plant and identify any potential diseases or pests affecting it.
Based on the identified issue, you will suggest affordable and locally available remedies, taking into account the provided geolocation if available.

For each remedy, provide the following details:
- name: The product name of the medicine or pesticide.
- type: The type of remedy (e.g., Pesticide, Fungicide, Organic).
- description: A brief description of the remedy and how to apply it.
- buyLink: A Google search URL to find and purchase the product. For example: "https://www.google.com/search?q=buy+<product_name>".

Also, provide any other general notes or considerations.

Consider the cost and availability of the remedies in your suggestions.

Geolocation: {{geolocation}}

Image: {{media url=photoDataUri}}
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
