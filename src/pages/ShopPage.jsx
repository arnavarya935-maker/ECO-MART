import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search, Filter, SlidersHorizontal, RotateCcw, Sparkles, X, ChevronRight,
  ChevronLeft, ArrowUpDown, Star, ShieldCheck, Scale, History, Heart, Scan,
  Tag, Compass, Lightbulb
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { calculateEcoScore } from '../lib/ecoScore';
import ProductCard from '../components/ProductCard';
import BarcodeScannerModal from '../components/BarcodeScannerModal';

const CATEGORY_DETAILS = {
  Kitchen: {
    tagline: 'Zero-Waste Culinary Essentials',
    description: 'Replace toxic non-stick coatings and single-use cling film with renewable bamboo, copper, and beeswax.',
    fact: 'Conventional kitchens throw out over 24 rolls of plastic film and 6 plastic sponges per household annually.'
  },
  'Personal Care': {
    tagline: 'Clean Routine, Clean Oceans',
    description: 'Sulfate-free, microplastic-free formulas packed in compostable paper or infinitely recyclable aluminum.',
    fact: 'Over 1 billion plastic toothbrushes end up in landfills each year in India and Southeast Asia alone.'
  },
  Fashion: {
    tagline: 'Circular & Organic Textiles',
    description: 'GOTS certified organic cotton, recycled canvas, and zero polyester runoff in every wash.',
    fact: 'A single polyester garment sheds up to 700,000 synthetic microfibers into our waterways per wash cycle.'
  },
  Stationery: {
    tagline: 'Tree-Free Paper & Seed Embedded Pens',
    description: 'Recycled cotton rag paper and pencils that sprout into tulsi and coriander when planted.',
    fact: 'Recycling 1 ton of office paper saves 17 trees, 7,000 gallons of water, and 4,100 kWh of electricity.'
  },
  Home: {
    tagline: 'Conscious Living Spaces',
    description: 'Sustainably harvested neem wood, natural coir fiber, and terracotta artisan homeware.',
    fact: 'Coir and terracotta support rural Indian artisan clusters while emitting near-zero net carbon.'
  },
  Bags: {
    tagline: 'Handwoven Artisanal Totes',
    description: 'Heavyweight organic jute, canvas, and hemp carriers engineered for 1,000+ reliable shopping trips.',
    fact: 'One reusable cotton bag used for 2 years prevents over 400 plastic grocery bags from entering landfills.'
  }
};

export default function ShopPage({ initialCategory, onCategoryChange }) {
  const {
    allProducts,
    setIsAgentOpen,
    compareList,
    setIsCompareOpen,
    recentlyViewed,
    setSelectedProduct
  } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('eco_recent_searches');
      return saved ? JSON.parse(saved) : ['Bamboo', 'Organic Cotton', 'Plastic-Free', 'Copper', 'Neem'];
    } catch {
      return ['Bamboo', 'Organic Cotton', 'Plastic-Free'];
    }
  });
  const searchContainerRef = useRef(null);

  const addRecentSearch = (term) => {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 8);
    setRecentSearches(updated);
    try {
      localStorage.setItem('eco_recent_searches', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const removeRecentSearch = (term, e) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    try {
      localStorage.setItem('eco_recent_searches', JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [category, setCategory] = useState(initialCategory || 'All');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [maxPrice, setMaxPrice] = useState(3500);
  const [packagingFilter, setPackagingFilter] = useState('All');
  const [certFilter, setCertFilter] = useState('All');
  const [materialFilter, setMaterialFilter] = useState('All');
  const [onlyPlasticFree, setOnlyPlasticFree] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('eco-score-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const categories = [
    'All',
    'Kitchen',
    'Personal Care',
    'Fashion',
    'Stationery',
    'Home',
    'Bags',
    'Outdoor & Travel',
    'Cleaning & Laundry'
  ];
  const grades = ['All', 'A', 'B', 'C', 'D', 'E'];
  const packagingOptions = ['All', 'plastic-free', 'recycled', 'plastic'];

  // Extract all unique certifications
  const allCertifications = useMemo(() => {
    const set = new Set();
    (allProducts || []).forEach((p) => {
      (p.certifications || []).forEach((c) => set.add(c));
    });
    return ['All', ...Array.from(set)];
  }, [allProducts]);

  // Extract all unique materials
  const allMaterials = useMemo(() => {
    const set = new Set();
    (allProducts || []).forEach((p) => {
      if (p.material) {
        // extract primary material words
        p.material.split(/[\/,]/).forEach((m) => {
          const trimmed = m.trim();
          if (trimmed.length > 2) set.add(trimmed);
        });
      }
    });
    return ['All', ...Array.from(set).slice(0, 14)];
  }, [allProducts]);

  // Sync category if external prop changes
  React.useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
      setCurrentPage(1);
    }
  }, [initialCategory]);

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setCurrentPage(1);
    if (onCategoryChange) onCategoryChange(cat === 'All' ? null : cat);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategory('All');
    setGradeFilter('All');
    setMaxPrice(3500);
    setPackagingFilter('All');
    setCertFilter('All');
    setMaterialFilter('All');
    setOnlyPlasticFree(false);
    setOnlyInStock(false);
    setMinRating(0);
    setSortBy('eco-score-desc');
    setCurrentPage(1);
    if (onCategoryChange) onCategoryChange(null);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = (allProducts || []).map((p) => ({
      ...p,
      ecoScoreData: calculateEcoScore(p)
    }));

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (category !== 'All') {
      result = result.filter((p) => p.category === category);
    }

    // Grade
    if (gradeFilter !== 'All') {
      result = result.filter((p) => p.ecoScoreData.grade === gradeFilter);
    }

    // Max Price
    if (maxPrice < 3500) {
      result = result.filter((p) => p.price <= maxPrice);
    }

    // Packaging
    if (packagingFilter !== 'All') {
      result = result.filter((p) => p.packaging === packagingFilter);
    }

    // Plastic free toggle
    if (onlyPlasticFree) {
      result = result.filter((p) => p.packaging === 'plastic-free');
    }

    // Certification
    if (certFilter !== 'All') {
      result = result.filter((p) => (p.certifications || []).includes(certFilter));
    }

    // Material
    if (materialFilter !== 'All') {
      result = result.filter((p) => p.material && p.material.toLowerCase().includes(materialFilter.toLowerCase()));
    }

    // Rating
    if (minRating > 0) {
      result = result.filter((p) => (p.rating || 4.5) >= minRating);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'eco-score-desc') {
        return b.ecoScoreData.score - a.ecoScoreData.score;
      }
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (sortBy === 'carbon-asc') {
        return (a.carbonKg || 0) - (b.carbonKg || 0);
      }
      if (sortBy === 'distance-asc') {
        return (a.madeInKm || 0) - (b.madeInKm || 0);
      }
      return 0;
    });

    return result;
  }, [
    allProducts,
    searchQuery,
    category,
    gradeFilter,
    maxPrice,
    packagingFilter,
    onlyPlasticFree,
    certFilter,
    materialFilter,
    minRating,
    sortBy
  ]);

  // Smart search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const suggestions = [];
    (allProducts || []).forEach((p) => {
      if (p.name.toLowerCase().includes(q) && !suggestions.some((s) => s.text.toLowerCase() === p.name.toLowerCase())) {
        suggestions.push({ type: 'product', text: p.name, product: p });
      }
      if (p.material && p.material.toLowerCase().includes(q) && !suggestions.some((s) => s.text.toLowerCase() === p.material.toLowerCase())) {
        suggestions.push({ type: 'material', text: p.material });
      }
    });
    return suggestions.slice(0, 6);
  }, [searchQuery, allProducts]);

  // Paginated slice
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Active filters list for chips
  const activeFilters = [];
  if (category !== 'All') activeFilters.push({ label: `Category: ${category}`, clear: () => handleCategorySelect('All') });
  if (gradeFilter !== 'All') activeFilters.push({ label: `Grade: ${gradeFilter}`, clear: () => setGradeFilter('All') });
  if (maxPrice < 3500) activeFilters.push({ label: `Max: ₹${maxPrice}`, clear: () => setMaxPrice(3500) });
  if (packagingFilter !== 'All') activeFilters.push({ label: `Pack: ${packagingFilter}`, clear: () => setPackagingFilter('All') });
  if (onlyPlasticFree) activeFilters.push({ label: 'Plastic-Free Only', clear: () => setOnlyPlasticFree(false) });
  if (materialFilter !== 'All') activeFilters.push({ label: `Material: ${materialFilter}`, clear: () => setMaterialFilter('All') });
  if (certFilter !== 'All') activeFilters.push({ label: `Cert: ${certFilter}`, clear: () => setCertFilter('All') });
  if (searchQuery.trim()) activeFilters.push({ label: `"${searchQuery}"`, clear: () => setSearchQuery('') });
  if (minRating > 0) activeFilters.push({ label: `${minRating}★+`, clear: () => setMinRating(0) });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
              Full Sustainable Catalog
            </span>
            <span className="text-xs text-stone-500 font-medium">60+ Audited Products</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 mt-1">
            Shop with Purpose
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl">
            Compare lifecycle scores, filter plastic-free packaging, or let the Eco Agent suggest optimal alternatives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAgentOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 font-bold text-xs hover:bg-emerald-200 transition shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Ask Eco Agent</span>
          </button>
        </div>
      </div>

      {/* Category Landing Highlight (Feature 28) */}
      {category !== 'All' && CATEGORY_DETAILS[category] && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                Category Spotlight: {category}
              </span>
            </div>
            <h2 className="text-xl font-black text-stone-900 dark:text-stone-100">
              {CATEGORY_DETAILS[category].tagline}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-300 max-w-xl">
              {CATEGORY_DETAILS[category].description}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-emerald-200/60 dark:border-emerald-800/60 max-w-xs text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-relaxed">
              <strong>Eco Fact:</strong> {CATEGORY_DETAILS[category].fact}
            </span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar Control Strip */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs space-y-5">
        {/* Search Input, Barcode Scanner & Sort Selector */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div ref={searchContainerRef} className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addRecentSearch(searchQuery);
                  setSearchFocused(false);
                }
              }}
              placeholder="Search products by material, name, keyword (e.g. bamboo, cotton, copper, neem)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-stone-100/80 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Smart Suggestions & Recent Searches Dropdown */}
            {searchFocused && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden p-3 space-y-3">
                {/* Search suggestions */}
                {searchSuggestions.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 px-2">
                      Matching Suggestions
                    </div>
                    <div className="space-y-1">
                      {searchSuggestions.map((s, idx) => (
                        <div
                          key={idx}
                          onMouseDown={() => {
                            if (s.product) setSelectedProduct(s.product);
                            setSearchQuery(s.text);
                            addRecentSearch(s.text);
                            setSearchFocused(false);
                          }}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer text-stone-800 dark:text-stone-200"
                        >
                          <div className="flex items-center gap-2">
                            <Search className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="font-semibold">{s.text}</span>
                          </div>
                          <span className="text-[10px] text-stone-400 uppercase font-medium">{s.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 px-2 flex items-center justify-between">
                      <span>Recent Searches</span>
                      <History className="w-3 h-3 text-stone-400" />
                    </div>
                    <div className="flex flex-wrap gap-1.5 px-1">
                      {recentSearches.map((term, idx) => (
                        <span
                          key={idx}
                          onMouseDown={() => {
                            setSearchQuery(term);
                            addRecentSearch(term);
                            setSearchFocused(false);
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300 hover:text-emerald-700 text-xs cursor-pointer border border-stone-200/60 dark:border-stone-700/60 transition"
                        >
                          <span>{term}</span>
                          <button
                            type="button"
                            onMouseDown={(e) => removeRecentSearch(term, e)}
                            className="hover:text-rose-500 rounded-full"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Barcode Scanner Button */}
          <button
            type="button"
            onClick={() => setIsBarcodeOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 font-bold text-xs transition shadow-2xs whitespace-nowrap shrink-0"
            title="Scan barcode or enter code to find eco alternative"
          >
            <Scan className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Scan Barcode</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider shrink-0">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-2xl bg-stone-100/80 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 focus:outline-hidden"
            >
              <option value="eco-score-desc">🌱 Highest Eco-Score First</option>
              <option value="carbon-asc">💨 Lowest Carbon Footprint</option>
              <option value="distance-asc">📍 Nearest Origin (Local First)</option>
              <option value="price-asc">₹ Price: Low to High</option>
              <option value="price-desc">₹ Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Detailed Secondary Filters: Grade, Price, Packaging, Certifications, Material */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
          {/* Grade Filter */}
          <div>
            <label className="block font-bold text-stone-500 uppercase tracking-wider mb-1.5">
              Eco Grade:
            </label>
            <div className="flex items-center gap-1">
              {grades.map((gr) => (
                <button
                  key={gr}
                  type="button"
                  onClick={() => {
                    setGradeFilter(gr);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 py-1 rounded-lg font-extrabold border transition ${
                    gradeFilter === gr
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-emerald-400'
                  }`}
                >
                  {gr}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Filter */}
          <div>
            <div className="flex items-center justify-between font-bold text-stone-500 uppercase tracking-wider mb-1.5">
              <span>Max Price:</span>
              <span className="text-stone-800 dark:text-stone-200">
                {maxPrice >= 3500 ? 'Any' : `Under ₹${maxPrice}`}
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="3500"
              step="100"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Material Filter */}
          <div>
            <label className="block font-bold text-stone-500 uppercase tracking-wider mb-1.5">
              Material:
            </label>
            <select
              value={materialFilter}
              onChange={(e) => {
                setMaterialFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 rounded-xl bg-stone-100/80 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-medium capitalize focus:outline-hidden"
            >
              {allMaterials.map((m) => (
                <option key={m} value={m}>
                  {m === 'All' ? 'All Materials' : m}
                </option>
              ))}
            </select>
          </div>

          {/* Packaging Filter */}
          <div>
            <label className="block font-bold text-stone-500 uppercase tracking-wider mb-1.5">
              Packaging:
            </label>
            <select
              value={packagingFilter}
              onChange={(e) => {
                setPackagingFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 rounded-xl bg-stone-100/80 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-medium capitalize focus:outline-hidden"
            >
              {packagingOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'All' ? 'All Packaging' : opt}
                </option>
              ))}
            </select>
          </div>

          {/* Eco Certification */}
          <div>
            <label className="block font-bold text-stone-500 uppercase tracking-wider mb-1.5">
              Certification:
            </label>
            <select
              value={certFilter}
              onChange={(e) => {
                setCertFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 rounded-xl bg-stone-100/80 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-medium focus:outline-hidden"
            >
              {allCertifications.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggles Strip (Plastic Free & Rating) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOnlyPlasticFree(!onlyPlasticFree)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition font-bold ${
                onlyPlasticFree
                  ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
              }`}
            >
              <span>🌱 100% Plastic-Free Packaging</span>
            </button>

            <button
              type="button"
              onClick={() => setMinRating(minRating === 4 ? 0 : 4)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full border transition font-bold ${
                minRating === 4
                  ? 'bg-amber-100 dark:bg-amber-950 border-amber-500 text-amber-900 dark:text-amber-300'
                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
              }`}
            >
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>4★ & Above</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-stone-500 font-medium">
              Showing <strong className="text-stone-900 dark:text-stone-100">{filteredProducts.length}</strong> items
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:underline font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Active:</span>
            {activeFilters.map((chip, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-medium border border-stone-200/80 dark:border-stone-700"
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={chip.clear}
                  className="hover:text-rose-500 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Product Results Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-850 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="text-4xl">🔍</div>
          <h3 className="font-bold text-lg text-stone-800 dark:text-stone-200">
            No products match your current filters
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search criteria, reset the price slider, or ask our Eco Agent to recommend items.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                      currentPage === pageNum
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Recently Viewed Carousel */}
      {recentlyViewed && recentlyViewed.length > 0 && (
        <div className="pt-10 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Recently Viewed Products
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentlyViewed.slice(0, 4).map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className="p-3 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 hover:border-emerald-400 dark:hover:border-emerald-600 cursor-pointer transition shadow-xs flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = `/images/products/${p.id}.svg`; }}
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">{p.name}</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">₹{p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Compare Bar Dock */}
      {compareList && compareList.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 bg-stone-900 dark:bg-stone-800 text-white px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3 animate-slide-up">
          <Scale className="w-5 h-5 text-emerald-400" />
          <div className="text-xs font-semibold">
            <span>{compareList.length} of 3 items in comparison</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCompareOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
          >
            Compare Now
          </button>
        </div>
      )}

      {/* Barcode Scanner Modal (Feature 30) */}
      <BarcodeScannerModal
        isOpen={isBarcodeOpen}
        onClose={() => setIsBarcodeOpen(false)}
      />
    </div>
  );
}
