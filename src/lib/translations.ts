
export type Language = 'en' | 'hi' | 'mr' | 'te' | 'bn' | 'ta' | 'gu';

export type TranslationKeys = {
  // Header
  appTitle: string;
  appDescription: string;
  
  // Footer
  footerCopyright: string;
  footerTagline: string;

  // Greeting
  greeting: string;

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

  // Schemes Page
  schemesNavTitle: string;
  schemesPageTitle: string;
  schemesPageDescription: string;
  eligibilityFormTitle: string;
  eligibilityFormDescription: string;
  stateLabel: string;
  statePlaceholder: string;
  cropLabel: string;
  cropPlaceholder: string;
  landLabel: string;
  categoryLabel: string;
  categoryPlaceholder: string;
  categoryGeneral: string;
  categoryOBC: string;
  categorySC: string;
  categoryST: string;
  queryLabel: string;
  queryPlaceholder: string;
  findSchemesButton: string;
  findingSchemesButton: string;
  schemesResultTitle: string;
  noSchemesFoundError: string;
  schemeEligibilityLabel: string;
  schemeBenefitsLabel: string;
  schemeApplyButton: string;
  requiredError: string;
  positiveNumberError: string;
  queryMinLengthError: string;


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
  greeting: '👋 Hello Farmer! Let’s care for your crops today!',
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
  schemesNavTitle: 'Govt. Schemes',
  schemesPageTitle: 'Find Government Schemes',
  schemesPageDescription: 'Enter your details below to find agricultural schemes you might be eligible for.',
  eligibilityFormTitle: 'Your Profile',
  eligibilityFormDescription: 'Provide a few details to help us find the right schemes for you.',
  stateLabel: 'State / Union Territory',
  statePlaceholder: 'Select your state',
  cropLabel: 'Primary Crop (Optional)',
  cropPlaceholder: 'e.g., "Rice", "Wheat", "Cotton"',
  landLabel: 'Land Holding (in acres, Optional)',
  categoryLabel: 'Social Category (Optional)',
  categoryPlaceholder: 'Select a category',
  categoryGeneral: 'General',
  categoryOBC: 'OBC',
  categorySC: 'SC',
  categoryST: 'ST',
  queryLabel: 'What are you looking for?',
  queryPlaceholder: 'e.g., "drip irrigation subsidy", "help with buying seeds", "crop insurance"',
  findSchemesButton: 'Find Schemes',
  findingSchemesButton: 'Searching for schemes...',
  schemesResultTitle: 'Eligible Schemes Found',
  noSchemesFoundError: 'No schemes found matching your criteria. Try adjusting your search.',
  schemeEligibilityLabel: 'Eligibility',
  schemeBenefitsLabel: 'Benefits',
  schemeApplyButton: 'Apply Here',
  requiredError: 'This field is required.',
  positiveNumberError: 'Please enter a valid number.',
  queryMinLengthError: 'Please describe your need in a few more words.',
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
    greeting: '👋 नमस्ते किसान! चलिए आज आपकी फसलों की देखभाल करें!',
    uploadTitle: 'अपने पौधे की एक तस्वीर अपलोड करें',
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
    schemesNavTitle: 'सरकारी योजनाएं',
    schemesPageTitle: 'सरकारी योजनाएं खोजें',
    schemesPageDescription: 'आप जिन कृषि योजनाओं के लिए पात्र हो सकते हैं, उन्हें खोजने के लिए नीचे अपना विवरण दर्ज करें।',
    eligibilityFormTitle: 'आपकी प्रोफाइल',
    eligibilityFormDescription: 'आपके लिए सही योजनाएं खोजने में हमारी मदद करने के लिए कुछ विवरण प्रदान करें।',
    stateLabel: 'राज्य/केंद्र शासित प्रदेश',
    statePlaceholder: 'अपना राज्य चुनें',
    queryLabel: 'आप क्या ढूंढ रहे हैं?',
    queryPlaceholder: 'जैसे, "ड्रिप सिंचाई सब्सिडी", "बीज खरीदने में मदद", "फसल बीमा"',
    findSchemesButton: 'योजनाएं खोजें',
    findingSchemesButton: 'योजनाएं खोजी जा रही हैं...',
    schemesResultTitle: 'पात्र योजनाएं मिलीं',
    noSchemesFoundError: 'आपके मानदंडों से मेल खाने वाली कोई योजना नहीं मिली। अपनी खोज को समायोजित करने का प्रयास करें।',
    schemeEligibilityLabel: 'पात्रता',
    schemeBenefitsLabel: 'लाभ',
    schemeApplyButton: 'यहां आवेदन करें',
    requiredError: 'यह फ़ील्ड आवश्यक है।',
    queryMinLengthError: 'कृपया अपनी आवश्यकता का कुछ और शब्दों में वर्णन करें।',
  },
  mr: {
    ...englishTranslations,
    appTitle: 'अ‍ॅग्रीमेडिक एआय',
    appDescription: 'पीक रोगांचे त्वरित निदान करा',
    footerCopyright: '© {year} अ‍ॅग्रीमेडिक एआय. सर्व हक्क राखीव.',
    footerTagline: 'शेतकऱ्यांना एआय तंत्रज्ञानाने सक्षम करणे.',
    greeting: '👋 नमस्कार शेतकरी! चला आज तुमच्या पिकांची काळजी घेऊया!',
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
    schemesNavTitle: 'शासकीय योजना',
    schemesPageTitle: 'सरकारी योजना शोधा',
    schemesPageDescription: 'तुम्ही पात्र असलेल्या कृषी योजना शोधण्यासाठी खाली तुमचे तपशील प्रविष्ट करा.',
    eligibilityFormTitle: 'तुमची प्रोफाइल',
    eligibilityFormDescription: 'तुमच्यासाठी योग्य योजना शोधण्यात आम्हाला मदत करण्यासाठी काही तपशील द्या.',
    stateLabel: 'राज्य/केंद्रशासित प्रदेश',
    statePlaceholder: 'तुमचे राज्य निवडा',
    queryLabel: 'तुम्ही काय शोधत आहात?',
    queryPlaceholder: 'उदा. "ठिबक सिंचन अनुदान", "बियाणे खरेदीसाठी मदत", "पीक विमा"',
    findSchemesButton: 'योजना शोधा',
    findingSchemesButton: 'योजना शोधत आहे...',
    schemesResultTitle: 'पात्र योजना आढळल्या',
    noSchemesFoundError: 'तुमच्या निकषांशी जुळणाऱ्या कोणत्याही योजना आढळल्या नाहीत. तुमचा शोध समायोजित करण्याचा प्रयत्न करा.',
    schemeEligibilityLabel: 'पात्रता',
    schemeBenefitsLabel: 'फायदे',
    schemeApplyButton: 'येथे अर्ज करा',
    requiredError: 'हे क्षेत्र आवश्यक आहे.',
    queryMinLengthError: 'कृपया तुमच्या गरजेबद्दल आणखी काही शब्दांत वर्णन करा.',
  },
  te: {
    ...englishTranslations,
    language: 'భాష',
    telugu: 'తెలుగు',
    appTitle: 'అగ్రిమెడిక్ AI',
    greeting: '👋 నమస్కారం రైతు! ఈ రోజు మీ పంటలను చూసుకుందాం!',
    uploadTitle: 'మీ మొక్క యొక్క ఫోటోను అప్‌లోడ్ చేయండి',
    diagnosingButton: 'మీ మొక్క ఆరోగ్యాన్ని తనిఖీ చేస్తోంది... 🌿',
    describeIssueLabel: 'లేదా, సమస్యను వివరించండి (ఐచ్ఛికం)',
    listening: 'వినడం జరుగుతోంది...',
  },
  bn: {
    ...englishTranslations,
    language: 'ভাষা',
    bengali: 'বাংলা',
    appTitle: 'এগ্রিমেডিক এআই',
    greeting: '👋 নমস্কার কৃষক! আসুন আজ আপনার ফসলের যত্ন নেওয়া যাক!',
    uploadTitle: 'আপনার গাছের একটি ছবি আপলোড করুন',
    diagnosingButton: 'আপনার গাছের স্বাস্থ্য পরীক্ষা করা হচ্ছে... 🌿',
    describeIssueLabel: 'অথবা, সমস্যাটি বর্ণনা করুন (ঐচ্ছিক)',
    listening: 'শুনছি...',
  },
  ta: {
    ...englishTranslations,
    language: 'மொழி',
    tamil: 'தமிழ்',
    appTitle: 'அக்ரிமெடிக் AI',
    greeting: '👋 வணக்கம் விவசாயி! இன்று உங்கள் பயிர்களை கவனிப்போம்!',
    uploadTitle: 'உங்கள் தாவரத்தின் புகைப்படத்தைப் பதிவேற்றவும்',
    diagnosingButton: 'உங்கள் தாவரத்தின் ஆரோக்கியத்தைச் சரிபார்க்கிறது... 🌿',
    describeIssueLabel: 'அல்லது, சிக்கலை விவரிக்கவும் (விருப்பத்தேர்வு)',
    listening: 'கேட்கிறது...',
  },
  gu: {
    ...englishTranslations,
    language: 'ભાષા',
    gujarati: 'ગુજરાતી',
    appTitle: 'એગ્રીમેડિક એઆઈ',
    greeting: '👋 નમસ્તે ખેડૂત! ચાલો આજે તમારા પાકની સંભાળ લઈએ!',
    uploadTitle: 'તમારા છોડનો ફોટો અપલોડ કરો',
    diagnosingButton: 'તમારા છોડના સ્વાસ્થ્યની તપાસ કરી રહ્યું છે... 🌿',
    describeIssueLabel: 'અથવા, સમસ્યાનું વર્ણન કરો (વૈકલ્પિક)',
    listening: 'સાંભળી રહ્યું છે...',
  },
};
