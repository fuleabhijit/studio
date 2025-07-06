
'use server';

/**
 * @fileOverview An AI agent for analyzing market prices and generating alerts for farmers.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MarketPriceSchema = z.object({
    commodity: z.string(),
    state: z.string(),
    district: z.string(),
    market: z.string(),
    price: z.number(),
    date: z.string(),
});

const PriceAlertSchema = z.object({
    priceRange: z.string().describe("The current price range, e.g., '15-20'"),
    trend: z.enum(['▲', '▼', '-']).describe("The price trend compared to the previous day: '▲' for up, '▼' for down, '-' for stable."),
    bestMarket: z.string().describe("The name of the market with the highest price."),
    bestPrice: z.number().describe("The price at the best market."),
    advice: z.enum(['Hold', 'Sell Now']).describe("The recommended action for the farmer."),
    reason: z.string().describe("A brief reason for the advice."),
});
export type PriceAlert = z.infer<typeof PriceAlertSchema>;

const getLatestTomatoPrices = ai.defineTool(
    {
        name: 'getLatestTomatoPrices',
        description: 'Gets the most recent tomato prices from various markets.',
        inputSchema: z.void(),
        outputSchema: z.array(MarketPriceSchema),
    },
    async () => {
        // In a real application, this would query a database like Firestore.
        // For now, we return hardcoded data to simulate the scraper's output.
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
        
        return [
            { commodity: "Tomato", state: "Maharashtra", district: "Nashik", market: "Pimpalgaon", price: 25, date: today },
            { commodity: "Tomato", state: "Maharashtra", district: "Pune", market: "Manchar", price: 22, date: today },
            { commodity: "Tomato", state: "Karnataka", district: "Kolar", market: "Kolar", price: 18, date: today },
            { commodity: "Tomato", state: "Maharashtra", district: "Nashik", market: "Pimpalgaon", price: 23, date: yesterday },
            { commodity: "Tomato", state: "Maharashtra", district: "Pune", market: "Manchar", price: 24, date: yesterday },
        ];
    }
);

const priceAlertPrompt = ai.definePrompt({
    name: 'priceAlertPrompt',
    tools: [getLatestTomatoPrices],
    output: { schema: PriceAlertSchema },
    prompt: `You are an agricultural market analyst. A farmer wants to know the current tomato prices.
    First, use the getLatestTomatoPrices tool to fetch the latest data.
    Then, analyze these tomato prices and provide a summary for the farmer.
    
    1. Calculate the current price range for today.
    2. Compare today's average price with yesterday's to determine the trend (▲ for up, ▼ for down).
    3. Identify the market with the best price today.
    4. Provide clear advice to "Hold" or "Sell Now" with a brief, simple reason.
    
    Respond ONLY with a JSON object that strictly adheres to the PriceAlertSchema.`,
});

const getMarketPriceAlertFlow = ai.defineFlow(
    {
        name: 'getMarketPriceAlertFlow',
        inputSchema: z.void(),
        outputSchema: PriceAlertSchema,
    },
    async () => {
        const { output } = await priceAlertPrompt();
        if (!output) {
            throw new Error('Failed to generate price alert from AI.');
        }
        return output;
    }
);

export async function getMarketPriceAlertFlowWrapper(): Promise<PriceAlert> {
    return getMarketPriceAlertFlow();
}
