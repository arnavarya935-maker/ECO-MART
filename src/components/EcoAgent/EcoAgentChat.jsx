import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Send,
  User,
  ShoppingBag,
  Trash2,
  Mic,
  MicOff,
  Check,
  Sparkles,
  Sliders,
  Volume2,
  VolumeX,
  ShieldAlert,
  Brain
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useT } from '../../context/I18nContext';
import { FEATURES } from '../../lib/features';
import { sendAgentQuery } from '../../lib/ecoAgent';
import { runMultiAgentPipeline } from '../../lib/multiAgentEngine';
import { askEcoAgent } from '../../lib/ai/geminiAdapter';
import { playSound } from '../../lib/audio';
import PrioritiesPanel from '../decision/PrioritiesPanel';
import EcoScoreBadge from '../EcoScoreBadge';
import ReasoningExplanationCard from './ReasoningExplanationCard';
import AgentMemoryDrawer from './AgentMemoryDrawer';
import AIEnergyMeter from './AIEnergyMeter';
import HonestyMeter from './HonestyMeter';
import { appendBlackBoxLog } from '../../lib/ai/blackboxStore';
import { getStrictnessThreshold, setStrictnessThreshold, evaluateConfidenceBrake } from '../../lib/ai/confidenceBrake';

const QUICK_CHIPS_EN = [
  { id: 'cart-transformer', label: '🪄 Transform shopping list', query: 'Transform my shopping list' },
  { id: 'bamboo-swap', label: '🌱 Why bamboo toothbrush?', query: 'Why swap petroleum plastic for organic bamboo toothbrush?' },
  { id: 'detective', label: '🕵️ Check greenwashing', query: 'audit greenwashing claims on packaging' },
  { id: 'price-priority', label: '💰 I care most about price', query: 'I care most about price' },
  { id: 'gift', label: '🎁 Gift under ₹1000', query: 'Find an eco-friendly gift under ₹1000' },
  { id: 'kitchen', label: '🎋 Plastic-free kitchen', query: 'Show plastic-free items for my kitchen' },
  { id: 'cart', label: '🛒 Review my cart', query: 'Review my cart and suggest greener swaps' },
  { id: 'uncertainty-test', label: '❓ Honest boundary test', query: 'Is this bamboo brush certified to degrade in 3 days?' },
  { id: 'scoring', label: '🔬 How EcoScore works', query: 'Explain how the eco score is calculated' }
];

const QUICK_CHIPS_HI = [
  { id: 'cart-transformer', label: '🪄 खरीदारी सूची को बदलें', query: 'Transform my shopping list' },
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
  const navigate = useNavigate();
  const {
    isAgentOpen,
    setIsAgentOpen,
    cartItems,
    allProducts,
    addToCart,
    swapItemInCart,
    showToast,
    userPriorities,
    updateUserPriorities,
    addToCompare,
    clearCompare,
    setIsCompareOpen
  } = useCart();

  const { t, lang } = useT();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPriorities, setShowPriorities] = useState(false);
  const [memoryDrawerOpen, setMemoryDrawerOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [speechSupported] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  });
  const [hasVoice, setHasVoice] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [totalSessionWh, setTotalSessionWh] = useState(0.24);
  const [lastQueryWh, setLastQueryWh] = useState(0.12);
  const [queryCount, setQueryCount] = useState(2);

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

  const [strictness, setStrictness] = useState(() => getStrictnessThreshold());
  const [showStrictnessPopover, setShowStrictnessPopover] = useState(false);

  useEffect(() => {
    const handler = (e) => setStrictness(e.detail);
    window.addEventListener('strictness-updated', handler);
    return () => window.removeEventListener('strictness-updated', handler);
  }, []);

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

    // Cart Transformer list detection (Requirement 6)
    const lowerQ = q.toLowerCase();
    const tokenCount = q.split(/[\r\n,]/).filter((s) => s.trim().length > 1).length;
    const isListOrTransformer =
      lowerQ.includes('transform') ||
      lowerQ.includes('swap my list') ||
      tokenCount >= 3;

    if (isListOrTransformer) {
      setLoading(false);
      const listText = lowerQ.includes('transform my shopping list') ? '' : q;
      const agentMsg = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: "I can transform your shopping list into a sustainable, budget-respecting cart! Click below to review your items, greener swaps, and real environmental savings.",
        source: 'local-rules',
        data: [],
        transformerCta: {
          text: listText
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, agentMsg]);
      playSound('pop');
      return;
    }

    try {
      // Parallel execution: LLM adapter + local rules + Multi-Agent Collective (Planner, Researcher, Skeptic, Advisor)
      const aiPromise = askEcoAgent({
        query: q,
        language: lang,
        userPriorities,
        cartItems,
        allProducts
      }).catch(() => null);

      const localPromise = sendAgentQuery({
        query: q,
        cartItems,
        allProducts,
        context: {
          ...agentContext,
          userPriorities
        }
      }).catch(() => null);

      const multiAgentResult = runMultiAgentPipeline({
        query: q,
        allProducts,
        cartItems,
        userPriorities,
        contextProduct: agentContext.contextProduct || null
      });

      const [aiResult, responseRaw] = await Promise.all([aiPromise, localPromise]);
      const response = responseRaw || {};

      if (response.newPriorities && updateUserPriorities) {
        updateUserPriorities(response.newPriorities);
        showToast('Decision priorities updated', 'info');
      }

      const isFirst = !firstAgentAnswerDone;
      if (isFirst) setFirstAgentAnswerDone(true);

      const energy = Number(aiResult?.estimated_energy_wh) || 0.12;
      setTotalSessionWh((prev) => Number((prev + energy).toFixed(2)));
      setLastQueryWh(energy);
      setQueryCount((prev) => prev + 1);

      // Prefer AI answer text when rich knowledge is returned
      const replyText =
        aiResult?.answer && (!response.basketPlan && !response.cartReview)
          ? aiResult.answer
          : response.message || aiResult?.answer || multiAgentResult?.pipelineHandoffs?.[3]?.summary || 'I evaluated your request across cradle-to-grave sustainability factors.';

      const finalData = Array.isArray(response.data) && response.data.length > 0
        ? response.data
        : (multiAgentResult?.items && multiAgentResult.items.length > 0
            ? multiAgentResult.items
            : (response.data?.results || aiResult?.recommended_products || []));

      const agentMsg = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: replyText,
        source: aiResult?.source === 'gemini' ? 'cloud-llm' : (response.source || 'multi-agent-collective'),
        data: finalData,
        didYouMean: response.didYouMean,
        tradeoffs: response.tradeoffs || multiAgentResult?.tradeoffs,
        trace: response.trace || [],
        pipelineHandoffs: multiAgentResult?.pipelineHandoffs || [],
        skepticReport: multiAgentResult?.skepticReport || null,
        proposedActions: multiAgentResult?.proposedActions || [],
        basketPlan: response.basketPlan || multiAgentResult?.basketPlan,
        clarification: response.clarification,
        isFirstResponse: isFirst,
        cartReview: response.cartReview,
        reasoning_summary: aiResult?.reasoning_summary,
        sources_or_assumptions: aiResult?.sources_or_assumptions,
        confidence: aiResult?.confidence || 'high',
        estimated_energy_wh: energy,
        model: aiResult?.model || (aiResult?.source === 'gemini' ? 'Gemini 1.5 Flash' : 'Multi-Agent Collective (Planner/Researcher/Skeptic/Advisor)'),
        isFallback: Boolean(aiResult?.isFallback),
        query: q,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Confidence Brake Evaluation (Feature F3)
      const brakeCheck = evaluateConfidenceBrake({
        query: q,
        rawConfidence: aiResult?.confidence || 'medium',
        answerText: replyText,
        strictness
      });

      let isBrakeTriggered = false;
      let finalText = replyText;
      let guardrailName = agentMsg.confidence === 'low' ? 'Admitted Uncertainty Flag' : 'Standard Metric Integrity';
      let guardrailStatus = 'held';

      if (brakeCheck.brakeTriggered) {
        isBrakeTriggered = true;
        finalText = brakeCheck.refusalMessage;
        guardrailName = 'Confidence Brake (Strictness Threshold Exceeded)';
        guardrailStatus = 'intercepted';
      }

      agentMsg.text = finalText;
      agentMsg.confidenceBrakeTriggered = isBrakeTriggered;
      agentMsg.confidenceScore = brakeCheck.confidenceScore;
      agentMsg.strictnessThreshold = strictness;
      agentMsg.neededInfo = brakeCheck.neededInfo;
      if (isBrakeTriggered) {
        agentMsg.confidence = 'declined';
        agentMsg.data = [];
      }

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
      appendBlackBoxLog({
        query: q,
        answerSummary: isBrakeTriggered
          ? `[Confidence Brake Triggered] Refused answer (${brakeCheck.confidenceScore}% < ${strictness}%). Required: ${brakeCheck.neededInfo.join(', ')}`
          : replyText,
        confidence: isBrakeTriggered ? 'declined' : agentMsg.confidence,
        guardrailTriggered: guardrailName,
        guardrailStatus,
        energyEstimateWh: energy,
        model: isBrakeTriggered ? 'EcoMart Confidence Brake' : agentMsg.model,
        sources: isBrakeTriggered ? ['Strictness Policy §4', 'Missing Lab Verification'] : agentMsg.sources_or_assumptions,
        isFallback: agentMsg.isFallback
      });
      playSound('pop');
    } catch {
      // Silent graceful offline fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          text: "I am operating in responsible offline mode. You can ask for plastic-free kitchen essentials, gifts under ₹1000, or click 'Review my cart' below!",
          source: 'local-fallback',
          confidence: 'high',
          estimated_energy_wh: 0,
          reasoning_summary: 'Loaded from local deterministic knowledge store.',
          sources_or_assumptions: ['Local verified sustainability dataset'],
          query: q,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, lang, cartItems, allProducts, agentContext, firstAgentAnswerDone, userPriorities, updateUserPriorities, showToast, strictness]);

  const sendRef = useRef(handleSendMessage);
  useEffect(() => {
    sendRef.current = handleSendMessage;
  });

  // Contextual Agent listener ("Ask Eco Agent about this")
  useEffect(() => {
    const handleContextQuery = (e) => {
      const { query, contextProduct } = e.detail || {};
      if (contextProduct) {
        setAgentContext((prev) => ({ ...prev, contextProduct }));
      }
      setIsAgentOpen(true);
      if (query && sendRef.current) {
        sendRef.current(query);
      }
    };
    window.addEventListener('ecomart-agent-query', handleContextQuery);
    return () => window.removeEventListener('ecomart-agent-query', handleContextQuery);
  }, [setIsAgentOpen]);

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
      className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-drawers w-full sm:w-[440px] max-w-[calc(100vw-1.5rem)] h-[620px] max-h-[calc(100dvh-6.5rem)] bg-surface border border-line rounded-3xl shadow-soft-xl flex flex-col overflow-hidden text-text animate-slide-up"
    >
      {/* Top Header Bar */}
      <div className="p-4 bg-surface-raised border-b border-line text-heading flex items-center justify-between shadow-soft-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-soft-xs">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="font-sans font-bold text-sm flex items-center gap-1.5 text-heading">
              <span>Eco Agent</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-text-muted font-medium flex items-center gap-1 font-mono uppercase tracking-wider">
              <span className="text-emerald-400">Gemini + Responsible AI</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {/* AI Compute Energy Meter */}
          <AIEnergyMeter
            compact={true}
            totalSessionWh={totalSessionWh}
            lastQueryWh={lastQueryWh}
            queryCount={queryCount}
          />

          {/* Honesty & Uncertainty Meter */}
          <HonestyMeter
            messages={messages}
            compact={true}
          />

          {/* Confidence Brake Control */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowStrictnessPopover(!showStrictnessPopover)}
              className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors border cursor-pointer flex items-center gap-1 ${
                showStrictnessPopover || strictness >= 80
                  ? 'bg-amber-500/20 text-amber-800 border-amber-500/40 font-bold'
                  : 'bg-surface-sunken text-text-secondary border-line hover:text-heading hover:bg-surface'
              }`}
              title="Configure Confidence Brake Strictness Threshold"
            >
              <ShieldAlert className="w-2.5 h-2.5 text-amber-600" />
              <span>Brake: {strictness}%</span>
            </button>

            {showStrictnessPopover && (
              <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-surface border border-line rounded-2xl shadow-xl z-50 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-heading">
                  <span className="flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    Confidence Brake
                  </span>
                  <span className="font-mono text-primary">{strictness}%</span>
                </div>
                <p className="text-[10px] text-muted leading-tight">
                  Declines answers when certainty falls below threshold.
                </p>
                <input
                  type="range"
                  min="30"
                  max="95"
                  step="5"
                  value={strictness}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setStrictness(val);
                    setStrictnessThreshold(val);
                  }}
                  className="w-full accent-primary h-1.5 bg-surface-sunken rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-muted font-mono">
                  <span>Lenient (40%)</span>
                  <span>Strict (75%)</span>
                  <span>Ultra (90%)</span>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowPriorities(!showPriorities)}
            className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors border cursor-pointer flex items-center gap-1 ${
              showPriorities
                ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold'
                : 'bg-surface-sunken text-text-secondary border-line hover:text-heading hover:bg-surface'
            }`}
            title="Adjust multi-criteria decision weights"
          >
            <Sliders className="w-2.5 h-2.5" />
            <span>Priorities</span>
          </button>

          <button
            type="button"
            onClick={() => setMemoryDrawerOpen(true)}
            className="px-2 py-1 rounded-lg bg-surface-sunken text-text-secondary text-[10px] font-semibold hover:bg-surface hover:text-heading transition-colors border border-line cursor-pointer flex items-center gap-1"
            title="Inspect & manage stored agent memory"
          >
            <Brain className="w-2.5 h-2.5 text-primary" />
            <span>Memory</span>
          </button>
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
              className="px-2 py-1 rounded-lg bg-surface-sunken text-text-secondary text-[10px] font-semibold hover:bg-surface transition-colors border border-line cursor-pointer"
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
            className="w-8 h-8 text-text-muted hover:text-heading rounded-lg hover:bg-surface-sunken flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsAgentOpen(false)}
            className="w-8 h-8 text-text-muted hover:text-heading rounded-lg hover:bg-surface-sunken flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
            aria-label="Close Agent"
          >
            <X className="w-4 h-4" />
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
              <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-soft-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs space-y-2.5 ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-contrast font-medium rounded-tr-xs shadow-soft-sm'
                  : 'bg-surface-raised text-heading border border-line rounded-tl-xs shadow-card'
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

              {/* Confidence Brake Specialized Refusal Card */}
              {msg.confidenceBrakeTriggered && (
                <div className="pt-2 border-t border-amber-500/30">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-amber-800 uppercase">
                      <span className="flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                        Confidence Brake Interception
                      </span>
                      <span className="font-mono bg-amber-500/20 px-1.5 py-0.5 rounded">
                        Certainty: {msg.confidenceScore}% &lt; {msg.strictnessThreshold}%
                      </span>
                    </div>
                    {msg.neededInfo && msg.neededInfo.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-amber-500/20">
                        <span className="text-[10px] font-bold text-heading block">
                          Required data to satisfy strictness:
                        </span>
                        <ul className="space-y-1 text-[11px] text-muted">
                          {msg.neededInfo.map((info, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-amber-600 font-bold">•</span>
                              <span>{info}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cart Transformer Action Button */}
              {msg.transformerCta && (
                <div className="pt-2 border-t border-line">
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/transform', { state: { prefilledList: msg.transformerCta.text } });
                      setIsAgentOpen(false);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs flex items-center justify-center gap-2 shadow-soft-xs transition cursor-pointer min-h-[44px] active:scale-98 focus-visible:outline-2 focus-visible:outline-focus"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Open in Cart Transformer</span>
                  </button>
                </div>
              )}

              {/* Recommended Product Cards Inside Chat (Feature 20) */}
              {msg.data && msg.data.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-line">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                    Recommended Sustainable Options:
                  </span>
                  <div className="space-y-2">
                    {msg.data.slice(0, 3).map((prod) => {
                      const isAdded = addedItemMap[prod.id];
                      return (
                        <div
                          key={prod.id}
                          className="p-3 rounded-2xl bg-surface-raised border border-line flex items-center justify-between gap-2.5 text-text shadow-card hover:shadow-lift transition-all"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <EcoScoreBadge
                              score={prod.ecoScore || 90}
                              grade={prod.grade || 'A'}
                              size="sm"
                              variant="ring"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-xs truncate block text-heading">{prod.name}</span>
                                {prod.greenwashing?.isGreenwashed && (
                                  <span
                                    className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-warning-subtle text-accent border border-warning/30 shrink-0"
                                    title={prod.greenwashing.reason}
                                  >
                                    ⚠️ Check claims
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-serif font-bold text-primary">₹{prod.price}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddProductFromChat(prod)}
                            className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-sans font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-all shadow-soft-sm cursor-pointer min-h-[36px]"
                          >
                            {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
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
                  className="mt-2 text-xs bg-surface-sunken/80 rounded-2xl border border-line p-3 transition-all group shadow-2xs"
                  open={Boolean(msg.isFirstResponse)}
                >
                  <summary className="font-bold text-primary flex items-center justify-between cursor-pointer select-none py-0.5">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-surface-accent border border-primary/20 text-primary flex items-center justify-center text-[11px]">🧠</span>
                      <span className="text-xs font-serif font-bold text-heading">How I decided</span>
                      <span className="text-[10px] text-muted font-normal">({msg.trace.length} verified steps)</span>
                    </span>
                    <span className="text-[10px] text-primary font-semibold underline group-open:no-underline">
                      view trace
                    </span>
                  </summary>
                  <div className="mt-3 pt-2 border-t border-line/60 space-y-3">
                    {msg.trace.map((step, sIdx) => (
                      <div key={sIdx} className="relative pl-6">
                        {/* Thin vertical connector line */}
                        {sIdx < msg.trace.length - 1 && (
                          <div className="absolute left-2.5 top-5 bottom-0 w-px bg-primary/25" aria-hidden="true" />
                        )}
                        {/* Step number badge */}
                        <div className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-surface-raised border border-primary/30 text-primary font-bold text-[10px] flex items-center justify-center shadow-2xs">
                          {sIdx + 1}
                        </div>
                        <div className="space-y-0.5">
                          <div className="font-bold text-[11px] text-heading flex items-center gap-1.5">
                            <span>{step.step}</span>
                            <Check className="w-3 h-3 text-primary stroke-[2.5]" />
                          </div>
                          <div className="text-[11px] text-secondary leading-relaxed">{step.detail}</div>
                        </div>
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

              {/* Structured Tool Action Confirmation Cards (Tier 1 Feature 6) */}
              {msg.proposedActions && msg.proposedActions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-line">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-primary" />
                    <span>Action Awaiting Confirmation:</span>
                  </span>
                  {msg.proposedActions.map((action) => {
                    const status = actionStatus[action.id];
                    return (
                      <div
                        key={action.id}
                        className="p-3 rounded-2xl bg-surface-raised border border-primary/30 shadow-soft-xs space-y-2 text-left"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-heading text-xs">{action.label}</div>
                            <div className="text-[11px] text-secondary mt-0.5">{action.description}</div>
                          </div>
                          {status && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              status === 'confirmed'
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                            }`}>
                              {status === 'confirmed' ? '✓ Executed' : '✕ Declined'}
                            </span>
                          )}
                        </div>

                        {action.products && action.products.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {action.products.map((p) => (
                              <span
                                key={p.id}
                                className="px-2 py-0.5 rounded-lg bg-surface-sunken border border-line text-[10px] text-heading font-medium flex items-center gap-1"
                              >
                                <span>{p.name}</span>
                                <span className="text-primary font-bold">₹{p.price}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {!status && (
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (action.type === 'add_to_cart') {
                                  (action.products || []).forEach((prod) => addToCart(prod, 1));
                                  showToast(`Added ${action.products.length} item(s) to cart`, 'success');
                                  playSound('success');
                                } else if (action.type === 'compare_products') {
                                  clearCompare?.();
                                  (action.products || []).forEach((prod) => addToCompare?.(prod));
                                  setIsCompareOpen?.(true);
                                  showToast('Opening side-by-side comparison', 'info');
                                }
                                setActionStatus((prev) => ({ ...prev, [action.id]: 'confirmed' }));
                              }}
                              className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-[11px] flex items-center gap-1 shadow-soft-xs cursor-pointer transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Confirm &amp; Execute</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActionStatus((prev) => ({ ...prev, [action.id]: 'declined' }));
                                showToast('Action cancelled', 'info');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-surface-sunken hover:bg-surface text-secondary border border-line text-[11px] font-medium cursor-pointer transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Responsible AI: Explainable Decision & Sources Card (Part 3 #1) */}
              {msg.sender === 'agent' && (
                <ReasoningExplanationCard
                  reasoningSummary={
                    msg.reasoning_summary ||
                    (msg.trace && msg.trace.length > 0
                      ? msg.trace.map((t) => t.detail).join(' ')
                      : 'Evaluated multi-criteria lifecycle impacts (carbon, plastic packaging, water use) and verified credentials against EcoMart catalog.')
                  }
                  sourcesOrAssumptions={
                    msg.sources_or_assumptions && msg.sources_or_assumptions.length > 0
                      ? msg.sources_or_assumptions
                      : [
                          'EcoMart LCA dataset (cradle-to-grave parameters)',
                          'Central Pollution Control Board (CPCB) plastic packaging benchmarks',
                          'Standard municipal recycling and composting specifications'
                        ]
                  }
                  confidence={msg.confidence || 'high'}
                  estimatedEnergyWh={msg.estimated_energy_wh || 0.12}
                  model={msg.model || (msg.source === 'cloud-llm' ? 'Gemini 1.5 Flash' : 'Multi-Agent Collective')}
                  isFallback={Boolean(msg.isFallback || msg.source === 'local-fallback' || msg.source === 'local-rules')}
                  messageId={msg.id}
                  query={msg.query || ''}
                  pipelineHandoffs={msg.pipelineHandoffs || []}
                  skepticReport={msg.skepticReport || null}
                />
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
            <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-soft-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="p-3 bg-surface-raised rounded-2xl border border-line text-xs font-medium flex items-center gap-2 shadow-card text-text-secondary">
              <div className="flex items-center gap-1 py-1 px-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse [animation-delay:300ms]" />
              </div>
              <span className="text-text-secondary font-medium">Analyzing conscious catalog...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Chips (Feature 20) */}
      <div className="p-2.5 bg-surface-sunken/80 border-t border-line overflow-x-auto flex items-center gap-2 scrollbar-none">
        {(lang === 'hi' ? QUICK_CHIPS_HI : QUICK_CHIPS_EN).map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => handleSendMessage(chip.query)}
            className="px-3.5 py-1.5 rounded-full bg-surface-raised hover:bg-surface-accent hover:border-primary/40 hover:text-primary text-secondary text-xs font-sans font-medium border border-line transition-all shrink-0 shadow-soft-xs focus-visible:outline-2 focus-visible:outline-focus min-h-[36px] cursor-pointer"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="sticky bottom-0 z-10 p-3 bg-surface-raised/95 backdrop-blur-md border-t border-line flex items-center gap-2">
        {speechSupported && (
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer ${
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
          className="w-11 h-11 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-primary-contrast transition-all shadow-soft-sm flex items-center justify-center focus-visible:outline-2 focus-visible:outline-focus cursor-pointer shrink-0"
          aria-label="Send message"
        >
          <Send className="w-4 h-4 text-primary-contrast" />
        </button>
      </div>

      {/* Transparent Memory Inspector Drawer (Feature 7) */}
      <AgentMemoryDrawer
        isOpen={memoryDrawerOpen}
        onClose={() => setMemoryDrawerOpen(false)}
      />
    </div>
  );
}
