import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

export default function VoiceInputButton({ onTranscript, disabled = false }) {
  const [isListening, setIsListening] = useState(false);
  const [supported] = useState(() => typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Supports English with Indian accent / Hinglish phrases

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript && onTranscript) {
          onTranscript(transcript);
        }
      };

      recognitionRef.current = recognition;
    }
  }, [onTranscript]);

  if (!supported) return null;

  const toggleListening = () => {
    if (!recognitionRef.current || disabled) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch {
        setIsListening(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      aria-label={isListening ? 'Stop listening' : 'Speak shopping list'}
      title={isListening ? 'Listening... click to stop' : 'Speak shopping list'}
      className={`p-2.5 rounded-xl transition cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-focus ${
        isListening
          ? 'bg-rose-500/20 text-rose-600 border border-rose-500/30 animate-pulse'
          : 'bg-surface-sunken hover:bg-surface text-secondary hover:text-heading border border-line shadow-soft-xs'
      }`}
    >
      {isListening ? (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <MicOff className="w-4 h-4" />
        </span>
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
}
