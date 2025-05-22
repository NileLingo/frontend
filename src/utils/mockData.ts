import { TranslationItem } from '../types';

export const mockTranslationHistory: TranslationItem[] = [
  {
    id: '1',
    sourceText: 'Hello, how are you today?',
    translatedText: 'مرحبا، كيف حالك اليوم؟',
    sourceLanguage: 'ENG',
    targetLanguage: 'EGY',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    mode: 'text-to-text'
  },
  {
    id: '2',
    sourceText: 'أنا سعيد بلقائك',
    translatedText: 'I\'m happy to meet you',
    sourceLanguage: 'EGY',
    targetLanguage: 'ENG',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    mode: 'text-to-text'
  },
  {
    id: '3',
    sourceText: 'Can you help me find the museum?',
    translatedText: 'هل يمكنك مساعدتي في العثور على المتحف؟',
    sourceLanguage: 'ENG',
    targetLanguage: 'EGY',
    timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
    mode: 'text-to-text'
  },
  {
    id: '4',
    sourceText: 'أريد تذكرتين للسينما',
    translatedText: 'I want two tickets for the cinema',
    sourceLanguage: 'EGY',
    targetLanguage: 'ENG',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    mode: 'text-to-text'
  },
  {
    id: '5',
    sourceText: 'The weather is nice today',
    translatedText: 'الطقس جميل اليوم',
    sourceLanguage: 'ENG',
    targetLanguage: 'EGY',
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    mode: 'text-to-text'
  }
];