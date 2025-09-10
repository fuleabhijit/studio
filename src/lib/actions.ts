
'use server';

import { diagnosePlant } from '@/ai/flows/diagnose-plant-flow';
import { getMarketPriceAlertFlowWrapper, type PriceAlert } from '@/ai/flows/get-market-price-alert';
import { answerFarmerQuery } from '@/ai/flows/answer-farmer-query';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { escalateToExpert as escalateToExpertFlow } from '@/ai/flows/escalate-to-expert';
import { z } from 'zod';
import { 
  ComprehensiveDiagnosisInputSchema, 
  type ComprehensiveDiagnosisOutput,
  AnswerFarmerQueryInputSchema,
  type AnswerFarmerQueryOutput,
  EscalationInputSchema,
  type EscalationOutput
} from '@/ai/schemas';

export async function getComprehensiveDiagnosis(
  input: z.infer<typeof ComprehensiveDiagnosisInputSchema>
): Promise<{ data?: ComprehensiveDiagnosisOutput; error?: string }> {
  try {
    const validatedInput = ComprehensiveDiagnosisInputSchema.parse(input);
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

export async function getFarmerQueryAnswer(
  input: z.infer<typeof AnswerFarmerQueryInputSchema>
): Promise<{ data?: AnswerFarmerQueryOutput; error?: string }> {
  try {
    const validatedInput = AnswerFarmerQueryInputSchema.parse(input);
    const result = await answerFarmerQuery(validatedInput);
    return { data: result };
  } catch (error) {
    console.error('Error in getFarmerQueryAnswer action:', error);
    if (error instanceof z.ZodError) {
      return { error: 'Invalid input provided for the query.' };
    }
    return { error: 'An unexpected error occurred while generating the answer.' };
  }
}

export async function escalateToExpert(
    input: z.infer<typeof EscalationInputSchema>
): Promise<{ data?: EscalationOutput; error?: string }> {
    try {
        const validatedInput = EscalationInputSchema.parse(input);
        const result = await escalateToExpertFlow(validatedInput);
        return { data: result };
    } catch (error) {
        console.error('Error in escalateToExpert action:', error);
        return { error: 'Failed to prepare escalation. Please try again.' };
    }
}
