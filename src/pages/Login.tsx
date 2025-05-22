import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../features/auth/authSlice';
import { loginUser } from '../services/authService';
import { motion } from 'framer-motion';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';
import AudioWaveform from '../components/ui/AudioWaveform';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      dispatch(loginStart());
      const user = await loginUser(username, password);
      dispatch(loginSuccess(user));
      navigate('/translate');
    } catch (error) {
      dispatch(loginFailure(error instanceof Error ? error.message : 'Login failed'));
      setError(error instanceof Error ? error.message : 'Login failed');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#2A2A2A] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="bg-[#121212] rounded-lg overflow-hidden shadow-xl flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-[#BB86FC] mb-6">Login</h1>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <TextField
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  placeholder="Username"
                />
                
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  placeholder="Password"
                />
                
                {error && (
                  <p className="text-[#CF6679] text-sm">{error}</p>
                )}
                
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm text-[#BB86FC] hover:underline">
                    Forget password?
                  </Link>
                </div>
                
                <div className="flex items-center my-4">
                  <div className="flex-grow h-px bg-[#757575]"></div>
                  <span className="px-4 text-sm text-[#CCCCCC]">Or</span>
                  <div className="flex-grow h-px bg-[#757575]"></div>
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                >
                  Login
                </Button>
              </form>
            </motion.div>
          </div>
          
          <div className="hidden md:flex md:w-1/2 bg-[#1E1E1E] p-12 flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold text-[#F5F5F5] mb-6">Hello Friend</h2>
              
              <AudioWaveform isActive={false} className="my-8" />
              
              <p className="text-[#CCCCCC] mb-8">
                Already have an account?
              </p>
              
              <Button
                variant="outline"
                onClick={() => navigate('/register')}
                size="lg"
              >
                Login
              </Button>
            </motion.div>
          </div>
        </div>
        
        <div className="mt-6 text-center md:hidden">
          <p className="text-[#CCCCCC]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#BB86FC] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;