
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/agrimedic/Header';
import Footer from '@/components/agrimedic/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoaderCircle, AlertTriangle, TrendingUp, DollarSign, ShoppingCart, Sparkles } from 'lucide-react';
import { getMarketPriceAlert } from '@/lib/actions';
import type { PriceAlert } from '@/ai/flows/get-market-price-alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const availableCrops = ["Tomato", "Onion", "Potato", "Wheat", "Rice", "Cotton", "Maize", "Soyabean"];

export default function PricesPage() {
    const searchParams = useSearchParams();
    const cropFromURL = searchParams.get('crop');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<PriceAlert | null>(null);
    const [selectedCrop, setSelectedCrop] = useState<string>(cropFromURL || '');

    const handleFetchPrices = async () => {
        if (!selectedCrop) {
            setError("Please select a crop first.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        const response = await getMarketPriceAlert({ commodity: selectedCrop });

        if (response.error) {
            setError(response.error);
        } else if (response.data) {
            setResult(response.data);
        } else {
            setError("Failed to get price alert.");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if(cropFromURL) {
            setSelectedCrop(cropFromURL);
            handleFetchPrices();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cropFromURL]);


    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold">Market Price Tracker 📈</h1>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Get real-time price analysis for your crops. Knowledge is profit!</p>
                </div>
                
                <Card className="max-w-2xl mx-auto glass-card shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl">Crop Price Analysis</CardTitle>
                        <CardDescription>Select a crop to get the latest mandi price intelligence.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                        <Select onValueChange={setSelectedCrop} value={selectedCrop}>
                            <SelectTrigger className="w-full text-lg py-6 bg-background/50">
                                <SelectValue placeholder="Select a crop..." />
                            </SelectTrigger>
                            <SelectContent>
                                {availableCrops.map(crop => (
                                    <SelectItem key={crop} value={crop} className="text-lg">{crop}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleFetchPrices} disabled={isLoading || !selectedCrop} className="w-full text-lg py-6 bg-accent text-accent-foreground hover:bg-accent/90 transform hover:scale-105 transition-all duration-300">
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                                    Fetching Prices...
                                </>
                            ) : (
                                "Get Prices ⚡️"
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <div className="mt-12 max-w-2xl mx-auto">
                    {error && (
                        <Alert variant="destructive" className="glass-card bg-destructive/20 border-destructive/50">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {result && (
                         <Card className="glass-card shadow-xl border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-2xl flex items-center gap-3">
                                    <TrendingUp className="w-8 h-8 text-primary" />
                                    Today's {result.commodity} Price Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-lg p-6">
                                <div className="flex items-center gap-4 p-3 rounded-lg bg-background/50">
                                    <DollarSign className="w-6 h-6 text-accent"/>
                                    <div>
                                        <p className="font-semibold">Price Range: {result.priceRange} INR/quintal <span className={result.trend === '▲' ? 'text-success' : result.trend === '▼' ? 'text-destructive' : ''}>{result.trend}</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-lg bg-background/50">
                                     <ShoppingCart className="w-6 h-6 text-accent"/>
                                     <div>
                                        <p className="font-semibold">Best Market: {result.bestMarket} at {result.bestPrice} INR/quintal</p>
                                     </div>
                                </div>
                                <div className="flex items-start gap-4 p-3 rounded-lg bg-background/50">
                                     <Sparkles className="w-6 h-6 text-accent mt-1"/>
                                     <div>
                                        <p className="font-semibold">AI Advice: <span className="font-bold">{result.advice}</span> - <span className="font-normal text-muted-foreground">{result.reason}</span></p>
                                     </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
