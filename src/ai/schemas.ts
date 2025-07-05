import { z } from 'zod';

export const AnalyzeCropImageOutputSchema = z.object({
  diseaseIdentification: z.object({
    diseaseDetected: z.boolean().describe('Whether or not a disease is detected.'),
    diseaseName: z.string().describe('The common name of the identified disease or pest.'),
    pestName: z.string().describe('The common name of the identified pest, if any. Set to "N/A" if not applicable.'),
  }),
  remedySuggestions: z.array(
    z.object({
      name: z.string().describe('The name of the remedy or product.'),
      type: z.enum(['Organic', 'Chemical', 'Preventive']).describe('The type of the remedy.'),
      description: z.string().describe('A detailed description of how to apply the remedy, including dosage and frequency.'),
      availability: z.array(z.string()).describe('A list of general local stores, Krishi Kendras, or types of shops where this remedy might be available based on the provided location.'),
    })
  ).describe('A list of recommended remedies, tailored to the user\'s location if provided.'),
  governmentSchemes: z.array(
      z.object({
          name: z.string().describe('The name of the government scheme or subsidy.'),
          description: z.string().describe('A brief description of the scheme, its benefits, and eligibility.'),
          link: z.string().url().optional().describe('An official government link to the scheme for more information or to apply.'),
      })
  ).describe('A list of relevant government subsidies or schemes available in the user\'s region for the identified crop or disease.'),
  notes: z.string().optional().describe('Other general notes, preventive measures, or important considerations for the farmer.'),
});
