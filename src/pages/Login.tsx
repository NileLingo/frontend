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
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#2A2A2A] to-[#BB86FC] flex">
      {/* Left Side - Welcome Back */}
      <div className="hidden lg:flex flex-1 p-12 flex-col justify-center items-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center z-10"
        >
          <h2 className="text-6xl font-bold text-[#F5F5F5] mb-12">Welcome Back</h2>
          <AudioWaveform isActive={false} size="lg" className="mb-12 opacity-40" />
          <p className="text-[#F5F5F5] mb-8">Don't have an account?</p>
          <Button
            variant="outline"
            onClick={() => navigate('/register')}
            size="lg"
            className="min-w-[200px] border-[#F5F5F5] text-[#F5F5F5]"
          >
            Signup
          </Button>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-[#1E1E1E] p-12 rounded-2xl"
        >
          <h1 className="text-4xl font-bold text-[#BB86FC] mb-12">Login</h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <TextField
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              fullWidth
              variant="outlined"
            />
            
            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              fullWidth
              variant="outlined"
            />
            
            <div className="flex justify-end">
              <Link 
                to="/forgot-password" 
                className="text-[#F5F5F5] hover:text-[#BB86FC] transition-colors"
              >
                Forget password?
              </Link>
            </div>
            
            {error && (
              <p className="text-[#CF6679] text-sm">{error}</p>
            )}
            
            <div className="flex items-center my-8">
              <div className="flex-grow h-px bg-[#F5F5F5] opacity-40"></div>
              <span className="px-4 text-[#F5F5F5]">Or</span>
              <div className="flex-grow h-px bg-[#F5F5F5] opacity-40"></div>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              className="bg-[#BB86FC] text-[#F5F5F5]"
            >
              Login
            </Button>
          </form>

          <div className="mt-8 text-center lg:hidden">
            <p className="text-[#F5F5F5]">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#BB86FC] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;