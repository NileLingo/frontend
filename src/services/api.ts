import { Language } from "../types";

const API_URL = "https://cf22-34-127-84-184.ngrok-free.app";

const headers = {
  "ngrok-skip-browser-warning": "true",
};

export const translateText = async (
  text: string,
  srcLang: Language,
  tgtLang: Language,
  userId: string
) => {
  try {
    const response = await fetch(`${API_URL}/translate-text`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        src_lang: srcLang === "ENG" ? "en" : "ar",
        tgt_lang: tgtLang === "ENG" ? "en" : "ar",
        user_id: userId,
      }),
    });

    if (!response.ok) {
      throw new Error("Translation failed");
    }

    const data = await response.json();
    return data.translated_text;
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
};

export const translateAndSpeak = async (
  text: string,
  srcLang: Language,
  tgtLang: Language,
  userId: string
) => {
  try {
    const response = await fetch(`${API_URL}/translate-and-speak`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        src_lang: srcLang === "ENG" ? "en" : "ar",
        tgt_lang: tgtLang === "ENG" ? "en" : "ar",
        user_id: userId,
      }),
    });

    if (!response.ok) {
      throw new Error("Translation and speech generation failed");
    }

    const audioBlob = await response.blob();
    const translatedText = response.headers.get("Translated-Text");
    const translationId = response.headers.get("Translation-Id");

    return {
      audio: URL.createObjectURL(audioBlob),
      translatedText: translatedText ? atob(translatedText) : "",
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

    const response = await fetch(`${API_URL}/speech-to-speech`, {
      method: "POST",
      headers: {
        ...headers,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Speech-to-speech translation failed");
    }

    const responseAudioBlob = await response.blob();
    const originalText = response.headers.get("Original-Text");
    const translatedText = response.headers.get("Translated-Text");
    const translationId = response.headers.get("Translation-Id");

    return {
      audio: URL.createObjectURL(responseAudioBlob),
      originalText: originalText ? atob(originalText) : "",
      translatedText: translatedText ? atob(translatedText) : "",
      translationId,
    };
  } catch (error) {
    console.error("Speech-to-speech error:", error);
    throw error;
  }
};

export const generateSpeech = async (text: string, language: Language) => {
  try {
    const response = await fetch(`${API_URL}/generate-speech`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        output_lang: language === "ENG" ? "en" : "ar",
      }),
    });

    if (!response.ok) {
      throw new Error("Speech generation failed");
    }

    const audioBlob = await response.blob();
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

    const response = await fetch(`${API_URL}/transcribe`, {
      method: "POST",
      headers: {
        ...headers,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Audio transcription failed");
    }

    const data = await response.json();
    return data.transcription;
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
};

export const getUserTranslations = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/user/${userId}/translations`, {
      headers: {
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch translations");
    }

    const data = await response.json();
    return data.translations;
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
    const response = await fetch(
      `${API_URL}/user/${userId}/translations/${translationId}/toggle-favorite`,
      {
        method: "PUT",
        headers: {
          ...headers,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to toggle favorite status");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Toggle favorite error:", error);
    throw error;
  }
};
