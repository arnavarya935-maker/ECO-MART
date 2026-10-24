import React, { useState, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

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

  const recognitionRef = useRef(null);

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

  const startListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatusMessage('Web Speech API is not supported in this browser. Please click a preset prompt below.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'hindi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage(lang === 'hindi' ? 'सुन रहा हूँ... बोलिए' : 'Listening... Speak now');
      };

      recognition.onresult = (event) => {
        const text = Array.from(event.results)
          .map((r) => r[0].transcript)
          .join('');
        setTranscript(text);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setStatusMessage('Could not recognize voice. Try a preset prompt below.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setStatusMessage('Microphone access denied or unavailable. Use the presets below.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
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
                  Hinglish &amp; Hindi Voice Shopping
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Web Speech STT/TTS
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Speak naturally in conversational Hindi or English to discover items.
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

        {/* Language & Sound Toolbar */}
        <div className="p-3 border-b border-line bg-surface flex items-center justify-between">
          <div className="flex items-center gap-1 bg-surface-sunken rounded-xl p-0.5 border border-line text-xs font-mono">
            <button
              type="button"
              onClick={() => setLang('hinglish')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                lang === 'hinglish' ? 'bg-primary text-white font-bold' : 'text-text-muted hover:text-heading'
              }`}
            >
              Hinglish / EN
            </button>
            <button
              type="button"
              onClick={() => setLang('hindi')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                lang === 'hindi' ? 'bg-primary text-white font-bold' : 'text-text-muted hover:text-heading'
              }`}
            >
              हिंदी (Hindi)
            </button>
          </div>

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
              onClick={isListening ? stopListening : startListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all shadow-soft-lg cursor-pointer mx-auto ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse scale-105'
                  : 'bg-primary text-white hover:opacity-90'
              }`}
              title={isListening ? 'Click to stop listening' : 'Click to start speaking'}
            >
              {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8 opacity-90" />}
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
