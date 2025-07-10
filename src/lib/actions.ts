
'use server';

import { diagnosePlant, type ComprehensiveDiagnosisOutput, type ComprehensiveDiagnosisInput } from '@/ai/flows/diagnose-plant-flow';
import { getMarketPriceAlertFlowWrapper, type PriceAlert } from '@/ai/flows/get-market-price-alert';
import { findGovtSchemes, type FindGovtSchemesOutput } from '@/ai/flows/find-govt-schemes';
import { translateText } from '@/ai/flows/translate-text';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { z } from 'zod';
import type { Language } from './translations';
import { FindGovtSchemesInputSchema } from '@/ai/schemas';

const DiagnosisInputSchema = z.object({
  photoDataUri: z.string(),
  language: z.string(),
});

export async function getComprehensiveDiagnosis(
  input: z.infer<typeof DiagnosisInputSchema>
): Promise<{ data?: ComprehensiveDiagnosisOutput; error?: string }> {
  try {
    const validatedInput = DiagnosisInputSchema.parse(input);
    const result = await diagnosePlant(validatedInput);
    return { data: result };
  } catch (error) {
    console.error('Error in getComprehensiveDiagnosis action:', error);
    if (error instanceof z.ZodError) {
        return { error: 'Invalid input provided.' };
    }
    return { error: 'An unexpected error occurred while analyzing the image. Please try again.' };
  }
}

export async function getSpeechFromText(
  text: string
): Promise<{ data?: { media: string }; error?: string }> {
  if (!text) {
    return { error: 'No text provided for speech synthesis.' };
  }
  try {
    const result = await textToSpeech(text);
    return { data: result };
  } catch (error) {
    console.error('Error in getSpeechFromText action:', error);
    return { error: 'An unexpected error occurred during text-to-speech conversion.' };
  }
}

export async function getGovtSchemes(
  input: z.infer<typeof FindGovtSchemesInputSchema>
): Promise<{ data?: FindGovtSchemesOutput; error?: string }> {
  try {
    const validatedInput = FindGovtSchemesInputSchema.parse(input);
    const result = await findGovtSchemes(validatedInput);
    return { data: result };
  } catch (error) {
    console.error('Error in getGovtSchemes action:', error);
     if (error instanceof z.ZodError) {
        return { error: 'Invalid input provided for finding schemes.' };
    }
    return { error: 'An unexpected error occurred while fetching government schemes.' };
  }
}

const GetMarketPriceAlertInputSchema = z.object({
  commodity: z.string().min(1, 'Commodity is required.'),
});

export async function getMarketPriceAlert(input: z.infer<typeof GetMarketPriceAlertInputSchema>): Promise<{ data?: PriceAlert; error?: string }> {
  try {
    const validatedInput = GetMarketPriceAlertInputSchema.parse(input);
    const result = await getMarketPriceAlertFlowWrapper(validatedInput);
    return { data: result };
  } catch (error) {
    console.error('Error in getMarketPriceAlert action:', error);
    return { error: 'An unexpected error occurred while fetching market prices.' };
  }
}
