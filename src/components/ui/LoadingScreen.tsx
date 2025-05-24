import React from "react";
import { motion } from "framer-motion";
import AudioWaveform from "./AudioWaveform";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Translating...",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="bg-[#1E1E1E] rounded-2xl p-8 flex flex-col items-center">
        <AudioWaveform isActive={true} size="lg" className="mb-4" />
        <p className="text-[#F5F5F5] text-lg">{message}</p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
