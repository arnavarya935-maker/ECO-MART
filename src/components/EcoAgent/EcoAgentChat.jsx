import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, X, Send, Bot, User, ShoppingBag, RefreshCw, HelpCircle,
  AlertTriangle, CheckCircle2, Trash2, ShieldCheck, Mic, MicOff,
  Flame, Trophy, ChevronDown, ChevronUp, Sliders, Check
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { AGENT_QUICK_ACTIONS, sendAgentQuery } from '../../lib/ecoAgent';
import EcoScoreBadge from '../EcoScoreBadge';

export default function EcoAgentChat() {
  const {
    isAgentOpen,
    setIsAgentOpen,
    cartItems,
    allProducts,
    addToCart,
    swapItemInCart,
    setSelectedProduct
  } = useCart();

  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'challenge'
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [expandedReasonings, setExpandedReasonings] = useState({});

  // Typewriter streaming message buffer
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const [displayedStreamingText, setDisplayedStreamingText] = useState('');

  // Personalization preferences
  const [userPrefs, setUserPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_user_prefs');
      return saved ? JSON.parse(saved) : { maxBudget: 1500, favoriteCategory: 'Kitchen' };
    } catch (_e) {
      return { maxBudget: 1500, favoriteCategory: 'Kitchen' };
    }
  });

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'agent',
      text: "👋 Welcome to EcoMart! I'm your conscious shopping assistant. Ask me to find gifts within a budget, filter plastic-free essentials, or review your cart for greener swaps.",
      quickChips: true,
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSendMessage(transcript);
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
      } catch (_e) {}
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAgentOpen) {
      scrollToBottom();
    }
  }, [messages, isAgentOpen, displayedStreamingText]);

  // Streaming typewriter effect for new agent messages
  const streamAgentResponse = (fullText, messageId) => {
    setStreamingMessageId(messageId);
    setDisplayedStreamingText('');
    let index = 0;
    const interval = setInterval(() => {
      index += 3;
      if (index >= fullText.length) {
        setDisplayedStreamingText(fullText);
        setStreamingMessageId(null);
        clearInterval(interval);
      } else {
        setDisplayedStreamingText(fullText.slice(0, index));
      }
    }, 15);
  };

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    // Append user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendAgentQuery({
        query,
        cartItems,
        allProducts
      });

      const agentMsgId = `agent-${Date.now()}`;
      const agentMsg = {
        id: agentMsgId,
        sender: 'agent',
        text: response.message,
        source: response.source,
        data: response.data,
        cartReview: response.cartReview,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, agentMsg]);
      streamAgentResponse(response.message, agentMsgId);
    } catch (_err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          text: "I'm currently running in offline mode. You can ask for plastic-free items, gifts, or click 'Review my cart' below!",
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleReasoning = (itemId) => {
    setExpandedReasonings((prev) => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  if (!isAgentOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full sm:w-[440px] max-w-[calc(100vw-2rem)] h-[620px] max-h-[85vh] bg-[#FAF8F5] dark:bg-stone-900 border border-emerald-400/50 dark:border-emerald-600/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-850 dark:text-stone-100 animate-slide-up">
      {/* Top Header Bar */}
      <div className="p-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Bot className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="font-extrabold text-sm flex items-center gap-1.5">
              <span>Eco Agent</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-emerald-200">
              Personalized • Offline Capable
            </div>
          </div>
        </div>

        {/* Tab switch & Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'chat' ? 'challenge' : 'chat')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              activeTab === 'challenge'
                ? 'bg-amber-400 text-stone-950 shadow-sm'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Challenge</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setMessages([
                {
                  id: 'welcome',
                  sender: 'agent',
                  text: "Chat cleared! How can I assist with your sustainable shopping?",
                  quickChips: true,
                  timestamp: new Date()
                }
              ])
            }
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-xl transition"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsAgentOpen(false)}
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* CHALLENGE TAB */}
      {activeTab === 'challenge' ? (
        <div className="flex-1 p-5 overflow-y-auto space-y-5 animate-fadeIn">
          {/* Weekly Eco Challenge */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-400/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                Weekly Challenge
              </span>
              <div className="flex items-center gap-1 text-xs font-black text-amber-500">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>4-Day Streak!</span>
              </div>
            </div>

            <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
              Plastic-Free Hero Challenge
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Swap 3 conventional items for plastic-free alternatives this week.
            </p>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-stone-500">Progress</span>
                <span className="text-emerald-600 dark:text-emerald-400">2 of 3 Completed</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-2/3 transition-all duration-500" />
              </div>
            </div>
          </div>

          {/* Leaderboard Mock */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400">
                Conscious Leaderboard
              </h4>
              <span className="text-[11px] text-emerald-600 font-bold">This Week</span>
            </div>

            <div className="space-y-2">
              {[
                { rank: '1', name: 'Maya K.', score: '480 pts', badge: '🥇' },
                { rank: '2', name: 'Dev R.', score: '410 pts', badge: '🥈' },
                { rank: '3', name: 'You (Conscious Shopper)', score: '360 pts', badge: '🥉', current: true },
                { rank: '4', name: 'Aarav P.', score: '310 pts', badge: '🌱' },
                { rank: '5', name: 'Pooja S.', score: '275 pts', badge: '🌱' }
              ].map((item) => (
                <div
                  key={item.rank}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                    item.current
                      ? 'bg-emerald-100/70 dark:bg-emerald-950/60 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                      : 'bg-white dark:bg-stone-850 border-stone-200/80 dark:border-stone-800 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-black text-stone-400 w-4">{item.rank}</span>
                    <span>{item.badge}</span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold">{item.score}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-sm"
          >
            Return to AI Assistant
          </button>
        </div>
      ) : (
        /* CHAT TAB */
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isStreamingThis = streamingMessageId === msg.id;
            const messageText = isStreamingThis ? displayedStreamingText : msg.text;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-br-xs shadow-sm'
                      : 'bg-white dark:bg-stone-800 text-stone-850 dark:text-stone-100 border border-stone-200 dark:border-stone-700/80 rounded-bl-xs shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {messageText}
                    {isStreamingThis && <span className="inline-block w-1.5 h-3.5 bg-emerald-500 ml-0.5 animate-pulse" />}
                  </p>

                  {/* Render Search Results with "Reasoning" expander */}
                  {msg.data && msg.data.results && msg.data.results.length > 0 && (
                    <div className="mt-3 space-y-2.5 pt-3 border-t border-stone-100 dark:border-stone-700">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                        Agent Curated Matches ({msg.data.results.length})
                      </div>
                      {msg.data.results.map((item) => {
                        const isExpanded = expandedReasonings[item.id];
                        return (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/60 hover:border-emerald-400 transition"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{item.icon}</span>
                                <div>
                                  <div className="font-bold text-xs text-stone-900 dark:text-stone-100">
                                    {item.name}
                                  </div>
                                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                    ₹{item.price} • {item.category}
                                  </div>
                                </div>
                              </div>
                              <EcoScoreBadge scoreData={item.ecoScoreData} product={item} size="sm" showPopoverButton={false} />
                            </div>

                            {/* Transparent Reasoning Expander */}
                            <div className="mt-2 pt-2 border-t border-stone-200/60 dark:border-stone-750">
                              <button
                                type="button"
                                onClick={() => toggleReasoning(item.id)}
                                className="w-full flex items-center justify-between text-[10px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                              >
                                <span>Why I Picked This (Lifecycle Factors)</span>
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>

                              {isExpanded && (
                                <div className="mt-1.5 p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-900/60 text-[10px] space-y-1 text-emerald-950 dark:text-emerald-200">
                                  <div>🌱 <strong>Reasoning:</strong> {item.reasoning}</div>
                                  <div>💨 <strong>Carbon:</strong> {item.carbonKg}kg CO₂ lifecycle footprint</div>
                                  <div>🌊 <strong>Packaging:</strong> {item.packaging} (zero single-use waste)</div>
                                  <div>📍 <strong>Distance:</strong> {item.madeInKm} km from regional hub</div>
                                </div>
                              )}
                            </div>

                            {/* Action buttons */}
                            <div className="mt-2 flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedProduct(item)}
                                className="px-2.5 py-1 text-[11px] font-medium text-stone-600 dark:text-stone-300 hover:underline"
                              >
                                View Details
                              </button>
                              <button
                                type="button"
                                onClick={() => addToCart(item)}
                                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-medium shadow-xs"
                              >
                                <ShoppingBag className="w-3 h-3" />
                                <span>Add to Cart</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Render Cart Review Suggestions Card */}
                  {msg.cartReview && (
                    <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-700 space-y-3">
                      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-600 dark:text-stone-300">
                            Cart Average Eco-Score:
                          </span>
                          <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                            {msg.cartReview.averageScore} / 100
                          </span>
                        </div>

                        {msg.cartReview.lowGradeCount > 0 ? (
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{msg.cartReview.lowGradeCount} low-scoring item(s) detected in cart</span>
                          </div>
                        ) : (
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>All cart items have sustainable ratings!</span>
                          </div>
                        )}
                      </div>

                      {msg.cartReview.suggestions && msg.cartReview.suggestions.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                            Top Greener Swaps
                          </div>
                          {msg.cartReview.suggestions.map((sug, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800"
                            >
                              <div className="flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200">
                                <span className="line-through text-rose-500">{sug.from.name}</span>
                                <span className="text-emerald-700 dark:text-emerald-300">→ {sug.to.name}</span>
                              </div>
                              <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1">
                                🌱 {sug.reason}
                              </p>
                              <div className="mt-2.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => swapItemInCart(sug.from.id, sug.to)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs shadow-xs"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  <span>1-Tap Swap to {sug.to.name}</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Action Chips attached to first welcome */}
                {msg.quickChips && (
                  <div className="mt-3 flex flex-wrap gap-1.5 max-w-[90%]">
                    {AGENT_QUICK_ACTIONS.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => handleSendMessage(action.prompt)}
                        className="text-xs px-2.5 py-1 rounded-full bg-stone-100 hover:bg-emerald-100 dark:bg-stone-800 dark:hover:bg-emerald-950/80 text-stone-700 hover:text-emerald-800 dark:text-stone-300 dark:hover:text-emerald-200 border border-stone-200 dark:border-stone-700 transition"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 p-3 bg-white dark:bg-stone-800 rounded-2xl w-fit border border-stone-200 dark:border-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-stone-400 font-medium ml-1">Analyzing catalog...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 bg-white dark:bg-stone-850 border-t border-stone-200 dark:border-stone-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {speechSupported && (
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? 'Stop listening' : 'Start voice input'}
              className={`p-2.5 rounded-2xl transition ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? 'Listening to speech...' : 'Ask agent (e.g. Find a gift under 1000)...'}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-hidden focus:border-emerald-500"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-medium transition shadow-sm active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[10px] text-stone-400 px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Preferences: {userPrefs.favoriteCategory} • Under ₹{userPrefs.maxBudget}</span>
          </span>
          <span>Offline Ready</span>
        </div>
      </div>
    </div>
  );
}
