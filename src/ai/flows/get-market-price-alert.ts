
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
    commodity: z.string().describe("The name of the commodity being analyzed."),
    priceRange: z.string().describe("The current price range, e.g., '15-20'"),
    trend: z.enum(['▲', '▼', '-']).describe("The price trend compared to the previous day: '▲' for up, '▼' for down, '-' for stable."),
    bestMarket: z.string().describe("The name of the market with the highest price."),
    bestPrice: z.number().describe("The price at the best market."),
    advice: z.enum(['Hold', 'Sell Now']).describe("The recommended action for the farmer."),
    reason: z.string().describe("A brief reason for the advice."),
});
export type PriceAlert = z.infer<typeof PriceAlertSchema>;

const GetLatestPricesInputSchema = z.object({
    commodity: z.string().describe('The commodity to get prices for, e.g., "Tomato".'),
});

const getLatestPricesForCommodity = ai.defineTool(
    {
        name: 'getLatestPricesForCommodity',
        description: 'Gets the most recent prices for a specific commodity from various markets.',
        inputSchema: GetLatestPricesInputSchema,
        outputSchema: z.array(MarketPriceSchema),
    },
    async ({ commodity }) => {
        // In a real application, this would query a database or an external API like data.gov.in.
        // For now, we return hardcoded data to simulate the API's output.
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
        
        const priceData = {
            "Tomato": { today: [25, 22, 18], yesterday: [23, 24] },
            "Onion": { today: [15, 12, 16], yesterday: [14, 15] },
            "Potato": { today: [10, 11, 9], yesterday: [10, 10] },
            "Wheat": { today: [20, 21, 19], yesterday: [20, 20] },
        }[commodity] || { today: [25, 22, 18], yesterday: [23, 24] };

        const markets = [
            { state: "Maharashtra", district: "Nashik", market: "Pimpalgaon" },
            { state: "Maharashtra", district: "Pune", market: "Manchar" },
            { state: "Karnataka", district: "Kolar", market: "Kolar" },
        ];
        
        const todayPrices = priceData.today.map((price, i) => ({
            commodity,
            ...markets[i % markets.length],
            price,
            date: today,
        }));
        const yesterdayPrices = priceData.yesterday.map((price, i) => ({
            commodity,
            ...markets[i % markets.length],
            price,
            date: yesterday,
        }));

        return [...todayPrices, ...yesterdayPrices];
    }
);

const priceAlertPrompt = ai.definePrompt({
    name: 'priceAlertPrompt',
    model: 'googleai/gemini-2.0-flash',
    tools: [getLatestPricesForCommodity],
    input: { schema: GetLatestPricesInputSchema },
    output: { schema: PriceAlertSchema },
    prompt: `You are an agricultural market analyst. A farmer wants to know the current prices for {{{commodity}}}.
    First, use the getLatestPricesForCommodity tool to fetch the latest data for the specified commodity.
    Then, analyze these prices and provide a summary for the farmer.
    
    1. Identify the commodity in your response.
    2. Calculate the current price range for today.
    3. Compare today's average price with yesterday's to determine the trend (▲ for up, ▼ for down, - for stable).
    4. Identify the market with the best price today.
    5. Provide clear advice to "Hold" or "Sell Now" with a brief, simple reason.
    
    Respond ONLY with a JSON object that strictly adheres to the PriceAlertSchema.`,
});

const GetMarketPriceAlertInputSchema = z.object({
  commodity: z.string().min(1, 'Commodity is required.'),
});

const getMarketPriceAlertFlow = ai.defineFlow(
    {
        name: 'getMarketPriceAlertFlow',
        inputSchema: GetMarketPriceAlertInputSchema,
        outputSchema: PriceAlertSchema,
    },
    async ({ commodity }) => {
        const { output } = await priceAlertPrompt({ commodity });
        if (!output) {
            throw new Error('Failed to generate price alert from AI.');
        }
        return output;
    }
);

export async function getMarketPriceAlertFlowWrapper(input: z.infer<typeof GetMarketPriceAlertInputSchema>): Promise<PriceAlert> {
    return getMarketPriceAlertFlow(input);
}
