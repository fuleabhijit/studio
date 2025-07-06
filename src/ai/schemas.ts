import { z } from 'zod';

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
  state: z.string().describe("The farmer's state or union territory in India."),
  crop: z.string().optional().describe('The primary crop the farmer cultivates.'),
  landHolding: z.number().optional().describe("The farmer's land holding size in acres."),
  category: z.enum(['General', 'OBC', 'SC', 'ST']).optional().describe("The farmer's social category."),
  query: z.string().describe('The specific need or query the farmer has about government schemes (e.g., "drip irrigation subsidy").'),
});


export const GovtSchemesOutputSchema = z.object({
  schemes: z.array(
    z.object({
      name: z.string().describe('The official name of the government scheme.'),
      description: z.string().describe('A simple, easy-to-understand summary of the scheme and its purpose.'),
      eligibility: z.array(z.string()).describe('A list of key eligibility criteria for the farmer to qualify.'),
      benefits: z.string().describe('A description of the benefits provided by the scheme (e.g., subsidy amount, equipment provided).'),
      applicationLink: z.string().url().describe("The direct official URL to the scheme's application portal or information page."),
    })
  ).describe("A list of relevant government schemes based on the user's profile and query."),
});
