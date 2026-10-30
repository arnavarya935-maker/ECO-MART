import React, { useState, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { startAudioCapture, transcribeAudioBlob } from '../../lib/transcribeClient';

const VOICE_PRESETS = {
  hinglish: [
    { label: 'Plastic-free kitchen under 800', prompt: 'Show me plastic-free kitchen items under 800 rupees' },
    { label: 'Mujhe bamboo toothbrush dikhao', prompt: 'Mujhe bamboo toothbrush aur zero-waste bath items dikhao' },
    { label: 'Lowest carbon gifts under 1500', prompt: 'Find the lowest carbon gifts under 1500 rupees' },
    { label: 'Kaunse products compostable hain?', prompt: 'Which products in the catalog are 100% home compostable?' }
  ],
  hindi: [
    { label: 'बिना प्लास्टिक वाला किचन सामान', prompt: 'मुझे प्लास्टिक-मुक्त रसोई का सामान दिखाइए' },
    { label: 'बांस का टूथब्रश दिखाओ', prompt: 'बांस का टूथब्रश और प्राकृतिक साबुन दिखाइए' },
    { label: 'कम कार्बन वाले पर्यावरण-अनुकूल उपहार', prompt: '१००० रुपये के अंदर सबसे कम कार्बन वाले उपहार दिखाइए' }
  ]
};

export default function VoiceShoppingModal({ isOpen, onClose }) {
  const [lang, setLang] = useState('hinglish'); // 'hinglish' | 'hindi'
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Tap the microphone to speak or choose a voice prompt.');
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const [isTranscribing, setIsTranscribing] = useState(false);
  const recognitionRef = useRef(null);
  const audioCaptureRef = useRef(null);
  const nativeTranscribedRef = useRef(false);

  const speakText = (text) => {
    if (!ttsEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hindi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  const startListening = async () => {
    if (typeof window === 'undefined') return;
    setTranscript('');
    nativeTranscribedRef.current = false;

    // 1. Start audio capture with HTML5 MediaRecorder (universal support across Opera, Chrome, Edge, Safari, Firefox)
    try {
      const capture = await startAudioCapture();
      audioCaptureRef.current = capture;
      setIsListening(true);
      setStatusMessage(
        lang === 'hindi'
          ? '🎙️ सुन रहा हूँ... बोलिए (रोकने के लिए माइक दबाएं)'
          : '🎙️ Listening... Speak now (Tap mic when done)'
      );
    } catch (permErr) {
      if (permErr?.name === 'NotAllowedError' || permErr?.name === 'PermissionDeniedError') {
        setStatusMessage(
          lang === 'hindi'
            ? 'माइक्रोफ़ोन की अनुमति अस्वीकृत। ब्राउज़र में अनुमति दें।'
            : 'Microphone access denied. Please allow microphone in browser URL bar.'
        );
        return;
      }
      setStatusMessage(
        lang === 'hindi'
          ? 'माइक शुरू नहीं हो सका। नीचे दिए गए सुझावों में से चुनें।'
          : 'Microphone unavailable. Please click a preset prompt below.'
      );
      return;
    }

    // 2. In parallel, attempt native SpeechRecognition (for real-time streaming in Chrome / Edge)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }

        const recognition = new SpeechRecognition();
        recognition.lang = lang === 'hindi' ? 'hi-IN' : 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          const text = Array.from(event.results)
            .map((r) => r[0].transcript)
            .join('');
          if (text) {
            nativeTranscribedRef.current = true;
            setTranscript(text);
          }
        };

        recognition.onerror = (event) => {
          console.warn('Native SpeechRecognition error:', event?.error);
          // In Opera, event.error === 'network' is expected; MediaRecorder handles it on stop
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.warn('Native SpeechRecognition start error:', err);
      }
    }
  };

  const stopListening = async () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);

    if (audioCaptureRef.current) {
      const audioBlob = await audioCaptureRef.current.stop();
      audioCaptureRef.current = null;

      if (nativeTranscribedRef.current && transcript) {
        handleExecuteVoiceQuery(transcript);
        return;
      }

      if (audioBlob && audioBlob.size > 200) {
        setIsTranscribing(true);
        setStatusMessage(
          lang === 'hindi'
            ? '⚡ AI से आवाज़ को समझा जा रहा है...'
            : '⚡ Transcribing voice with AI Audio...'
        );
        try {
          const res = await transcribeAudioBlob(audioBlob, lang === 'hindi' ? 'hi' : 'en');
          if (res?.transcript && res.transcript.trim()) {
            setTranscript(res.transcript.trim());
            setStatusMessage(
              lang === 'hindi'
                ? `आवाज़ दर्ज हुई: "${res.transcript}"`
                : `Voice heard: "${res.transcript}"`
            );
            handleExecuteVoiceQuery(res.transcript.trim());
            return;
          }
        } catch (err) {
          console.warn('Audio transcribe error:', err);
        } finally {
          setIsTranscribing(false);
        }
      }

      setStatusMessage(
        lang === 'hindi'
          ? 'आवाज़ स्पष्ट नहीं सुनाई दी। कृपया नीचे दिए गए वॉइस प्रॉम्प्ट्स में से चुनें।'
          : 'Could not clearly recognize speech. Please select a preset prompt below.'
      );
    }
  };

  const handleExecuteVoiceQuery = (queryText) => {
    const text = queryText || transcript;
    if (!text.trim()) return;

    speakText(
      lang === 'hindi'
        ? `आपके लिए ${text} खोजा जा रहा है।`
        : `Searching for ${text}`
    );

    // Dispatch event to EcoAgent chat
    window.dispatchEvent(
      new CustomEvent('ecomart-agent-query', {
        detail: { query: text }
      })
    );

    onClose();
  };

  if (!isOpen) return null;

  const currentPresets = VOICE_PRESETS[lang] || VOICE_PRESETS.hinglish;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-modals flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-surface-raised border border-line rounded-3xl shadow-soft-xl flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-line flex items-center justify-between bg-surface-sunken">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-heading">
                  Voice Shopping Assistant
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Web Speech STT/TTS
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Speak naturally to discover sustainable items.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="p-2.5 min-h-[44px] min-w-[44px] rounded-xl border border-line bg-surface hover:bg-surface-sunken text-text-muted hover:text-heading text-xs font-mono transition flex items-center justify-center cursor-pointer"
              aria-label="How voice shopping works"
            >
              <HelpCircle className="w-4 h-4 text-primary" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 min-h-[44px] min-w-[44px] rounded-xl border border-line text-text-muted hover:text-heading hover:bg-surface transition flex items-center justify-center cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* How it works drawer */}
        {showHowItWorks && (
          <div className="p-4 bg-surface border-b border-line text-xs space-y-1.5 animate-fade-in text-left">
            <div className="flex items-center gap-1.5 font-serif font-bold text-heading">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>About Voice Assistant Purity</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Uses the native browser Web Speech API without external audio recording services. Audio waveforms are processed on-device. If your microphone is not connected, click any preset prompt below.
            </p>
          </div>
        )}

        {/* Sound Toolbar */}
        <div className="p-3 border-b border-line bg-surface flex items-center justify-between">
          <span className="text-xs text-text-muted font-sans">Tap microphone or click a sample prompt</span>

          <button
            type="button"
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`p-2 rounded-xl border border-line text-xs flex items-center gap-1 transition cursor-pointer ${
              ttsEnabled ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface text-text-muted'
            }`}
            title={ttsEnabled ? 'Voice feedback active' : 'Voice feedback muted'}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[10px] font-mono hidden sm:inline">{ttsEnabled ? 'Audio On' : 'Muted'}</span>
          </button>
        </div>

        {/* Central Audio Microphone Station */}
        <div className="p-6 text-center space-y-4 font-sans">
          <div className="relative inline-block">
            <button
              type="button"
              disabled={isTranscribing}
              onClick={isListening ? stopListening : startListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all shadow-soft-lg cursor-pointer mx-auto ${
                isTranscribing
                  ? 'bg-amber-500 text-white animate-pulse'
                  : isListening
                  ? 'bg-rose-500 text-white animate-pulse scale-105'
                  : 'bg-primary text-white hover:opacity-90'
              }`}
              title={isTranscribing ? 'Transcribing...' : isListening ? 'Click to stop listening' : 'Click to start speaking'}
            >
              {isTranscribing ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : isListening ? (
                <Mic className="w-8 h-8" />
              ) : (
                <MicOff className="w-8 h-8 opacity-90" />
              )}
            </button>
          </div>

          <div>
            <div className="text-xs font-mono text-primary font-bold">
              {statusMessage}
            </div>
            {transcript && (
              <div className="mt-3 p-3.5 rounded-2xl bg-surface-sunken border border-line text-xs text-heading font-medium">
                "{transcript}"
              </div>
            )}
          </div>

          {transcript && (
            <button
              type="button"
              onClick={() => handleExecuteVoiceQuery(transcript)}
              className="w-full py-2.5 px-4 rounded-xl bg-primary text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-soft-xs cursor-pointer"
            >
              <span>Ask Eco Agent</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Preset Quick Prompts */}
          <div className="pt-3 border-t border-line text-left space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block">
              Or tap a pre-built voice query:
            </span>
            <div className="space-y-1.5">
              {currentPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleExecuteVoiceQuery(preset.prompt)}
                  className="w-full text-left p-2.5 rounded-xl bg-surface-sunken hover:bg-surface border border-line text-xs text-text-secondary hover:text-heading flex items-center justify-between transition cursor-pointer"
                >
                  <span className="font-medium truncate">{preset.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
