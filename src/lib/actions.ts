
'use server';

import { analyzeCropImage, type AnalyzeCropImageInput, type AnalyzeCropImageOutput } from '@/ai/flows/analyze-crop-image';
import { z } from 'zod';

const ActionInputSchema = z.object({
  photoDataUri: z.string(),
  geolocation: z.string().optional(),
});

export async function getDiagnosis(
  input: AnalyzeCropImageInput
): Promise<{ data?: AnalyzeCropImageOutput; error?: string }> {
  try {
    const validatedInput = ActionInputSchema.parse(input);
    const result = await analyzeCropImage(validatedInput);
    return { data: result };
  } catch (error) {
    console.error('Error in getDiagnosis action:', error);
    if (error instanceof z.ZodError) {
        return { error: 'Invalid input provided.' };
    }
    return { error: 'An unexpected error occurred while analyzing the image. Please try again.' };
  }
}
