import axios from "axios";
import { Language } from "../types";

const API_URL = "https://8fdf-34-125-131-93.ngrok-free.app";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

export const translateText = async (
  text: string,
  srcLang: Language,
  tgtLang: Language,
  userId: string
) => {
  try {
    const response = await axiosInstance.post("/translate-text", {
      text,
      src_lang: srcLang === "ENG" ? "en" : "ar",
      tgt_lang: tgtLang === "ENG" ? "en" : "ar",
      user_id: userId,
    });

    return response.data.translated_text;
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
};

// Helper function to decode base64
const decodeBase64 = (encodedString: string): string => {
  try {
    // First decode the base64 to get the UTF-8 bytes, then decode those bytes to a string
    return decodeURIComponent(escape(atob(encodedString)));
  } catch (error) {
    console.error("Error decoding base64 string:", error);
    return encodedString; // Return original if decoding fails
  }
};

export const translateAndSpeak = async (
  text: string,
  srcLang: Language,
  tgtLang: Language,
  userId: string
) => {
  try {
    const response = await axiosInstance.post(
      "/translate-and-speak",
      {
        text,
        src_lang: srcLang === "ENG" ? "en" : "ar",
        tgt_lang: tgtLang === "ENG" ? "en" : "ar",
        user_id: userId,
      },
      {
        responseType: "blob",
      }
    );

    const translatedText = response.headers["translated-text"];
    const translationId = response.headers["translation-id"];

    return {
      audio: URL.createObjectURL(response.data),
      translatedText: translatedText ? decodeBase64(translatedText) : "",
      translationId,
    };
  } catch (error) {
    console.error("Translation and speech error:", error);
    throw error;
  }
};

export const speechToSpeech = async (
  audioBlob: Blob,
  srcLang: Language,
  tgtLang: Language,
  userId: string
) => {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append("src_lang", srcLang === "ENG" ? "en" : "ar");
    formData.append("tgt_lang", tgtLang === "ENG" ? "en" : "ar");
    formData.append("user_id", userId);

    const response = await axiosInstance.post("/speech-to-speech", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "blob",
    });

    const originalText = response.headers["original-text"];
    const translatedText = response.headers["translated-text"];
    const translationId = response.headers["translation-id"];
    console.log("originalText", originalText);
    return {
      audio: URL.createObjectURL(response.data),
      originalText: originalText ? decodeBase64(originalText) : "",
      translatedText: translatedText ? decodeBase64(translatedText) : "",
      translationId,
    };
  } catch (error) {
    console.error("Speech-to-speech error:", error);
    throw error;
  }
};

export const generateSpeech = async (text: string, language: Language) => {
  try {
    const response = await axiosInstance.post(
      "/generate-speech",
      {
        text,
        output_lang: language === "ENG" ? "en" : "ar",
      },
      {
        responseType: "blob",
      }
    );

    const audioBlob = response.data;
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error("Speech generation error:", error);
    throw error;
  }
};

export const transcribeAudio = async (audioBlob: Blob, language: Language) => {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append("output_lang", language === "ENG" ? "en" : "ar");

    const response = await axiosInstance.post("/transcribe", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.transcription;
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
};

export const getUserTranslations = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/user/${userId}/translations`);
    return response.data.translations;
  } catch (error) {
    console.error("Get translations error:", error);
    throw error;
  }
};

export const toggleTranslationFavorite = async (
  userId: string,
  translationId: string
) => {
  try {
    const response = await axiosInstance.put(
      `/user/${userId}/translations/${translationId}/toggle-favorite`
    );
    return response.data;
  } catch (error) {
    console.error("Toggle favorite error:", error);
    throw error;
  }
};