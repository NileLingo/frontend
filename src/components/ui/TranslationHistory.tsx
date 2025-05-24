import React from "react";
import { TranslationItem } from "../../types";
import { Volume2 } from "lucide-react";

interface TranslationHistoryProps {
  translations: TranslationItem[];
  onPlayAudio?: (audioUrl: string) => void;
}

const TranslationHistory: React.FC<TranslationHistoryProps> = ({
  translations,
  onPlayAudio,
}) => {
  return (
    <div className="bg-[#1E1E1E] rounded-xl p-6 max-h-[600px] overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-6 text-[#F5F5F5]">
        Translation History
      </h2>

      {translations.length === 0 ? (
        <p className="text-[#757575] text-center">No translations yet</p>
      ) : (
        <div className="space-y-6">
          {translations.map((item) => (
            <div key={item.id} className="bg-[#2A2A2A] rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#BB86FC]">
                  {item.sourceLanguage} → {item.targetLanguage}
                </span>
                <span className="text-sm text-[#757575]">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-[#F5F5F5]">{item.sourceText}</p>
                <p className="text-[#CCCCCC]">{item.translatedText}</p>
              </div>

              {item.audioUrl && (
                <button
                  onClick={() => onPlayAudio?.(item.audioUrl!)}
                  className="mt-2 text-[#BB86FC] hover:text-[#A070DA] transition-colors flex items-center"
                >
                  <Volume2 size={16} className="mr-1" />
                  Play Audio
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TranslationHistory;
