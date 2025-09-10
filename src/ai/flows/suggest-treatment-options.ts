
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting treatment options for plant diseases, focusing on local availability and affordability.
 *
 * - suggestTreatmentOptions -  A function that takes a disease name and location as input and returns a list of treatment options.
 * - SuggestTreatmentOptionsInput - The input type for the suggestTreatmentOptions function.
 * - SuggestTreatmentOptionsOutput - The return type for the suggestTreatmentOptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTreatmentOptionsInputSchema = z.object({
  diseaseName: z.string().describe('The name of the plant disease.'),
  location: z.string().describe('The geolocation of the farm (e.g., city, country).'),
});
export type SuggestTreatmentOptionsInput = z.infer<typeof SuggestTreatmentOptionsInputSchema>;

const SuggestTreatmentOptionsOutputSchema = z.object({
  treatmentOptions: z.array(
    z.object({
      name: z.string().describe('The name of the treatment option.'),
      description: z.string().describe('A detailed description of the treatment, including application instructions.'),
      availability: z.string().describe('Information on local availability.'),
      cost: z.string().describe('An estimate of the cost of the treatment.'),
    })
  ).describe('A list of treatment options for the specified disease, considering local availability and affordability.'),
});
export type SuggestTreatmentOptionsOutput = z.infer<typeof SuggestTreatmentOptionsOutputSchema>;

export async function suggestTreatmentOptions(input: SuggestTreatmentOptionsInput): Promise<SuggestTreatmentOptionsOutput> {
  return suggestTreatmentOptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTreatmentOptionsPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: SuggestTreatmentOptionsInputSchema},
  output: {schema: SuggestTreatmentOptionsOutputSchema},
  prompt: `You are an agricultural expert, skilled in recommending treatments for plant diseases.

  Based on the identified disease ({{{diseaseName}}}) and the farmer's location ({{{location}}}), suggest treatment options that are locally available and affordable.

  Provide a list of treatments with the following information for each:
  - Name: The name of the treatment.
  - Description: A detailed description of the treatment, including application instructions.
  - Availability: Information on where the treatment can be found locally.
  - Cost: An estimate of the cost of the treatment.

  Ensure the suggested treatments are practical for the farmer to implement immediately.

  Format the output as a JSON object matching the SuggestTreatmentOptionsOutputSchema schema.  Use the Zod descriptions to guide the contents of the fields.
`,
});

const suggestTreatmentOptionsFlow = ai.defineFlow(
  {
    name: 'suggestTreatmentOptionsFlow',
    inputSchema: SuggestTreatmentOptionsInputSchema,
    outputSchema: SuggestTreatmentOptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
