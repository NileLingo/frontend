import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import AudioWaveform from "../components/ui/AudioWaveform";
import { Play, Bot, Mic, Pause } from "lucide-react";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="min-h-screen bg-[#121212] text-[#F5F5F5] px-4 sm:px-8 md:px-12 lg:px-24 py-6">
      {/* Hero Section */}
      <section className="relative bg-[#1E1E1E] rounded-3xl mx-2 sm:mx-4 md:mx-6 mt-8 px-4 sm:px-8 md:px-12 py-12 md:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Break Language
              <br />
              Barriers Instantly!
            </h2>
            <p className="text-lg sm:text-xl text-[#CCCCCC] mb-6 sm:mb-8">
              Translate Egyptian Arabic to
              <br />
              English with AI-powered accuracy
            </p>
            <div className="flex justify-center lg:justify-start">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/translate")}
              >
                Try it now !
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mt-8 lg:mt-0"
          >
            <div className="relative">
              <div className="flex items-center justify-center space-x-4 mb-6 sm:mb-8">
                <button
                  onClick={() => setIsActive((prev) => !prev)}
                  className="focus:outline-none"
                  aria-label={isActive ? "Pause" : "Play"}
                >
                  {isActive ? (
                    <Pause size={32} className="text-[#BB86FC] animate-pulse" />
                  ) : (
                    <Play size={32} className="text-[#BB86FC]" />
                  )}
                </button>
                <AudioWaveform isActive={isActive} size="lg" className="w-40 sm:w-48" />
              </div>
              <div className="flex justify-center space-x-2">
                <span className="px-4 py-1 bg-[#757575] rounded-full text-sm">
                  Egy arabic
                </span>
                <span className="px-4 py-1 bg-[#F5F5F5] text-[#121212] rounded-full text-sm">
                  English
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-2 sm:px-4 md:px-6 py-12 md:py-16 lg:py-24">
        <div className="flex flex-col">
          {/* AI-Powered Accuracy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between mb-12 gap-8 lg:gap-0">
              <div className="max-w-md order-2 lg:order-1 text-center lg:text-left">
                <h3 className="text-3xl sm:text-4xl font-bold mb-4">AI-Powered Accuracy</h3>
                <p className="text-[#CCCCCC]">
                  The translation engine is trained on large datasets to ensure
                  accurate translations between Egyptian Arabic and English.
                </p>
              </div>
              <div className="w-40 h-40 sm:w-56 sm:h-56 bg-[#BB86FC] rounded-2xl flex items-center justify-center order-1 lg:order-2">
                <Bot size={80} className="text-white sm:w-100" />
              </div>
            </div>
          </motion.div>

          {/* Text-to-Speech Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between mt-12 md:mt-16 lg:mt-28 gap-8 lg:gap-0">
              <div className="w-40 h-40 sm:w-56 sm:h-56 bg-[#BB86FC] rounded-2xl flex items-center justify-center lg:order-1">
                <Mic size={80} className="text-white sm:w-100" />
              </div>
              <div className="max-w-md lg:order-2 text-center lg:text-left">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                  Text-to-Speech Support
                </h3>
                <p className="text-[#CCCCCC]">
                  Users can listen to both the input text and the translated
                  output using AI-powered speech synthesis, helping with
                  pronunciation and learning.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;