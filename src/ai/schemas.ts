import { z } from 'zod';

export const AnalyzeCropImageOutputSchema = z.object({
  diseaseIdentification: z.object({
    diseaseDetected: z.boolean().describe('Whether or not a disease is detected.'),
    diseaseName: z.string().describe('The name of the identified disease.'),
    pestName: z.string().describe('The name of the identified pest.'),
  }),
  remedySuggestions: z.array(z.string()).describe('A list of recommended medicines or pesticides.'),
  notes: z.string().optional().describe('Other general notes or considerations.'),
});
