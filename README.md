# NileLingo

Break Language Barriers Instantly!

AI-powered translation between Egyptian Arabic and English with text and speech support.

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)

---

## Features

### Text Translation

- **Bidirectional Translation**: Seamlessly translate between Egyptian Arabic and English
- **Real-time Translation**: Instant translation as you type
- **AI-Powered Accuracy**: Advanced neural machine translation for precise results

### Speech-to-Speech Translation

- **Voice Recording**: Record audio directly in the browser
- **Audio File Upload**: Support for various audio formats (WAV, MP3, OGG)
- **Custom Voice Cloning**: Add and use custom speaker voices
- **Text-to-Speech**: Generate natural-sounding speech from translated text

### Live Conversation Mode

- **Real-time Transcription**: Live speech-to-text conversion
- **Live Translation**: Real-time speech translation with WebSocket support
- **Speaker Diarization**: Automatic speaker identification and separation
- **Configurable Modes**: Choose between transcription-only or translation modes

### User Management

- **User Authentication**: Secure login and registration system
- **Translation History**: Save and manage translation history
- **Favorites**: Mark important translations as favorites
- **Personalized Experience**: User-specific settings and preferences

### Internationalization

- **RTL Support**: Full right-to-left language support for Arabic
- **Bilingual Interface**: Switch between English and Arabic UI
- **Responsive Design**: Optimized for all device sizes

---

## Tech Stack

### Frontend

- React 18.3.1 - Modern React with hooks and functional components
- TypeScript - Type-safe development
- Redux Toolkit - State management
- React Router - Client-side routing
- Tailwind CSS - Utility-first CSS framework
- Framer Motion - Smooth animations and transitions
- React i18next - Internationalization framework

---

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Setup

1. Clone the repository

   ```bash
   git clone https://github.com/NileLingo/frontend
   cd frontend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Configure environment

   - Update the API URL in `src/utils/constants.ts`

   ```ts
   export const api_url = "your-backend-api-url";
   ```

4. Start development server

   ```bash
   npm run dev
   ```

5. Open your browser at `http://localhost:5173`

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/             # Base UI components
├── features/           # Feature-based modules
│   ├── auth/          # Authentication logic
│   └── translation/   # Translation logic
├── i18n/              # Internationalization
│   └── locales/       # Translation files
├── pages/             # Page components
├── services/          # API services
├── store/             # Redux store configuration
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

---

## Usage

### Basic Translation

1. Navigate to the Translation Page (`/translate`)
2. Type your text in the source language area
3. Press Enter or click the send button
4. Click the speaker icon to hear the translation

### Voice Translation

1. Click the microphone icon to start recording
2. Click again to stop and process
3. View both transcription and translation
4. Click play to hear the translated speech

### Custom Voice Cloning

1. Click the voice selector in translation mode
2. Click "Add New Voice"
3. Upload a clear audio sample (WAV, MP3, OGG)
4. Name your custom voice
5. Select and use the custom voice

### Live Conversation Mode

1. Click "Join room" from the translation page
2. Configure settings:
   - Select target language
   - Adjust chunk size and WebSocket URL
3. Click record to begin
4. See real-time transcription and translation with speaker identification


---

## Supported Languages

- English (ENG) – Full support for text and speech
- Egyptian Arabic (EGY) – Native dialect support with cultural context

---

## Responsive Design

NileLingo is fully responsive and optimized for:

- Desktop
- Tablet
- Mobile

---


## Contributing

1. Fork the repository
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request

