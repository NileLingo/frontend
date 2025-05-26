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
      className="fixed-center p-3 rounded-full text-[#BB86FC] hover:bg-[#2A2A2A] transition-colors shadow-lg"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <ArrowLeftRight size={24} />
    </button>
  );
};

export default LanguageSwitch;