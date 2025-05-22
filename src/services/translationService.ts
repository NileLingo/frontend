import { Language, TranslationMode } from '../types';

// Mock translation service with static data until backend API is integrated
export const translateText = async (
  text: string,
  sourceLanguage: Language,
  targetLanguage: Language
): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For demo purposes - actual translation will come from backend
  const mockTranslations: Record<string, string> = {
    'Hello': 'مرحبا',
    'Good morning': 'صباح الخير',
    'How are you?': 'كيف حالك؟',
    'Thank you': 'شكرا لك',
    'Goodbye': 'مع السلامة',
    'What is your name?': 'ما هو اسمك؟',
    'My name is': 'اسمي',
    'Where is the restaurant?': 'أين المطعم؟',
    'How much does it cost?': 'كم يكلف؟',
    'I would like to learn Arabic': 'أود أن أتعلم العربية',
    'مرحبا': 'Hello',
    'صباح الخير': 'Good morning',
    'كيف حالك؟': 'How are you?',
    'شكرا لك': 'Thank you',
    'مع السلامة': 'Goodbye',
    'ما هو اسمك؟': 'What is your name?',
    'اسمي': 'My name is',
    'أين المطعم؟': 'Where is the restaurant?',
    'كم يكلف؟': 'How much does it cost?',
    'أود أن أتعلم العربية': 'I would like to learn Arabic',
  };

  // If there's a direct translation available, use it
  if (mockTranslations[text]) {
    return mockTranslations[text];
  }

  // For other input text, generate a placeholder response
  if (sourceLanguage === 'ENG' && targetLanguage === 'EGY') {
    return `[Egyptian translation of: "${text}"]`;
  } else {
    return `[English translation of: "${text}"]`;
  }
};

export const convertTextToSpeech = async (
  text: string,
  language: Language
): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a mock audio URL - this would be an actual audio URL from the backend
  return 'https://example.com/audio/mock-audio.mp3';
};

export const convertSpeechToText = async (
  audioBlob: Blob,
  language: Language
): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Return mock recognized text - this would come from the backend
  return language === 'ENG' 
    ? 'This is a sample transcription from audio in English.'
    : 'هذا نموذج للنص المحول من الصوت باللغة العربية.';
};

export const performSpeechToSpeechTranslation = async (
  audioBlob: Blob,
  sourceLanguage: Language,
  targetLanguage: Language
): Promise<{text: string, audioUrl: string}> => {
  // 1. Convert speech to text
  const recognizedText = await convertSpeechToText(audioBlob, sourceLanguage);
  
  // 2. Translate the text
  const translatedText = await translateText(recognizedText, sourceLanguage, targetLanguage);
  
  // 3. Convert translated text back to speech
  const audioUrl = await convertTextToSpeech(translatedText, targetLanguage);
  
  return {
    text: translatedText,
    audioUrl
  };
};