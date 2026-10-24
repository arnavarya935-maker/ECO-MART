import React, { useState, useMemo } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ShoppingBag,
  Plus,
  Check,
  Search,
  X
} from 'lucide-react';
import productsData from '../data/products.json';
import { useCart } from '../context/CartContext';
import { playSound } from '../lib/audio';

// Hindi Translations & Display Names for Kirana Products
const HINDI_PRODUCT_MAP = {
  'kit-01': { hi: 'बांस की कटलरी सेट', desc: 'कांटा, चम्मच, चाकू और स्ट्रॉ - १००% प्लास्टिक मुक्त' },
  'kit-02': { hi: 'मोम वाले खाने के रैप', desc: 'प्लास्टिक पन्नी की जगह कपड़े का शुद्ध आवरण' },
  'kit-03': { hi: 'तांबे की पानी की बोतल', desc: 'शुद्ध तांबा, स्वास्थ्यवर्धक व टिकाऊ' },
  'kit-04': { hi: 'नारियल के रेशे का बर्तन स्क्रबर', desc: 'प्राकृतिक नारियल जूट से बर्तनों की धुलाई' },
  'kit-05': { hi: 'स्टील का टिफिन बॉक्स', desc: 'मजबूत फूड-ग्रेड स्टेनलेस स्टील डब्बा' },
  'kit-06': { hi: 'मिट्टी की हांडी व बर्तन', desc: 'प्राकृतिक मिट्टी, पकाने के लिए शुद्ध' },
  'pers-01': { hi: 'नीम की लकड़ी की कंघी', desc: 'बालों के लिए गुणकारी और पूरी तरह प्राकृतिक' },
  'pers-02': { hi: 'बांस का टूथब्रश', desc: 'प्लास्टिक ब्रश का सबसे शुद्ध विकल्प' },
  'pers-03': { hi: 'हाथ से बना नीम साबुन', desc: 'शुद्ध नीम तेल, बिना किसी रसायन के' },
  'pers-04': { hi: 'ठोस शैम्पू बार', desc: 'प्लास्टिक की बोतल से मुक्ति, ५०+ धुलाई' },
  'bag-01': { hi: 'जैविक खादी सूती झोला', desc: 'सब्जी और खरीदारी के लिए मजबूत थैला' },
  'bag-02': { hi: 'मजबूत जूट का थैला', desc: 'भारी सामान उठाने के लिए टिकाऊ' },
  'clean-01': { hi: 'प्राकृतिक रीठा (साबुन नट्स)', desc: 'कपड़े धोने के लिए प्राकृतिक रीठा' },
  'clean-02': { hi: 'नारियल झाड़ू व ब्रश', desc: 'घर की सफाई का पारंपरिक देसी तरीका' },
  'stat-01': { hi: 'बीज वाली नोटबुक (डायरी)', desc: 'कागज खत्म होने पर गमले में लगाएं पौधा' }
};

const KIRANA_CATEGORIES = [
  { id: 'all', hi: 'सब सामान', en: 'All Items' },
  { id: 'Kitchen', hi: 'रसोई का सामान', en: 'Kitchen' },
  { id: 'Personal Care', hi: 'व्यक्तिगत देखभाल', en: 'Personal Care' },
  { id: 'Bags', hi: 'थैले व झोले', en: 'Bags & Totes' },
  { id: 'Cleaning & Laundry', hi: 'घर व सफाई', en: 'Cleaning' }
];

const QUICK_VOICE_CHIPS = [
  { hi: 'नीम साबुन', en: 'Neem Soap' },
  { hi: 'बांस टूथब्रश', en: 'Bamboo Brush' },
  { hi: 'सूती झोला', en: 'Cotton Bag' },
  { hi: 'रीठा', en: 'Soapnuts' },
  { hi: 'तांबे की बोतल', en: 'Copper Bottle' },
  { hi: 'स्टील डब्बा', en: 'Steel Box' }
];

export default function KiranaPage() {
  const { addToCart, cartItems, setIsCartOpen } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [addedMap, setAddedMap] = useState({});

  // Filter eco-friendly items suitable for daily Kirana grocery
  const kiranaProducts = useMemo(() => {
    return productsData.filter((p) => {
      // Must be eco-friendly and belong to daily consumer categories
      if (!p.isEcoFriendly) return false;
      const validCats = ['Kitchen', 'Personal Care', 'Bags', 'Cleaning & Laundry', 'Stationery'];
      if (!validCats.includes(p.category)) return false;

      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

      // Search filter (English or Hindi transliteration)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const hiData = HINDI_PRODUCT_MAP[p.id]?.hi || '';
        const nameMatch = p.name.toLowerCase().includes(q);
        const hiMatch = hiData.toLowerCase().includes(q);
        const catMatch = p.category.toLowerCase().includes(q);
        if (!nameMatch && !hiMatch && !catMatch) return false;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Voice Input via Web Speech API
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('आपके ब्राउज़र में आवाज़ पहचान (Web Speech) उपलब्ध नहीं है। कृपया लिखकर खोजें।');
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN'; // Prioritize Hindi voice recognition
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
        playSound('pop');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        setSearchQuery(transcript);
        setIsListening(false);
        playSound('click');
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError('माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया अनुमति दें या नीचे लिखकर खोजें।');
        } else {
          setSpeechError('आवाज़ स्पष्ट नहीं सुनाई दी। कृपया दोबारा बोलें।');
        }
        setTimeout(() => setSpeechError(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setSpeechError('आवाज़ पहचान शुरू नहीं हो सकी।');
    }
  };

  // Voice Output via Web Speech Synthesis (Hindi Text-to-Speech)
  const speakProduct = (prod) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === prod.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const hiTitle = HINDI_PRODUCT_MAP[prod.id]?.hi || prod.name;
    const text = `यह है ${hiTitle}। कीमत ₹${prod.price}। यह पूरी तरह प्लास्टिक मुक्त और पर्यावरण अनुकूल है।`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(prod.id);
    window.speechSynthesis.speak(utterance);
  };

  const handleAdd = (prod) => {
    addToCart(prod, 1);
    playSound('pop');
    setAddedMap((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [prod.id]: false }));
    }, 1200);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-sand-50 py-8 px-4 sm:px-6 lg:px-8 text-forest-950 font-sans transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Kirana Store Header */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border-2 border-forest-900 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-800 border border-emerald-500/30">
                  🏪 शुद्ध देसी किराना मोड (Kirana Mode)
                </span>
                <span className="text-xs text-muted font-medium">High-Contrast & Voice First</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-heading">
                ईकोमार्ट देसी किराना
              </h1>
              <p className="text-secondary mt-1 text-sm sm:text-base font-medium">
                रोज़मर्रा का शुद्ध, बिना प्लास्टिक वाला सामान • बड़े बटन व आवाज़ से खोजें
              </p>
            </div>

            {/* Shopping Bag Button (Extra Large for Kirana) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-6 py-4 rounded-2xl bg-forest-900 text-white font-bold text-base flex items-center justify-center gap-3 shadow-md hover:bg-forest-800 transition active:scale-95 cursor-pointer self-start sm:self-auto min-h-[56px]"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-6 h-6 text-emerald-400" />
              <span>झोला देखें ({totalCartCount})</span>
            </button>
          </div>

          {/* Voice Search Bar & Controls */}
          <div className="mt-6 pt-6 border-t-2 border-line space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Text Search Input */}
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="सामान खोजें (जैसे: साबुन, कंघी, झोला)..."
                  className="w-full bg-surface-raised border-2 border-line rounded-2xl pl-12 pr-10 py-3.5 text-base font-medium text-heading focus:outline-none focus:border-forest-900 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted hover:text-heading"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Big Voice Search Button */}
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer min-h-[48px] shadow-sm ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    <span>सुन रहा हूँ... बोलिए</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    <span>बोलकर खोजें (Voice)</span>
                  </>
                )}
              </button>
            </div>

            {/* Error / Feedback notification */}
            {speechError && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-900 text-xs font-semibold">
                {speechError}
              </div>
            )}

            {/* Quick Speech Chips */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-xs font-bold text-muted">जल्दी खोजें:</span>
              {QUICK_VOICE_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(chip.hi)}
                  className="px-3 py-1.5 rounded-xl bg-surface-raised hover:bg-sand-100 border border-line text-xs font-bold text-heading transition cursor-pointer"
                >
                  {chip.hi} <span className="text-[10px] text-muted font-normal">({chip.en})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hindi Category Tabs */}
          <div className="mt-4 pt-4 border-t border-line flex gap-2 overflow-x-auto pb-1">
            {KIRANA_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer border ${
                  selectedCategory === cat.id
                    ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                    : 'bg-surface-raised hover:bg-sand-100 text-heading border-line'
                }`}
              >
                <span>{cat.hi}</span>
                <span className="text-[10px] opacity-75 font-normal ml-1.5">({cat.en})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Kirana Products Grid (High Contrast & Large Buttons) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {kiranaProducts.map((prod) => {
            const hiInfo = HINDI_PRODUCT_MAP[prod.id] || { hi: prod.name, desc: prod.description };
            const isAdded = addedMap[prod.id];
            const isSpeaking = speakingId === prod.id;

            return (
              <div
                key={prod.id}
                className="bg-surface rounded-3xl p-5 border-2 border-line hover:border-forest-900 transition-all shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Image & Voice Read-Aloud */}
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-surface-sunken border border-line">
                    <img
                      src={prod.image || prod.images?.[0]}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-forest-900 text-white shadow-sm">
                        १००% प्लास्टिक मुक्त
                      </span>
                    </div>

                    {/* Read Aloud Button */}
                    <button
                      type="button"
                      onClick={() => speakProduct(prod)}
                      className={`absolute bottom-2.5 right-2.5 p-2 rounded-xl transition cursor-pointer shadow-sm ${
                        isSpeaking
                          ? 'bg-rose-600 text-white ring-2 ring-white'
                          : 'bg-surface/90 hover:bg-surface text-forest-900'
                      }`}
                      title={isSpeaking ? 'बोलना बंद करें' : 'आवाज़ में सुनें'}
                      aria-label="Listen to product details"
                    >
                      {isSpeaking ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Hindi Title & English Subtitle */}
                  <div>
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-heading leading-tight">
                      {hiInfo.hi}
                    </h3>
                    <span className="text-xs text-muted block mt-0.5">
                      {prod.name}
                    </span>
                    <p className="text-xs text-secondary mt-1.5 leading-relaxed">
                      {hiInfo.desc}
                    </p>
                  </div>
                </div>

                {/* Price and Big Add to Bag Button */}
                <div className="pt-3 border-t-2 border-line flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-muted block">
                      दुकान कीमत
                    </span>
                    <span className="text-2xl font-black text-forest-900 font-serif">
                      ₹{prod.price}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAdd(prod)}
                    className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer min-h-[48px] shadow-sm ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-forest-900 hover:bg-forest-800 text-white active:scale-95'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>झोले में डाला!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>झोले में डालें</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search Result Fallback */}
        {kiranaProducts.length === 0 && (
          <div className="bg-surface rounded-3xl p-12 text-center border-2 border-line space-y-3">
            <span className="text-4xl">🎋</span>
            <h3 className="font-serif font-bold text-xl text-heading">
              कोई सामान नहीं मिला
            </h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              "{searchQuery}" के लिए किराना सामान नहीं मिला। कृपया ऊपर दिए गए बटनों में से चुनें।
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-forest-900 text-white text-xs font-bold hover:bg-forest-800 transition"
            >
              सभी सामान देखें
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
