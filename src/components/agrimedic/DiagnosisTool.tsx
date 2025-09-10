
"use client";

import 'regenerator-runtime/runtime';
import { useState, useRef, type ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { Camera, LoaderCircle, AlertTriangle, HeartPulse, FlaskConical, Volume2, Mic, Flower2, Share2, Save, ShoppingCart, TrendingUp, Sparkles, X, RotateCcw, UserSquare } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { getComprehensiveDiagnosis, getSpeechFromText, escalateToExpert as escalateToAction } from '@/lib/actions';
import type { ComprehensiveDiagnosisOutput } from '@/ai/schemas';
import type { EscalationOutput } from '@/ai/flows/escalate-to-expert';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useGeolocationContext } from '@/context/GeolocationContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type TTSSection = 'diagnosis' | 'remedies';

const extractCropName = (text: string): string | null => {
  const cropKeywords = ["tomato", "potato", "wheat", "onion", "rice", "cotton", "sugarcane", "maize"];
  const lowerText = text.toLowerCase();
  for (const crop of cropKeywords) {
    if (lowerText.includes(crop)) {
      return crop.charAt(0).toUpperCase() + crop.slice(1);
    }
  }
  return null;
}

export default function DiagnosisTool() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEscalating, setIsEscalating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComprehensiveDiagnosisOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { state: geoState } = useGeolocationContext();
  const [ttsLoading, setTtsLoading] = useState<TTSSection | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [lastAudioSrc, setLastAudioSrc] = useState<string | null>(null);
  const router = useRouter();

  const [escalationDetails, setEscalationDetails] = useState<EscalationOutput | null>(null);
  const [showEscalationModal, setShowEscalationModal] = useState(false);


  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({
    commands: [
      {
        command: [t('voiceCommandUpload'), t('voiceCommandSelect'), t('voiceCommandChoose')],
        callback: () => triggerFileSelect()
      },
      {
        command: t('voiceCommandDiagnose'),
        callback: () => handleDiagnose()
      },
      {
        command: [t('voiceCommandClear'), t('voiceCommandReset')],
        callback: () => handleClear()
      },
      {
        command: t('voiceCommandCheckPrice'),
        callback: (command) => handleVoicePriceCheck(command),
      }
    ]
  });

  const handleVoicePriceCheck = async (command: string) => {
    const crop = extractCropName(command);
    if (crop) {
        router.push(`/prices?crop=${crop}`);
    } else {
        toast({
            variant: 'destructive',
            title: t('errorTitle'),
            description: t('cropNotRecognizedError'),
        });
    }
  };


  useEffect(() => {
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
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        handleDiagnose(file, dataUri);
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
  
  const handleEscalate = async () => {
    if (!result || !imagePreview || !geoState) {
        toast({ variant: 'destructive', title: "Cannot Escalate", description: "Not enough information to escalate. Please perform a diagnosis first and ensure location services are enabled."});
        return;
    }

    setIsEscalating(true);
    const { diagnosis } = result;

    const response = await escalateToAction({
        plantName: diagnosis.plantName,
        diseaseName: diagnosis.diseaseIdentification.diseaseName,
        remedies: diagnosis.remedySuggestions.map(r => r.name),
        photoDataUri: imagePreview,
        userState: geoState,
    });

    if (response.error) {
        toast({ variant: 'destructive', title: "Escalation Failed", description: response.error });
    } else if (response.data) {
        setEscalationDetails(response.data);
        setShowEscalationModal(true);
    }
    setIsEscalating(false);
  };


  const handleClear = () => {
    setResult(null);
    setError(null);
    setImageFile(null);
    setImagePreview(null);
    resetTranscript();
    setLastAudioSrc(null);
    if(audioRef.current) audioRef.current.src = "";
    if(fileInputRef.current) fileInputRef.current.value = "";
  }

  const triggerFileSelect = () => fileInputRef.current?.click();
  
  const handlePlayTTS = async (section: TTSSection) => {
    if (!result || ttsLoading) return;

    let textToSpeak = '';
    if (section === 'diagnosis' && result.diagnosis) {
      textToSpeak = `${t('diagnosisTitle')}. ${result.diagnosis.diseaseIdentification.diseaseName}.`;
    } else if (section === 'remedies' && result.diagnosis.remedySuggestions) {
      textToSpeak = result.diagnosis.remedySuggestions.map(r => `${r.name}. ${r.description}`).join(' ');
    }
    
    if (!textToSpeak) return;

    setTtsLoading(section);
    try {
        const response = await getSpeechFromText(textToSpeak);
        if (response.data?.media && audioRef.current) {
            setLastAudioSrc(response.data.media);
            audioRef.current.src = response.data.media;
            audioRef.current.play();
        } else {
            throw new Error(response.error || 'Failed to get audio');
        }
    } catch (e) {
        console.error(e);
        toast({
            variant: 'destructive',
            title: t('errorTitle'),
            description: t('unexpectedError'),
        });
        setTtsLoading(null);
    }
  };
  
  const handleRepeatTTS = () => {
    if (lastAudioSrc && audioRef.current) {
      audioRef.current.src = lastAudioSrc;
      audioRef.current.play();
    }
  };

  const handleShare = () => {
    if (!result) return;
    const shareText = `AgriMedic AI Diagnosis:\nDisease: ${result.diagnosis.diseaseIdentification.diseaseName}\n\nRemedies:\n${result.diagnosis.remedySuggestions.map(r => `- ${r.name}: ${r.description}`).join('\n')}`;
    if (navigator.share) {
      navigator.share({
        title: 'AgriMedic AI Diagnosis',
        text: shareText,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      toast({title: 'Copied to clipboard'});
    }
  }

  const renderResult = () => {
    if (!result) return null;
    
    const { diagnosis, marketAnalysis } = result;

    const getRemedyTypeBadgeVariant = (type: 'Organic' | 'Chemical' | 'Preventive'): BadgeProps['variant'] => {
        switch (type) {
            case 'Organic': return 'success';
            case 'Chemical': return 'destructive';
            case 'Preventive': return 'default';
            default: return 'outline';
        }
    };
    
    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-8">
                <Card className="glass-card">
                    <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 p-6">
                        <div className="flex items-center gap-4">
                            <HeartPulse className="w-8 h-8 text-primary flex-shrink-0" />
                            <CardTitle className="text-2xl">{t('diagnosisTitle')}</CardTitle>
                        </div>
                        <div className="flex items-center gap-1">
                            {lastAudioSrc && (
                                <Button variant="ghost" size="icon" onClick={handleRepeatTTS} disabled={!!ttsLoading} className="rounded-full h-10 w-10">
                                    <RotateCcw className="w-5 h-5" />
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => handlePlayTTS('diagnosis')} disabled={!!ttsLoading} className="rounded-full h-10 w-10">
                                {ttsLoading === 'diagnosis' ? <LoaderCircle className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <p className="text-xl font-semibold">{diagnosis.diseaseIdentification.diseaseName}</p>
                        <Badge variant={diagnosis.diseaseIdentification.diseaseDetected ? "destructive" : "success"} className="mt-2 text-sm">
                           {diagnosis.diseaseIdentification.diseaseDetected ? t('diseaseDetectedBadge') : t('noDiseaseDetectedBadge')}
                        </Badge>
                    </CardContent>
                </Card>

                {diagnosis.remedySuggestions && diagnosis.remedySuggestions.length > 0 && (
                    <Card className="glass-card">
                        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 p-6">
                           <div className="flex items-center gap-4">
                             <FlaskConical className="w-8 h-8 text-accent flex-shrink-0" />
                             <CardTitle className="text-2xl">{t('remedyRecommendationsTitle')}</CardTitle>
                           </div>
                           <Button variant="ghost" size="icon" onClick={() => handlePlayTTS('remedies')} disabled={!!ttsLoading} className="rounded-full h-10 w-10">
                             {ttsLoading === 'remedies' ? <LoaderCircle className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
                           </Button>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6 pt-0">
                            {diagnosis.remedySuggestions.map((remedy, index) => (
                                <div key={index} className="p-4 rounded-lg bg-background/50">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-lg">{remedy.name}</h4>
                                        <Badge variant={getRemedyTypeBadgeVariant(remedy.type)}>{remedy.type}</Badge>
                                    </div>
                                    <p className="text-muted-foreground mt-1 text-base">{remedy.description}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
            <div className="space-y-8">
                {marketAnalysis && (
                    <Card className="glass-card">
                         <CardHeader className="flex-row items-center gap-4 space-y-0 p-6">
                            <TrendingUp className="w-8 h-8 text-primary" />
                            <CardTitle className="text-2xl">{marketAnalysis.commodity} Market Intel</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 p-6 pt-0">
                            <div className="flex items-center gap-3"><ShoppingCart className="w-5 h-5 text-accent"/> <p>Range: {marketAnalysis.priceRange} INR/quintal</p></div>
                            <div className="flex items-center gap-3"><TrendingUp className="w-5 h-5 text-accent"/> <p>Trend: {marketAnalysis.trend}</p></div>
                            <div className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-accent"/> <p>Advice: <strong>{marketAnalysis.advice}</strong> - {marketAnalysis.reason}</p></div>
                        </CardContent>
                    </Card>
                )}
                 <div className="grid grid-cols-2 gap-4">
                    <Button onClick={handleShare} className="text-lg py-6" variant="outline"><Share2 className="mr-2 h-5 w-5"/> {t('shareButton')}</Button>
                    <Button onClick={handleEscalate} disabled={isEscalating} className="text-lg py-6" variant="secondary">
                        {isEscalating ? <LoaderCircle className="w-5 h-5 animate-spin mr-2" /> : <UserSquare className="mr-2 h-5 w-5"/>}
                        Escalate to Expert
                    </Button>
                 </div>
            </div>
        </div>
    );
  };
  
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center text-center p-8 h-full">
       <LoaderCircle className="w-20 h-20 text-primary animate-spin mb-6" />
       <h2 className="text-3xl font-bold mb-2">{t('diagnosingButton')}</h2>
       <p className="text-muted-foreground">Our AI is analyzing your image...</p>
    </div>
  );

  const renderPlaceholder = () => (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border/50 rounded-2xl h-full bg-background/20 min-h-[400px]">
          <Flower2 size={80} className="text-muted-foreground mb-6" />
          <h2 className="text-3xl font-bold mb-3">{t('placeholderTitle')}</h2>
          <p className="text-muted-foreground max-w-sm text-lg">
            {t('placeholderDescription')}
          </p>
      </div>
  );

  return (
    <div className="relative pb-24">
      <Card className="max-w-4xl mx-auto mb-12 glass-card">
        <CardContent className="p-6">
            <div
                className="relative w-full h-64 flex-shrink-0 border-2 border-dashed border-border/50 rounded-2xl flex items-center justify-center cursor-pointer hover:border-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
                onClick={triggerFileSelect}
            >
                {imagePreview ? (
                    <>
                        <Image
                            src={imagePreview}
                            alt="Plant preview"
                            fill
                            className="object-cover rounded-2xl"
                        />
                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 z-10 rounded-full" onClick={(e) => {e.stopPropagation(); handleClear();}}>
                            <X className="h-5 w-5"/>
                        </Button>
                    </>
                ) : (
                    <div className="text-center text-muted-foreground p-4">
                        <Camera className="mx-auto h-16 w-16" />
                        <p className="text-lg mt-4 font-semibold">{t('uploadPrompt')} 📁</p>
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
        </CardContent>
      </Card>

      <div className="mt-8 min-h-[400px]">
          {error && (
              <Alert variant="destructive" className="glass-card bg-destructive/20 border-destructive/50">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{t('errorTitle')}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
          )}
          {isLoading ? renderLoading() : result ? renderResult() : renderPlaceholder()}
      </div>
      
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
            size="icon" 
            className={`h-16 w-16 rounded-full shadow-2xl transition-all transform hover:scale-110 ${listening ? 'bg-destructive/90 animate-pulse' : 'bg-accent'}`}
            onClick={handleMicClick}
            title={listening ? t('stopListening') : t('startListening')}
        >
                <Mic className={`h-8 w-8 text-accent-foreground transition-all ${listening ? 'scale-125' : ''}`} />
        </Button>
        {listening && <p className="fixed bottom-24 right-6 text-sm bg-background/80 px-2 py-1 rounded-md shadow-lg">{t('listening')}</p>}
      </div>

       <AlertDialog open={showEscalationModal} onOpenChange={setShowEscalationModal}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Escalate to Agricultural Expert</AlertDialogTitle>
                  <AlertDialogDescription>
                      Copy the message below and send it to the expert via email or WhatsApp.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="p-4 bg-muted rounded-md space-y-4">
                  <p><strong>Expert:</strong> {escalationDetails?.expertName}</p>
                  <p><strong>Contact:</strong> {escalationDetails?.expertContact}</p>
                  <p className="text-sm border-t pt-4 mt-4 whitespace-pre-wrap">{escalationDetails?.escalationMessage}</p>
              </div>
              <AlertDialogFooter>
                   <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                      navigator.clipboard.writeText(escalationDetails?.escalationMessage || '');
                      toast({ title: 'Message Copied!'});
                      setShowEscalationModal(false);
                  }}>Copy Message & Close</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

      <audio ref={audioRef} className="hidden" onEnded={() => setTtsLoading(null)} />
    </div>
  );
}

    