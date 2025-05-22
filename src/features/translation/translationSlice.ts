import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TranslationState, TranslationItem, Language, TranslationMode } from '../../types';

const initialState: TranslationState = {
  history: [],
  currentTranslation: {
    sourceText: '',
    translatedText: '',
    sourceLanguage: 'ENG',
    targetLanguage: 'EGY',
    isTranslating: false,
    mode: 'text-to-text',
    error: null,
  },
};

const translationSlice = createSlice({
  name: 'translation',
  initialState,
  reducers: {
    setSourceText: (state, action: PayloadAction<string>) => {
      state.currentTranslation.sourceText = action.payload;
    },
    setTranslatedText: (state, action: PayloadAction<string>) => {
      state.currentTranslation.translatedText = action.payload;
    },
    setSourceLanguage: (state, action: PayloadAction<Language>) => {
      state.currentTranslation.sourceLanguage = action.payload;
    },
    setTargetLanguage: (state, action: PayloadAction<Language>) => {
      state.currentTranslation.targetLanguage = action.payload;
    },
    swapLanguages: (state) => {
      const temp = state.currentTranslation.sourceLanguage;
      state.currentTranslation.sourceLanguage = state.currentTranslation.targetLanguage;
      state.currentTranslation.targetLanguage = temp;
      
      // Also swap text if we have translations
      if (state.currentTranslation.sourceText || state.currentTranslation.translatedText) {
        const tempText = state.currentTranslation.sourceText;
        state.currentTranslation.sourceText = state.currentTranslation.translatedText;
        state.currentTranslation.translatedText = tempText;
      }
    },
    setTranslationMode: (state, action: PayloadAction<TranslationMode>) => {
      state.currentTranslation.mode = action.payload;
    },
    startTranslation: (state) => {
      state.currentTranslation.isTranslating = true;
      state.currentTranslation.error = null;
    },
    translationSuccess: (state, action: PayloadAction<string>) => {
      state.currentTranslation.isTranslating = false;
      state.currentTranslation.translatedText = action.payload;
    },
    translationFailure: (state, action: PayloadAction<string>) => {
      state.currentTranslation.isTranslating = false;
      state.currentTranslation.error = action.payload;
    },
    addToHistory: (state, action: PayloadAction<TranslationItem>) => {
      state.history.unshift(action.payload);
    },
    clearHistory: (state) => {
      state.history = [];
    },
    clearCurrentTranslation: (state) => {
      state.currentTranslation.sourceText = '';
      state.currentTranslation.translatedText = '';
    },
  },
});

export const {
  setSourceText,
  setTranslatedText,
  setSourceLanguage,
  setTargetLanguage,
  swapLanguages,
  setTranslationMode,
  startTranslation,
  translationSuccess,
  translationFailure,
  addToHistory,
  clearHistory,
  clearCurrentTranslation,
} = translationSlice.actions;

export default translationSlice.reducer;