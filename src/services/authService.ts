import { User } from '../types';

// Mock authentication service until backend integration
export const loginUser = async (username: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simulate validation
  if (!username || !password) {
    throw new Error('Username and password are required');
  }
  
  if (password.length < 6) {
    throw new Error('Invalid credentials');
  }
  
  // Return mock user data
  return {
    id: '1',
    username: username,
    email: `${username}@example.com`
  };
};

export const registerUser = async (
  username: string, 
  email: string, 
  password: string
): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate validation
  if (!username || !email || !password) {
    throw new Error('All fields are required');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  if (!email.includes('@')) {
    throw new Error('Invalid email format');
  }
  
  // Return mock user data for newly registered user
  return {
    id: Math.random().toString(36).substring(2, 11),
    username,
    email
  };
};

export const logoutUser = async (): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would clear the session with the backend
  return;
};