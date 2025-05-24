import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { getUserTranslations } from "../services/translationService";
import { TranslationItem } from "../types";
import { Volume2 } from "lucide-react";

const History: React.FC = () => {
  const [translations, setTranslations] = useState<TranslationItem[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );

  useEffect(() => {
    if (user?.id) {
      loadTranslationHistory();
    }

    const audio = new Audio();
    setAudioElement(audio);

    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, [user?.id]);

  const loadTranslationHistory = async () => {
    if (!user?.id) return;
    try {
      const history = await getUserTranslations(user.id);
      setTranslations(history);
    } catch (error) {
      console.error("Failed to load translation history:", error);
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioElement) {
      audioElement.src = audioUrl;
      audioElement.play();
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#F5F5F5] mb-8">
          Translation History
        </h1>

        {translations.length === 0 ? (
          <p className="text-[#757575] text-center">No translations yet</p>
        ) : (
          <div className="space-y-6">
            {translations.map((item) => (
              <div key={item.id} className="bg-[#1E1E1E] rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-[#BB86FC]">
                    {item.sourceLanguage} → {item.targetLanguage}
                  </span>
                  <span className="text-sm text-[#757575]">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-[#F5F5F5]">{item.sourceText}</p>
                  <p className="text-[#CCCCCC]">{item.translatedText}</p>
                </div>

                {item.audioUrl && (
                  <button
                    onClick={() => playAudio(item.audioUrl!)}
                    className="mt-4 text-[#BB86FC] hover:text-[#A070DA] transition-colors flex items-center gap-2"
                  >
                    <Volume2 size={16} />
                    Play Audio
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
