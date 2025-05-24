import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  setSourceText, 
  setTranslatedText, 
  swapLanguages, 
  startTranslation, 
  translationSuccess, 
  translationFailure,
  addToHistory
} from '../features/translation/translationSlice';
import { translateAndSpeak, speechToSpeech, getUserTranslations } from '../services/translationService';
import { RootState } from '../store';
import { Upload, Plus, History as HistoryIcon, Mic, Pause, Volume2, Send } from 'lucide-react';
import LanguageSwitch from '../components/ui/LanguageSwitch';
import AudioControls from '../components/ui/AudioControls';
import AudioWaveform from '../components/ui/AudioWaveform';
import TranslationHistory from '../components/ui/TranslationHistory';
import Button from '../components/ui/Button';
import { TranslationItem } from '../types';

const Translation: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTranslation } = useSelector((state: RootState) => state.translation);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [translations, setTranslations] = useState<TranslationItem[]>([]);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
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

  const loadTranslationHistory = async () => {
    if (!user?.id) return;
    try {
      const history = await getUserTranslations(user.id);
      setTranslations(history);
    } catch (error) {
      console.error('Failed to load translation history:', error);
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
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        if (user?.id) {
          try {
            const result = await speechToSpeech(
              audioBlob,
              currentTranslation.sourceLanguage,
              currentTranslation.targetLanguage,
              user.id
            );
            dispatch(setSourceText(result.originalText));
            dispatch(setTranslatedText(result.translatedText));
            setAudioURL(result.audio);
          } catch (error) {
            console.error('Speech to speech translation failed:', error);
          }
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    dispatch(setSourceText(text));
  };

  const handleTranslateSubmit = async () => {
    if (!currentTranslation.sourceText.trim() || !user?.id) return;

    try {
      dispatch(startTranslation());
      
      const result = await translateAndSpeak(
        currentTranslation.sourceText,
        currentTranslation.sourceLanguage,
        currentTranslation.targetLanguage,
        user.id
      );
      
      dispatch(translationSuccess(result.translatedText));
      setAudioURL(result.audio);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Translation failed';
      dispatch(translationFailure(errorMessage));
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

  const handleReset = useCallback(() => {
    setAudioURL(null);
    setIsPlaying(false);
    if (audioElement.current) {
      audioElement.current.pause();
      audioElement.current.src = '';
    }
  }, []);

  const handleUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      const result = await speechToSpeech(
        file,
        currentTranslation.sourceLanguage,
        currentTranslation.targetLanguage,
        user.id
      );
      
      dispatch(setSourceText(result.originalText));
      dispatch(setTranslatedText(result.translatedText));
      setAudioURL(result.audio);
    } catch (error) {
      console.error('Audio upload failed:', error);
    }
  };

  const playHistoryAudio = (audioUrl: string) => {
    if (audioElement.current) {
      audioElement.current.src = audioUrl;
      audioElement.current.play();
      setIsPlaying(true);
    }
  };

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
            <Button
              onClick={handleTranslateSubmit}
              variant="primary"
              className="absolute bottom-4 right-4 flex items-center gap-2"
            >
              <Send size={16} />
              Translate
            </Button>
            <AudioControls
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onPlay={handlePlayPause}
              onReset={handleReset}
              onUpload={handleUpload}
              isRecording={isRecording}
              isPlaying={isPlaying}
              hasRecording={!!audioURL}
            />
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
            <div className="absolute top-4 left-4 text-xl font-semibold">
              {currentTranslation.targetLanguage}
            </div>
            <textarea
              className="w-full h-64 bg-[#1E1E1E] rounded-2xl p-12 resize-none text-[#F5F5F5] placeholder-[#757575] focus:outline-none"
              placeholder="Translation will appear here"
              value={currentTranslation.translatedText}
              readOnly
            />
            {audioURL && (
              <button
                onClick={handlePlayPause}
                className="absolute bottom-4 right-4 text-[#BB86FC] hover:text-[#A070DA] transition-colors p-2"
              >
                <Volume2 size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-12 mt-16">
          <button 
            className="group flex flex-col items-center"
            onClick={handleUpload}
          >
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
          
          <button 
            className="group flex flex-col items-center"
            onClick={() => setShowHistory(!showHistory)}
          >
            <div className="w-12 h-12 bg-[#1E1E1E] rounded-full flex items-center justify-center mb-2 group-hover:bg-[#2A2A2A] transition-colors">
              <HistoryIcon className="w-5 h-5 text-[#BB86FC]" />
            </div>
            <span className="text-sm text-[#757575]">History</span>
          </button>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="audio/*"
          onChange={handleFileUpload}
        />

        {/* Translation History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-3xl">
              <TranslationHistory 
                translations={translations}
                onPlayAudio={playHistoryAudio}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Translation;