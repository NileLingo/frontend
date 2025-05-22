import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setSourceText, 
  setTranslatedText, 
  swapLanguages, 
  startTranslation, 
  translationSuccess, 
  translationFailure,
  addToHistory
} from '../features/translation/translationSlice';
import { translateText } from '../services/translationService';
import { RootState } from '../store';
import { v4 as uuidv4 } from 'uuid';
import { Upload, Plus, History, Mic } from 'lucide-react';
import LanguageSwitch from '../components/ui/LanguageSwitch';

const Translation: React.FC = () => {
  const dispatch = useDispatch();
  const { currentTranslation } = useSelector((state: RootState) => state.translation);
  const [isRecording, setIsRecording] = useState(false); 
  
  const handleTranslate = useCallback(async (text: string) => {
    if (!text.trim()) {
      dispatch(setTranslatedText('')); 
      return;
    }

    try {
      dispatch(startTranslation());
      
      const translatedText = await translateText(
        text,
        currentTranslation.sourceLanguage,
        currentTranslation.targetLanguage
      );
      
      dispatch(translationSuccess(translatedText));
      
      // Add to history only after successful translation
      dispatch(addToHistory({
        id: uuidv4(),
        sourceText: text,
        translatedText,
        sourceLanguage: currentTranslation.sourceLanguage,
        targetLanguage: currentTranslation.targetLanguage,
        timestamp: new Date().toISOString(),
        mode: 'text-to-text'
      }));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Translation failed';
      dispatch(translationFailure(errorMessage));
      console.error('Translation error:', errorMessage); 
    }
  }, [dispatch, currentTranslation.sourceLanguage, currentTranslation.targetLanguage]);

  const handleTextInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    dispatch(setSourceText(text));
    handleTranslate(text); 
  }, [dispatch, handleTranslate]);

  const handleLanguageSwitch = useCallback(() => {
    dispatch(swapLanguages());
  }, [dispatch]);

  // DESIGN REMAINS IDENTICAL
  return (
    <div className="min-h-screen bg-[#121212] text-[#F5F5F5] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <h1 className="text-4xl font-bold mb-16">NileLingo</h1>
        
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {/* Source Text Area */}
          <div className="relative">
            <div className="absolute top-4 left-4 text-xl font-semibold">
              {currentTranslation.sourceLanguage}
            </div>
            <textarea
              className="w-full h-64 bg-[#1E1E1E] rounded-2xl p-12 resize-none text-[#F5F5F5] placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-[#BB86FC]"
              placeholder="Type here .."
              value={currentTranslation.sourceText}
              onChange={handleTextInput}
            />
            <button 
              className="absolute bottom-4 right-4 text-[#BB86FC] hover:opacity-80 transition-opacity"
              onClick={() => setIsRecording(!isRecording)}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              <Mic size={24} className={isRecording ? 'text-[#BB86FC]' : 'text-[#BB86FC] opacity-60'} />
            </button>
          </div>

          <LanguageSwitch
            sourceLanguage={currentTranslation.sourceLanguage}
            targetLanguage={currentTranslation.targetLanguage}
            onSwitch={handleLanguageSwitch}
          />

          {/* Target Text Area */}
          <div className="relative">
            <div className="absolute top-4 left-4 text-xl font-semibold">
              {currentTranslation.targetLanguage}
            </div>
            <textarea
              className="w-full h-64 bg-[#1E1E1E] rounded-2xl p-12 resize-none text-[#F5F5F5] placeholder-[#757575] focus:outline-none"
              placeholder="Translation will appear here"
              value={currentTranslation.translatedText}
              readOnly
            />
          </div>
        </div>

        {/* Action Buttons (Unchanged) */}
        <div className="flex items-center justify-center space-x-12 mt-16">
          <button className="group flex flex-col items-center">
            <div className="w-12 h-12 bg-[#1E1E1E] rounded-full flex items-center justify-center mb-2 group-hover:bg-[#2A2A2A] transition-colors">
              <Upload className="w-5 h-5 text-[#BB86FC]" />
            </div>
            <span className="text-sm text-[#757575]">Upload audio</span>
          </button>
          
          <button className="group flex flex-col items-center">
            <div className="w-16 h-16 bg-[#1E1E1E] rounded-full flex items-center justify-center mb-2 group-hover:bg-[#2A2A2A] transition-colors">
              <Plus className="w-8 h-8 text-[#BB86FC]" />
            </div>
            <span className="text-sm text-[#757575]">Join room</span>
          </button>
          
          <button className="group flex flex-col items-center">
            <div className="w-12 h-12 bg-[#1E1E1E] rounded-full flex items-center justify-center mb-2 group-hover:bg-[#2A2A2A] transition-colors">
              <History className="w-5 h-5 text-[#BB86FC]" />
            </div>
            <span className="text-sm text-[#757575]">History</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Translation;