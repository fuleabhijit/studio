
export type Language = 'en' | 'hi' | 'mr' | 'te' | 'bn' | 'ta' | 'gu';

export type TranslationKeys = {
  // Header
  appTitle: string;
  appDescription: string;
  
  // Footer
  footerCopyright: string;
  footerTagline: string;

  // Diagnosis Tool
  uploadTitle: string;
  uploadPrompt: string;
  diagnoseButton: string;
  diagnosingButton: string;
  placeholderTitle: string;
  placeholderDescription: string;
  errorTitle: string;
  diagnosisTitle: string;
  diseaseIdentifiedLabel: string;
  pestIdentifiedLabel: string;
  diseaseDetectedBadge: string;
  noDiseaseDetectedMessage: string;
  noDiseaseDetectedBadge: string;
  remedyRecommendationsTitle: string;
  noRemediesSuggested: string;
  additionalNotesTitle: string;
  notApplicable: string;
  remedyTypeLabel: string;
  organicType: string;
  chemicalType: string;
  preventiveType: string;
  availabilityLabel: string;
  governmentSchemesTitle: string;
  schemeDescriptionLabel: string;
  schemeLinkLabel: string;
  noSchemesFound: string;
  describeIssueLabel: string;
  describeIssuePlaceholder: string;
  startListening: string;
  stopListening: string;
  listening: string;

  // Errors & Toasts
  selectImageError: string;
  readImageError: string;
  geolocationErrorTitle: string;
  geolocationErrorDescription: string;
  invalidInputError: string;
  unexpectedError: string;
  speechRecognitionNotSupported: string;
  microphoneNotAvailable: string;
  language: string;
  english: string;
  hindi: string;
  marathi: string;
  telugu: string;
  bengali: string;
  tamil: string;
  gujarati: string;
};

export type Translations = {
  [key in Language]: TranslationKeys;
};

const englishTranslations: TranslationKeys = {
  appTitle: 'AgriMedic AI',
  appDescription: 'Diagnose Crop Diseases Instantly',
  footerCopyright: `© {year} AgriMedic AI. All rights reserved.`,
  footerTagline: 'Empowering farmers with AI technology.',
  uploadTitle: 'Upload a Photo of Your Plant',
  uploadPrompt: 'Click or drag a photo here',
  diagnoseButton: 'Diagnose Plant',
  diagnosingButton: 'Checking your plant’s health... 🌿',
  placeholderTitle: 'Your Plant Doctor',
  placeholderDescription: 'Upload a photo of your plant to get a quick and accurate diagnosis from our AI assistant.',
  errorTitle: 'Error',
  diagnosisTitle: 'Diagnosis',
  diseaseIdentifiedLabel: 'Disease Identified',
  pestIdentifiedLabel: 'Pest Identified',
  diseaseDetectedBadge: 'Disease Detected',
  noDiseaseDetectedMessage: 'No disease or pest was confidently identified from the image.',
  noDiseaseDetectedBadge: 'Healthy',
  remedyRecommendationsTitle: 'Remedy Recommendations',
  noRemediesSuggested: 'No specific remedies suggested.',
  additionalNotesTitle: 'Additional Notes',
  notApplicable: 'N/A',
  remedyTypeLabel: 'Type',
  organicType: 'Organic',
  chemicalType: 'Chemical',
  preventiveType: 'Preventive',
  availabilityLabel: 'Local Availability',
  governmentSchemesTitle: 'Government Schemes',
  schemeDescriptionLabel: 'Description',
  schemeLinkLabel: 'More Info',
  noSchemesFound: 'No relevant government schemes were found for your location and crop.',
  describeIssueLabel: 'Or, describe the issue (optional)',
  describeIssuePlaceholder: 'e.g., "The leaves are yellow with brown spots."',
  startListening: 'Start Listening',
  stopListening: 'Stop Listening',
  listening: 'Listening...',
  selectImageError: 'Please select an image first.',
  readImageError: 'Failed to read the image file.',
  geolocationErrorTitle: 'Geolocation Error',
  geolocationErrorDescription: 'Could not get your location. Diagnosis will not be location-specific.',
  invalidInputError: 'Invalid input provided.',
  unexpectedError: 'An unexpected error occurred. Please try again.',
  speechRecognitionNotSupported: 'Speech recognition is not supported by your browser.',
  microphoneNotAvailable: 'Microphone is not available.',
  language: 'Language',
  english: 'English',
  hindi: 'Hindi',
  marathi: 'Marathi',
  telugu: 'Telugu',
  bengali: 'Bengali',
  tamil: 'Tamil',
  gujarati: 'Gujarati',
};

export const translations: Translations = {
  en: englishTranslations,
  hi: {
    ...englishTranslations,
    appTitle: 'एग्रीमेडिक एआई',
    appDescription: 'फसल रोगों का तुरंत निदान करें',
    footerCopyright: '© {year} एग्रीमेडिक एआई। सर्वाधिकार सुरक्षित।',
    footerTagline: 'किसानों को एआई तकनीक से सशक्त बनाना।',
    uploadTitle: 'अपने पौधे का फोटो अपलोड करें',
    uploadPrompt: 'यहां एक फोटो क्लिक करें या खींचें',
    diagnoseButton: 'पौधे का निदान करें',
    diagnosingButton: 'आपके पौधे के स्वास्थ्य की जांच हो रही है... 🌿',
    placeholderTitle: 'आपका पौधा डॉक्टर',
    placeholderDescription: 'हमारे AI सहायक से त्वरित और सटीक निदान पाने के लिए अपने पौधे की एक तस्वीर अपलोड करें।',
    errorTitle: 'त्रुटि',
    diagnosisTitle: 'निदान',
    diseaseIdentifiedLabel: 'पहचानी गई बीमारी',
    diseaseDetectedBadge: 'रोग का पता चला',
    noDiseaseDetectedMessage: 'छवि से किसी बीमारी या कीट की आत्मविश्वास से पहचान नहीं की गई।',
    noDiseaseDetectedBadge: 'स्वस्थ',
    remedyRecommendationsTitle: 'उपचार की सिफारिशें',
    noRemediesSuggested: 'कोई विशेष उपचार का सुझाव नहीं दिया गया।',
    describeIssueLabel: 'या, समस्या का वर्णन करें (वैकल्पिक)',
    describeIssuePlaceholder: 'जैसे, "पत्तियों पर भूरे धब्बों के साथ पीलापन है। "',
    startListening: 'सुनना शुरू करें',
    stopListening: 'सुनना बंद करें',
    listening: 'सुन रहा है...',
    selectImageError: 'कृपया पहले एक छवि चुनें।',
    readImageError: 'छवि फ़ाइल पढ़ने में विफल।',
    unexpectedError: 'एक अप्रत्याशित त्रुटि हुई। कृपया पुन: प्रयास करें।',
    language: 'भाषा',
    hindi: 'हिंदी',
  },
  mr: {
    ...englishTranslations,
    appTitle: 'अ‍ॅग्रीमेडिक एआय',
    appDescription: 'पीक रोगांचे त्वरित निदान करा',
    footerCopyright: '© {year} अ‍ॅग्रीमेडिक एआय. सर्व हक्क राखीव.',
    footerTagline: 'शेतकऱ्यांना एआय तंत्रज्ञानाने सक्षम करणे.',
    uploadTitle: 'तुमच्या वनस्पतीचा फोटो अपलोड करा',
    uploadPrompt: 'येथे फोटो क्लिक करा किंवा ड्रॅग करा',
    diagnoseButton: 'वनस्पतीचे निदान करा',
    diagnosingButton: 'तुमच्या वनस्पतीच्या आरोग्याची तपासणी करत आहे... 🌿',
    placeholderTitle: 'तुमचा वनस्पती डॉक्टर',
    placeholderDescription: 'आमच्या AI सहाय्यकाकडून जलद आणि अचूक निदान मिळवण्यासाठी तुमच्या वनस्पनाचा फोटो अपलोड करा.',
    errorTitle: 'त्रुटी',
    diagnosisTitle: 'निदान',
    diseaseIdentifiedLabel: 'ओळखलेला रोग',
    diseaseDetectedBadge: 'रोग आढळला',
    noDiseaseDetectedMessage: 'प्रतिमेवरून कोणताही रोग किंवा कीटक आत्मविश्वासाने ओळखला गेला नाही.',
    noDiseaseDetectedBadge: 'निरोगी',
    remedyRecommendationsTitle: 'उपाय सूचना',
    noRemediesSuggested: 'कोणतेही विशिष्ट उपाय सुचवलेले नाहीत.',
    describeIssueLabel: 'किंवा, समस्येचे वर्णन करा (पर्यायी)',
    describeIssuePlaceholder: 'उदा. "पाने तपकिरी डागांसह पिवळी आहेत."',
    startListening: 'ऐकण्यास प्रारंभ करा',
    stopListening: 'ऐकणे थांबवा',
    listening: 'ऐकत आहे...',
    selectImageError: 'कृपया प्रथम एक प्रतिमा निवडा.',
    readImageError: 'प्रतिमा फाइल वाचण्यात अयशस्वी.',
    unexpectedError: 'एक अनपेक्षित त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
    language: 'भाषा',
    marathi: 'मराठी',
  },
  te: {
    ...englishTranslations,
    language: 'భాష',
    telugu: 'తెలుగు',
    appTitle: 'అగ్రిమెడిక్ AI',
    describeIssueLabel: 'లేదా, సమస్యను వివరించండి (ఐచ్ఛికం)',
    listening: 'వినడం జరుగుతోంది...',
  },
  bn: {
    ...englishTranslations,
    language: 'ভাষা',
    bengali: 'বাংলা',
    appTitle: 'এগ্রিমেডিক এআই',
    describeIssueLabel: 'অথবা, সমস্যাটি বর্ণনা করুন (ঐচ্ছিক)',
    listening: 'শুনছি...',
  },
  ta: {
    ...englishTranslations,
    language: 'மொழி',
    tamil: 'தமிழ்',
    appTitle: 'அக்ரிமெடிக் AI',
    describeIssueLabel: 'அல்லது, சிக்கலை விவரிக்கவும் (விருப்பத்தேர்வு)',
    listening: 'கேட்கிறது...',
  },
  gu: {
    ...englishTranslations,
    language: 'ભાષા',
    gujarati: 'ગુજરાતી',
    appTitle: 'એગ્રીમેડિક એઆઈ',
    describeIssueLabel: 'અથવા, સમસ્યાનું વર્ણન કરો (વૈકલ્પિક)',
    listening: 'સાંભળી રહ્યું છે...',
  },
};
