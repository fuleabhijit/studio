
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

        const resourceId = '9ef84268-d588-465a-a308-a864a43d0070'; // A common resource for market prices
        const limit = 50; // Fetch a decent number of recent records
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
                // API Date format is DD/MM/YYYY
                const dateParts = record.arrival_date.split('/');
                if (dateParts.length !== 3) return null;
                // new Date(YYYY, MM, DD) - month is 0-indexed
                const arrivalDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));

                const price = parseInt(record.modal_price, 10);
                if (isNaN(price) || price === 0) return null;

                return {
                    commodity: record.commodity,
                    state: record.state,
                    district: record.district,
                    market: record.market,
                    price,
                    date: arrivalDate.toLocaleDateString('en-CA'), // YYYY-MM-DD for consistency
                };
            }).filter((r: any): r is z.infer<typeof MarketPriceSchema> => r !== null);
            
            // Return up to 10 most recent valid records
            return parsedRecords.slice(0, 10);

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
    First, use the getLatestPricesForCommodity tool to fetch the latest data for the specified commodity from live government APIs.
    Then, analyze these prices and provide a summary for the farmer.
    
    1. Identify the commodity in your response.
    2. Calculate the current price range for today based on the most recent data.
    3. Compare today's average price with yesterday's to determine the trend (▲ for up, ▼ for down, - for stable). If there's no data for yesterday, mark as '-'.
    4. Identify the market with the best price today.
    5. Provide clear advice to "Hold" or "Sell Now" with a brief, simple reason. Base your advice on price trends and volatility.
    
    If no data is returned from the tool, state that you could not retrieve the prices and do not fill the other fields.
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
