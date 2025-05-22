import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Language } from '../../types';

interface LanguageSwitchProps {
  sourceLanguage: Language;
  targetLanguage: Language;
  onSwitch: () => void;
}

const LanguageSwitch: React.FC<LanguageSwitchProps> = ({
  sourceLanguage,
  targetLanguage,
  onSwitch
}) => {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="flex items-center space-x-4">
        <div className="px-4 py-2 bg-[#1E1E1E] rounded-lg text-[#F5F5F5]">
          {sourceLanguage}
        </div>
        
        <button 
          onClick={onSwitch} 
          className="flex items-center justify-center p-2 bg-[#1E1E1E] rounded-full text-[#BB86FC] hover:bg-[#2A2A2A] transition-colors"
        >
          <ArrowLeftRight size={20} />
        </button>
        
        <div className="px-4 py-2 bg-[#1E1E1E] rounded-lg text-[#F5F5F5]">
          {targetLanguage}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitch;