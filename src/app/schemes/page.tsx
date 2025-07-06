
"use client";

import 'regenerator-runtime/runtime';
import { useState, useRef } from 'react';
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
import { Badge } from '@/components/ui/badge';
import Header from '@/components/agrimedic/Header';
import Footer from '@/components/agrimedic/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { getGovtSchemes } from '@/lib/actions';
import type { FindGovtSchemesOutput } from '@/ai/flows/find-govt-schemes';
import { IndianStates } from '@/lib/indian-states';
import { LoaderCircle, AlertTriangle, ListChecks, FileText, Sparkles, Mic, ExternalLink } from 'lucide-react';


export default function SchemesPage() {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<FindGovtSchemesOutput | null>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    const formSchema = z.object({
        state: z.string().min(1, { message: t('requiredError') }),
        crop: z.string().optional(),
        landHolding: z.coerce.number().positive({ message: t('positiveNumberError') }).optional().or(z.literal('')),
        category: z.enum(['General', 'OBC', 'SC', 'ST']).optional(),
        query: z.string().min(5, { message: t('queryMinLengthError') }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            state: '',
            crop: '',
            landHolding: '',
            category: undefined,
            query: '',
        },
    });

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
            setError(t('noSchemesFoundError'));
        }

        setIsLoading(false);
    }
    
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold font-headline">{t('schemesPageTitle')}</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{t('schemesPageDescription')}</p>
                </div>
                
                <Card className="max-w-4xl mx-auto shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">{t('eligibilityFormTitle')}</CardTitle>
                        <CardDescription>{t('eligibilityFormDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('stateLabel')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t('statePlaceholder')} />
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
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('categoryLabel')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t('categoryPlaceholder')} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="General">{t('categoryGeneral')}</SelectItem>
                                                        <SelectItem value="OBC">{t('categoryOBC')}</SelectItem>
                                                        <SelectItem value="SC">{t('categorySC')}</SelectItem>
                                                        <SelectItem value="ST">{t('categoryST')}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="crop"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('cropLabel')}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={t('cropPlaceholder')} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="landHolding"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('landLabel')}</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="e.g., 5" {...field} />
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
                                            <FormLabel>{t('queryLabel')}</FormLabel>
                                                <FormControl>
                                                <div className="relative">
                                                    <Textarea
                                                        placeholder={t('queryPlaceholder')}
                                                        className="pr-12"
                                                        rows={3}
                                                        {...field}
                                                    />
                                                    <Button 
                                                        type="button"
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="absolute right-2 top-1/2 -translate-y-1/2"
                                                        title={t('startListening')}
                                                    >
                                                        <Mic className="h-5 w-5" />
                                                        <span className="sr-only">{t('startListening')}</span>
                                                    </Button>
                                                </div>
                                                </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isLoading} className="w-full text-lg py-6 bg-accent text-accent-foreground hover:bg-accent/90">
                                    {isLoading ? (
                                        <>
                                            <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                                            {t('findingSchemesButton')}
                                        </>
                                    ) : (
                                        t('findSchemesButton')
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
                           <h2 className="text-2xl font-bold font-headline mb-2">{t('findingSchemesButton')}</h2>
                        </div>
                    )}
                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>{t('errorTitle')}</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {result && (
                        <div className="space-y-8">
                             <div className="text-center">
                                <h2 className="text-3xl font-bold font-headline">{t('schemesResultTitle')}</h2>
                             </div>
                             {result.schemes.map((scheme, index) => (
                                <Card key={index} className="shadow-lg border-primary/20">
                                    <CardHeader>
                                        <div className="flex justify-between items-start gap-4">
                                            <CardTitle className="font-headline text-2xl flex items-center gap-3">
                                                <Sparkles className="w-6 h-6 text-primary" />
                                                {scheme.name}
                                            </CardTitle>
                                            <Button asChild variant="default" size="sm">
                                                <Link href={scheme.applicationLink} target="_blank" rel="noopener noreferrer">
                                                    {t('schemeApplyButton')}
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
                                                        <span className="font-semibold">{t('schemeEligibilityLabel')}</span>
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
                                                        <span className="font-semibold">{t('schemeBenefitsLabel')}</span>
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
