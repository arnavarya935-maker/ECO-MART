import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  ShoppingBag,
  Trash2,
  Mic,
  MicOff,
  Check
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { sendAgentQuery } from '../../lib/ecoAgent';
import { playSound } from '../../lib/audio';

const QUICK_CHIPS = [
  { id: 'gift', label: '🎁 Gift under ₹1000', query: 'Find an eco-friendly gift under ₹1000' },
  { id: 'kitchen', label: '🎋 Plastic-free kitchen', query: 'Show plastic-free items for my kitchen' },
  { id: 'cart', label: '🛒 Review my cart', query: 'Review my cart and suggest greener swaps' },
  { id: 'basket', label: '🧺 Budget basket under ₹1000', query: 'Assemble a budget basket under 1000' },
  { id: 'scoring', label: '🔬 How EcoScore works', query: 'Explain how the eco score is calculated' }
];

export default function EcoAgentChat() {
  const {
    isAgentOpen,
    setIsAgentOpen,
    cartItems,
    allProducts,
    addToCart,
    swapItemInCart,
    showToast
  } = useCart();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  });
  const [addedItemMap, setAddedItemMap] = useState({});

  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome',
      sender: 'agent',
      text: "👋 Welcome to EcoMart! I'm your offline conscious shopping guide. Ask me to find zero-waste gifts, assemble a budget basket, or audit your cart for cleaner swaps.",
      quickChips: true,
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Core send query handler
  const handleSendMessage = useCallback(async (queryText) => {
    const q = (queryText || input).trim();
    if (!q || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    playSound('click');

    try {
      const response = await sendAgentQuery({
        query: q,
        cartItems,
        allProducts
      });

      const agentMsg = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: response.message,
        source: response.source || 'local-rules',
        data: response.data || [],
        cartReview: response.cartReview,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, agentMsg]);
      playSound('pop');
    } catch {
      // Silent graceful offline fallback (Feature 20)
      setMessages((prev) => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          text: "I am operating in 100% offline mode. You can ask for plastic-free kitchen essentials, gifts under ₹1000, or click 'Review my cart' below!",
          source: 'local-fallback',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, cartItems, allProducts]);

  const sendRef = useRef(handleSendMessage);
  useEffect(() => {
    sendRef.current = handleSendMessage;
  });

  // Speech Recognition initialization
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          sendRef.current(transcript);
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch {}
    }
  };

  useEffect(() => {
    if (isAgentOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAgentOpen]);

  const handleAddProductFromChat = (product) => {
    addToCart(product, 1);
    playSound('pop');
    setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
    showToast(`Added "${product.name}" to cart!`, 'success');
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  if (!isAgentOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Eco Agent Chat Assistant"
      className="fixed bottom-6 right-6 z-50 w-full sm:w-[420px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[85vh] bg-white border border-emerald-300 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-900 animate-slide-up"
    >
      {/* Top Header Bar */}
      <div className="p-4 bg-gradient-to-r from-[#0B3B2C] to-[#047857] text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Bot className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <div className="font-black text-sm flex items-center gap-1.5">
              <span>Eco Agent</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-emerald-100 font-bold flex items-center gap-1">
              <span>100% Offline Assistant</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              setMessages([
                {
                  id: 'welcome',
                  sender: 'agent',
                  text: "Chat cleared! How can I assist with your sustainable shopping?",
                  quickChips: true,
                  timestamp: 'Just now'
                }
              ])
            }
            className="p-1.5 text-emerald-200 hover:text-white rounded-xl hover:bg-white/10 transition"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsAgentOpen(false)}
            className="p-1.5 text-emerald-200 hover:text-white rounded-xl hover:bg-white/10 transition"
            aria-label="Close Agent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF9F6]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'agent' && (
              <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs space-y-2.5 shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-emerald-700 text-white rounded-tr-xs'
                  : 'bg-white text-stone-850 border border-stone-200/90 rounded-tl-xs'
              }`}
            >
              <div className="leading-relaxed font-medium whitespace-pre-wrap">{msg.text}</div>

              {/* Recommended Product Cards Inside Chat (Feature 20) */}
              {msg.data && msg.data.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-stone-100">
                  <span className="text-[10px] font-extrabold uppercase text-stone-400 block">
                    Recommended Sustainable Options:
                  </span>
                  <div className="space-y-1.5">
                    {msg.data.slice(0, 3).map((prod) => {
                      const isAdded = addedItemMap[prod.id];
                      return (
                        <div
                          key={prod.id}
                          className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-2 text-stone-900"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xl">{prod.icon}</span>
                            <div className="min-w-0">
                              <span className="font-bold text-xs truncate block">{prod.name}</span>
                              <span className="text-[10px] text-emerald-800 font-black">₹{prod.price}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddProductFromChat(prod)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] flex items-center gap-1 shrink-0 transition"
                          >
                            {isAdded ? <Check className="w-3 h-3 text-emerald-200" /> : <ShoppingBag className="w-3 h-3" />}
                            <span>{isAdded ? 'Added' : 'Add'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cart Review Swaps Inside Chat */}
              {msg.cartReview && msg.cartReview.suggestions && msg.cartReview.suggestions.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-stone-100">
                  <span className="text-[10px] font-extrabold uppercase text-amber-700 block">
                    Proposed Swaps:
                  </span>
                  {msg.cartReview.suggestions.map((swap, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-stone-900 flex items-center justify-between gap-2"
                    >
                      <div className="text-[11px] min-w-0">
                        <span className="line-through text-stone-400 block truncate">{swap.from.name}</span>
                        <span className="font-bold text-emerald-800 block truncate">➔ {swap.to.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          swapItemInCart(swap.from.id, swap.to);
                          playSound('swap');
                          showToast(`Swapped to ${swap.to.name}!`, 'swap');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-bold text-[10px] shrink-0"
                      >
                        Swap
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Message Timestamp */}
              <div
                className={`text-[9px] ${
                  msg.sender === 'user' ? 'text-emerald-100/70' : 'text-stone-400'
                } text-right`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-stone-200 text-stone-700 flex items-center justify-center text-xs shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5 items-center text-xs text-stone-500">
            <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 bg-white rounded-2xl border border-stone-200 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
              <span>Analyzing local eco-catalog...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Chips (Feature 20) */}
      <div className="p-2 bg-stone-50 border-t border-stone-200 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => handleSendMessage(chip.query)}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 text-[11px] font-bold border border-stone-200 transition shrink-0 shadow-2xs"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
        {speechSupported && (
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-xl border transition ${
              isListening
                ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                : 'bg-stone-50 border-stone-200 text-stone-500 hover:text-stone-800'
            }`}
            title={isListening ? 'Listening...' : 'Voice Input'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        )}

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="Ask about swaps, budget gifts, scoring..."
          className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-medium outline-hidden focus:border-emerald-600 focus:bg-white transition"
        />

        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white transition active:scale-95 shadow-xs"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
