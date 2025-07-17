
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
    priceRange: z.string().describe("The current price range, e.g., '15-20' or 'Could not retrieve prices' if no data is found."),
    trend: z.enum(['▲', '▼', '-']).describe("The price trend compared to the previous day: '▲' for up, '▼' for down, '-' for stable."),
    bestMarket: z.string().describe("The name of the market with the highest price. Should be 'N/A' if no data."),
    bestPrice: z.number().describe("The price at the best market. Should be 0 if no data."),
    advice: z.string().describe("The recommended action for the farmer, e.g., 'Hold' or 'Sell Now'."),
    reason: z.string().describe("A brief reason for the advice."),
});
export type PriceAlert = z.infer<typeof PriceAlertSchema>;

const GetLatestPricesInputSchema = z.object({
    commodity: z.string().describe('The commodity to get prices for, e.g., "Tomato".'),
});


const getLatestPricesForCommodity = ai.defineTool(
    {
        name: 'getLatestPricesForCommodity',
        description: 'Gets the most recent prices for a specific commodity from various markets using the data.gov.in API.',
        inputSchema: GetLatestPricesInputSchema,
        outputSchema: z.array(MarketPriceSchema),
    },
    async ({ commodity }) => {
        const apiKey = process.env.GOVT_API_KEY;
        if (!apiKey) {
            console.error('GOVT_API_KEY is not set in the environment variables.');
            throw new Error('Server is not configured for market price lookups.');
        }

        const resourceId = '9ef84268-d588-465a-a308-a864a43d0070';
        const limit = 100;
        const url = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&limit=${limit}&filters[commodity]=${encodeURIComponent(commodity)}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`API request failed with status ${response.status}:`, await response.text());
                throw new Error(`Failed to fetch data from data.gov.in API. Status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.records || data.records.length === 0) {
                console.log(`No records found for commodity: ${commodity}`);
                return [];
            }
            
            const parsedRecords = data.records.map((record: any) => {
                const dateParts = record.arrival_date.split('/');
                if (dateParts.length !== 3) return null;
                const arrivalDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));

                const price = parseInt(record.modal_price, 10);
                if (isNaN(price) || price === 0) return null;

                return {
                    commodity: record.commodity,
                    state: record.state,
                    district: record.district,
                    market: record.market,
                    price,
                    date: arrivalDate.toISOString().split('T')[0],
                };
            }).filter((r: any): r is z.infer<typeof MarketPriceSchema> => r !== null);
            
            return parsedRecords;

        } catch (error) {
            console.error('Error fetching or parsing market data:', error);
            throw new Error('An error occurred while fetching live market prices.');
        }
    }
);


const priceAlertPrompt = ai.definePrompt({
    name: 'priceAlertPrompt',
    model: 'googleai/gemini-2.0-flash',
    tools: [getLatestPricesForCommodity],
    input: { schema: GetLatestPricesInputSchema },
    output: { schema: PriceAlertSchema },
    prompt: `You are an agricultural market analyst. A farmer wants to know the current prices for {{{commodity}}}.
    
    1.  First, use the \`getLatestPricesForCommodity\` tool to fetch the latest data for the specified commodity.
    2.  **IMPORTANT**: If the tool returns NO records for the specific commodity (e.g., "Potato"), automatically try a more general category. For example, if "Potato" fails, try "Vegetable". If "Wheat" fails, try "Cereals". Use your judgment for the best fallback category. Use the tool again with this general category.
    3.  Analyze the prices from the successful tool call and provide a summary for the farmer.
    4.  Calculate the current price range based on the most recent data.
    5.  Compare today's average price with yesterday's to determine the trend (▲ for up, ▼ for down, - for stable). If there's no data for yesterday, mark as '-'.
    6.  Identify the market with the best price today.
    7.  Provide clear advice to "Hold" or "Sell Now" with a brief, simple reason. Base your advice on price trends and volatility.
    
    If no data is returned from the tool even after trying a general category, state that you could not retrieve the prices and do not fill the other fields (use "N/A", 0, or appropriate defaults).
    Respond ONLY with a JSON object that strictly adheres to the PriceAlertSchema.`,
});

const GetMarketPriceAlertInputSchema = z.object({
  commodity: z.string().min(1, 'Commodity is required.'),
});
type GetMarketPriceAlertInput = z.infer<typeof GetMarketPriceAlertInputSchema>;


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

export async function getMarketPriceAlertFlowWrapper(input: GetMarketPriceAlertInput): Promise<PriceAlert> {
    return getMarketPriceAlertFlow(input);
}
