import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../store";
import {
  getUserTranslations,
  toggleTranslationFavorite,
} from "../services/translationService";
import { TranslationItem } from "../types";
import { Volume2, Heart } from "lucide-react";
import Button from "../components/ui/Button";

const History: React.FC = () => {
  const [translations, setTranslations] = useState<TranslationItem[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation();
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

  const handleToggleFavorite = async (translationId: string) => {
    if (!user?.id) return;
    try {
      await toggleTranslationFavorite(user.id, translationId);
      setTranslations((prevTranslations) =>
        prevTranslations.map((translation) =>
          translation.id === translationId
            ? { ...translation, favorite: !translation.favorite }
            : translation
        )
      );
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioElement) {
      audioElement.src = audioUrl;
      audioElement.play();
    }
  };

  const filteredTranslations = showFavorites
    ? translations.filter((item) => item.favorite)
    : translations;

  return (
    <div className="min-h-screen bg-[#121212] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] rtl:text-right">
            {t("history.title")}
          </h1>
          <Button
            variant={showFavorites ? "primary" : "outline"}
            onClick={() => setShowFavorites(!showFavorites)}
            className="flex items-center gap-2"
          >
            <Heart size={16} className={showFavorites ? "fill-current" : ""} />
            {showFavorites ? t("history.showAll") : t("history.showFavorites")}
          </Button>
        </div>

        {filteredTranslations.length === 0 ? (
          <p className="text-[#757575] text-center">
            {showFavorites
              ? t("history.noFavorites")
              : t("history.noTranslations")}
          </p>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredTranslations.map((item) => (
              <div key={item.id} className="bg-[#1E1E1E] rounded-lg p-4 sm:p-6">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <span className="text-xs sm:text-sm text-[#BB86FC]">
                    {item.sourceLanguage} → {item.targetLanguage}
                  </span>
                  <button
                    onClick={() => handleToggleFavorite(item.id)}
                    className={`text-[#BB86FC] hover:text-[#A070DA] transition-colors`}
                    aria-label={
                      item.favorite
                        ? t("history.removeFromFavorites")
                        : t("history.addToFavorites")
                    }
                  >
                    <Heart
                      size={18}
                      className={item.favorite ? "fill-[#BB86FC]" : ""}
                    />
                  </button>
                </div>

                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                  <p className="text-sm sm:text-base text-[#F5F5F5] rtl:text-right">
                    {item.sourceText}
                  </p>
                  <p className="text-sm sm:text-base text-[#CCCCCC] rtl:text-right">
                    {item.translatedText}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                  {item.audioUrl && (
                    <button
                      onClick={() => playAudio(item.audioUrl!)}
                      className="text-[#BB86FC] hover:text-[#A070DA] transition-colors flex items-center gap-2 text-sm sm:text-base"
                      aria-label={t("history.playAudio")}
                    >
                      <Volume2 size={14} className="sm:size-4" />
                      {t("history.playAudio")}
                    </button>
                  )}
                  <p className="text-xs sm:text-sm text-[#757575] sm:ms-auto rtl:text-right">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
