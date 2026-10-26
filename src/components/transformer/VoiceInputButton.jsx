import React, { useState, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { startAudioCapture, transcribeAudioBlob } from '../../lib/transcribeClient';

export default function VoiceInputButton({ onTranscript, disabled = false }) {
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const audioCaptureRef = useRef(null);
  const recognitionRef = useRef(null);
  const nativeTranscribedRef = useRef(false);

  const toggleListening = async () => {
    if (disabled || isTranscribing) return;

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);

      if (audioCaptureRef.current) {
        const audioBlob = await audioCaptureRef.current.stop();
        audioCaptureRef.current = null;

        if (nativeTranscribedRef.current) return;

        if (audioBlob && audioBlob.size > 200) {
          setIsTranscribing(true);
          try {
            const data = await transcribeAudioBlob(audioBlob, 'en');
            if (data?.transcript && onTranscript) {
              onTranscript(data.transcript);
            }
          } catch (err) {
            console.warn('VoiceInputButton transcribe error:', err);
          } finally {
            setIsTranscribing(false);
          }
        }
      }
      return;
    }

    nativeTranscribedRef.current = false;

    try {
      const capture = await startAudioCapture();
      audioCaptureRef.current = capture;
      setIsListening(true);
    } catch {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';

        recognition.onresult = (event) => {
          const transcript = event.results[0]?.[0]?.transcript;
          if (transcript && onTranscript) {
            nativeTranscribedRef.current = true;
            onTranscript(transcript);
            setIsListening(false);
          }
        };

        recognition.onerror = () => {
          // Opera gives network error; MediaRecorder handles it on stop
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch {}
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled || isTranscribing}
      aria-label={isTranscribing ? 'Transcribing audio' : isListening ? 'Stop listening' : 'Speak shopping list'}
      title={isTranscribing ? 'Transcribing...' : isListening ? 'Listening... click to stop' : 'Speak shopping list'}
      className={`p-2.5 rounded-xl transition cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-focus ${
        isTranscribing
          ? 'bg-amber-500/20 text-amber-600 border border-amber-500/30 animate-pulse'
          : isListening
          ? 'bg-rose-500/20 text-rose-600 border border-rose-500/30 animate-pulse'
          : 'bg-surface-sunken hover:bg-surface text-secondary hover:text-heading border border-line shadow-soft-xs'
      }`}
    >
      {isTranscribing ? (
        <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
      ) : isListening ? (
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
