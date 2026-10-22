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
      className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-drawers w-full sm:w-[420px] max-w-[calc(100vw-1.5rem)] h-[600px] max-h-[calc(100dvh-6.5rem)] bg-surface border border-line rounded-3xl shadow-soft-xl flex flex-col overflow-hidden text-text animate-slide-up"
    >
      {/* Top Header Bar */}
      <div className="p-4 bg-primary text-primary-contrast flex items-center justify-between shadow-soft-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-primary-hover/80 flex items-center justify-center border border-primary-contrast/20">
            <Bot className="w-5 h-5 text-primary-contrast" />
          </div>
          <div>
            <div className="font-serif font-bold text-sm flex items-center gap-1.5">
              <span>Eco Agent</span>
              <span className="w-2 h-2 rounded-full bg-primary-contrast animate-pulse" />
            </div>
            <div className="text-[10px] text-primary-contrast/80 font-medium flex items-center gap-1">
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
            className="w-9 h-9 text-primary-contrast/80 hover:text-primary-contrast rounded-xl hover:bg-primary-hover flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-focus"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsAgentOpen(false)}
            className="w-9 h-9 text-primary-contrast/80 hover:text-primary-contrast rounded-xl hover:bg-primary-hover flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-focus"
            aria-label="Close Agent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-sunken/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'agent' && (
              <div className="w-7 h-7 rounded-xl bg-primary text-primary-contrast flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-soft-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs space-y-2.5 shadow-soft-xs ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-contrast rounded-tr-xs'
                  : 'bg-surface text-text border border-line rounded-tl-xs'
              }`}
            >
              <div className="leading-relaxed font-normal whitespace-pre-wrap">{msg.text}</div>

              {/* Recommended Product Cards Inside Chat (Feature 20) */}
              {msg.data && msg.data.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-line">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                    Recommended Sustainable Options:
                  </span>
                  <div className="space-y-1.5">
                    {msg.data.slice(0, 3).map((prod) => {
                      const isAdded = addedItemMap[prod.id];
                      return (
                        <div
                          key={prod.id}
                          className="p-2.5 rounded-xl bg-surface-sunken border border-line flex items-center justify-between gap-2 text-text shadow-soft-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xl">{prod.icon}</span>
                            <div className="min-w-0">
                              <span className="font-bold text-xs truncate block text-heading">{prod.name}</span>
                              <span className="text-[10px] font-serif font-bold text-primary">₹{prod.price}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddProductFromChat(prod)}
                            className="px-2.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-primary-contrast font-semibold text-[10px] flex items-center gap-1 shrink-0 transition-colors shadow-soft-xs focus-visible:outline-2 focus-visible:outline-focus"
                          >
                            {isAdded ? <Check className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
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
                <div className="space-y-2 pt-1 border-t border-line">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent block">
                    Proposed Swaps:
                  </span>
                  {msg.cartReview.suggestions.map((swap, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-2.5 rounded-xl bg-accent/10 border border-accent/30 text-text flex items-center justify-between gap-2 shadow-soft-xs"
                    >
                      <div className="text-[11px] min-w-0">
                        <span className="line-through text-muted block truncate">{swap.from.name}</span>
                        <span className="font-bold text-heading block truncate">➔ {swap.to.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          swapItemInCart(swap.from.id, swap.to);
                          playSound('swap');
                          showToast(`Swapped to ${swap.to.name}!`, 'swap');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-[10px] shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-focus"
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
                  msg.sender === 'user' ? 'text-primary-contrast/80' : 'text-muted'
                } text-right`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-surface-sunken text-secondary flex items-center justify-center text-xs shrink-0 mt-0.5 border border-line">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5 items-center text-xs text-muted">
            <div className="w-7 h-7 rounded-xl bg-primary text-primary-contrast flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 bg-surface rounded-2xl border border-line text-xs font-medium flex items-center gap-1.5 shadow-soft-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              <span>Analyzing local eco-catalog...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Chips (Feature 20) */}
      <div className="p-2.5 bg-surface-sunken border-t border-line overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => handleSendMessage(chip.query)}
            className="px-3 py-1.5 rounded-full bg-surface hover:bg-primary/10 hover:text-primary text-secondary text-[11px] font-semibold border border-line transition-colors shrink-0 shadow-soft-xs focus-visible:outline-2 focus-visible:outline-focus min-h-[32px]"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="p-3 bg-surface border-t border-line flex items-center gap-2">
        {speechSupported && (
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-focus ${
              isListening
                ? 'bg-danger/10 border-danger text-danger animate-pulse'
                : 'bg-surface-sunken border-line text-muted hover:text-heading'
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
          className="flex-1 bg-surface-sunken border border-line rounded-xl px-3.5 py-2.5 text-xs font-medium outline-hidden focus:border-primary focus:bg-surface transition-colors min-h-[44px] text-heading placeholder:text-muted focus:outline-2 focus:outline-focus"
        />

        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={!input.trim() || loading}
          className="w-11 h-11 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-primary-contrast transition-all active:scale-[0.98] shadow-soft-xs flex items-center justify-center focus-visible:outline-2 focus-visible:outline-focus"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
