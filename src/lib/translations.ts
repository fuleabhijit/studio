
export type Language = 'en' | 'hi' | 'mr' | 'te' | 'bn' | 'ta' | 'gu' | 'kn' | 'ml';

export type TranslationKeys = {
  // Header
  appTitle: string;
  appDescription: string;
  pricesNavTitle: string;
  schemesNavTitle: string;
  
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
  governmentSchemesTitle: string;
  speakNowPrompt: string;
  
  // Voice Commands
  voiceCommandUpload: string;
  voiceCommandSelect: string;
  voiceCommandChoose: string;
  voiceCommandDiagnose: string;
  voiceCommandCheck: string;
  voiceCommandWhatsWrong: string;
  voiceCommandClear: string;
  voiceCommandReset: string;

  // Buttons
  shareButton: string;
  saveButton: string;

  // Schemes Page
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
  unexpectedError: string;
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
  schemesNavTitle: 'Govt. Schemes',
  footerCopyright: `© {year} AgriMedic AI. All rights reserved.`,
  footerTagline: 'Empowering farmers with AI technology.',
  heroTitle: 'Your AI Plant Doctor',
  heroSubtitle: 'Snap a photo, get a diagnosis. Simple, fast, and for every farmer.',
  uploadTitle: 'Upload a Photo of Your Plant',
  uploadPrompt: 'Click or Tap to Upload',
  diagnoseButton: 'Diagnose Plant',
  diagnosingButton: 'Checking your plant’s health...',
  placeholderTitle: 'Your Plant Doctor',
  placeholderDescription: 'Upload a photo of your plant to get a quick and accurate diagnosis from our AI assistant.',
  errorTitle: 'Error',
  diagnosisTitle: 'Diagnosis',
  diseaseDetectedBadge: 'Disease Detected',
  noDiseaseDetectedMessage: 'No disease or pest was confidently identified from the image.',
  noDiseaseDetectedBadge: 'Healthy',
  remedyRecommendationsTitle: 'Remedy Recommendations',
  governmentSchemesTitle: 'Government Schemes',
  speakNowPrompt: 'Or, tap the mic to speak',
  voiceCommandUpload: 'upload image',
  voiceCommandSelect: 'select image',
  voiceCommandChoose: 'choose photo',
  voiceCommandDiagnose: 'diagnose plant',
  voiceCommandCheck: 'check plant',
  voiceCommandWhatsWrong: 'what is wrong with my crop',
  voiceCommandClear: 'clear',
  voiceCommandReset: 'reset',
  shareButton: 'Share',
  saveButton: 'Save',
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
  unexpectedError: 'An unexpected error occurred. Please try again.',
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
  startListening: 'Start Listening',
  stopListening: 'Stop Listening',
  listening: 'Listening...',
};

export const translations: Translations = {
  en: englishTranslations,
  hi: {
    ...englishTranslations,
    appTitle: 'एग्रीमेडिक एआई',
    appDescription: 'फसल रोगों का तुरंत निदान करें',
    pricesNavTitle: 'बाजार मूल्य',
    schemesNavTitle: 'सरकारी योजनाएं',
    footerCopyright: '© {year} एग्रीमेडिक एआई। सर्वाधिकार सुरक्षित।',
    footerTagline: 'किसानों को एआई तकनीक से सशक्त बनाना।',
    heroTitle: 'आपका एआई प्लांट डॉक्टर',
    heroSubtitle: 'एक तस्वीर खींचो, निदान पाओ। सरल, तेज, और हर किसान के लिए।',
    uploadPrompt: 'अपलोड करने के लिए क्लिक करें या टैप करें',
    diagnosingButton: 'आपके पौधे के स्वास्थ्य की जांच हो रही है...',
    placeholderTitle: 'आपका पौधा डॉक्टर',
    placeholderDescription: 'हमारे AI सहायक से त्वरित और सटीक निदान पाने के लिए अपने पौधे की एक तस्वीर अपलोड करें।',
    errorTitle: 'त्रुटि',
    diagnosisTitle: 'निदान',
    diseaseDetectedBadge: 'रोग का पता चला',
    noDiseaseDetectedMessage: 'छवि से किसी बीमारी या कीट की आत्मविश्वास से पहचान नहीं की गई।',
    noDiseaseDetectedBadge: 'स्वस्थ',
    remedyRecommendationsTitle: 'उपचार की सिफारिशें',
    governmentSchemesTitle: 'सरकारी योजनाएं',
    speakNowPrompt: 'या, बोलने के लिए माइक पर टैप करें',
    voiceCommandDiagnose: 'पौधे का निदान करें',
    voiceCommandCheck: 'पौधा जांचें',
    voiceCommandWhatsWrong: 'मेरी फसल में क्या खराबी है',
    voiceCommandClear: 'हटाएं',
    voiceCommandReset: 'रीसेट',
    startListening: 'सुनना शुरू करें',
    stopListening: 'सुनना बंद करें',
    listening: 'सुन रहा है...',
    selectImageError: 'कृपया पहले एक छवि चुनें।',
    unexpectedError: 'एक अप्रत्याशित त्रुटि हुई। कृपया पुन: प्रयास करें।',
    language: 'भाषा',
    hindi: 'हिंदी',
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
    pricesNavTitle: 'बाजारभाव',
    schemesNavTitle: 'शासकीय योजना',
    footerCopyright: '© {year} अ‍ॅग्रीमेडिक एआय. सर्व हक्क राखीव.',
    footerTagline: 'शेतकऱ्यांना एआय तंत्रज्ञानाने सक्षम करणे.',
    heroTitle: 'तुमचा एआय वनस्पती डॉक्टर',
    heroSubtitle: 'एक फोटो स्नॅप करा, निदान मिळवा. सोपे, जलद आणि प्रत्येक शेतकऱ्यासाठी.',
    uploadPrompt: 'अपलोड करण्यासाठी क्लिक करा किंवा टॅप करा',
    diagnosingButton: 'तुमच्या वनस्पतीच्या आरोग्याची तपासणी करत आहे...',
    placeholderTitle: 'तुमचा वनस्पती डॉक्टर',
    placeholderDescription: 'आमच्या AI सहाय्यकाकडून जलद आणि अचूक निदान मिळवण्यासाठी तुमच्या वनस्पनाचा फोटो अपलोड करा.',
    errorTitle: 'त्रुटी',
    diagnosisTitle: 'निदान',
    diseaseDetectedBadge: 'रोग आढळला',
    noDiseaseDetectedMessage: 'प्रतिमेवरून कोणताही रोग किंवा कीटक आत्मविश्वासाने ओळखला गेला नाही.',
    noDiseaseDetectedBadge: 'निरोगी',
    remedyRecommendationsTitle: 'उपाय सूचना',
    governmentSchemesTitle: 'सरकारी योजना',
    speakNowPrompt: 'किंवा, बोलण्यासाठी माइकवर टॅप करा',
    voiceCommandDiagnose: 'वनस्पतीचे निदान करा',
    voiceCommandCheck: 'वनस्पती तपासा',
    voiceCommandWhatsWrong: 'माझ्या पिकात काय चूक आहे',
    startListening: 'ऐकण्यास प्रारंभ करा',
    stopListening: 'ऐकणे थांबवा',
    listening: 'ऐकत आहे...',
    selectImageError: 'कृपया प्रथम एक प्रतिमा निवडा.',
    unexpectedError: 'एक अनपेक्षित त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
    language: 'भाषा',
    marathi: 'मराठी',
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
    pricesNavTitle: 'మార్కెట్ ధరలు',
    schemesNavTitle: 'ప్రభుత్వ పథకాలు',
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
    schemesNavTitle: 'সরকারি প্রকল্প',
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
    schemesNavTitle: 'அரசு திட்டங்கள்',
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
    schemesNavTitle: 'સરકારી યોજનાઓ',
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
    schemesNavTitle: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
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
    schemesNavTitle: 'സർക്കാർ പദ്ധതികൾ',
    heroTitle: 'നിങ്ങളുടെ AI പ്ലാന്റ് ഡോക്ടർ',
    heroSubtitle: 'ഒരു ഫോട്ടോ എടുക്കുക, ഒരു രോഗനിർണയം നേടുക. ലളിതവും വേഗതയേറിയതും ഓരോ കർഷകനും.',
    diagnosingButton: 'നിങ്ങളുടെ ചെടിയുടെ ആരോഗ്യം പരിശോധിക്കുന്നു...',
    listening: 'കേൾക്കുന്നു...',
  },
};
