
export type Language = 'en' | 'hi' | 'mr';

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

  // Errors & Toasts
  selectImageError: string;
  readImageError: string;
  geolocationErrorTitle: string;
  geolocationErrorDescription: string;
  invalidInputError: string;
  unexpectedError: string;
  language: string;
  english: string;
  hindi: string;
  marathi: string;
};

export type Translations = {
  [key in Language]: TranslationKeys;
};

export const translations: Translations = {
  en: {
    appTitle: 'AgriMedic AI',
    appDescription: 'Diagnose Crop Diseases Instantly',
    footerCopyright: `© {year} AgriMedic AI. All rights reserved.`,
    footerTagline: 'Empowering farmers with AI technology.',
    uploadTitle: 'Upload Plant Photo',
    uploadPrompt: 'Click to upload or drag and drop an image',
    diagnoseButton: 'Diagnose Plant',
    diagnosingButton: 'Diagnosing...',
    placeholderTitle: 'AI Diagnosis Awaits',
    placeholderDescription: 'Your plant\'s diagnosis and treatment suggestions will appear here once you upload a photo and start the analysis.',
    errorTitle: 'Error',
    diagnosisTitle: 'Diagnosis',
    diseaseIdentifiedLabel: 'Disease Identified',
    pestIdentifiedLabel: 'Pest Identified',
    diseaseDetectedBadge: 'Disease Detected',
    noDiseaseDetectedMessage: 'No disease or pest was confidently identified from the image.',
    noDiseaseDetectedBadge: 'No Disease Detected',
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
    selectImageError: 'Please select an image first.',
    readImageError: 'Failed to read the image file.',
    geolocationErrorTitle: 'Geolocation Error',
    geolocationErrorDescription: 'Could not get your location. Diagnosis will not be location-specific.',
    invalidInputError: 'Invalid input provided.',
    unexpectedError: 'An unexpected error occurred. Please try again.',
    language: 'Language',
    english: 'English',
    hindi: 'Hindi',
    marathi: 'Marathi',
  },
  hi: {
    appTitle: 'एग्रीमेडिक एआई',
    appDescription: 'फसल रोगों का तुरंत निदान करें',
    footerCopyright: '© {year} एग्रीमेडिक एआई। सर्वाधिकार सुरक्षित।',
    footerTagline: 'किसानों को एआई तकनीक से सशक्त बनाना।',
    uploadTitle: 'पौधे का फोटो अपलोड करें',
    uploadPrompt: 'अपलोड करने के लिए क्लिक करें या एक छवि खींचें और छोड़ें',
    diagnoseButton: 'पौधे का निदान करें',
    diagnosingButton: 'निदान हो रहा है...',
    placeholderTitle: 'एआई निदान की प्रतीक्षा है',
    placeholderDescription: 'आपके पौधे का निदान और उपचार के सुझाव यहां दिखाई देंगे जब आप एक फोटो अपलोड करेंगे और विश्लेषण शुरू करेंगे।',
    errorTitle: 'त्रुटि',
    diagnosisTitle: 'निदान',
    diseaseIdentifiedLabel: 'पहचानी गई बीमारी',
    pestIdentifiedLabel: 'पहचाना गया कीट',
    diseaseDetectedBadge: 'रोग का पता चला',
    noDiseaseDetectedMessage: 'छवि से किसी बीमारी या कीट की आत्मविश्वास से पहचान नहीं की गई।',
    noDiseaseDetectedBadge: 'कोई रोग नहीं मिला',
    remedyRecommendationsTitle: 'उपचार की सिफारिशें',
    noRemediesSuggested: 'कोई विशेष उपचार का सुझाव नहीं दिया गया।',
    additionalNotesTitle: 'अतिरिक्त नोट्स',
    notApplicable: 'लागू नहीं',
    remedyTypeLabel: 'प्रकार',
    organicType: 'जैविक',
    chemicalType: 'रासायनिक',
    preventiveType: 'निवारक',
    availabilityLabel: 'स्थानीय उपलब्धता',
    governmentSchemesTitle: 'सरकारी योजनाएं',
    schemeDescriptionLabel: 'विवरण',
    schemeLinkLabel: 'और जानकारी',
    noSchemesFound: 'आपके स्थान और फसल के लिए कोई प्रासंगिक सरकारी योजनाएं नहीं मिलीं।',
    selectImageError: 'कृपया पहले एक छवि चुनें।',
    readImageError: 'छवि फ़ाइल पढ़ने में विफल।',
    geolocationErrorTitle: 'जियोलोकेशन त्रुटि',
    geolocationErrorDescription: 'आपका स्थान प्राप्त नहीं हो सका। निदान स्थान-विशिष्ट नहीं होगा।',
    invalidInputError: 'अमान्य इनपुट प्रदान किया गया।',
    unexpectedError: 'एक अप्रत्याशित त्रुटि हुई। कृपया पुन: प्रयास करें।',
    language: 'भाषा',
    english: 'अंग्रेज़ी',
    hindi: 'हिंदी',
    marathi: 'मराठी',
  },
  mr: {
    appTitle: 'अ‍ॅग्रीमेडिक एआय',
    appDescription: 'पीक रोगांचे त्वरित निदान करा',
    footerCopyright: '© {year} अ‍ॅग्रीमेडिक एआय. सर्व हक्क राखीव.',
    footerTagline: 'शेतकऱ्यांना एआय तंत्रज्ञानाने सक्षम करणे.',
    uploadTitle: 'वनस्पतीचा फोटो अपलोड करा',
    uploadPrompt: 'अपलोड करण्यासाठी क्लिक करा किंवा इमेज ड्रॅग आणि ड्रॉप करा',
    diagnoseButton: 'वनस्पतीचे निदान करा',
    diagnosingButton: 'निदान होत आहे...',
    placeholderTitle: 'एआय निदानाची प्रतीक्षा आहे',
    placeholderDescription: 'तुम्ही फोटो अपलोड करून विश्लेषण सुरू केल्यावर तुमच्या वनस्पतीच्या निदानाचे आणि उपचारांचे सल्ले येथे दिसतील.',
    errorTitle: 'त्रुटी',
    diagnosisTitle: 'निदान',
    diseaseIdentifiedLabel: 'ओळखलेला रोग',
    pestIdentifiedLabel: 'ओळखलेला कीटक',
    diseaseDetectedBadge: 'रोग आढळला',
    noDiseaseDetectedMessage: 'प्रतिमेवरून कोणताही रोग किंवा कीटक आत्मविश्वासाने ओळखला गेला नाही.',
    noDiseaseDetectedBadge: ' कोणताही रोग आढळला नाही',
    remedyRecommendationsTitle: 'उपाय सूचना',
    noRemediesSuggested: 'कोणतेही विशिष्ट उपाय सुचवलेले नाहीत.',
    additionalNotesTitle: 'अतिरिक्त टिपा',
    notApplicable: 'लागू नाही',
    remedyTypeLabel: 'प्रकार',
    organicType: 'सेंद्रिय',
    chemicalType: 'रासायनिक',
    preventiveType: 'प्रतिबंधात्मक',
    availabilityLabel: 'स्थानिक उपलब्धता',
    governmentSchemesTitle: 'सरकारी योजना',
    schemeDescriptionLabel: 'वर्णन',
    schemeLinkLabel: 'अधिक माहिती',
    noSchemesFound: 'तुमच्या स्थानासाठी आणि पिकासाठी कोणतीही संबंधित सरकारी योजना आढळली नाही.',
    selectImageError: 'कृपया प्रथम एक प्रतिमा निवडा.',
    readImageError: 'प्रतिमा फाइल वाचण्यात अयशस्वी.',
    geolocationErrorTitle: 'जिओलोकेशन त्रुटी',
    geolocationErrorDescription: 'तुमचे स्थान मिळू शकले नाही. निदान स्थान-विशिष्ट होणार नाही.',
    invalidInputError: 'अवैध इनपुट प्रदान केले.',
    unexpectedError: 'एक अनपेक्षित त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
    language: 'भाषा',
    english: 'इंग्रजी',
    hindi: 'हिंदी',
    marathi: 'मराठी',
  },
};
