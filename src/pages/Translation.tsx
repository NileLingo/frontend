import React, { useState, useCallback, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  setSourceText,
  setTranslatedText,
  swapLanguages,
  startTranslation,
  translationSuccess,
  translationFailure,
  clearCurrentTranslation,
} from "../features/translation/translationSlice";
import {
  translateAndSpeak,
  speechToSpeech,
} from "../services/translationService";
import { RootState } from "../store";
import {
  Upload,
  Plus,
  History as HistoryIcon,
  Mic,
  Volume2,
  Send,
  X,
} from "lucide-react";
import LanguageSwitch from "../components/ui/LanguageSwitch";
import AudioWaveform from "../components/ui/AudioWaveform";
import LoadingScreen from "../components/ui/LoadingScreen";
import ErrorToast from "../components/ui/ErrorToast";
import SpeakerSelector from "../components/ui/SpeakerSelector";

const Translation: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { currentTranslation } = useSelector(
    (state: RootState) => state.translation
  );
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | null>(null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    audioElement.current = new Audio();
    audioElement.current.onended = () => setIsPlaying(false);

    return () => {
      if (audioElement.current) {
        audioElement.current.pause();
        audioElement.current = null;
      }
    };
  }, [isAuthenticated, navigate]);

  const handleReset = () => {
    dispatch(clearCurrentTranslation());
    setAudioURL(null);
    setIsPlaying(false);
    if (audioElement.current) {
      audioElement.current.pause();
      audioElement.current.src = "";
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        if (user?.id) {
          try {
            setIsLoading(true);
            const result = await speechToSpeech(
              audioBlob,
              currentTranslation.sourceLanguage,
              currentTranslation.targetLanguage,
              user.id,
              selectedSpeaker || undefined
            );
            dispatch(setSourceText(result.originalText));
            dispatch(setTranslatedText(result.translatedText));
            setAudioURL(result.audio);
          } catch (error) {
            setError(t("errors.audioProcessingFailed"));
            console.error("Speech to speech translation failed:", error);
          } finally {
            setIsLoading(false);
          }
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      setError(t("errors.microphoneAccess"));
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    dispatch(setSourceText(text));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTranslateSubmit();
    }
  };

  const handleTranslateSubmit = async () => {
    if (!currentTranslation.sourceText.trim() || !user?.id) return;

    try {
      dispatch(startTranslation());
      setIsLoading(true);

      const result = await translateAndSpeak(
        currentTranslation.sourceText,
        currentTranslation.sourceLanguage,
        currentTranslation.targetLanguage,
        user.id,
        selectedSpeaker || undefined
      );

      dispatch(translationSuccess(result.translatedText));
      setAudioURL(result.audio);
    } catch (error) {
      const errorMessage = t("errors.translationFailed");
      dispatch(translationFailure(errorMessage));
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageSwitch = useCallback(() => {
    dispatch(swapLanguages());
  }, [dispatch]);

  const handlePlayPause = useCallback(() => {
    if (!audioElement.current || !audioURL) return;

    if (isPlaying) {
      audioElement.current.pause();
    } else {
      audioElement.current.src = audioURL;
      audioElement.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, audioURL]);

  const handleUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      setIsLoading(true);
      const result = await speechToSpeech(
        file,
        currentTranslation.sourceLanguage,
        currentTranslation.targetLanguage,
        user.id,
        selectedSpeaker || undefined
      );

      dispatch(setSourceText(result.originalText));
      dispatch(setTranslatedText(result.translatedText));
      setAudioURL(result.audio);
    } catch (error) {
      setError(t("errors.audioProcessingFailed"));
      console.error("Audio upload failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = () => {
    navigate('/live-stream');
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#F5F5F5] flex flex-col">
      {isLoading && <LoadingScreen message={t("translation.translating")} />}
      {error && (
        <ErrorToast
          message={error}
          onClose={() => setError(null)}
          duration={5000}
        />
      )}

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {/* Source Text Area */}
          <div className="relative">
            <div
              className={`absolute top-4 ${
                isRTL ? "right-4" : "left-4"
              } text-xl font-semibold`}
            >
              {t(`common.languages.${currentTranslation.sourceLanguage}`)}
            </div>
            <textarea
              className="w-full h-64 bg-[#1E1E1E] rounded-2xl py-12 px-4 resize-none text-[#F5F5F5] placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-[#BB86FC] rtl:text-right"
              placeholder={t("translation.typeHere")}
              value={currentTranslation.sourceText}
              onChange={handleTextInput}
              onKeyDown={handleKeyDown}
              dir={isRTL ? "rtl" : "ltr"}
            />
            {currentTranslation.sourceText && (
              <button
                onClick={handleReset}
                className={`absolute top-4 ${
                  isRTL ? "left-4" : "right-4"
                } text-[#757575] hover:text-[#BB86FC] transition-colors p-2`}
                aria-label={t("translation.clearText")}
              >
                <X size={20} />
              </button>
            )}
            <div
              className={`absolute bottom-4 ${
                isRTL ? "left-4" : "right-4"
              } flex items-center gap-3`}
            >
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className="text-[#BB86FC] hover:text-[#A070DA] transition-colors p-2"
                aria-label={t(
                  isRecording
                    ? "translation.stopRecording"
                    : "translation.startRecording"
                )}
              >
                <Mic size={24} className={isRecording ? "animate-pulse" : ""} />
              </button>
              <button
                onClick={handleTranslateSubmit}
                className="text-[#BB86FC] hover:text-[#A070DA] transition-colors p-2"
              >
                <Send size={24} className={isRTL ? "scale-x-[-1]" : ""} />
              </button>
            </div>
            {isRecording && (
              <AudioWaveform
                isActive={true}
                size="md"
                className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
              />
            )}
          </div>

          <LanguageSwitch
            sourceLanguage={currentTranslation.sourceLanguage}
            targetLanguage={currentTranslation.targetLanguage}
            onSwitch={handleLanguageSwitch}
          />

          {/* Target Text Area */}
          <div className="relative">
            <div
              className={`absolute top-4 ${
                isRTL ? "right-4" : "left-4"
              } text-xl font-semibold`}
            >
              {t(`common.languages.${currentTranslation.targetLanguage}`)}
            </div>
            
            {/* Voice Selector - Top Right */}
            <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} z-10`}>
              <SpeakerSelector
              selectedSpeaker={selectedSpeaker}
              onSpeakerChange={setSelectedSpeaker}
              />
            </div>
            

            <textarea
              className="w-full h-64 bg-[#1E1E1E] rounded-2xl py-12 px-4 resize-none text-[#F5F5F5] placeholder-[#757575] focus:outline-none rtl:text-right"
              placeholder={t("translation.translationWillAppear")}
              value={currentTranslation.translatedText}
              readOnly
              dir={isRTL ? "rtl" : "ltr"}
            />
            {audioURL && (
              <button
                onClick={handlePlayPause}
                className={`absolute bottom-4 ${
                  isRTL ? "left-4" : "right-4"
                } text-[#BB86FC] hover:text-[#A070DA] transition-colors p-2`}
                aria-label={t(
                  isPlaying ? "translation.pauseAudio" : "translation.playAudio"
                )}
              >
                <Volume2 size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex items-center justify-center mt-16">
          <div
            className="grid grid-cols-3 items-end gap-12 rtl:gap-reverse"
            style={{ width: "384px" }}
          >
            {/* Upload Button */}
            <button
              className="group flex flex-col items-center"
              onClick={handleUpload}
            >
              <div className="w-12 h-12 bg-[#1E1E1E] rounded-full flex items-center justify-center mb-2 group-hover:bg-[#2A2A2A] transition-colors">
                <Upload className="w-5 h-5 text-[#BB86FC]" />
              </div>
              <span className="text-sm text-[#757575]">
                {t("translation.uploadAudio")}
              </span>
            </button>

            {/* Join Room Button - Centered */}
            <button 
              className="group flex flex-col items-center"
              onClick={handleJoinRoom}
            >
              <div className="w-16 h-16 bg-[#1E1E1E] rounded-full flex items-center justify-center mb-2 group-hover:bg-[#2A2A2A] transition-colors">
                <Plus className="w-8 h-8 text-[#BB86FC]" />
              </div>
              <span className="text-sm text-[#757575]">
                {t("translation.joinRoom")}
              </span>
            </button>

            {/* History Button */}
            <button
              className="group flex flex-col items-center"
              onClick={() => navigate("/history")}
            >
              <div className="w-12 h-12 bg-[#1E1E1E] rounded-full flex items-center justify-center mb-2 group-hover:bg-[#2A2A2A] transition-colors">
                <HistoryIcon className="w-5 h-5 text-[#BB86FC]" />
              </div>
              <span className="text-sm text-[#757575]">
                {t("translation.history")}
              </span>
            </button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="audio/*"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
};

export default Translation;