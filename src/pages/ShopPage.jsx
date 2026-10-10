import React, { useState, useMemo } from 'react';
import {
  Search, Filter, SlidersHorizontal, RotateCcw, Sparkles, X, ChevronRight,
  ChevronLeft, ArrowUpDown, Star, ShieldCheck, Scale, History, Heart
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { calculateEcoScore } from '../lib/ecoScore';
import ProductCard from '../components/ProductCard';

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

      {/* Filter and Search Bar Control Strip */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs space-y-5">
        {/* Search Input & Sort Selector */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search products by material, name, keyword (e.g. bamboo, cotton, copper, neem)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-100/80 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

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
    </div>
  );
}
