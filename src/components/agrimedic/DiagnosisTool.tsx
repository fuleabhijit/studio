
"use client";

import { useState, useRef, type ChangeEvent } from 'react';
import Image from 'next/image';
import { UploadCloud, LoaderCircle, AlertTriangle, Bot, Stethoscope, Pill, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGeolocation } from '@/hooks/useGeolocation';
import { getDiagnosis } from '@/lib/actions';
import type { AnalyzeCropImageOutput } from '@/ai/flows/analyze-crop-image';
import { useToast } from '@/hooks/use-toast';

export default function DiagnosisTool() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeCropImageOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useGeolocation();
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResult(null);
      setError(null);
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    if (!imageFile) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = async () => {
        const photoDataUri = reader.result as string;

        if (location.error) {
            toast({
                variant: 'destructive',
                title: 'Geolocation Error',
                description: "Could not get your location. Diagnosis will not be location-specific.",
            });
        }
        
        const geolocationString = location.latitude && location.longitude 
          ? `lat: ${location.latitude}, lon: ${location.longitude}`
          : undefined;

        const response = await getDiagnosis({ photoDataUri, geolocation: geolocationString });

        if (response.error) {
            setError(response.error);
        } else if (response.data) {
            setResult(response.data);
        }
        setIsLoading(false);
    }
    reader.onerror = () => {
        setError('Failed to read the image file.');
        setIsLoading(false);
    };
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const renderResult = () => (
    <div className="space-y-6">
      <Card className="bg-card shadow-lg border-primary/20">
        <CardHeader className="flex flex-row items-center gap-4">
          <Stethoscope className="w-8 h-8 text-primary" />
          <CardTitle className="font-headline text-2xl">Diagnosis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result?.diseaseIdentification.diseaseDetected ? (
            <>
              <div>
                <h3 className="font-semibold text-lg">Disease Identified</h3>
                <p className="text-muted-foreground">{result.diseaseIdentification.diseaseName || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Pest Identified</h3>
                <p className="text-muted-foreground">{result.diseaseIdentification.pestName || 'N/A'}</p>
              </div>
              <Badge variant="destructive">Disease Detected</Badge>
            </>
          ) : (
             <>
              <p className="text-lg">No disease or pest was confidently identified from the image.</p>
              <Badge variant="secondary">No Disease Detected</Badge>
             </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card shadow-lg border-accent/20">
        <CardHeader className="flex flex-row items-center gap-4">
          <Sparkles className="w-8 h-8 text-accent" />
          <CardTitle className="font-headline text-2xl">Remedy Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2"><Pill className="w-5 h-5"/>Affordable Remedies</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{result?.remedySuggestions.affordableRemedies || 'No specific remedies suggested.'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Notes</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{result?.remedySuggestions.notes || 'No additional notes.'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  const renderLoading = () => (
    <div className="space-y-6">
       <Card>
         <CardHeader>
          <Skeleton className="h-8 w-1/2" />
         </CardHeader>
         <CardContent className="space-y-4">
           <Skeleton className="h-4 w-3/4" />
           <Skeleton className="h-4 w-1/2" />
         </CardContent>
       </Card>
       <Card>
         <CardHeader>
           <Skeleton className="h-8 w-1/2" />
         </CardHeader>
         <CardContent className="space-y-4">
           <Skeleton className="h-4 w-full" />
           <Skeleton className="h-4 w-full" />
           <Skeleton className="h-4 w-2/3" />
         </CardContent>
       </Card>
    </div>
  );

  const renderPlaceholder = () => (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg h-full">
          <Bot size={64} className="text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold font-headline mb-2">AI Diagnosis Awaits</h2>
          <p className="text-muted-foreground max-w-sm">
            Your plant's diagnosis and treatment suggestions will appear here once you upload a photo and start the analysis.
          </p>
      </div>
  );

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Upload Plant Photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-secondary transition-colors"
              onClick={triggerFileSelect}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if(file) handleFileChange({ target: { files: [file] } } as any);
              }}
            >
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                Click to upload or drag and drop an image
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            {imagePreview && (
              <div className="mt-4 border rounded-lg overflow-hidden shadow-sm">
                <Image
                  src={imagePreview}
                  alt="Plant preview"
                  width={500}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            
            <Button
              onClick={handleDiagnose}
              disabled={!imageFile || isLoading}
              className="w-full text-lg py-6 bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
            >
              {isLoading && <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />}
              {isLoading ? 'Diagnosing...' : 'Diagnose Plant'}
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {isLoading ? renderLoading() : result ? renderResult() : renderPlaceholder()}
      </div>
    </div>
  );
}
