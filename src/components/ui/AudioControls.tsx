import React, { useState } from 'react';
import { Mic, StopCircle, Play, Upload, RotateCcw } from 'lucide-react';
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
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
      {isRecording ? (
        <Button
          onClick={onStopRecording}
          variant="primary"
          className="flex items-center justify-center p-3 rounded-full"
        >
          <StopCircle size={24} />
        </Button>
      ) : (
        <Button
          onClick={onStartRecording}
          variant={hasRecording ? "outline" : "primary"}
          className="flex items-center justify-center p-3 rounded-full"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Mic size={24} className={isHovering ? "animate-pulse" : ""} />
        </Button>
      )}
      
      {hasRecording && !isRecording && (
        <>
          <Button
            onClick={onPlay}
            variant="outline"
            className="flex items-center justify-center p-3 rounded-full"
          >
            <Play size={24} />
          </Button>
          
          <Button
            onClick={onReset}
            variant="secondary"
            className="flex items-center justify-center p-3 rounded-full"
          >
            <RotateCcw size={20} />
          </Button>
        </>
      )}
      
      <Button
        onClick={onUpload}
        variant="secondary"
        className="flex items-center justify-center p-3 rounded-full"
      >
        <Upload size={20} />
      </Button>
    </div>
  );
};

export default AudioControls;