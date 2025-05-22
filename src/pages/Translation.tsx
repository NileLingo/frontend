import React, { useState } from 'react';
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
import { Upload, Plus, History } from 'lucide-react';

const Translation: React.FC = () => {
  const dispatch = useDispatch();
  const { currentTranslation } = useSelector((state: RootState) => state.translation);
  const [isRecording, setIsRecording] = useState(false);
  
  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setSourceText(e.target.value));
    handleTranslate(e.target.value);
  };
  
  const handleTranslate = async (text: string) => {
    if (!text) return;
    
    try {
      dispatch(startTranslation());
      
      const translatedText = await translateText(
        text,
        currentTranslation.sourceLanguage,
        currentTranslation.targetLanguage
      );
      
      dispatch(translationSuccess(translatedText));
      
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
      dispatch(translationFailure(error instanceof Error ? error.message : 'Translation failed'));
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#F5F5F5] p-8">
      <h1 className="text-3xl font-bold text-center mb-12">NileLingo</h1>
      
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="relative">
          <div className="absolute top-4 left-4 text-lg font-semibold">
            {currentTranslation.sourceLanguage}
          </div>
          <textarea
            className="w-full h-64 bg-[#1E1E1E] rounded-lg p-12 resize-none text-[#F5F5F5] placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-[#BB86FC]"
            placeholder="Type here .."
            value={currentTranslation.sourceText}
            onChange={handleTextInput}
          />
          <button 
            className="absolute bottom-4 right-4 text-[#BB86FC]"
            onClick={() => setIsRecording(!isRecording)}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isRecording ? 'bg-[#BB86FC] bg-opacity-20' : ''}`}>
              <div className={`w-4 h-4 rounded-full ${isRecording ? 'bg-[#BB86FC]' : 'border-2 border-[#BB86FC]'}`} />
            </div>
          </button>
        </div>

        {/* Output Area */}
        <div className="relative">
          <div className="absolute top-4 left-4 text-lg font-semibold">
            {currentTranslation.targetLanguage}
          </div>
          <textarea
            className="w-full h-64 bg-[#1E1E1E] rounded-lg p-12 resize-none text-[#F5F5F5] placeholder-[#757575] focus:outline-none"
            placeholder="Translation will appear here"
            value={currentTranslation.translatedText}
            readOnly
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center space-x-8 mt-12">
        <button className="w-12 h-12 bg-[#1E1E1E] rounded-full flex items-center justify-center hover:bg-[#2A2A2A] transition-colors">
          <Upload className="w-5 h-5 text-[#BB86FC]" />
          <span className="sr-only">Upload audio</span>
        </button>
        
        <button className="w-16 h-16 bg-[#1E1E1E] rounded-full flex items-center justify-center hover:bg-[#2A2A2A] transition-colors">
          <Plus className="w-8 h-8 text-[#BB86FC]" />
          <span className="sr-only">Join room</span>
        </button>
        
        <button className="w-12 h-12 bg-[#1E1E1E] rounded-full flex items-center justify-center hover:bg-[#2A2A2A] transition-colors">
          <History className="w-5 h-5 text-[#BB86FC]" />
          <span className="sr-only">History</span>
        </button>
      </div>
    </div>
  );
};

export default Translation;