
export type Language = 'en' | 'hi' | 'mr' | 'te' | 'bn' | 'ta' | 'gu' | 'kn' | 'ml';

export type TranslationKeys = {
  // Header
  appTitle: string;
  appDescription: string;
  pricesNavTitle: string;
  
  // Footer
  footerCopyright: string;
  footerTagline: string;

  // Hero Section
  heroTitle: string;
  heroSubtitle: string;

  // Diagnosis Tool
  uploadTitle: string;
  uploadPrompt: string;
  diagnoseButton: string;
  diagnosingButton: string;
  placeholderTitle: string;
  placeholderDescription: string;
  errorTitle: string;
  diagnosisTitle: string;
  diseaseDetectedBadge: string;
  noDiseaseDetectedMessage: string;
  noDiseaseDetectedBadge: string;
  remedyRecommendationsTitle: string;
  speakNowPrompt: string;
  
  // Voice Commands
  voiceCommandUpload: string;
  voiceCommandSelect: string;
  voiceCommandChoose: string;
  voiceCommandDiagnose: string;
  voiceCommandCheckPrice: string;
  voiceCommandCheck: string;
  voiceCommandWhatsWrong: string;
  voiceCommandClear: string;
  voiceCommandReset: string;

  // Buttons
  shareButton: string;
  saveButton: string;

  // Errors & Toasts
  selectImageError: string;
  unexpectedError: string;
  cropNotRecognizedError: string;
  speechRecognitionNotSupported: string;
  language: string;
  english: string;
  hindi: string;
  marathi: string;
  telugu: string;
  bengali: string;
  tamil: string;
  gujarati: string;
  kannada: string;
  malayalam: string;
  startListening: string;
  stopListening: string;
  listening: string;
};

export type Translations = {
  [key in Language]: TranslationKeys;
};

const englishTranslations: TranslationKeys = {
  appTitle: 'AgriMedic AI',
  appDescription: 'Diagnose Crop Diseases Instantly',
  pricesNavTitle: 'Market Prices',
  footerCopyright: `© {year} AgriMedic AI. All rights reserved.`,
  footerTagline: 'Empowering farmers with visionary AI technology.',
  heroTitle: 'Your AI Plant Doctor',
  heroSubtitle: 'Snap a photo, get a diagnosis. Simple, fast, and for every farmer.',
  uploadTitle: 'Upload a Photo of Your Plant',
  uploadPrompt: 'Drop your plant photo here',
  diagnoseButton: 'Diagnose Plant 🚀',
  diagnosingButton: 'AI is analyzing...',
  placeholderTitle: 'Your Plant Diagnosis Awaits',
  placeholderDescription: 'Upload a clear photo of the affected plant part to get a lightning-fast diagnosis from our AI.',
  errorTitle: 'Oops! An Error Occurred',
  diagnosisTitle: 'AI Diagnosis',
  diseaseDetectedBadge: 'Disease Detected',
  noDiseaseDetectedMessage: 'No disease or pest was confidently identified from the image.',
  noDiseaseDetectedBadge: 'Healthy',
  remedyRecommendationsTitle: 'AI Remedy Recommendations',
  speakNowPrompt: 'Or, tap the mic to speak',
  voiceCommandUpload: 'upload image',
  voiceCommandSelect: 'select image',
  voiceCommandChoose: 'choose photo',
  voiceCommandDiagnose: 'diagnose',
  voiceCommandCheckPrice: 'price of',
  voiceCommandCheck: 'check plant',
  voiceCommandWhatsWrong: 'what is wrong with my crop',
  voiceCommandClear: 'clear',
  voiceCommandReset: 'reset',
  shareButton: 'Share Report',
  saveButton: 'Save Report',
  selectImageError: 'Please select an image first.',
  unexpectedError: 'An unexpected error occurred. Please try again.',
  cropNotRecognizedError: 'Could not recognize the crop name in your query. Please try again.',
  speechRecognitionNotSupported: 'Speech recognition is not supported by your browser.',
  language: 'Language',
  english: 'English',
  hindi: 'Hindi',
  marathi: 'Marathi',
  telugu: 'Telugu',
  bengali: 'Bengali',
  tamil: 'Tamil',
  gujarati: 'Gujarati',
  kannada: 'Kannada',
  malayalam: 'Malayalam',
  startListening: 'Tap to Speak',
  stopListening: 'Listening... Tap to Stop',
  listening: 'Listening...',
};

export const translations: Translations = {
  en: englishTranslations,
  hi: {
    ...englishTranslations,
    appTitle: 'एग्रीमेडिक एआई',
    appDescription: 'फसल रोगों का तुरंत निदान करें',
    pricesNavTitle: 'बाजार मूल्य',
    footerCopyright: '© {year} एग्रीमेडिक एआई। सर्वाधिकार सुरक्षित।',
    footerTagline: 'किसानों को एआई तकनीक से सशक्त बनाना।',
    heroTitle: 'आपका एआई प्लांट डॉक्टर',
    heroSubtitle: 'एक तस्वीर खींचो, निदान पाओ। सरल, तेज, और हर किसान के लिए।',
    uploadPrompt: 'फोटो अपलोड करने के लिए क्लिक करें या टैप करें',
    diagnosingButton: 'आपके पौधे के स्वास्थ्य की जांच हो रही है...',
    placeholderTitle: 'आपका पौधा डॉक्टर',
    placeholderDescription: 'हमारे AI सहायक से त्वरित और सटीक निदान पाने के लिए अपने पौधे की एक तस्वीर अपलोड करें।',
    errorTitle: 'त्रुटि',
    diagnosisTitle: 'निदान',
    diseaseDetectedBadge: 'रोग का पता चला',
    noDiseaseDetectedMessage: 'छवि से किसी बीमारी या कीट की आत्मविश्वास से पहचान नहीं की गई।',
    noDiseaseDetectedBadge: 'स्वस्थ',
    remedyRecommendationsTitle: 'उपचार की सिफारिशें',
    speakNowPrompt: 'या, बोलने के लिए माइक पर टैप करें',
    voiceCommandDiagnose: 'निदान',
    voiceCommandCheckPrice: 'का भाव',
    voiceCommandCheck: 'पौधा जांचें',
    voiceCommandWhatsWrong: 'मेरी फसल में क्या खराबी है',
    voiceCommandClear: 'हटाएं',
    voiceCommandReset: 'रीसेट',
    startListening: 'सुनना शुरू करें',
    stopListening: 'सुनना बंद करें',
    listening: 'सुन रहा है...',
    selectImageError: 'कृपया पहले एक छवि चुनें।',
    unexpectedError: 'एक अप्रत्याशित त्रुटि हुई। कृपया पुन: प्रयास करें।',
    cropNotRecognizedError: 'आपकी क्वेरी में फसल का नाम नहीं पहचान सका। कृपया पुन: प्रयास करें।',
    language: 'भाषा',
    hindi: 'हिंदी',
  },
  mr: {
    ...englishTranslations,
    appTitle: 'अ‍ॅग्रीमेडिक एआय',
    pricesNavTitle: 'बाजारभाव',
    footerCopyright: '© {year} अ‍ॅग्रीमेडिक एआय. सर्व हक्क राखीव.',
    footerTagline: 'शेतकऱ्यांना एआय तंत्रज्ञानाने सक्षम करणे.',
    heroTitle: 'तुमचा एआय वनस्पती डॉक्टर',
    heroSubtitle: 'एक फोटो स्नॅप करा, निदान मिळवा. सोपे, जलद आणि प्रत्येक शेतकऱ्यासाठी.',
    uploadPrompt: 'फोटो अपलोड करण्यासाठी क्लिक करा किंवा टॅप करा',
    diagnosingButton: 'तुमच्या वनस्पतीच्या आरोग्याची तपासणी करत आहे...',
    placeholderTitle: 'तुमचा वनस्पती डॉक्टर',
    placeholderDescription: 'आमच्या AI सहाय्यकाकडून जलद आणि अचूक निदान मिळवण्यासाठी तुमच्या वनस्पनाचा फोटो अपलोड करा.',
    errorTitle: 'त्रुटी',
    diagnosisTitle: 'निदान',
    diseaseDetectedBadge: 'रोग आढळला',
    noDiseaseDetectedMessage: 'प्रतिमेवरून कोणताही रोग किंवा कीटक आत्मविश्वासाने ओळखला गेला नाही.',
    noDiseaseDetectedBadge: 'निरोगी',
    remedyRecommendationsTitle: 'उपाय सूचना',
    speakNowPrompt: 'किंवा, बोलण्यासाठी माइकवर टॅप करा',
    voiceCommandDiagnose: 'निदान',
    voiceCommandCheckPrice: 'ची किंમત',
    voiceCommandCheck: 'वनस्पती तपासा',
    voiceCommandWhatsWrong: 'माझ्या पिकात काय चूक आहे',
    startListening: 'ऐकण्यास प्रारंभ करा',
    stopListening: 'ऐकणे थांबवा',
    listening: 'ऐकत आहे...',
    selectImageError: 'कृपया प्रथम एक प्रतिमा निवडा.',
    unexpectedError: 'एक अनपेक्षित त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
    cropNotRecognizedError: 'तुमच्या प्रश्नातील पिकाचे नाव ओळखू शकलो नाही. कृपया पुन्हा प्रयत्न करा.',
    language: 'भाषा',
    marathi: 'मराठी',
  },
  te: {
    ...englishTranslations,
    language: 'భాష',
    telugu: 'తెలుగు',
    appTitle: 'అగ్రిమెడిక్ AI',
    pricesNavTitle: 'మార్కెట్ ధరలు',
    heroTitle: 'మీ AI మొక్కల డాక్టర్',
    heroSubtitle: 'ఒక ఫోటో తీయండి, ఒక రోగ నిర్ధారణ పొందండి. సులభమైన, వేగవంతమైనది మరియు ప్రతి రైతు కోసం.',
    diagnosingButton: 'మీ మొక్క ఆరోగ్యాన్ని తనిఖీ చేస్తోంది...',
    listening: 'వినడం జరుగుతోంది...',
  },
  bn: {
    ...englishTranslations,
    language: 'ভাষা',
    bengali: 'বাংলা',
    appTitle: 'এগ্রিমেডিক এআই',
    pricesNavTitle: 'বাজার দর',
    heroTitle: 'আপনার এআই প্ল্যান্ট ডাক্তার',
    heroSubtitle: 'একটি ছবি তুলুন, একটি রোগ নির্ণয় করুন। সহজ, দ্রুত এবং প্রতিটি কৃষকের জন্য।',
    diagnosingButton: 'আপনার গাছের স্বাস্থ্য পরীক্ষা করা হচ্ছে...',
    listening: 'শুনছি...',
  },
  ta: {
    ...englishTranslations,
    language: 'மொழி',
    tamil: 'தமிழ்',
    appTitle: 'அக்ரிமெடிக் AI',
    pricesNavTitle: 'சந்தை விலைகள்',
    heroTitle: 'உங்கள் AI தாவர மருத்துவர்',
    heroSubtitle: 'ஒரு புகைப்படத்தை எடுங்கள், ஒரு நோயறிதலைப் பெறுங்கள். எளிமையானது, வேகமானது மற்றும் ஒவ்வொரு விவசாயிக்கும்.',
    diagnosingButton: 'உங்கள் தாவரத்தின் ஆரோக்கியத்தைச் சரிபார்க்கிறது...',
    listening: 'கேட்கிறது...',
  },
  gu: {
    ...englishTranslations,
    language: 'ભાષા',
    gujarati: 'ગુજરાતી',
    appTitle: 'એગ્રીમેડિક એઆઈ',
    pricesNavTitle: 'બજાર ભાવ',
    heroTitle: 'તમારા એઆઈ પ્લાન્ટ ડોક્ટર',
    heroSubtitle: 'એક ફોટો સ્નેપ કરો, નિદાન મેળવો. સરળ, ઝડપી અને દરેક ખેડૂત માટે.',
    diagnosingButton: 'તમારા છોડના સ્વાસ્થ્યની તપાસ કરી રહ્યું છે...',
    listening: 'સાંભળી રહ્યું છે...',
  },
  kn: {
    ...englishTranslations,
    language: 'ಭಾಷೆ',
    kannada: 'ಕನ್ನಡ',
    pricesNavTitle: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು',
    heroTitle: 'ನಿಮ್ಮ AI ಸಸ್ಯ ವೈದ್ಯ',
    heroSubtitle: 'ಒಂದು ಫೋಟೋ ತೆಗೆಯಿರಿ, ರೋಗನಿರ್ಣಯವನ್ನು ಪಡೆಯಿರಿ. ಸರಳ, ವೇಗ ಮತ್ತು ಪ್ರತಿಯೊಬ್ಬ ರೈತರಿಗಾಗಿ.',
    diagnosingButton: 'ನಿಮ್ಮ ಸಸ್ಯದ ಆರೋಗ್ಯವನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    listening: 'ಕೇಳುತ್ತಿದೆ...',
  },
  ml: {
    ...englishTranslations,
    language: 'ഭാഷ',
    malayalam: 'മലയാളം',
    pricesNavTitle: 'വിപണി വിലകൾ',
    heroTitle: 'നിങ്ങളുടെ AI പ്ലാന്റ് ഡോക്ടർ',
    heroSubtitle: 'ഒരു ഫോട്ടോ എടുക്കുക, ഒരു രോഗനിർണയം നേടുക. ലളിതവും വേഗതയേറിയതും ഓരോ കർഷകനും.',
    diagnosingButton: 'നിങ്ങളുടെ ചെടിയുടെ ആരോഗ്യം പരിശോധിക്കുന്നു...',
    listening: 'കേൾക്കുന്നു...',
  },
};
