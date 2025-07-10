
'use server';
/**
 * @fileOverview A comprehensive plant problem diagnosis AI agent.
 *
 * - diagnosePlant - A function that handles the full plant diagnosis process, including market price and scheme lookups.
 * - ComprehensiveDiagnosisInput - The input type for the diagnosePlant function.
 * - ComprehensiveDiagnosisOutput - The return type for the diagnosePlant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { findGovtSchemes } from './find-govt-schemes';
import { getMarketPriceAlertFlowWrapper } from './get-market-price-alert';
import { translateText } from './translate-text';
import type { Language } from '@/lib/translations';

// Define schemas for internal sub-tasks
const DiseaseDiagnosisSchema = z.object({
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

// Final output schema combining all information
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

// Main exported function
export async function diagnosePlant(input: ComprehensiveDiagnosisInput): Promise<ComprehensiveDiagnosisOutput> {
  return diagnosePlantFlow(input);
}

// Prompt for the initial disease diagnosis
const diagnosisPrompt = ai.definePrompt({
  name: 'diseaseDiagnosisPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: z.object({ photoDataUri: z.string() })},
  output: {schema: DiseaseDiagnosisSchema},
  prompt: `You are an expert botanist. Analyze the provided plant image.
  Identify the plant's common name and any diseases or pests.
  Suggest at least two remedies (Organic, Chemical, or Preventive).
  If no plant is detected or the plant is healthy, state that clearly.
  
  Photo: {{media url=photoDataUri}}
  
  Respond ONLY with a JSON object strictly adhering to the DiseaseDiagnosisSchema.`,
});

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
