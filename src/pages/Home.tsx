import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Navbar from '../components/ui/Navbar';
import AudioWaveform from '../components/ui/AudioWaveform';

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#121212] text-[#F5F5F5]">
      <Navbar />
      
      <main>
        <section className="relative bg-[#1E1E1E] py-16 rounded-b-lg overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Break Language Barriers Instantly!
                </h1>
                <p className="text-xl text-[#CCCCCC] mb-6">
                  Translate Egyptian Arabic to English with AI-powered accuracy
                </p>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => navigate('/translate')}
                >
                  Try it now !
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <AudioWaveform isActive={true} size="lg" className="mb-8" />
                  </motion.div>
                  
                  <div className="flex justify-center space-x-2 mb-6">
                    <div className="px-3 py-1 rounded-full bg-[#757575] text-xs text-[#121212]">
                      Egyptian
                    </div>
                    <div className="px-3 py-1 rounded-full bg-[#F5F5F5] text-xs text-[#121212]">
                      English
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-[#1E1E1E] p-8 rounded-lg max-w-md"
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-[#BB86FC] p-4 rounded-full">
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="w-8 h-8 text-[#121212]"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="10" r="3" />
                      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-center">AI-Powered Accuracy</h2>
                <p className="text-[#CCCCCC] text-center">
                  The translation engine is trained on large datasets to ensure accurate translations between Egyptian Arabic and English.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-[#1E1E1E] p-8 rounded-lg max-w-md"
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-[#BB86FC] p-4 rounded-full">
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="w-8 h-8 text-[#121212]"
                    >
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" x2="12" y1="19" y2="22" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-center">Text-to-Speech Support</h2>
                <p className="text-[#CCCCCC] text-center">
                  Users can listen to both the input text and the translated output using AI-powered speech synthesis, helping with pronunciation and learning.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;