import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Language } from '../../types';

interface LanguageSwitchProps {
  sourceLanguage: Language;
  targetLanguage: Language;
  onSwitch: () => void;
}

const LanguageSwitch: React.FC<LanguageSwitchProps> = ({
  onSwitch
}) => {
  return (
    <button 
      onClick={onSwitch}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-3 rounded-full text-[#BB86FC] hover:bg-[#2A2A2A] transition-colors shadow-lg"
    >
      <ArrowLeftRight size={24} />
    </button>
  );
};

export default LanguageSwitch;