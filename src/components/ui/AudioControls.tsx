import React, { useState } from 'react';
import { Mic, StopCircle, Play, Pause, Upload, RotateCcw } from 'lucide-react';
import Button from './Button';

interface AudioControlsProps {
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onPlay?: () => void;
  onUpload?: () => void;
  onReset?: () => void;
  isRecording?: boolean;
  isPlaying?: boolean;
  hasRecording?: boolean;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  onStartRecording,
  onStopRecording,
  onPlay,
  onUpload,
  onReset,
  isRecording = false,
  isPlaying = false,
  hasRecording = false,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
      {isRecording ? (
        <Button
          onClick={onStopRecording}
          variant="primary"
          className="flex items-center justify-center p-3 rounded-full"
          aria-label="Stop recording"
        >
          <StopCircle size={24} />
        </Button>
      ) : (
        <Button
          onClick={onStartRecording}
          variant={hasRecording ? "outline" : "primary"}
          className="flex items-center justify-center p-3 rounded-full"
          aria-label={hasRecording ? "Record again" : "Start recording"}
        >
          <MicWithPulse />
        </Button>
      )}
      
      {hasRecording && !isRecording && (
        <>
          <Button
            onClick={onPlay}
            variant="outline"
            className="flex items-center justify-center p-3 rounded-full"
            aria-label={isPlaying ? "Pause playback" : "Play recording"}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </Button>
          
          <Button
            onClick={onReset}
            variant="secondary"
            className="flex items-center justify-center p-3 rounded-full"
            aria-label="Reset recording"
          >
            <RotateCcw size={20} />
          </Button>
        </>
      )}
      
      {hasRecording && (
        <Button
          onClick={onUpload}
          variant="secondary"
          className="flex items-center justify-center p-3 rounded-full"
          aria-label="Upload recording"
        >
          <Upload size={20} />
        </Button>
      )}
    </div>
  );
};

// Extracted component for the pulsing mic icon
const MicWithPulse = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <Mic 
      size={24} 
      className={isHovering ? "animate-pulse" : ""}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    />
  );
};

export default AudioControls;