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
  governmentSchemes: z.any().optional().describe('Relevant government schemes for the identified plant/crop.'),
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

export const FindGovtSchemesInputSchema = z.object({
  state: z.string().describe("The user's state or union territory in India."),
  profession: z.string().describe("The user's profession (e.g., Farmer, Student)."),
  annualIncome: z.string().describe("The user's annual income bracket."),
  category: z.enum(['General', 'OBC', 'SC', 'ST']).optional().describe("The user's social category."),
  landHolding: z.number().optional().describe("The user's land holding size in acres (for farmers)."),
  crop: z.string().optional().describe('The primary crop the user cultivates (for farmers).'),
  query: z.string().describe('The specific need or query the user has about government schemes (e.g., "drip irrigation subsidy").'),
});


export const GovtSchemesOutputSchema = z.object({
  schemes: z.array(
    z.object({
      name: z.string().describe('The official name of the government scheme.'),
      description: z.string().describe('A simple, easy-to-understand summary of the scheme and its purpose.'),
      eligibility: z.array(z.string()).describe('A list of key eligibility criteria for the user to qualify.'),
      benefits: z.string().describe('A description of the benefits provided by the scheme (e.g., subsidy amount, equipment provided).'),
      applicationLink: z.string().url().describe("The direct official URL to the scheme's application portal or information page."),
    })
  ).describe("A list of relevant government schemes based on the user's profile and query."),
});


export const AnswerFarmerQueryInputSchema = z.object({
  query: z.string().describe('The question asked by the farmer.'),
});
export type AnswerFarmerQueryInput = z.infer<typeof AnswerFarmerQueryInputSchema>;


export const AnswerFarmerQueryOutputSchema = z.object({
    answer: z.string().describe('A helpful and actionable answer to the farmer\'s question.'),
});
export type AnswerFarmerQueryOutput = z.infer<typeof AnswerFarmerQueryOutputSchema>;
