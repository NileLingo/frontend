import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerStart, registerSuccess, registerFailure } from '../features/auth/authSlice';
import { registerUser } from '../services/authService';
import { motion } from 'framer-motion';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';
import AudioWaveform from '../components/ui/AudioWaveform';

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!username) newErrors.username = 'Username is required';
    if (!email) newErrors.email = 'Email is required';
    if (!email.includes('@')) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      dispatch(registerStart());
      const user = await registerUser(username, email, password);
      dispatch(registerSuccess(user));
      navigate('/translate');
    } catch (error) {
      dispatch(registerFailure(error instanceof Error ? error.message : 'Registration failed'));
      setErrors({ form: error instanceof Error ? error.message : 'Registration failed' });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#2A2A2A] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="bg-[#121212] rounded-lg overflow-hidden shadow-xl flex flex-col md:flex-row">
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
                onClick={() => navigate('/login')}
                size="lg"
              >
                Login
              </Button>
            </motion.div>
          </div>
          
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-[#BB86FC] mb-6">Register</h1>
              
              <form onSubmit={handleRegister} className="space-y-4">
                <TextField
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={errors.username}
                  fullWidth
                  placeholder="Username"
                />
                
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  fullWidth
                  placeholder="Email"
                />
                
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  fullWidth
                  placeholder="Password"
                />
                
                <TextField
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                  fullWidth
                  placeholder="Confirm Password"
                />
                
                {errors.form && (
                  <p className="text-[#CF6679] text-sm">{errors.form}</p>
                )}
                
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
        </div>
        
        <div className="mt-6 text-center md:hidden">
          <p className="text-[#CCCCCC]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#BB86FC] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;