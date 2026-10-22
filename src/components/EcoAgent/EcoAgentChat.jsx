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
  Check,
  Sparkles,
  Play,
  RotateCcw,
  Sliders,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useT } from '../../context/I18nContext';
import { FEATURES } from '../../lib/features';
import { sendAgentQuery } from '../../lib/ecoAgent';
import { playSound } from '../../lib/audio';
import PrioritiesPanel from '../decision/PrioritiesPanel';

const QUICK_CHIPS_EN = [
  { id: 'eco-check', label: '🔍 Eco Check a product', query: 'Eco check a product' },
  { id: 'price-priority', label: '💰 I care most about price', query: 'I care most about price' },
  { id: 'plastic-priority', label: '🌊 Plastic matters more', query: 'plastic matters more' },
  { id: 'gift', label: '🎁 Gift under ₹1000', query: 'Find an eco-friendly gift under ₹1000' },
  { id: 'kitchen', label: '🎋 Plastic-free kitchen', query: 'Show plastic-free items for my kitchen' },
  { id: 'cart', label: '🛒 Review my cart', query: 'Review my cart and suggest greener swaps' },
  { id: 'basket', label: '🧺 Budget basket under ₹1000', query: 'Assemble a budget basket under 1000' },
  { id: 'scoring', label: '🔬 How EcoScore works', query: 'Explain how the eco score is calculated' }
];

const QUICK_CHIPS_HI = [
  { id: 'eco-check', label: '🔍 किसी उत्पाद का इको चेक', query: 'Eco check a product' },
  { id: 'price-priority', label: '💰 मुझे सबसे सस्ती कीमत चाहिए', query: 'I care most about price' },
  { id: 'plastic-priority', label: '🌊 प्लास्टिक हटाना प्राथमिकता है', query: 'plastic matters more' },
  { id: 'gift', label: '🎁 ₹1000 से कम का उपहार', query: 'Find an eco-friendly gift under ₹1000' },
  { id: 'kitchen', label: '🎋 प्लास्टिक मुक्त रसोई', query: 'Show plastic-free items for my kitchen' },
  { id: 'cart', label: '🛒 मेरा झोला चेक करें', query: 'Review my cart and suggest greener swaps' },
  { id: 'basket', label: '🧺 ₹1000 का बजट बास्केट', query: 'Assemble a budget basket under 1000' },
  { id: 'scoring', label: '🔬 इको-स्कोर कैसे काम करता है', query: 'Explain how the eco score is calculated' }
];

export default function EcoAgentChat() {
  const { judgeMode } = useTheme();
  const {
    isAgentOpen,
    setIsAgentOpen,
    cartItems,
    allProducts,
    addToCart,
    swapItemInCart,
    clearCart,
    setCartItems,
    showToast,
    userPriorities,
    updateUserPriorities
  } = useCart();

  const { t, lang } = useT();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPriorities, setShowPriorities] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  });
  const [hasVoice, setHasVoice] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const checkVoices = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        setHasVoice(Boolean(voices && voices.length > 0));
      } catch {
        setHasVoice(false);
      }
    };
    checkVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = checkVoices;
    }
    return () => {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    };
  }, []);

  const toggleSpeak = useCallback((msgId, text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/[#*_`~>]/g, '')
        .replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      utterance.onend = () => setSpeakingMsgId(null);
      utterance.onerror = () => setSpeakingMsgId(null);

      setSpeakingMsgId(msgId);
      window.speechSynthesis.speak(utterance);
    } catch {
      setSpeakingMsgId(null);
    }
  }, [speakingMsgId, lang]);

  const [addedItemMap, setAddedItemMap] = useState({});
  const [firstAgentAnswerDone, setFirstAgentAnswerDone] = useState(false);
  const [agentContext, setAgentContext] = useState({
    lastCategory: null,
    lastBudget: null,
    lastSort: null,
    lastRecipient: null,
    lastPackaging: null,
    lastResults: [],
    lastQuery: null
  });

  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome',
      sender: 'agent',
      text: lang === 'hi'
        ? "👋 नमस्ते! मैं इकोमार्ट का ऑफ़लाइन AI शॉपिंग गाइड हूँ। शून्य-अपशिष्ट उपहार खोजने, बजट बास्केट बनाने या अपने झोले के ऑडिट के लिए मुझसे पूछें।"
        : "👋 Welcome to EcoMart! I'm your offline conscious shopping guide. Ask me to find zero-waste gifts, assemble a budget basket, or audit your cart for cleaner swaps.",
      quickChips: true,
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const [demoRunning, setDemoRunning] = useState(false);
  const demoTimeoutsRef = useRef([]);

  const stopDemoTimeouts = useCallback(() => {
    demoTimeoutsRef.current.forEach((t) => clearTimeout(t));
    demoTimeoutsRef.current = [];
    setDemoRunning(false);
  }, []);

  const handleResetDemo = useCallback(() => {
    stopDemoTimeouts();
    if (clearCart) clearCart();
    setMessages([
      {
        id: 'welcome',
        sender: 'agent',
        text: "👋 Demo reset to clean state. Ready for new queries or another demo run!",
        quickChips: true,
        timestamp: 'Just now'
      }
    ]);
    setAgentContext({
      lastCategory: null,
      lastBudget: null,
      lastSort: null,
      lastRecipient: null,
      lastPackaging: null,
      lastResults: [],
      lastQuery: null
    });
    showToast('Demo environment reset', 'info');
  }, [clearCart, showToast, stopDemoTimeouts]);

  const handleRunDemoScenario = useCallback(() => {
    stopDemoTimeouts();
    setDemoRunning(true);
    setIsAgentOpen(true);

    const conv1 = allProducts.find((p) => p.id === 'care-01-conv') || {
      id: 'care-01-conv',
      name: 'Nylon Bristle Plastic Toothbrushes (Pack of 4)',
      category: 'Personal Care',
      price: 120,
      icon: '🪥',
      isEcoFriendly: false,
      conventionalAlternativeId: 'care-01'
    };
    const conv2 = allProducts.find((p) => p.id === 'care-02-conv') || {
      id: 'care-02-conv',
      name: 'Chemical Liquid Shampoo in HDPE Bottle (350ml)',
      category: 'Personal Care',
      price: 280,
      icon: '🧴',
      isEcoFriendly: false,
      conventionalAlternativeId: 'care-02'
    };
    const conv3 = allProducts.find((p) => p.id === 'kit-01-conv') || {
      id: 'kit-01-conv',
      name: 'Single-Use Plastic Cutlery Pack (50 pcs)',
      category: 'Kitchen',
      price: 129,
      icon: '🍴',
      isEcoFriendly: false,
      conventionalAlternativeId: 'kit-01'
    };

    if (setCartItems) {
      setCartItems([
        { product: conv1, quantity: 1 },
        { product: conv2, quantity: 1 },
        { product: conv3, quantity: 1 }
      ]);
      try {
        localStorage.setItem(
          'ecomart_cart',
          JSON.stringify([
            { product: conv1, quantity: 1 },
            { product: conv2, quantity: 1 },
            { product: conv3, quantity: 1 }
          ])
        );
      } catch {}
    }

    const green1 = allProducts.find((p) => p.id === 'care-01');
    const green2 = allProducts.find((p) => p.id === 'care-02');
    const green3 = allProducts.find((p) => p.id === 'kit-01');

    setMessages([
      {
        id: 'demo-user-1',
        sender: 'user',
        text: 'Audit my cart and help me switch to a zero-waste lifestyle under ₹1500',
        timestamp: 'Just now'
      }
    ]);

    const t1 = setTimeout(() => {
      const auditMsg = {
        id: 'demo-agent-audit',
        sender: 'agent',
        text: 'I audited your cart! Found 3 conventional items with high plastic and carbon footprint. Here is how we can swap them for certified circular alternatives while staying well under your ₹1500 budget:',
        source: 'local-rule-engine',
        data: [green1, green2, green3].filter(Boolean),
        isFirstResponse: true,
        trace: [
          { step: 'Understood goal', detail: 'Audit cart & eliminate single-use plastics under ₹1500' },
          { step: 'Constraints identified', detail: '3 conventional items found: plastic toothbrush, liquid shampoo, disposable cutlery' },
          { step: 'Candidates matched', detail: 'Matched 3 certified zero-waste circular alternatives (Bamboo Toothbrush, Solid Shampoo Bar, Bamboo Cutlery)' },
          { step: 'Scored & Ranked', detail: 'Swapping all 3 raises cart average EcoScore from 38 to 92/100' },
          { step: 'Trade-offs evaluated', detail: 'Upfront cost is ₹897 vs ₹529, but eliminates 485g plastic and avoids 4.2kg lifecycle CO2' },
          { step: 'Decision', detail: 'Recommended executing conscious swaps to achieve zero-waste starter kit' }
        ],
        tradeoffs: {
          winnerName: 'Certified Zero-Waste Bundle',
          runnerUpName: 'Conventional Plastic Cart',
          beats: [
            'Diverts 485g of single-use plastic from landfills',
            'Prevents 4.2kg lifecycle greenhouse emissions',
            'Saves 142 litres of freshwater in production'
          ],
          givesUp: [
            '₹368 higher initial investment for reusable materials'
          ]
        },
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, auditMsg]);
    }, 1200);

    const t2 = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: 'demo-user-apply',
          sender: 'user',
          text: 'Apply all greener swaps to my cart now',
          timestamp: 'Just now'
        }
      ]);

      if (setCartItems && green1 && green2 && green3) {
        setCartItems([
          { product: green1, quantity: 1 },
          { product: green2, quantity: 1 },
          { product: green3, quantity: 1 }
        ]);
        try {
          localStorage.setItem(
            'ecomart_cart',
            JSON.stringify([
              { product: green1, quantity: 1 },
              { product: green2, quantity: 1 },
              { product: green3, quantity: 1 }
            ])
          );
        } catch {}
      }
    }, 4500);

    const t3 = setTimeout(() => {
      const receiptMsg = {
        id: 'demo-agent-receipt',
        sender: 'agent',
        text: '🎉 Conscious swaps applied! Your cart is now 100% verified plastic-free (Total: ₹897, under your ₹1500 budget). Here is your environmental savings receipt:',
        source: 'local-rule-engine',
        basketPlan: {
          itemCount: 3,
          totalPrice: 897,
          budget: 1500,
          averageEcoScore: 92,
          savings: {
            co2Saved: 4.2,
            plasticSaved: 485,
            waterSaved: 142
          }
        },
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, receiptMsg]);
      setDemoRunning(false);
      showToast('Demo scenario completed successfully!', 'success');
    }, 6500);

    demoTimeoutsRef.current = [t1, t2, t3];
  }, [allProducts, setCartItems, showToast, setIsAgentOpen, stopDemoTimeouts]);

  useEffect(() => {
    const handleStartEvent = () => handleRunDemoScenario();
    const handleResetEvent = () => handleResetDemo();

    window.addEventListener('start-demo-scenario', handleStartEvent);
    window.addEventListener('reset-demo', handleResetEvent);

    return () => {
      window.removeEventListener('start-demo-scenario', handleStartEvent);
      window.removeEventListener('reset-demo', handleResetEvent);
      stopDemoTimeouts();
    };
  }, [handleRunDemoScenario, handleResetDemo, stopDemoTimeouts]);

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
        allProducts,
        context: {
          ...agentContext,
          userPriorities
        }
      });

      if (response.newPriorities && updateUserPriorities) {
        updateUserPriorities(response.newPriorities);
        showToast('Decision priorities updated', 'info');
      }

      const isFirst = !firstAgentAnswerDone;
      if (isFirst) setFirstAgentAnswerDone(true);

      const agentMsg = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: response.message,
        source: response.source || 'local-rules',
        data: Array.isArray(response.data) ? response.data : (response.data?.results || []),
        didYouMean: response.didYouMean,
        tradeoffs: response.tradeoffs,
        trace: response.trace || [],
        basketPlan: response.basketPlan,
        clarification: response.clarification,
        isFirstResponse: isFirst,
        cartReview: response.cartReview,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setAgentContext((prev) => ({
        lastCategory: response.analysis?.intent?.category || prev.lastCategory,
        lastBudget: response.analysis?.intent?.maxBudget || prev.lastBudget,
        lastSort: response.analysis?.intent?.sortBy || prev.lastSort,
        lastRecipient: response.analysis?.intent?.recipient || prev.lastRecipient,
        lastPackaging: response.analysis?.intent?.packaging || prev.lastPackaging,
        lastResults: agentMsg.data || prev.lastResults,
        lastQuery: q
      }));

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
  }, [input, loading, cartItems, allProducts, agentContext, firstAgentAnswerDone, userPriorities, updateUserPriorities, showToast]);

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
        <div className="flex items-center gap-1.5">
          {judgeMode && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400 text-stone-900 uppercase tracking-wider" title="Judge Mode active">
              Judge
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowPriorities(!showPriorities)}
            className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors border cursor-pointer flex items-center gap-1 ${
              showPriorities
                ? 'bg-amber-300 text-stone-900 border-amber-400 font-bold'
                : 'bg-surface text-primary border-primary-contrast/20 hover:bg-surface-raised'
            }`}
            title="Adjust multi-criteria decision weights"
          >
            <Sliders className="w-2.5 h-2.5" />
            <span>Priorities</span>
          </button>
          <button
            type="button"
            onClick={handleRunDemoScenario}
            disabled={demoRunning}
            className="px-2 py-1 rounded-lg bg-surface text-primary text-[10px] font-bold hover:bg-surface-raised transition-colors border border-primary-contrast/20 cursor-pointer flex items-center gap-1 shadow-soft-xs"
            title="Auto-play 60s scripted competition demo flow"
          >
            <Play className="w-2.5 h-2.5 fill-current" />
            <span>{demoRunning ? 'Running...' : 'Demo scenario'}</span>
          </button>

          {(demoRunning || messages.length > 1) && (
            <button
              type="button"
              onClick={handleResetDemo}
              className="px-2 py-1 rounded-lg bg-primary-hover/80 text-primary-contrast text-[10px] font-semibold hover:bg-primary-hover transition-colors border border-primary-contrast/20 cursor-pointer flex items-center gap-1"
              title="Reset demo, cart, and chat"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          )}
          {Boolean(agentContext.lastCategory || agentContext.lastBudget || agentContext.lastQuery) && (
            <button
              type="button"
              onClick={() => {
                setAgentContext({
                  lastCategory: null,
                  lastBudget: null,
                  lastSort: null,
                  lastRecipient: null,
                  lastPackaging: null,
                  lastResults: [],
                  lastQuery: null
                });
                showToast('Agent memory cleared', 'info');
              }}
              className="px-2 py-1 rounded-lg bg-primary-hover/80 text-primary-contrast text-[10px] font-semibold hover:bg-primary-hover transition-colors border border-primary-contrast/20 cursor-pointer"
              title="Clear multi-turn context memory"
            >
              Clear context
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setMessages([
                {
                  id: 'welcome',
                  sender: 'agent',
                  text: "Chat cleared! How can I assist with your sustainable shopping?",
                  quickChips: true,
                  timestamp: 'Just now'
                }
              ]);
              setAgentContext({
                lastCategory: null,
                lastBudget: null,
                lastSort: null,
                lastRecipient: null,
                lastPackaging: null,
                lastResults: [],
                lastQuery: null
              });
            }}
            className="w-9 h-9 text-primary-contrast/80 hover:text-primary-contrast rounded-xl hover:bg-primary-hover flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsAgentOpen(false)}
            className="w-9 h-9 text-primary-contrast/80 hover:text-primary-contrast rounded-xl hover:bg-primary-hover flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
            aria-label="Close Agent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Priorities Panel inside Agent */}
      {showPriorities && (
        <div className="p-3 bg-surface-raised border-b border-line max-h-80 overflow-y-auto">
          <PrioritiesPanel compact />
        </div>
      )}

      {/* Multi-turn Active Context Indicator Bar */}
      {(agentContext.lastCategory || agentContext.lastBudget) && (
        <div className="px-4 py-1.5 bg-surface border-b border-line flex items-center justify-between text-[10px] text-muted">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-semibold text-heading">Memory:</span>
            {agentContext.lastCategory && (
              <span className="px-1.5 py-0.5 rounded bg-surface-sunken border border-line text-primary font-medium">
                {agentContext.lastCategory}
              </span>
            )}
            {agentContext.lastBudget && (
              <span className="px-1.5 py-0.5 rounded bg-surface-sunken border border-line text-heading font-medium">
                ≤ ₹{agentContext.lastBudget}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setAgentContext({
                lastCategory: null,
                lastBudget: null,
                lastSort: null,
                lastRecipient: null,
                lastPackaging: null,
                lastResults: [],
                lastQuery: null
              });
              showToast('Memory reset', 'info');
            }}
            className="text-[10px] text-primary hover:underline cursor-pointer shrink-0 ml-2"
          >
            Clear context
          </button>
        </div>
      )}

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
              {msg.source === 'cloud-llm' && (
                <div className="flex items-center gap-1 text-[9px] font-semibold text-primary mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Cloud-enhanced</span>
                </div>
              )}
              <div className="flex items-start justify-between gap-2">
                <div className="leading-relaxed font-normal whitespace-pre-wrap flex-1">{msg.text}</div>
                {msg.sender === 'agent' && FEATURES.SPEECH_SYNTHESIS && hasVoice && (
                  <button
                    type="button"
                    onClick={() => toggleSpeak(msg.id, msg.text)}
                    className="p-1 rounded-lg text-muted hover:text-primary transition shrink-0 cursor-pointer"
                    title={speakingMsgId === msg.id ? 'Stop read-aloud' : 'Read aloud'}
                    aria-label={speakingMsgId === msg.id ? 'Stop read-aloud' : 'Read aloud'}
                  >
                    {speakingMsgId === msg.id ? (
                      <VolumeX className="w-3.5 h-3.5 text-danger" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

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
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-xs truncate block text-heading">{prod.name}</span>
                                {prod.greenwashing?.isGreenwashed && (
                                  <span
                                    className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shrink-0"
                                    title={prod.greenwashing.reason}
                                  >
                                    ⚠️ Check claims
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-serif font-bold text-primary">₹{prod.price}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddProductFromChat(prod)}
                            className="px-2.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-primary-contrast font-semibold text-[10px] flex items-center gap-1 shrink-0 transition-colors shadow-soft-xs focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
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

              {/* Goal-Based Starter Kit Basket Plan */}
              {msg.basketPlan && (
                <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 space-y-2.5 text-text shadow-soft-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-heading text-xs">Conscious Basket Plan</div>
                      <div className="text-[10px] text-muted">{msg.basketPlan.itemCount} items curated</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-serif font-bold text-primary">₹{msg.basketPlan.totalPrice}</div>
                      <div className="text-[10px] text-muted">Budget: ₹{msg.basketPlan.budget}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                    <div className="p-1.5 rounded-xl bg-surface border border-line">
                      <div className="font-bold text-primary">-{msg.basketPlan.savings.co2Saved}kg</div>
                      <div className="text-muted text-[8px]">CO₂ Avoided</div>
                    </div>
                    <div className="p-1.5 rounded-xl bg-surface border border-line">
                      <div className="font-bold text-accent">-{msg.basketPlan.savings.plasticSaved}g</div>
                      <div className="text-muted text-[8px]">Plastic Diverted</div>
                    </div>
                    <div className="p-1.5 rounded-xl bg-surface border border-line">
                      <div className="font-bold text-heading">{msg.basketPlan.averageEcoScore}/100</div>
                      <div className="text-muted text-[8px]">Avg EcoScore</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      msg.basketPlan.items.forEach((item) => addToCart(item, 1));
                      showToast(`Added all ${msg.basketPlan.items.length} items to cart!`, 'success');
                      playSound('success');
                    }}
                    className="w-full py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-xs flex items-center justify-center gap-1.5 shadow-soft-xs transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add Entire Basket to Cart (₹{msg.basketPlan.totalPrice})</span>
                  </button>
                </div>
              )}

              {/* Trade-off Explanation vs Runner-up */}
              {msg.tradeoffs && (
                <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/25 text-text text-[11px] space-y-1">
                  <div className="font-bold text-heading text-[10px] uppercase tracking-wider flex items-center gap-1 text-accent">
                    <span>⚖️ Why #1 won vs &ldquo;{msg.tradeoffs.runnerUpName}&rdquo;:</span>
                  </div>
                  <div className="space-y-0.5 text-[10px]">
                    <div className="text-emerald-700 font-medium">
                      ✓ Superior: {msg.tradeoffs.beats.join('; ')}
                    </div>
                    <div className="text-muted">
                      △ Trade-off: {msg.tradeoffs.givesUp.join('; ')}
                    </div>
                  </div>
                </div>
              )}

              {/* Visible Reasoning Trace (Feature 7) */}
              {msg.trace && msg.trace.length > 0 && (
                <details
                  className="mt-1 text-[11px] bg-surface-sunken/90 rounded-xl border border-line p-2 transition-all group"
                  open={Boolean(msg.isFirstResponse)}
                >
                  <summary className="font-bold text-primary flex items-center justify-between cursor-pointer select-none">
                    <span className="flex items-center gap-1.5">
                      <span>🧠 How I decided</span>
                      <span className="text-[10px] text-muted font-normal">({msg.trace.length} steps)</span>
                    </span>
                    <span className="text-[10px] text-muted font-normal underline group-open:no-underline">
                      details
                    </span>
                  </summary>
                  <div className="mt-2 space-y-1.5 pl-2.5 border-l-2 border-primary/40 text-text">
                    {msg.trace.map((step, sIdx) => (
                      <div key={sIdx} className="space-y-0.5">
                        <div className="font-semibold text-[10px] text-heading flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{step.step}:</span>
                        </div>
                        <div className="text-[10px] text-muted leading-tight pl-2.5">{step.detail}</div>
                      </div>
                    ))}
                  </div>
                </details>
              )}

              {/* Clarification Quick Options */}
              {msg.clarification && msg.clarification.options && (
                <div className="space-y-1.5 pt-1 border-t border-line">
                  <div className="text-[10px] text-muted font-medium">Suggested choices:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.clarification.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSendMessage(opt.prompt)}
                        className="px-2.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        {opt.label}
                      </button>
                    ))}
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
                        className="px-2.5 py-1 rounded-lg bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-[10px] shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
                      >
                        Swap
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Did you mean suggestion chip */}
              {msg.didYouMean && (
                <div className="pt-1.5 border-t border-line">
                  <div className="text-[10px] text-muted mb-1 font-medium">Suggested query:</div>
                  <button
                    type="button"
                    onClick={() => handleSendMessage(msg.didYouMean)}
                    className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-xs inline-flex items-center gap-1.5 transition-colors border border-primary/20 cursor-pointer"
                  >
                    <span>Search for &ldquo;{msg.didYouMean}&rdquo;</span>
                  </button>
                </div>
              )}

              {/* Empty state category suggestions when nothing matched (Bug 10: show category chips on all no-result replies) */}
              {msg.sender === 'agent' && (!msg.data || msg.data.length === 0) && !msg.cartReview && !msg.quickChips && !msg.clarification && !msg.basketPlan && (
                <div className="pt-1.5 border-t border-line space-y-1.5">
                  <span className="text-[10px] text-muted block font-medium">Or explore conscious categories:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Kitchen', 'Personal Care', 'Home', 'Bags'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleSendMessage(`Show ${cat} items`)}
                        className="px-2 py-1 rounded-lg bg-surface-sunken hover:bg-line/40 text-text border border-line text-[10px] font-medium transition-colors cursor-pointer"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
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
        {(lang === 'hi' ? QUICK_CHIPS_HI : QUICK_CHIPS_EN).map((chip) => (
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
          placeholder={t('agent.inputPlaceholder', 'Ask about swaps, budget gifts, scoring...')}
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
