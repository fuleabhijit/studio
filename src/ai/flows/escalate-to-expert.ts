
'use server';
/**
 * @fileOverview An AI agent for escalating a diagnosis to a local agricultural expert.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { EscalationInputSchema, EscalationOutputSchema } from '@/ai/schemas';
import type { EscalationInput, EscalationOutput } from '@/ai/schemas';


// Mock database of agricultural experts by state
const expertsByState: Record<string, { name: string; email: string; phone: string }> = {
    "Maharashtra": { name: "Dr. Anjali Patil", email: "anjali.p@agri.gov.in", phone: "9876543210" },
    "Karnataka": { name: "Mr. Shankar Gowda", email: "s.gowda@agri.gov.in", phone: "9876543211" },
    "Punjab": { name: "Dr. Harpreet Singh", email: "h.singh@agri.gov.in", phone: "9876543212" },
    "Uttar Pradesh": { name: "Mr. Rajesh Kumar", email: "rkumar@agri.gov.in", phone: "9876543213" },
    "Tamil Nadu": { name: "Mrs. Priya Murugan", email: "p.murugan@agri.gov.in", phone: "9876543214" },
    "Default": { name: "National Agri Helpline", email: "help@agri.gov.in", phone: "1800-180-1551" },
};

const findLocalExpertTool = ai.defineTool(
    {
        name: 'findLocalExpert',
        description: 'Finds the contact information for a local agricultural expert based on the state.',
        inputSchema: z.object({ state: z.string().describe("The state of the user.") }),
        outputSchema: z.object({ name: z.string(), email: z.string(), phone: z.string() }),
    },
    async ({ state }) => {
        return expertsByState[state] || expertsByState["Default"];
    }
);

const escalationPrompt = ai.definePrompt({
    name: 'escalationPrompt',
    model: 'googleai/gemini-2.0-flash',
    tools: [findLocalExpertTool],
    input: { schema: EscalationInputSchema },
    output: { schema: EscalationOutputSchema },
    prompt: `You are an assistant helping a farmer escalate an issue to a government agricultural expert.
    
    1.  First, use the 'findLocalExpert' tool to get the contact details for the expert in the farmer's state: {{{userState}}}.
    2.  Then, generate a clear, professional, and concise message for the farmer to send to this expert.
    3.  The message should include:
        - The plant identified: {{{plantName}}}
        - The potential disease: {{{diseaseName}}}
        - The remedies already suggested: {{{remedies}}}
        - A note that a photo is attached for review.
    4.  The escalation message should be polite and to the point.
    5.  Finally, return the expert's name, their contact info (email and phone), and the generated message.
    
    Respond ONLY with a JSON object that strictly adheres to the EscalationOutputSchema.`,
});


const escalateToExpertFlow = ai.defineFlow(
  {
    name: 'escalateToExpertFlow',
    inputSchema: EscalationInputSchema,
    outputSchema: EscalationOutputSchema,
  },
  async (input) => {
    const { output } = await escalationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate escalation details.');
    }
    return output;
  }
);

export async function escalateToExpert(input: EscalationInput): Promise<EscalationOutput> {
  return escalateToExpertFlow(input);
}
