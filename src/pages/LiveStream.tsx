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

const LiveStream: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("Click to start transcription");
  const [chunkDuration, setChunkDuration] = useState(1000);
  const [websocketUrl, setWebsocketUrl] = useState("");
  const [transcriptLines, setTranscriptLines] = useState<TranscriptLine[]>([]);
  const [bufferText, setBufferText] = useState("");
  const [recordingTime, setRecordingTime] = useState("00:00");
  const [showSettings, setShowSettings] = useState(false);
  const [waitingForStop, setWaitingForStop] = useState(false);

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

  // Initialize WebSocket URL
  useEffect(() => {
    const defaultUrl = `wss://content-seriously-tiger.ngrok-free.app:443/asr`;
    setWebsocketUrl(defaultUrl);
  }, []);

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

  // WebSocket setup
  const setupWebSocket = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        websocketRef.current = new WebSocket(websocketUrl);
      } catch (error) {
        setStatus("Invalid WebSocket URL. Please check and try again.");
        reject(error);
        return;
      }

      websocketRef.current.onopen = () => {
        setStatus("Connected to server.");
        setIsConnected(true);
        resolve();
      };

      websocketRef.current.onclose = () => {
        setIsConnected(false);
        if (waitingForStop) {
          setStatus("Processing finalized or connection closed.");
          if (lastReceivedDataRef.current) {
            renderTranscript(lastReceivedDataRef.current, true);
          }
        } else {
          setStatus("Disconnected from the WebSocket server.");
          if (isRecording) {
            stopRecording();
          }
        }
        setIsRecording(false);
        setWaitingForStop(false);
        websocketRef.current = null;
      };

      websocketRef.current.onerror = () => {
        setStatus("Error connecting to WebSocket.");
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
          setStatus("Finished processing audio! Ready to record again.");

          if (websocketRef.current) {
            websocketRef.current.close();
          }
          return;
        }

        lastReceivedDataRef.current = data;
        renderTranscript(data, false);
      };
    });
  }, [websocketUrl, waitingForStop, isRecording]);

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
        setBufferText("No audio detected...");
        return;
      }

      setTranscriptLines(lines);

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
    []
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
      setStatus("Recording...");
    } catch (err) {
      setStatus("Error accessing microphone. Please allow microphone access.");
      console.error(err);
    }
  }, [chunkDuration, updateTimer]);

  // Stop recording function
  const stopRecording = useCallback(() => {
    setWaitingForStop(true);

    if (
      websocketRef.current &&
      websocketRef.current.readyState === WebSocket.OPEN
    ) {
      const emptyBlob = new Blob([], { type: "audio/webm" });
      websocketRef.current.send(emptyBlob);
      setStatus("Recording stopped. Processing final audio...");
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
  }, []);

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
        setStatus("Could not connect to WebSocket or access mic. Aborted.");
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
  ]);

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
    const colors = [
      "bg-[#BB86FC]", // Primary purple
      "bg-[#03DAC6]", // Teal
      "bg-[#CF6679]", // Pink/Red
      "bg-[#FFC107]", // Amber
      "bg-[#4CAF50]", // Green
      "bg-[#FF9800]", // Orange
    ];
    return colors[speaker % colors.length] || "bg-[#757575]";
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#F5F5F5]">
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
              <h1 className="text-xl font-bold">Live Transcription</h1>
              <div className="flex items-center gap-2 text-sm text-[#757575]">
                {isConnected ? (
                  <>
                    <Wifi size={14} className="text-[#03DAC6]" />
                    <span>Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={14} className="text-[#CF6679]" />
                    <span>Disconnected</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Users size={16} className="text-[#757575]" />
              <span className="text-[#757575]">Live Session</span>
            </div>
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
                    Chunk Size (ms)
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
                    WebSocket URL
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
      <div className="flex-1 flex flex-col">
        {/* Recording Controls */}
        <div className="bg-[#1E1E1E] px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center gap-4">
            {/* Record Button */}
            <motion.button
              onClick={toggleRecording}
              disabled={waitingForStop}
              className={`
                relative flex items-center justify-center gap-4 px-6 py-3 rounded-full
                transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#BB86FC]
                ${
                  isRecording
                    ? "bg-[#CF6679] hover:bg-[#B85A6B] min-w-[200px]"
                    : "bg-[#BB86FC] hover:bg-[#A070DA] w-16 h-16"
                }
                ${
                  waitingForStop
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
              `}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-center">
                {isRecording ? (
                  <div className="w-6 h-6 bg-white rounded-sm" />
                ) : (
                  <Mic size={24} className="text-white" />
                )}
              </div>

              {isRecording && (
                <div className="flex items-center gap-3">
                  <AudioWaveform isActive={true} size="sm" className="w-16" />
                  <div className="flex items-center gap-2 text-white">
                    <Clock size={16} />
                    <span className="font-mono text-sm">{recordingTime}</span>
                  </div>
                </div>
              )}
            </motion.button>

            {/* Status */}
            <p className="text-center text-[#CCCCCC] text-sm">{status}</p>
          </div>
        </div>

        {/* Transcript Area */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1E1E1E] rounded-2xl p-6 min-h-[400px]">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Volume2 size={20} className="text-[#BB86FC]" />
                Live Transcript
              </h2>

              <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-hidden">
                {transcriptLines.length === 0 && !bufferText ? (
                  <div className="text-center text-[#757575] py-12">
                    <Mic size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Start recording to see live transcription</p>
                  </div>
                ) : (
                  <>
                    {transcriptLines.map((line, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        {/* Speaker Label */}
                        <div className="flex items-center gap-2">
                          {line.speaker === -2 ? (
                            <span className="px-3 py-1 bg-[#2A2A2A] text-[#757575] rounded-full text-xs">
                              Silence
                            </span>
                          ) : line.speaker === -1 ? (
                            <span
                              className={`px-3 py-1 ${getSpeakerColor(
                                1
                              )} text-white rounded-full text-xs font-medium`}
                            >
                              Speaker 1
                            </span>
                          ) : line.speaker > 0 ? (
                            <span
                              className={`px-3 py-1 ${getSpeakerColor(
                                line.speaker
                              )} text-white rounded-full text-xs font-medium`}
                            >
                              Speaker {line.speaker}
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-[#757575] text-white rounded-full text-xs">
                              Processing...
                            </span>
                          )}

                          {line.beg !== undefined && line.end !== undefined && (
                            <span className="text-xs text-[#757575]">
                              {line.beg}s - {line.end}s
                            </span>
                          )}
                        </div>

                        {/* Transcript Text */}
                        {line.text && (
                          <div className="pl-4 border-l-2 border-[#333]">
                            <p className="text-[#F5F5F5] leading-relaxed">
                              {line.text}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {/* Buffer Text */}
                    {bufferText && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="pl-4 border-l-2 border-[#BB86FC] border-dashed"
                      >
                        <p className="text-[#CCCCCC] italic">{bufferText}</p>
                      </motion.div>
                    )}
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
