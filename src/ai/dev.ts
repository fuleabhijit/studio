import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-crop-image.ts';
import '@/ai/flows/suggest-treatment-options.ts';
import '@/ai/flows/translate-text.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/find-govt-schemes.ts';
