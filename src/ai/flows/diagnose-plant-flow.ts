
'use server';
/**
 * @fileOverview A comprehensive plant problem diagnosis AI agent.
 *
 * - diagnosePlant - A function that handles the full plant diagnosis process, including market price and scheme lookups.
 */

import {ai} from '@/ai/genkit';
import { findGovtSchemes } from './find-govt-schemes';
import { getMarketPriceAlertFlowWrapper } from './get-market-price-alert';
import { translateText } from './translate-text';
import {
    ComprehensiveDiagnosisInputSchema,
    ComprehensiveDiagnosisOutputSchema,
    DiseaseDiagnosisSchema
} from '@/ai/schemas';
import type { ComprehensiveDiagnosisInput, ComprehensiveDiagnosisOutput } from '@/ai/schemas';

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
  async ({ photoDataUri, language }) => {
    // 1. Get initial diagnosis in English
    const { output: diagnosis } = await diagnosisPrompt({ photoDataUri });
    if (!diagnosis || !diagnosis.isPlant) {
      // If it's not a plant, return early
      return { diagnosis: diagnosis || { isPlant: false, plantName: 'N/A', diseaseIdentification: { diseaseDetected: false, diseaseName: 'N/A' }, remedySuggestions: [] } };
    }

    let marketAnalysis, governmentSchemes;

    // 2. Concurrently fetch market prices and government schemes
    // We use the identified plantName for these lookups.
    const plantName = diagnosis.plantName;
    if (plantName && plantName.toLowerCase() !== 'n/a') {
        const [marketResult, schemesResult] = await Promise.all([
            getMarketPriceAlertFlowWrapper({ commodity: plantName }).catch(e => { console.error("Market analysis failed:", e); return null; }),
            findGovtSchemes({ state: 'Maharashtra', crop: plantName, query: `schemes for ${plantName}` }).catch(e => { console.error("Scheme lookup failed:", e); return null; })
        ]);
        marketAnalysis = marketResult;
        governmentSchemes = schemesResult;
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
        if(governmentSchemes) { governmentSchemes.schemes.forEach(s => { addText(s.name); addText(s.description); }); }

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
            if (governmentSchemes) {
                governmentSchemes.schemes.forEach(s => {
                    s.name = translateField(s.name);
                    s.description = translateField(s.description);
                });
            }
        }
    }
    
    return {
      diagnosis,
      marketAnalysis,
      governmentSchemes,
    };
  }
);
