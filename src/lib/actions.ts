
'use server';

import { analyzeCropImage, type AnalyzeCropImageInput, type AnalyzeCropImageOutput } from '@/ai/flows/analyze-crop-image';
import { translateText } from '@/ai/flows/translate-text';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { z } from 'zod';
import type { Language } from './translations';
import { AnalyzeCropImageOutputSchema } from '@/ai/schemas';

const ActionInputSchema = z.object({
  photoDataUri: z.string(),
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

    const textsToTranslate: string[] = [];
    const addText = (text: string | undefined | null) => {
        if (text && text.trim() && text.trim().toLowerCase() !== 'n/a') {
            textsToTranslate.push(text.trim());
        }
    };
    
    addText(diagnosis.diseaseIdentification.diseaseName);
    diagnosis.remedySuggestions.forEach(remedy => {
        addText(remedy.name);
        addText(remedy.description);
    });
    addText(diagnosis.notes);

    const uniqueTexts = [...new Set(textsToTranslate)];
    if (uniqueTexts.length === 0) {
      return { data: diagnosis };
    }
    
    const combinedText = uniqueTexts.join(separator);
    const translationResult = await translateText({ textToTranslate: combinedText, targetLanguage: languageName });

    if (!translationResult || !translationResult.translatedText) {
        return { error: 'Translation failed to return text.' };
    }

    const translatedParts = translationResult.translatedText.split(separator);

    if (translatedParts.length !== uniqueTexts.length) {
        console.warn("Translation returned a different number of parts than expected.");
        return { data: diagnosis };
    }

    const translationMap = new Map<string, string>();
    uniqueTexts.forEach((text, index) => {
        translationMap.set(text, translatedParts[index]?.trim());
    });

    const translatedDiagnosis = JSON.parse(JSON.stringify(diagnosis));

    const translateField = (text: string | undefined | null) => (text && text.trim() && text.trim().toLowerCase() !== 'n/a' && translationMap.get(text.trim())) || text;

    translatedDiagnosis.diseaseIdentification.diseaseName = translateField(diagnosis.diseaseIdentification.diseaseName);

    translatedDiagnosis.remedySuggestions.forEach((remedy: any, index: number) => {
        remedy.name = translateField(diagnosis.remedySuggestions[index].name);
        remedy.description = translateField(diagnosis.remedySuggestions[index].description);
    });

    if (diagnosis.notes) {
        translatedDiagnosis.notes = translateField(diagnosis.notes);
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
