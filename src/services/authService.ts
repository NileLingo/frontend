import axios from "axios";
import { User } from "../types";

const API_URL = "https://8fdf-34-125-131-93.ngrok-free.app";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const response = await axiosInstance.post("/login", { email, password });

    const user = {
      id: response.data.user_id,
      username: email.split("@")[0],
      email,
    };

    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.detail || "Login failed";
      console.error("Login error:", errorMessage);
      throw new Error(errorMessage);
    }
    console.error("Login error:", error);
    throw error;
  }
};

export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<User> => {
  try {
    const response = await axiosInstance.post("/register", {
      username,
      email,
      password,
    });

    const user = {
      id: response.data.user_id,
      username,
      email,
    };

    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.detail || "Registration failed";
      console.error("Registration error:", errorMessage);
      throw new Error(errorMessage);
    }
    console.error("Registration error:", error);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("user");
};