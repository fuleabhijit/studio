
"use client";

import { useState } from 'react';
import Header from '@/components/agrimedic/Header';
import Footer from '@/components/agrimedic/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoaderCircle, AlertTriangle, TrendingUp, DollarSign, ShoppingCart, Wheat } from 'lucide-react';
import { getMarketPriceAlert } from '@/lib/actions';
import type { PriceAlert } from '@/ai/flows/get-market-price-alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const availableCrops = ["Tomato", "Onion", "Potato", "Wheat"];

export default function PricesPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<PriceAlert | null>(null);
    const [selectedCrop, setSelectedCrop] = useState<string>('');

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

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold font-headline">Market Price Tracker</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Get real-time price analysis for your crops.</p>
                </div>
                
                <Card className="max-w-2xl mx-auto shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Crop Price Analysis</CardTitle>
                        <CardDescription>Select a crop to get the latest price analysis.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Select onValueChange={setSelectedCrop} value={selectedCrop}>
                            <SelectTrigger className="w-full text-lg py-6">
                                <SelectValue placeholder="Select a crop..." />
                            </SelectTrigger>
                            <SelectContent>
                                {availableCrops.map(crop => (
                                    <SelectItem key={crop} value={crop} className="text-lg">{crop}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleFetchPrices} disabled={isLoading || !selectedCrop} className="w-full text-lg py-6 bg-accent text-accent-foreground hover:bg-accent/90">
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                                    Fetching Prices...
                                </>
                            ) : (
                                "Get Prices"
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <div className="mt-12 max-w-2xl mx-auto">
                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {result && (
                         <Card className="shadow-lg border-primary/20">
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl flex items-center gap-3">
                                    <TrendingUp className="w-6 h-6 text-primary" />
                                    Today's {result.commodity} Price Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-lg">
                                <div className="flex items-center gap-4">
                                    <DollarSign className="w-6 h-6 text-accent"/>
                                    <div>
                                        <p className="font-semibold">Price Range: {result.priceRange} INR/kg <span className={result.trend === '▲' ? 'text-success' : result.trend === '▼' ? 'text-destructive' : ''}>{result.trend}</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                     <ShoppingCart className="w-6 h-6 text-accent"/>
                                     <div>
                                        <p className="font-semibold">Best Market: {result.bestMarket} at {result.bestPrice} INR/kg</p>
                                     </div>
                                </div>
                                <div className="flex items-start gap-4">
                                     <AlertTriangle className="w-6 h-6 text-accent mt-1"/>
                                     <div>
                                        <p className="font-semibold">Advice: <span className="font-bold">{result.advice}</span> - <span className="font-normal text-muted-foreground">{result.reason}</span></p>
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
