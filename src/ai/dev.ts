
import { config } from 'dotenv';
config();

import '@/ai/flows/diagnose-plant-flow.ts';
import '@/ai/flows/suggest-treatment-options.ts';
import '@/ai/flows/translate-text.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/find-govt-schemes.ts';
import '@/ai/flows/get-market-price-alert.ts';
import '@/ai/flows/answer-farmer-query.ts';

