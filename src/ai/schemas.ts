
import { z } from 'zod';

export const DiseaseDiagnosisSchema = z.object({
  isPlant: z.boolean().describe('Whether the image contains a plant.'),
  plantName: z.string().describe('The common name of the plant identified (e.g., "Tomato", "Potato").'),
  diseaseIdentification: z.object({
    diseaseDetected: z.boolean().describe('Whether or not a disease is detected.'),
    diseaseName: z.string().describe('The common name of the identified disease or pest.'),
  }),
  remedySuggestions: z.array(
    z.object({
      name: z.string().describe('The name of the remedy or product.'),
      type: z.enum(['Organic', 'Chemical', 'Preventive']).describe('The type of the remedy.'),
      description: z.string().describe('A detailed description of how to apply the remedy, including dosage and frequency.'),
    })
  ).describe('A list of recommended remedies.'),
});

export const ComprehensiveDiagnosisOutputSchema = z.object({
  diagnosis: DiseaseDiagnosisSchema,
  marketAnalysis: z.any().optional().describe('Market price analysis for the identified plant/crop.'),
});
export type ComprehensiveDiagnosisOutput = z.infer<typeof ComprehensiveDiagnosisOutputSchema>;

export const ComprehensiveDiagnosisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  language: z.string().describe("The user's selected language (e.g., 'en', 'hi')."),
});
export type ComprehensiveDiagnosisInput = z.infer<typeof ComprehensiveDiagnosisInputSchema>;


export const AnalyzeCropImageOutputSchema = z.object({
  diseaseIdentification: z.object({
    diseaseDetected: z.boolean().describe('Whether or not a disease is detected.'),
    diseaseName: z.string().describe('The common name of the identified disease or pest.'),
  }),
  remedySuggestions: z.array(
    z.object({
      name: z.string().describe('The name of the remedy or product.'),
      type: z.enum(['Organic', 'Chemical', 'Preventive']).describe('The type of the remedy.'),
      description: z.string().describe('A detailed description of how to apply the remedy, including dosage and frequency.'),
    })
  ).describe('A list of recommended remedies.'),
  notes: z.string().optional().describe('Other general notes, preventive measures, or important considerations for the farmer.'),
});

export const AnswerFarmerQueryInputSchema = z.object({
  query: z.string().describe('The question asked by the farmer.'),
});
export type AnswerFarmerQueryInput = z.infer<typeof AnswerFarmerQueryInputSchema>;


export const AnswerFarmerQueryOutputSchema = z.object({
    answer: z.string().describe('A helpful and actionable answer to the farmer\'s question.'),
});
export type AnswerFarmerQueryOutput = z.infer<typeof AnswerFarmerQueryOutputSchema>;

export const EscalationInputSchema = z.object({
  plantName: z.string(),
  diseaseName: z.string(),
  remedies: z.array(z.string()),
  photoDataUri: z.string(),
  userState: z.string(),
});
export type EscalationInput = z.infer<typeof EscalationInputSchema>;

export const EscalationOutputSchema = z.object({
    expertName: z.string(),
    expertContact: z.string(),
    escalationMessage: z.string().describe("A concise, well-formatted message to send to the expert."),
});
export type EscalationOutput = z.infer<typeof EscalationOutputSchema>;
