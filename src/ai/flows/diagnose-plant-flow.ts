
'use server';
/**
 * @fileOverview A comprehensive plant problem diagnosis AI agent.
 *
 * - diagnosePlant - A function that handles the full plant diagnosis process, including market price and scheme lookups.
 */

import {ai} from '@/ai/genkit';
import { getMarketPriceAlertFlowWrapper } from './get-market-price-alert';
import { translateText } from './translate-text';
import { suggestTreatmentOptions } from './suggest-treatment-options';
import {
    ComprehensiveDiagnosisInputSchema,
    ComprehensiveDiagnosisOutputSchema,
    DiseaseDiagnosisSchema,
    TreatmentSuggestionSchema,
} from '@/ai/schemas';
import type { ComprehensiveDiagnosisInput, ComprehensiveDiagnosisOutput } from '@/ai/schemas';
import { z } from 'zod';

const languageMap: Record<string, string> = {
    en: 'English',
    hi: 'Hindi',
    mr: 'Marathi',
    te: 'Telugu',
    bn: 'Bengali',
    ta: 'Tamil',
    gu: 'Gujarati',
    kn: 'Kannada',
    ml: 'Malayalam',
};

// Main exported function
export async function diagnosePlant(input: ComprehensiveDiagnosisInput): Promise<ComprehensiveDiagnosisOutput> {
  return diagnosePlantFlow(input);
}

// Prompt for the initial disease diagnosis
const diagnosisPrompt = ai.definePrompt({
  name: 'diseaseDiagnosisPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: ComprehensiveDiagnosisInputSchema.pick({ photoDataUri: true })},
  output: {schema: DiseaseDiagnosisSchema},
  prompt: `You are an expert botanist. Analyze the provided plant image.
  Identify the plant's common name and any diseases or pests.
  Suggest at least two remedies (Organic, Chemical, or Preventive).
  If no plant is detected or the plant is healthy, state that clearly.
  
  Photo: {{media url=photoDataUri}}
  
  Respond ONLY with a JSON object strictly adhering to the DiseaseDiagnosisSchema.`,
});

const diagnosePlantFlow = ai.defineFlow(
  {
    name: 'diagnosePlantFlow',
    inputSchema: ComprehensiveDiagnosisInputSchema,
    outputSchema: ComprehensiveDiagnosisOutputSchema,
  },
  async ({ photoDataUri, language, location }) => {
    // 1. Get initial diagnosis in English
    const { output: diagnosis } = await diagnosisPrompt({ photoDataUri });
    if (!diagnosis || !diagnosis.isPlant) {
      // If it's not a plant, return early
      return { diagnosis: diagnosis || { isPlant: false, plantName: 'N/A', diseaseIdentification: { diseaseDetected: false, diseaseName: 'N/A' }, remedySuggestions: [] } };
    }

    let marketAnalysis;
    let treatmentSuggestions: z.infer<typeof TreatmentSuggestionSchema>[] | undefined;

    // 2. Concurrently fetch market prices and treatment suggestions
    const plantName = diagnosis.plantName;
    const diseaseName = diagnosis.diseaseIdentification.diseaseName;

    const promises = [];

    if (plantName && plantName.toLowerCase() !== 'n/a') {
        promises.push(
            getMarketPriceAlertFlowWrapper({ commodity: plantName }).catch(e => { console.error("Market analysis failed:", e); return null; })
        );
    }

    if (diseaseName && diseaseName.toLowerCase() !== 'n/a' && location) {
        promises.push(
            suggestTreatmentOptions({ diseaseName: diseaseName, location: location }).catch(e => { console.error("Treatment suggestion failed:", e); return null; })
        );
    }
    
    const [marketResult, treatmentResult] = await Promise.all(promises);

    marketAnalysis = marketResult;
    if (treatmentResult) {
        treatmentSuggestions = treatmentResult.treatmentOptions;
    }


    // 3. Translate if the language is not English
    if (language !== 'en' && languageMap[language]) {
        const textsToTranslate: string[] = [];
        const addText = (text: string | undefined | null) => {
            if (text && text.trim() && text.trim().toLowerCase() !== 'n/a') {
                textsToTranslate.push(text.trim());
            }
        };

        // Collect all text fields
        addText(diagnosis.plantName);
        addText(diagnosis.diseaseIdentification.diseaseName);
        diagnosis.remedySuggestions.forEach(r => { addText(r.name); addText(r.description); });
        if(marketAnalysis) { addText(marketAnalysis.advice); addText(marketAnalysis.reason); }
        if(treatmentSuggestions) { treatmentSuggestions.forEach(t => { addText(t.name); addText(t.description); addText(t.availability); addText(t.cost); }); }

        const uniqueTexts = [...new Set(textsToTranslate)];
        
        if (uniqueTexts.length > 0) {
            const separator = '|||';
            const combinedText = uniqueTexts.join(separator);
            const translationResult = await translateText({ textToTranslate: combinedText, targetLanguage: languageMap[language] });
            const translatedParts = translationResult.translatedText.split(separator).map(p => p.trim());
            
            const translationMap = new Map<string, string>();
            uniqueTexts.forEach((text, index) => {
                translationMap.set(text, translatedParts[index]);
            });

            const translateField = (text: string | undefined | null) => (text && text.trim() && text.trim().toLowerCase() !== 'n/a' && translationMap.get(text.trim())) || text;

            // Apply translations
            diagnosis.plantName = translateField(diagnosis.plantName);
            diagnosis.diseaseIdentification.diseaseName = translateField(diagnosis.diseaseIdentification.diseaseName);
            diagnosis.remedySuggestions.forEach(r => {
                r.name = translateField(r.name);
                r.description = translateField(r.description);
            });
            if (marketAnalysis) {
                marketAnalysis.advice = translateField(marketAnalysis.advice);
                marketAnalysis.reason = translateField(marketAnalysis.reason);
            }
            if (treatmentSuggestions) {
                treatmentSuggestions.forEach(t => {
                    t.name = translateField(t.name);
                    t.description = translateField(t.description);
                    t.availability = translateField(t.availability);
                    t.cost = translateField(t.cost);
                });
            }
        }
    }
    
    return {
      diagnosis,
      marketAnalysis,
      treatmentSuggestions,
    };
  }
);
