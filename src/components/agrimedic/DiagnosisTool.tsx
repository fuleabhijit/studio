
"use client";

import 'regenerator-runtime/runtime';
import { useState, useRef, type ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { Camera, LoaderCircle, AlertTriangle, HeartPulse, FlaskConical, Volume2, Mic, MicOff, Flower2, Share2, Save, ShoppingCart, TrendingUp, Sparkles, X } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { getComprehensiveDiagnosis } from '@/lib/actions';
import type { ComprehensiveDiagnosisOutput } from '@/ai/flows/diagnose-plant-flow';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

type TTSSection = 'diagnosis' | 'remedies';

export default function DiagnosisTool() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComprehensiveDiagnosisOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [ttsLoading, setTtsLoading] = useState<TTSSection | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({
    commands: [
        {
          command: ['upload image', 'select image', 'choose photo'],
          callback: () => triggerFileSelect()
        },
        {
          command: ['diagnose *', 'check *', 'what is wrong with my *'],
          callback: (plant) => {
            toast({ title: `Diagnosing ${plant}...`});
            handleDiagnose();
          }
        },
        {
            command: ['clear', 'reset'],
            callback: () => handleClear()
        }
      ]
  });

  useEffect(() => {
    // Reset state when language changes
    handleClear();
  }, [language]);


  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
        if (!browserSupportsSpeechRecognition) {
            toast({
                variant: 'destructive',
                title: t('errorTitle'),
                description: t('speechRecognitionNotSupported'),
            });
            return;
        }
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false, language });
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleClear();
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        handleDiagnose(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async (file?: File, dataUri?: string) => {
    const currentFile = file || imageFile;
    const currentDataUri = dataUri || imagePreview;

    if (!currentFile || !currentDataUri) {
      setError(t("selectImageError"));
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const diagnosisResponse = await getComprehensiveDiagnosis({ photoDataUri: currentDataUri, language });
    
    if (diagnosisResponse.error) {
        setError(diagnosisResponse.error);
    } else if (diagnosisResponse.data) {
        setResult(diagnosisResponse.data);
    } else {
        setError(t('unexpectedError'));
    }
    setIsLoading(false);
  };

  const handleClear = () => {
    setResult(null);
    setError(null);
    setImageFile(null);
    setImagePreview(null);
    resetTranscript();
    if(fileInputRef.current) fileInputRef.current.value = "";
  }

  const triggerFileSelect = () => fileInputRef.current?.click();

  const renderResult = () => {
    if (!result) return null;
    
    const { diagnosis, marketAnalysis, governmentSchemes } = result;

    const getRemedyTypeBadgeVariant = (type: 'Organic' | 'Chemical' | 'Preventive'): BadgeProps['variant'] => {
        switch (type) {
            case 'Organic': return 'success';
            case 'Chemical': return 'destructive';
            case 'Preventive': return 'default';
            default: return 'outline';
        }
    };
    
    return (
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <div className="space-y-6">
                {/* Diagnosis */}
                <Card className="glass-card">
                    <CardHeader className="flex-row items-center gap-4 space-y-0">
                        <HeartPulse className="w-8 h-8 text-primary" />
                        <CardTitle className="text-2xl">{t('diagnosisTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {diagnosis.diseaseIdentification.diseaseDetected ? (
                            <p className="text-lg">{diagnosis.diseaseIdentification.diseaseName}</p>
                        ) : (
                            <p className="text-lg">{t('noDiseaseDetectedMessage')}</p>
                        )}
                        <Badge variant={diagnosis.diseaseIdentification.diseaseDetected ? "destructive" : "success"} className="mt-2">
                           {diagnosis.diseaseIdentification.diseaseDetected ? t('diseaseDetectedBadge') : t('noDiseaseDetectedBadge')}
                        </Badge>
                    </CardContent>
                </Card>

                {/* Remedies */}
                {diagnosis.remedySuggestions && diagnosis.remedySuggestions.length > 0 && (
                    <Card className="glass-card">
                        <CardHeader className="flex-row items-center gap-4 space-y-0">
                            <FlaskConical className="w-8 h-8 text-accent" />
                            <CardTitle className="text-2xl">{t('remedyRecommendationsTitle')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {diagnosis.remedySuggestions.map((remedy, index) => (
                                <div key={index} className="p-3 rounded-md bg-background/50">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold">{remedy.name}</h4>
                                        <Badge variant={getRemedyTypeBadgeVariant(remedy.type)}>{remedy.type}</Badge>
                                    </div>
                                    <p className="text-muted-foreground mt-1 text-sm">{remedy.description}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
            <div className="space-y-6">
                {/* Market Analysis */}
                {marketAnalysis && (
                    <Card className="glass-card">
                         <CardHeader className="flex-row items-center gap-4 space-y-0">
                            <TrendingUp className="w-8 h-8 text-primary" />
                            <CardTitle className="text-2xl">{marketAnalysis.commodity} Prices</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3"><ShoppingCart className="w-5 h-5 text-accent"/> <p>Range: {marketAnalysis.priceRange} INR/kg</p></div>
                            <div className="flex items-center gap-3"><TrendingUp className="w-5 h-5 text-accent"/> <p>Trend: {marketAnalysis.trend}</p></div>
                            <div className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-accent"/> <p>Advice: <strong>{marketAnalysis.advice}</strong> - {marketAnalysis.reason}</p></div>
                        </CardContent>
                    </Card>
                )}
                {/* Government Schemes */}
                {governmentSchemes && governmentSchemes.schemes.length > 0 && (
                    <Card className="glass-card">
                         <CardHeader className="flex-row items-center gap-4 space-y-0">
                            <Sparkles className="w-8 h-8 text-primary" />
                            <CardTitle className="text-2xl">{t('governmentSchemesTitle')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {governmentSchemes.schemes.map((scheme, index) => (
                                <div key={index} className="p-3 rounded-md bg-background/50">
                                    <h4 className="font-bold">{scheme.name}</h4>
                                    <p className="text-muted-foreground mt-1 text-sm line-clamp-2">{scheme.description}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
  };
  
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center text-center p-8 h-full">
       <LoaderCircle className="w-16 h-16 text-primary animate-spin mb-4" />
       <h2 className="text-2xl font-bold mb-2">{t('diagnosingButton')}</h2>
    </div>
  );

  const renderPlaceholder = () => (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg h-full bg-background/30">
          <Flower2 size={64} className="text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">{t('placeholderTitle')}</h2>
          <p className="text-muted-foreground max-w-sm">
            {t('placeholderDescription')}
          </p>
      </div>
  );

  return (
    <>
      <Card className="max-w-4xl mx-auto mb-8 glass-card">
        <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div
                    className="relative w-full md:w-48 h-32 md:h-24 flex-shrink-0 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    onClick={triggerFileSelect}
                >
                    {imagePreview ? (
                        <>
                            <Image
                                src={imagePreview}
                                alt="Plant preview"
                                layout="fill"
                                className="object-cover rounded-lg"
                            />
                            <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-7 w-7 z-10" onClick={(e) => {e.stopPropagation(); handleClear();}}>
                                <X className="h-4 w-4"/>
                            </Button>
                        </>
                    ) : (
                        <div className="text-center text-muted-foreground p-2">
                            <Camera className="mx-auto h-8 w-8" />
                            <p className="text-xs mt-1">{t('uploadPrompt')}</p>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>

                <div className='text-center text-muted-foreground font-semibold'>OR</div>

                <div className="flex-grow flex items-center justify-center">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-20 w-20 rounded-full"
                        onClick={handleMicClick}
                        title={listening ? t('stopListening') : t('startListening')}
                    >
                        {listening ? 
                            <MicOff className="h-10 w-10 text-destructive animate-pulse" /> : 
                            <Mic className="h-10 w-10 text-primary" />
                        }
                    </Button>
                </div>
                 <div className='w-full md:w-auto'>
                    {listening && <p className="text-sm text-primary animate-pulse text-center mb-2">{t('listening')}</p>}
                    <p className='text-sm text-muted-foreground text-center md:text-left'>Say "Upload Image" or "Diagnose Tomato Leaf"</p>
                 </div>
            </div>
        </CardContent>
      </Card>

      <div className="mt-8 min-h-[400px]">
          {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{t('errorTitle')}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
          )}
          {isLoading ? renderLoading() : result ? renderResult() : renderPlaceholder()}
      </div>
      <audio ref={audioRef} className="hidden" onEnded={() => setTtsLoading(null)} />
    </>
  );
}
