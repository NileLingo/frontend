import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import AudioWaveform from '../components/ui/AudioWaveform';
import { Play, Bot, Mic } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#121212] text-[#F5F5F5] px-24 py-6 ">
      {/* Navigation */}
      <nav className="flex items-center justify-between">
        <h1 className="text-xl font-bold">NILELINGU</h1>
        <div className="flex items-center space-x-8">
          <a href="#research" className="text-[#F5F5F5] hover:text-[#BB86FC] transition-colors">Research</a>
          <a href="#products" className="text-[#F5F5F5] hover:text-[#BB86FC] transition-colors">Products</a>
          <a href="#safety" className="text-[#F5F5F5] hover:text-[#BB86FC] transition-colors">Safety</a>
          <a href="#company" className="text-[#F5F5F5] hover:text-[#BB86FC] transition-colors">Company</a>
        </div>
          <Button 
            variant="primary"
            onClick={() => navigate('/translate')}
          >
            Try it now !
          </Button>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-[#1E1E1E] rounded-3xl mx-6 mt-8 px-12 py-24">
        <div className="grid grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-bold mb-4">
              Break Language<br />
              Barriers Instantly!
            </h2>
            <p className="text-xl text-[#CCCCCC] mb-8">
              Translate Egyptian Arabic to<br />
              English with AI-powered accuracy
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
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center"
          >
            <div className="relative">
              <div className="flex items-center space-x-4 mb-8">
                <Play size={32} className="text-[#BB86FC]" />
                <AudioWaveform isActive={true} size="lg" className="w-48" />
              </div>
              <div className="flex space-x-2">
                <span className="px-4 py-1 bg-[#757575] rounded-full text-sm">Egy arabic</span>
                <span className="px-4 py-1 bg-[#F5F5F5] text-[#121212] rounded-full text-sm">English</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24">
        <div className="grid grid-cols-1 gap-12">
          {/* AI-Powered Accuracy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-start justify-between"
          >
            <div className="max-w-md">
              <h3 className="text-3xl font-bold mb-4">AI-Powered Accuracy</h3>
              <p className="text-[#CCCCCC]">
                The translation engine is trained on large datasets to ensure accurate translations between Egyptian Arabic and English.
              </p>
            </div>
            <div className="w-32 h-32 bg-[#BB86FC] rounded-2xl flex items-center justify-center">
              <Bot size={50} className="text-[#121212]" />
            </div>
          </motion.div>

          {/* Text-to-Speech Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-start justify-between"
          >
            <div className="w-32 h-32 bg-[#BB86FC] rounded-2xl flex items-center justify-center">
              <Mic size={50} className="text-[#121212]" />
            </div>
            <div className="max-w-md">
              <h3 className="text-3xl font-bold mb-4">Text-to-Speech Support</h3>
              <p className="text-[#CCCCCC]">
                Users can listen to both the input text and the translated output using AI-powered speech synthesis, helping with pronunciation and learning.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;