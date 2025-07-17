
"use client";

import 'regenerator-runtime/runtime';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/agrimedic/Header';
import Footer from '@/components/agrimedic/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { getGovtSchemes } from '@/lib/actions';
import type { FindGovtSchemesOutput } from '@/ai/flows/find-govt-schemes';
import { IndianStates } from '@/lib/indian-states';
import { LoaderCircle, AlertTriangle, ListChecks, FileText, Sparkles, ExternalLink } from 'lucide-react';
import { useGeolocationContext } from '@/context/GeolocationContext';

const incomeBrackets = ["Below 1 Lakh", "1-5 Lakhs", "5-10 Lakhs", "Above 10 Lakhs"];
const professions = ["Farmer", "Student", "Entrepreneur", "Woman Entrepreneur", "Unemployed", "Other"];

export default function SchemesPage() {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<FindGovtSchemesOutput | null>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const { state: geoState } = useGeolocationContext();

    const formSchema = z.object({
        state: z.string().min(1, { message: "State is required." }),
        profession: z.string().min(1, { message: "Profession is required." }),
        annualIncome: z.string().min(1, { message: "Annual income is required." }),
        category: z.enum(['General', 'OBC', 'SC', 'ST']).optional(),
        landHolding: z.coerce.number().positive({ message: "Please enter a valid number." }).optional().or(z.literal('')),
        crop: z.string().optional(),
        query: z.string().min(5, { message: "Please describe your need in a few more words." }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            state: '',
            profession: '',
            annualIncome: '',
            category: undefined,
            landHolding: '',
            crop: '',
            query: '',
        },
    });

    useEffect(() => {
        if (geoState) {
            form.setValue('state', geoState);
        }
    }, [geoState, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);
        setResult(null);

        const apiInput = {
            ...values,
            landHolding: values.landHolding ? Number(values.landHolding) : undefined,
        };

        const response = await getGovtSchemes(apiInput);

        if (response.error) {
            setError(response.error);
        } else if (response.data && response.data.schemes.length > 0) {
            setResult(response.data);
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            setError("No schemes found matching your criteria. Try adjusting your search.");
        }

        setIsLoading(false);
    }
    
    return (
        <div className="flex flex-col min-h-screen bg-background bg-grid-black/[0.05] dark:bg-grid-white/[0.05]">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold">Find Government Schemes</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Enter your details to find schemes you might be eligible for.</p>
                </div>
                
                <Card className="max-w-4xl mx-auto glass-card shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">Your Profile</CardTitle>
                        <CardDescription>Please enter the following details to help us find the best government schemes for you.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>State / Union Territory *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-background/50">
                                                            <SelectValue placeholder="Select your state" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {IndianStates.map(state => (
                                                            <SelectItem key={state} value={state}>{state}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="profession"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Profession / Category *</FormLabel>
                                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-background/50">
                                                            <SelectValue placeholder="Select your profession" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {professions.map(p => (
                                                            <SelectItem key={p} value={p}>{p}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="annualIncome"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Annual Income Bracket *</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-background/50">
                                                            <SelectValue placeholder="Select income bracket" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {incomeBrackets.map(i => (
                                                          <SelectItem key={i} value={i}>{i}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Social Category</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-background/50">
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="General">General</SelectItem>
                                                        <SelectItem value="OBC">OBC</SelectItem>
                                                        <SelectItem value="SC">SC</SelectItem>
                                                        <SelectItem value="ST">ST</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="landHolding"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Land Holding (acres)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" className="bg-background/50" placeholder="e.g., 5" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name="crop"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Primary Crop</FormLabel>
                                                <FormControl>
                                                    <Input className="bg-background/50" placeholder="e.g., Rice, Wheat" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                 <FormField
                                    control={form.control}
                                    name="query"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>What are you looking for?</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder={'e.g., "drip irrigation subsidy", "crop insurance", "startup loan"'}
                                                        className="pr-12 bg-background/50"
                                                        rows={3}
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
                                            Searching for schemes...
                                        </>
                                    ) : (
                                        "Find Schemes 🚀"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <div ref={resultsRef} className="mt-12 max-w-4xl mx-auto">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                           <LoaderCircle className="w-16 h-16 text-primary animate-spin mb-4" />
                           <h2 className="text-2xl font-bold">Searching for schemes...</h2>
                        </div>
                    )}
                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {result && (
                        <div className="space-y-8">
                             <div className="text-center">
                                <h2 className="text-3xl font-bold">Relevant Schemes Found</h2>
                             </div>
                             {result.schemes.map((scheme, index) => (
                                <Card key={index} className="glass-card shadow-lg border-primary/20">
                                    <CardHeader>
                                        <div className="flex justify-between items-start gap-4">
                                            <CardTitle className="text-2xl flex items-center gap-3">
                                                <Sparkles className="w-6 h-6 text-primary" />
                                                {scheme.name}
                                            </CardTitle>
                                            <Button asChild variant="default" size="sm">
                                                <Link href={scheme.applicationLink} target="_blank" rel="noopener noreferrer">
                                                    Apply Here
                                                    <ExternalLink className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                        <CardDescription className="pt-2">{scheme.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem value="eligibility">
                                                <AccordionTrigger>
                                                    <div className="flex items-center gap-2">
                                                        <ListChecks className="w-5 h-5 text-accent" />
                                                        <span className="font-semibold">Eligibility</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                                                        {scheme.eligibility.map((item, i) => <li key={i}>{item}</li>)}
                                                    </ul>
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="benefits" className="border-b-0">
                                                <AccordionTrigger>
                                                     <div className="flex items-center gap-2">
                                                        <FileText className="w-5 h-5 text-accent" />
                                                        <span className="font-semibold">Benefits</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <p className="text-muted-foreground">{scheme.benefits}</p>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </CardContent>
                                </Card>
                             ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
