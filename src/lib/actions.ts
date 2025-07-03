
'use server';

import { analyzeCropImage, type AnalyzeCropImageInput, type AnalyzeCropImageOutput } from '@/ai/flows/analyze-crop-image';
import { translateText } from '@/ai/flows/translate-text';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { z } from 'zod';
import type { Language } from './translations';
import { AnalyzeCropImageOutputSchema } from '@/ai/schemas';

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

const TranslationActionInputSchema = z.object({
    diagnosis: AnalyzeCropImageOutputSchema,
    targetLanguage: z.enum(['en', 'hi', 'mr']),
});

export async function getTranslatedDiagnosis(
  input: { diagnosis: AnalyzeCropImageOutput; targetLanguage: Language }
): Promise<{ data?: AnalyzeCropImageOutput; error?: string }> {
  try {
    const { diagnosis, targetLanguage } = TranslationActionInputSchema.parse(input);

    if (targetLanguage === 'en' || !diagnosis) {
      return { data: diagnosis };
    }

    const languageName = targetLanguage === 'hi' ? 'Hindi' : 'Marathi';
    const separator = '|||';

    const textToTranslate: (string | undefined)[] = [
      diagnosis.diseaseIdentification.diseaseName,
      diagnosis.diseaseIdentification.pestName,
      ...(diagnosis.remedySuggestions || []),
      diagnosis.notes,
    ];
    
    const validTexts = textToTranslate.filter((t): t is string => !!t && t.trim() !== 'N/A' && t.trim() !== '');

    if (validTexts.length === 0) {
      return { data: diagnosis };
    }
    
    const combinedText = validTexts.join(separator);
    const translationResult = await translateText({ textToTranslate: combinedText, targetLanguage: languageName });

    if (!translationResult || !translationResult.translatedText) {
        return { error: 'Translation failed to return text.' };
    }

    const translatedParts = translationResult.translatedText.split(separator);

    if (translatedParts.length !== validTexts.length) {
        console.warn("Translation returned a different number of parts than expected.");
        return { data: diagnosis };
    }

    const translationMap = new Map<string, string>();
    validTexts.forEach((text, index) => {
        translationMap.set(text, translatedParts[index]?.trim());
    });

    const translatedDiagnosis = JSON.parse(JSON.stringify(diagnosis));

    translatedDiagnosis.diseaseIdentification.diseaseName = translationMap.get(diagnosis.diseaseIdentification.diseaseName) || diagnosis.diseaseIdentification.diseaseName;
    translatedDiagnosis.diseaseIdentification.pestName = translationMap.get(diagnosis.diseaseIdentification.pestName) || diagnosis.diseaseIdentification.pestName;

    if (diagnosis.remedySuggestions) {
        translatedDiagnosis.remedySuggestions = diagnosis.remedySuggestions.map(remedy => translationMap.get(remedy) || remedy);
    }
    if (diagnosis.notes) {
        translatedDiagnosis.notes = translationMap.get(diagnosis.notes) || diagnosis.notes;
    }
    
    return { data: translatedDiagnosis };

  } catch (error) {
    console.error('Error in getTranslatedDiagnosis action:', error);
    if (error instanceof z.ZodError) {
        return { error: 'Invalid input provided for translation.' };
    }
    return { error: 'An unexpected error occurred during translation. Please try again.' };
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
