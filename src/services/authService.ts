import { User } from '../types';

const API_URL = 'https://cf22-34-127-84-184.ngrok-free.app';

const headers = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true'
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    return {
      id: data.user_id,
      username: email.split('@')[0], // Using email prefix as username for now
      email
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (username: string, email: string, password: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    const data = await response.json();
    return {
      id: data.user_id,
      username,
      email
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};