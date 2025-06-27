import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Settings,
  Mic,
  Users,
  Clock,
  Wifi,
  WifiOff,
  Volume2,
  PhoneOff,
  User,
} from "lucide-react";
import Button from "../components/ui/Button";
import AudioWaveform from "../components/ui/AudioWaveform";

interface TranscriptLine {
  speaker: number;
  text: string;
  beg?: number;
  end?: number;
}

interface WebSocketData {
  lines?: TranscriptLine[];
  buffer_transcription?: string;
  buffer_diarization?: string;
  remaining_time_transcription?: number;
  remaining_time_diarization?: number;
  status?: string;
  type?: string;
}

interface SpeakerInfo {
  id: number;
  name: string;
  isActive: boolean;
  lastSpoke: number;
  color: string;
}

const LiveStream: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState(t("liveStream.status.clickToStart"));
  const [chunkDuration, setChunkDuration] = useState(500);
  const [websocketUrl, setWebsocketUrl] = useState("");
  const [transcriptLines, setTranscriptLines] = useState<TranscriptLine[]>([]);
  const [bufferText, setBufferText] = useState("");
  const [recordingTime, setRecordingTime] = useState("00:00");
  const [showSettings, setShowSettings] = useState(false);
  const [waitingForStop, setWaitingForStop] = useState(false);
  const [speakers, setSpeakers] = useState<SpeakerInfo[]>([]);
  const [activeSpeakerId, setActiveSpeakerId] = useState<number | null>(null);

  // Refs
  const websocketRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastReceivedDataRef = useRef<WebSocketData | null>(null);
  const speakerRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Speaker colors
  const speakerColors = [
    "bg-[#BB86FC]", // Primary purple
    "bg-[#03DAC6]", // Teal
    "bg-[#CF6679]", // Pink/Red
    "bg-[#FFC107]", // Amber
    "bg-[#4CAF50]", // Green
    "bg-[#FF9800]", // Orange
    "bg-[#9C27B0]", // Purple
    "bg-[#2196F3]", // Blue
  ];

  // Initialize WebSocket URL
  useEffect(() => {
    const defaultUrl = `wss://content-seriously-tiger.ngrok-free.app:443/asr`;
    setWebsocketUrl(defaultUrl);
  }, []);

  // Update status translations when language changes
  useEffect(() => {
    if (!isRecording && !isConnected) {
      setStatus(t("liveStream.status.clickToStart"));
    }
  }, [i18n.language, isRecording, isConnected, t]);

  // Auto-scroll to bottom of transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcriptLines, bufferText]);

  // Focus on active speaker card
  useEffect(() => {
    if (activeSpeakerId && speakerRefs.current[activeSpeakerId]) {
      speakerRefs.current[activeSpeakerId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeSpeakerId]);

  // Timer update function
  const updateTimer = useCallback(() => {
    if (!startTimeRef.current) return;

    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const minutes = Math.floor(elapsed / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (elapsed % 60).toString().padStart(2, "0");
    setRecordingTime(`${minutes}:${seconds}`);
  }, []);

  // Update speakers based on transcript lines
  const updateSpeakers = useCallback(
    (lines: TranscriptLine[]) => {
      const currentTime = Date.now();
      const activeSpeakers = new Set<number>();
      let currentActiveSpeaker: number | null = null;

      // Get active speakers from recent lines and find the most recent speaker
      lines.forEach((line, index) => {
        if (line.speaker > 0) {
          activeSpeakers.add(line.speaker);
          // The last speaker in the array is the most recent
          if (index === lines.length - 1) {
            currentActiveSpeaker = line.speaker;
          }
        }
      });

      // Set the active speaker for focusing
      setActiveSpeakerId(currentActiveSpeaker);

      setSpeakers((prevSpeakers) => {
        const updatedSpeakers = [...prevSpeakers];

        // Add new speakers
        activeSpeakers.forEach((speakerId) => {
          if (!updatedSpeakers.find((s) => s.id === speakerId)) {
            updatedSpeakers.push({
              id: speakerId,
              name: `${t("liveStream.speaker")} ${speakerId}`,
              isActive: speakerId === currentActiveSpeaker,
              lastSpoke: currentTime,
              color: speakerColors[(speakerId - 1) % speakerColors.length],
            });
          }
        });

        // Update existing speakers
        return updatedSpeakers.map((speaker) => {
          const isCurrentlyActive = speaker.id === currentActiveSpeaker;
          return {
            ...speaker,
            isActive: isCurrentlyActive,
            lastSpoke: activeSpeakers.has(speaker.id)
              ? currentTime
              : speaker.lastSpoke,
          };
        });
      });
    },
    [t]
  );

  // WebSocket setup
  const setupWebSocket = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        websocketRef.current = new WebSocket(websocketUrl);
      } catch (error) {
        setStatus(t("liveStream.status.error"));
        reject(error);
        return;
      }

      websocketRef.current.onopen = () => {
        setStatus(t("liveStream.status.connected"));
        setIsConnected(true);
        resolve();
      };

      websocketRef.current.onclose = () => {
        setIsConnected(false);
        if (waitingForStop) {
          setStatus(t("liveStream.status.processing"));
          if (lastReceivedDataRef.current) {
            renderTranscript(lastReceivedDataRef.current, true);
          }
        } else {
          setStatus(t("liveStream.status.disconnected"));
          if (isRecording) {
            stopRecording();
          }
        }
        setIsRecording(false);
        setWaitingForStop(false);
        websocketRef.current = null;
      };

      websocketRef.current.onerror = () => {
        setStatus(t("liveStream.status.error"));
        setIsConnected(false);
        reject(new Error("Error connecting to WebSocket"));
      };

      websocketRef.current.onmessage = (event) => {
        const data: WebSocketData = JSON.parse(event.data);

        if (data.type === "ready_to_stop") {
          setWaitingForStop(false);
          if (lastReceivedDataRef.current) {
            renderTranscript(lastReceivedDataRef.current, true);
          }
          setStatus(t("liveStream.status.finished"));

          if (websocketRef.current) {
            websocketRef.current.close();
          }
          return;
        }

        lastReceivedDataRef.current = data;
        renderTranscript(data, false);
      };
    });
  }, [websocketUrl, waitingForStop, isRecording, t]);

  // Render transcript function
  const renderTranscript = useCallback(
    (data: WebSocketData, isFinalizing: boolean = false) => {
      const {
        lines = [],
        buffer_transcription = "",
        buffer_diarization = "",
        status: currentStatus = "active_transcription",
      } = data;

      if (currentStatus === "no_audio_detected") {
        setTranscriptLines([]);
        setBufferText(t("liveStream.status.noAudio"));
        setActiveSpeakerId(null);
        return;
      }

      setTranscriptLines(lines);
      updateSpeakers(lines);

      // Handle buffer text
      let combinedBuffer = "";
      if (buffer_diarization) {
        combinedBuffer += isFinalizing
          ? buffer_diarization.trim()
          : buffer_diarization;
      }
      if (buffer_transcription) {
        combinedBuffer += isFinalizing
          ? buffer_transcription.trim()
          : buffer_transcription;
      }
      setBufferText(combinedBuffer);
    },
    [t, updateSpeakers]
  );

  // Start recording function
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      microphoneRef.current =
        audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);

      recorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      recorderRef.current.ondataavailable = (e) => {
        if (
          websocketRef.current &&
          websocketRef.current.readyState === WebSocket.OPEN
        ) {
          websocketRef.current.send(e.data);
        }
      };
      recorderRef.current.start(chunkDuration);

      startTimeRef.current = Date.now();
      timerIntervalRef.current = window.setInterval(updateTimer, 1000);

      setIsRecording(true);
      setStatus(t("liveStream.status.recording"));
    } catch (err) {
      setStatus(t("errors.microphoneAccess"));
      console.error(err);
    }
  }, [chunkDuration, updateTimer, t]);

  // Stop recording function
  const stopRecording = useCallback(() => {
    setWaitingForStop(true);

    if (
      websocketRef.current &&
      websocketRef.current.readyState === WebSocket.OPEN
    ) {
      const emptyBlob = new Blob([], { type: "audio/webm" });
      websocketRef.current.send(emptyBlob);
      setStatus(t("liveStream.status.stopped"));
    }

    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }

    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }

    if (analyserRef.current) {
      analyserRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        audioContextRef.current.close();
      } catch (e) {
        console.warn("Could not close audio context:", e);
      }
      audioContextRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setRecordingTime("00:00");
    startTimeRef.current = null;
    setIsRecording(false);
    setActiveSpeakerId(null);
  }, [t]);

  // Toggle recording function
  const toggleRecording = useCallback(async () => {
    if (!isRecording) {
      if (waitingForStop) return;

      try {
        if (
          websocketRef.current &&
          websocketRef.current.readyState === WebSocket.OPEN
        ) {
          await startRecording();
        } else {
          await setupWebSocket();
          await startRecording();
        }
      } catch (err) {
        setStatus(t("liveStream.status.error"));
        console.error(err);
      }
    } else {
      stopRecording();
    }
  }, [
    isRecording,
    waitingForStop,
    startRecording,
    setupWebSocket,
    stopRecording,
    t,
  ]);

  // End call function
  const handleEndCall = useCallback(() => {
    if (isRecording) {
      stopRecording();
    }
    if (websocketRef.current) {
      websocketRef.current.close();
    }
    setSpeakers([]);
    setTranscriptLines([]);
    setBufferText("");
    setActiveSpeakerId(null);
    navigate("/translate");
  }, [isRecording, stopRecording, navigate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const getSpeakerColor = (speaker: number) => {
    return (
      speakerColors[(speaker - 1) % speakerColors.length] || "bg-[#757575]"
    );
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#F5F5F5] flex flex-col">
      {/* Header */}
      <div className="bg-[#1E1E1E] px-4 sm:px-6 lg:px-8 py-4 border-b border-[#333]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="text"
              onClick={() => navigate("/translate")}
              className="text-[#BB86FC] hover:text-[#A070DA] p-2"
            >
              <ArrowLeft size={20} className={isRTL ? "rotate-180" : ""} />
            </Button>
            <div>
              <h1 className="text-xl font-bold">{t("liveStream.title")}</h1>
              <div className="flex items-center gap-2 text-sm text-[#757575]">
                {isConnected ? (
                  <>
                    <Wifi size={14} className="text-[#03DAC6]" />
                    <span>{t("liveStream.connected")}</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={14} className="text-[#CF6679]" />
                    <span>{t("liveStream.disconnected")}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="text"
              onClick={() => setShowSettings(!showSettings)}
              className="text-[#757575] hover:text-[#BB86FC] p-2"
            >
              <Settings size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#1E1E1E] border-b border-[#333] overflow-hidden"
          >
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                    {t("liveStream.chunkSize")}
                  </label>
                  <select
                    value={chunkDuration}
                    onChange={(e) => setChunkDuration(parseInt(e.target.value))}
                    className="w-full bg-[#2A2A2A] text-[#F5F5F5] rounded-lg px-3 py-2 border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#BB86FC]"
                  >
                    <option value={500}>500 ms</option>
                    <option value={1000}>1000 ms</option>
                    <option value={2000}>2000 ms</option>
                    <option value={3000}>3000 ms</option>
                    <option value={4000}>4000 ms</option>
                    <option value={5000}>5000 ms</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#CCCCCC] mb-2">
                    {t("liveStream.websocketUrl")}
                  </label>
                  <input
                    type="text"
                    value={websocketUrl}
                    onChange={(e) => setWebsocketUrl(e.target.value)}
                    className="w-full bg-[#2A2A2A] text-[#F5F5F5] rounded-lg px-3 py-2 border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#BB86FC]"
                    placeholder="ws://localhost:8000/asr"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side - Speakers */}
        <div className="lg:w-1/3 bg-[#1E1E1E] p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-[#333]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users size={20} className="text-[#BB86FC]" />
              {t("liveStream.speakers")} ({speakers.length})
            </h2>

            {/* Recording Status */}
            <div className="flex items-center gap-2">
              {isRecording && (
                <>
                  <div className="w-2 h-2 bg-[#CF6679] rounded-full animate-pulse"></div>
                  <span className="text-xs text-[#CF6679] font-medium">
                    {recordingTime}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Speaker Cards */}
          <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hidden">
            {speakers.length === 0 ? (
              <div className="text-center text-[#757575] py-8">
                <User size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-sm">{t("liveStream.startRecording")}</p>
              </div>
            ) : (
              speakers.map((speaker) => (
                <motion.div
                  key={speaker.id}
                  ref={(el) => (speakerRefs.current[speaker.id] = el)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: speaker.isActive ? 1.02 : 1,
                  }}
                  transition={{
                    duration: 0.3,
                    scale: { duration: 0.2 },
                  }}
                  className={`
                    relative bg-[#2A2A2A] rounded-xl p-4 border-2 transition-all duration-300
                    ${
                      speaker.isActive
                        ? "border-[#BB86FC] shadow-lg shadow-[#BB86FC]/30 bg-[#2A2A2A]/80"
                        : "border-[#333]"
                    }
                  `}
                >
                  {/* Speaker Avatar and Info */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-white font-bold
                      ${speaker.color}
                      ${
                        speaker.isActive
                          ? "animate-pulse ring-2 ring-[#BB86FC] ring-opacity-50"
                          : ""
                      }
                    `}
                    >
                      {speaker.id}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-[#F5F5F5]">
                        {speaker.name}
                      </h3>
                    </div>

                    {/* Audio Waveform for Active Speaker */}
                    {speaker.isActive && (
                      <AudioWaveform
                        isActive={true}
                        size="sm"
                        className="w-16"
                      />
                    )}
                  </div>

                  {/* Active Indicator */}
                  {speaker.isActive && (
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 bg-[#03DAC6] rounded-full animate-pulse shadow-lg shadow-[#03DAC6]/50"></div>
                    </div>
                  )}

                  {/* Glow effect for active speaker */}
                  {speaker.isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#BB86FC]/10 to-[#03DAC6]/10 pointer-events-none"></div>
                  )}
                </motion.div>
              ))
            )}
          </div>

          {/* Recording Controls */}
          <div className="mt-8 space-y-4">
            <motion.button
              onClick={toggleRecording}
              disabled={waitingForStop}
              className={`
                w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl
                transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#BB86FC]
                ${
                  isRecording
                    ? "bg-[#CF6679] hover:bg-[#B85A6B] text-white"
                    : "bg-[#BB86FC] hover:bg-[#A070DA] text-white"
                }
                ${
                  waitingForStop
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
              `}
              whileTap={{ scale: 0.95 }}
            >
              {isRecording ? (
                <>
                  <div className="w-4 h-4 bg-white rounded-sm" />
                  <span className="font-medium">
                    {t("translation.stopRecording")}
                  </span>
                </>
              ) : (
                <>
                  <Mic size={20} />
                  <span className="font-medium">
                    {t("translation.startRecording")}
                  </span>
                </>
              )}
            </motion.button>

            <Button
              onClick={handleEndCall}
              variant="secondary"
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[#CF6679] hover:bg-[#B85A6B] text-white border-none"
            >
              <PhoneOff size={20} />
              <span className="font-medium">{t("liveStream.endCall")}</span>
            </Button>
          </div>

          {/* Status */}
          <div className="mt-4 text-center">
            <p className="text-sm text-[#CCCCCC]">{status}</p>
          </div>
        </div>

        {/* Right Side - Transcript */}
        <div className="flex-1 p-4 sm:p-6">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Volume2 size={20} className="text-[#BB86FC]" />
                {t("liveStream.liveTranscript")}
              </h2>

              {isRecording && (
                <div className="flex items-center gap-2 text-sm text-[#757575]">
                  <Clock size={16} />
                  <span>
                    {t("liveStream.recordingTime")}: {recordingTime}
                  </span>
                </div>
              )}
            </div>

            {/* Transcript Content */}
            <div className="flex-1 bg-[#1E1E1E] rounded-2xl p-6 overflow-hidden">
              <div className="h-full overflow-y-auto scrollbar-hidden space-y-4">
                {transcriptLines.length === 0 && !bufferText ? (
                  <div className="h-full flex items-center justify-center text-center text-[#757575]">
                    <div>
                      <Mic size={48} className="mx-auto mb-4 opacity-50" />
                      <p>{t("liveStream.startRecording")}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Display each line separately for line-by-line effect */}
                    {transcriptLines.map((line, index) => (
                      <motion.div
                        key={`${line.speaker}-${index}-${line.beg}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.1, // Stagger animation for each line
                        }}
                        className="space-y-2"
                      >
                        {/* Speaker Label */}
                        <div className="flex items-center gap-2">
                          {line.speaker === -2 ? (
                            <span className="px-3 py-1 bg-[#2A2A2A] text-[#757575] rounded-full text-xs">
                              {t("liveStream.silence")}
                            </span>
                          ) : line.speaker === -1 ? (
                            <span
                              className={`px-3 py-1 ${getSpeakerColor(
                                1
                              )} text-white rounded-full text-xs font-medium`}
                            >
                              {t("liveStream.speaker")} 1
                            </span>
                          ) : line.speaker > 0 ? (
                            <span
                              className={`px-3 py-1 ${getSpeakerColor(
                                line.speaker
                              )} text-white rounded-full text-xs font-medium shadow-lg`}
                            >
                              {t("liveStream.speaker")} {line.speaker}
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-[#757575] text-white rounded-full text-xs">
                              {t("liveStream.processing")}
                            </span>
                          )}

                          {line.beg !== undefined && line.end !== undefined && (
                            <span className="text-xs text-[#757575]">
                              {line.beg}s - {line.end}s
                            </span>
                          )}
                        </div>

                        {/* Transcript Text - Each line displayed separately */}
                        {line.text && (
                          <motion.div
                            className="pl-4 border-l-2 border-[#333]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <p className="text-[#F5F5F5] leading-relaxed rtl:text-right">
                              {line.text}
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}

                    {/* Buffer Text - Live typing effect */}
                    {bufferText && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="pl-4 border-l-2 border-[#BB86FC] border-dashed"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-[#BB86FC] text-white rounded-full text-xs">
                            Live
                          </span>
                          <div className="w-2 h-2 bg-[#BB86FC] rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-[#CCCCCC] italic rtl:text-right">
                          {bufferText}
                        </p>
                      </motion.div>
                    )}

                    {/* Auto-scroll anchor */}
                    <div ref={transcriptEndRef} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
