
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Header from '@/components/agrimedic/Header';
import Footer from '@/components/agrimedic/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoaderCircle, AlertTriangle, MessageSquare, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getFarmerQueryAnswer } from '@/lib/actions';
import type { AnswerFarmerQueryOutput } from '@/ai/flows/answer-farmer-query';


const FormSchema = z.object({
    query: z.string().min(10, { message: "Please ask a more detailed question." }),
});

export default function QAPage() {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AnswerFarmerQueryOutput | null>(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            query: "",
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsLoading(true);
        setError(null);
        setResult(null);

        const response = await getFarmerQueryAnswer({ query: data.query });

        if (response.error) {
            setError(response.error);
        } else if (response.data) {
            setResult(response.data);
        } else {
             setError("Failed to get an answer. Please try again.");
        }

        setIsLoading(false);
    }

    return (
        <div className="flex flex-col min-h-screen bg-background bg-grid-black/[0.05] dark:bg-grid-white/[0.05]">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold">Farmer Q&A</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Ask any question about farming and get an instant answer from our AI expert.</p>
                </div>
                
                <Card className="max-w-3xl mx-auto glass-card shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-3">
                            <MessageSquare className="w-6 h-6 text-primary" />
                            Ask a Question
                        </CardTitle>
                        <CardDescription>Describe your problem or question in detail below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="query"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="sr-only">Your Question</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="e.g., How can I control pests on my tomato plants using organic methods?"
                                                    className="resize-none bg-background/50"
                                                    rows={4}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isLoading} className="w-full text-lg py-6 bg-accent text-accent-foreground hover:bg-accent/90">
                                    {isLoading ? (
                                        <>
                                            <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                                            Getting Answer...
                                        </>
                                    ) : (
                                        "Get AI Answer"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <div className="mt-12 max-w-3xl mx-auto">
                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {result && (
                         <Card className="glass-card shadow-lg border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-2xl flex items-center gap-3">
                                    <Sparkles className="w-6 h-6 text-primary" />
                                    AI Generated Answer
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-lg">
                               <p className="whitespace-pre-wrap">{result.answer}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

            </main>
            <Footer />
        </div>
    );
}
