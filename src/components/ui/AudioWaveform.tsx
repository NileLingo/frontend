import React from 'react';
import { motion } from 'framer-motion';

interface AudioWaveformProps {
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isActive = false,
  size = 'md',
  className = '',
}) => {
  const numberOfBars = 15;
  const bars = Array.from({ length: numberOfBars });
  
  const sizeStyles = {
    sm: {
      containerHeight: 'h-12',
      barWidth: 'w-1',
      spacing: 'gap-[2px]'
    },
    md: {
      containerHeight: 'h-16',
      barWidth: 'w-1.5',
      spacing: 'gap-[3px]'
    },
    lg: {
      containerHeight: 'h-20',
      barWidth: 'w-2',
      spacing: 'gap-1'
    }
  };
  
  const { containerHeight, barWidth, spacing } = sizeStyles[size];
  
  // Initial random heights for all bars
  const initialHeights = bars.map(() => `${Math.random() * 40 + 10}%`);
  
  return (
    <div className={`flex items-center ${containerHeight} ${spacing} ${className}`}>
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className={`${barWidth} rounded-full ${isActive ? 'bg-[#BB86FC]' : 'bg-[#757575]'}`}
          initial={{ height: initialHeights[i] }}
          animate={{
            height: isActive 
              ? [
                  `${Math.random() * 40 + 10}%`,
                  `${Math.random() * 60 + 20}%`,
                  `${Math.random() * 80 + 40}%`,
                  `${Math.random() * 60 + 20}%`,
                  `${Math.random() * 40 + 10}%`
                ]
              : initialHeights[i]
          }}
          transition={{
            duration: isActive ? 0.8 : 0.3,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default AudioWaveform;