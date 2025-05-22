export interface User {
  id: string;
  username: string;
  email?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type TranslationMode = 'text-to-text' | 'speech-to-speech' | 'text-to-speech' | 'speech-to-text';

export type Language = 'ENG' | 'EGY';

export interface TranslationItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  timestamp: string;
  mode: TranslationMode;
  audioUrl?: string;
}

export interface TranslationState {
  history: TranslationItem[];
  currentTranslation: {
    sourceText: string;
    translatedText: string;
    sourceLanguage: Language;
    targetLanguage: Language;
    isTranslating: boolean;
    mode: TranslationMode;
    error: string | null;
  };
}