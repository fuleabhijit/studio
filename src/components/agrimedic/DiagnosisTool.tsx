
"use client";

import { useState, useRef, type ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { UploadCloud, LoaderCircle, AlertTriangle, Bot, Stethoscope, Sparkles, Volume2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getDiagnosis, getTranslatedDiagnosis, getSpeechFromText } from '@/lib/actions';
import type { AnalyzeCropImageOutput } from '@/ai/flows/analyze-crop-image';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

type TTSSection = 'diagnosis' | 'remedies';

export default function DiagnosisTool() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeCropImageOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [ttsLoading, setTtsLoading] = useState<TTSSection | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setResult(null);
  }, [language]);


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
      setError(t("selectImageError"));
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = async () => {
        const photoDataUri = reader.result as string;

        const diagnosisResponse = await getDiagnosis({ photoDataUri });

        if (diagnosisResponse.error) {
            setError(diagnosisResponse.error);
            setIsLoading(false);
        } else if (diagnosisResponse.data) {
            if (language === 'en') {
                setResult(diagnosisResponse.data);
                setIsLoading(false);
            } else {
                const translationResponse = await getTranslatedDiagnosis({ diagnosis: diagnosisResponse.data, targetLanguage: language });
                if (translationResponse.error) {
                    setError(t('unexpectedError'));
                    setResult(diagnosisResponse.data);
                } else {
                    setResult(translationResponse.data);
                }
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }
    reader.onerror = () => {
        setError(t('readImageError'));
        setIsLoading(false);
    };
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleTextToSpeech = async (section: TTSSection) => {
    if (!result) return;
    setTtsLoading(section);

    let textToSpeak = '';
    
    if (section === 'diagnosis') {
        textToSpeak = `${t('diagnosisTitle')}. `;
        if (result.diseaseIdentification.diseaseDetected) {
            textToSpeak += `${t('diseaseIdentifiedLabel')}: ${result.diseaseIdentification.diseaseName}`;
        } else {
            textToSpeak += t('noDiseaseDetectedMessage');
        }
    } else if (section === 'remedies') {
        textToSpeak = `${t('remedyRecommendationsTitle')}. `;
        if (result.remedySuggestions && result.remedySuggestions.length > 0) {
            textToSpeak += result.remedySuggestions.map((remedy, index) => 
              `Remedy ${index + 1}: ${remedy.name}. Type: ${remedy.type}. Description: ${remedy.description}`
            ).join('. ');
        } else {
            textToSpeak += t('noRemediesSuggested');
        }
    }

    try {
        const response = await getSpeechFromText(textToSpeak);
        if (response.error || !response.data?.media) {
            toast({
                variant: 'destructive',
                title: t('errorTitle'),
                description: response.error || 'Failed to generate audio.',
            });
            setTtsLoading(null);
        } else if (audioRef.current) {
            audioRef.current.src = response.data.media;
            audioRef.current.play().catch(err => {
                console.error("Audio playback failed:", err);
                toast({
                    variant: 'destructive',
                    title: 'Audio Error',
                    description: 'Could not play audio.',
                });
                setTtsLoading(null);
            });
        }
    } catch (e) {
        toast({
            variant: 'destructive',
            title: t('errorTitle'),
            description: t('unexpectedError'),
        });
        setTtsLoading(null);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    const getRemedyTypeBadgeVariant = (type: 'Organic' | 'Chemical' | 'Preventive') => {
        switch (type) {
            case 'Organic': return 'secondary';
            case 'Chemical': return 'destructive';
            case 'Preventive': return 'default';
            default: return 'outline';
        }
    };
    
    return (
        <div className="space-y-6">
            <Card className="bg-card shadow-lg border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Stethoscope className="w-8 h-8 text-primary" />
                        <CardTitle className="font-headline text-2xl">{t('diagnosisTitle')}</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleTextToSpeech('diagnosis')} disabled={!!ttsLoading}>
                        {ttsLoading === 'diagnosis' ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
                        <span className="sr-only">Read diagnosis</span>
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {result.diseaseIdentification.diseaseDetected ? (
                        <>
                            <div>
                                <h3 className="font-semibold text-lg">{t('diseaseIdentifiedLabel')}</h3>
                                <p className="text-muted-foreground">{result.diseaseIdentification.diseaseName || t('notApplicable')}</p>
                            </div>
                            <Badge variant="destructive">{t('diseaseDetectedBadge')}</Badge>
                        </>
                    ) : (
                        <>
                            <p className="text-lg">{t('noDiseaseDetectedMessage')}</p>
                            <Badge variant="secondary">{t('noDiseaseDetectedBadge')}</Badge>
                        </>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-card shadow-lg border-accent/20">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="remedies" className="border-b-0">
                        <AccordionTrigger className="p-6 hover:no-underline">
                           <div className="flex items-center gap-4">
                                <Sparkles className="w-8 h-8 text-accent" />
                                <CardTitle className="font-headline text-2xl">{t('remedyRecommendationsTitle')}</CardTitle>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                            <div className="flex justify-end -mt-4 mb-2">
                                <Button variant="ghost" size="icon" onClick={() => handleTextToSpeech('remedies')} disabled={!!ttsLoading}>
                                    {ttsLoading === 'remedies' ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
                                    <span className="sr-only">Read remedies</span>
                                </Button>
                            </div>
                            {result.remedySuggestions && result.remedySuggestions.length > 0 ? (
                                <div className="space-y-4">
                                    {result.remedySuggestions.map((remedy, index) => (
                                        <Card key={index} className="bg-background p-4">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-lg">{remedy.name}</h4>
                                                <Badge variant={getRemedyTypeBadgeVariant(remedy.type)}>{remedy.type}</Badge>
                                            </div>
                                            <p className="text-muted-foreground mt-2">{remedy.description}</p>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">{t('noRemediesSuggested')}</p>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Card>
        </div>
    );
  };
  
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
        <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
        <CardContent><Skeleton className="h-20 w-full" /></CardContent>
       </Card>
    </div>
  );

  const renderPlaceholder = () => (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg h-full">
          <Bot size={64} className="text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold font-headline mb-2">{t('placeholderTitle')}</h2>
          <p className="text-muted-foreground max-w-sm">
            {t('placeholderDescription')}
          </p>
      </div>
  );

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{t('uploadTitle')}</CardTitle>
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
                  {t('uploadPrompt')}
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
                {isLoading ? t('diagnosingButton') : t('diagnoseButton')}
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{t('errorTitle')}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
          )}
          {isLoading ? renderLoading() : result ? renderResult() : renderPlaceholder()}
        </div>
      </div>
      <audio ref={audioRef} className="hidden" onEnded={() => setTtsLoading(null)} onError={() => setTtsLoading(null)}/>
    </>
  );
}
