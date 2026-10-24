import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TrendingUp, Gift, Package } from 'lucide-react';
import productsData from '../data/products.json';
import { calculateEcoScore } from '../lib/ecoScore';
import { rankProducts } from '../lib/decisionEngine';
import { FEATURES } from '../lib/features';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import PrioritiesPanel from '../components/decision/PrioritiesPanel';
import ShopFilterBar from '../components/shop/ShopFilterBar';
import ShopActiveChips from '../components/shop/ShopActiveChips';
import ShopFilterDrawer from '../components/shop/ShopFilterDrawer';
import ShopEmptyState from '../components/shop/ShopEmptyState';
import StarterKits from '../components/tools/StarterKits';
import ForYouRow from '../components/recommendations/ForYouRow';
import TradeoffExplorerModal from '../components/shop/TradeoffExplorerModal';
import HouseholdProfileSelector from '../components/shop/HouseholdProfileSelector';
import GiftFinderModal from '../components/shop/GiftFinderModal';
import OccasionKitsModal from '../components/shop/OccasionKitsModal';
import IntentSearchInput from '../components/shop/IntentSearchInput';
import { HOUSEHOLD_PROFILES } from '../lib/personaEngine';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userPriorities } = useCart();

  // URL-driven query states
  const categoryParam = searchParams.get('category') || 'All';
  const queryParam = searchParams.get('q') || '';
  const sortParam = searchParams.get('sort') || 'featured';

  // Local filter states
  const [priceRange, setPriceRange] = useState(2500);
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [onlyPlasticFree, setOnlyPlasticFree] = useState(false);
  const [onlyEcoFriendly, setOnlyEcoFriendly] = useState(true); // Default true to prioritize eco picks
  const [selectedCert, setSelectedCert] = useState(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isTradeoffModalOpen, setIsTradeoffModalOpen] = useState(false);
  const [activeHouseholdProfile, setActiveHouseholdProfile] = useState('default');
  const [isGiftFinderOpen, setIsGiftFinderOpen] = useState(false);
  const [isOccasionKitsOpen, setIsOccasionKitsOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState('All'); // 'All' | 'Monsoon' | 'Summer' | 'Festive' | 'Winter'

  // Extract all categories & certifications
  const categories = useMemo(() => {
    return [...new Set(productsData.map((p) => p.category))].sort();
  }, []);

  const availableCerts = useMemo(() => {
    const certs = new Set();
    productsData.forEach((p) => {
      if (Array.isArray(p.certifications)) {
        p.certifications.forEach((c) => certs.add(c));
      }
    });
    return Array.from(certs).sort();
  }, []);

  const maxPriceLimit = useMemo(() => {
    return Math.max(...productsData.map((p) => p.price), 2500);
  }, []);

  // Update URL search parameters
  const updateQueryParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === 'featured') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  // Filter and sort items
  const filteredProducts = useMemo(() => {
    const q = queryParam.trim().toLowerCase();

    return productsData.filter((product) => {
      // 1. Search Query
      if (q) {
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesMat = (product.material || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesMat) return false;
      }

      // 2. Category
      if (categoryParam !== 'All' && product.category !== categoryParam) {
        return false;
      }

      // 3. Price Range
      if (product.price > priceRange) {
        return false;
      }

      // 4. Eco Score Grade
      if (selectedGrade !== 'All') {
        const score = calculateEcoScore(product);
        if (score.grade !== selectedGrade) return false;
      }

      // 5. Packaging
      if (onlyPlasticFree && product.packaging !== 'plastic-free') {
        return false;
      }

      // 6. Eco-Friendly vs Conventional
      if (onlyEcoFriendly && !product.isEcoFriendly) {
        return false;
      }

      // 7. Certification
      if (selectedCert && (!product.certifications || !product.certifications.includes(selectedCert))) {
        return false;
      }

      // 8. Seasonal & Regional Filter (Feature 64)
      if (selectedSeason !== 'All') {
        const mat = (product.material || '').toLowerCase();
        const cat = (product.category || '').toLowerCase();
        const name = (product.name || '').toLowerCase();
        if (selectedSeason === 'Monsoon') {
          const matchesMonsoon = mat.includes('steel') || mat.includes('neem') || mat.includes('bamboo') || cat.includes('kitchen') || name.includes('bottle') || name.includes('scrubber');
          if (!matchesMonsoon) return false;
        } else if (selectedSeason === 'Summer') {
          const matchesSummer = mat.includes('cotton') || mat.includes('copper') || mat.includes('clay') || cat.includes('clothing') || name.includes('bottle') || name.includes('tote');
          if (!matchesSummer) return false;
        } else if (selectedSeason === 'Festive') {
          const matchesFestive = mat.includes('brass') || mat.includes('paper') || cat.includes('home') || (product.certifications && product.certifications.length > 0);
          if (!matchesFestive) return false;
        } else if (selectedSeason === 'Winter') {
          const matchesWinter = mat.includes('wood') || mat.includes('glass') || cat.includes('care') || cat.includes('home');
          if (!matchesWinter) return false;
        }
      }

      return true;
    });
  }, [categoryParam, queryParam, priceRange, selectedGrade, onlyPlasticFree, onlyEcoFriendly, selectedCert, selectedSeason]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];

    switch (sortParam) {
      case 'impact-rupee':
        return list.sort((a, b) => {
          const ratioA = (a.carbonKg * 1000 + (a.plasticGrams || 0)) / a.price;
          const ratioB = (b.carbonKg * 1000 + (b.plasticGrams || 0)) / b.price;
          return ratioB - ratioA;
        });
      case 'eco-desc':
        return list.sort((a, b) => calculateEcoScore(b).score - calculateEcoScore(a).score);
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'carbon-asc':
        return list.sort((a, b) => a.carbonKg - b.carbonKg);
      case 'priorities':
      default:
        if (FEATURES.DECISION_ENGINE) {
          return rankProducts(list, userPriorities);
        }
        return list.sort((a, b) => (b.isEcoFriendly ? 1 : 0) - (a.isEcoFriendly ? 1 : 0));
    }
  }, [filteredProducts, sortParam, userPriorities]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (categoryParam !== 'All') count++;
    if (queryParam) count++;
    if (priceRange < maxPriceLimit) count++;
    if (selectedGrade !== 'All') count++;
    if (onlyPlasticFree) count++;
    if (!onlyEcoFriendly) count++; // deviated from default
    if (selectedCert) count++;
    if (sortParam !== 'featured') count++;
    return count;
  }, [categoryParam, queryParam, priceRange, maxPriceLimit, selectedGrade, onlyPlasticFree, onlyEcoFriendly, selectedCert, sortParam]);

  const handleSelectHouseholdProfile = (profileId) => {
    setActiveHouseholdProfile(profileId);
    const prof = HOUSEHOLD_PROFILES[profileId];
    if (prof?.constraints) {
      if (prof.constraints.maxPrice) setPriceRange(prof.constraints.maxPrice);
      if (typeof prof.constraints.onlyPlasticFree === 'boolean') setOnlyPlasticFree(prof.constraints.onlyPlasticFree);
      if (typeof prof.constraints.onlyEcoFriendly === 'boolean') setOnlyEcoFriendly(prof.constraints.onlyEcoFriendly);
    }
  };

  const handleApplyIntent = (parsed) => {
    if (parsed.cleanQuery !== undefined && parsed.cleanQuery.trim()) {
      updateQueryParam('q', parsed.cleanQuery);
    }
    const c = parsed.extractedConstraints;
    if (c.maxPrice) setPriceRange(c.maxPrice);
    if (c.category) updateQueryParam('category', c.category);
    if (c.onlyPlasticFree) setOnlyPlasticFree(true);
    if (c.onlyEcoFriendly) setOnlyEcoFriendly(true);
  };

  const handleResetAllFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
    setPriceRange(maxPriceLimit);
    setSelectedGrade('All');
    setOnlyPlasticFree(false);
    setOnlyEcoFriendly(true);
    setSelectedCert(null);
    setActiveHouseholdProfile('default');
  };

  return (
    <div className="min-h-screen bg-surface text-text pb-28 sm:pb-20">
      {/* Page Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-primary bg-primary-subtle px-2.5 py-0.5 rounded-full border border-primary/20">
                EcoMart Catalog
              </span>
              <span className="text-xs font-sans text-muted font-medium">
                {productsData.length} Products Indexed
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-heading mt-2 tracking-tight">
              Sustainable Living Catalog
            </h1>
            <p className="font-sans text-xs sm:text-sm text-secondary mt-1">
              Filter by certified materials, 0–100 lifecycle eco scores, or sort by impact per rupee.
            </p>
          </div>

          {/* Action Tools Toolbar */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsGiftFinderOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-surface-raised hover:bg-surface border border-line hover:border-amber-500/40 text-heading text-xs font-semibold shadow-soft-xs transition-colors cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-amber-500" />
              <span>Curated Gifts</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOccasionKitsOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-surface-raised hover:bg-surface border border-line hover:border-primary/40 text-heading text-xs font-semibold shadow-soft-xs transition-colors cursor-pointer"
            >
              <Package className="w-3.5 h-3.5 text-primary" />
              <span>Occasion Kits</span>
            </button>

            {/* Trade-off Frontier Button (Feature 4) */}
            <button
              type="button"
              onClick={() => setIsTradeoffModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-surface-raised hover:bg-surface border border-line hover:border-primary/40 text-heading text-xs font-semibold shadow-soft-xs transition-colors cursor-pointer"
              title="Open 2D Price vs EcoScore Pareto scatter plot"
            >
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span>Trade-off Frontier</span>
            </button>
          </div>
        </div>

        {/* Feature 27: Intent Search Bar & Feature 23: Household Profile Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
          <div className="lg:col-span-5">
            <IntentSearchInput onApplyIntent={handleApplyIntent} />
          </div>
          <div className="lg:col-span-7">
            <HouseholdProfileSelector
              activeProfileId={activeHouseholdProfile}
              onSelectProfile={handleSelectHouseholdProfile}
            />
          </div>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ShopFilterBar
          searchQuery={queryParam}
          onSearchChange={(q) => updateQueryParam('q', q)}
          category={categoryParam}
          onCategoryChange={(cat) => updateQueryParam('category', cat)}
          categories={categories}
          sortBy={sortParam}
          onSortChange={(s) => updateQueryParam('sort', s)}
          onOpenMobileFilters={() => setIsFilterDrawerOpen(true)}
          activeFilterCount={activeFilterCount}
        />

        {/* Filter Chips with 1-Click Clear */}
        <ShopActiveChips
          category={categoryParam}
          onClearCategory={() => updateQueryParam('category', 'All')}
          searchQuery={queryParam}
          onClearSearch={() => updateQueryParam('q', '')}
          priceRange={priceRange}
          maxPriceLimit={maxPriceLimit}
          onResetPrice={() => setPriceRange(maxPriceLimit)}
          selectedGrade={selectedGrade}
          onClearGrade={() => setSelectedGrade('All')}
          onlyPlasticFree={onlyPlasticFree}
          onTogglePlasticFree={() => setOnlyPlasticFree(false)}
          onlyEcoFriendly={onlyEcoFriendly}
          onToggleEcoFriendly={() => setOnlyEcoFriendly(false)}
          sortBy={sortParam}
          onResetSort={() => updateQueryParam('sort', 'featured')}
          onClearAll={handleResetAllFilters}
        />

        {/* Seasonal & Regional Living Filters (Feature 64) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="text-[11px] font-mono text-muted uppercase tracking-wider shrink-0 mr-1">
            Season:
          </span>
          {[
            { id: 'All', label: 'All Seasons' },
            { id: 'Monsoon', label: '🌧️ Monsoon Essentials' },
            { id: 'Summer', label: '☀️ Summer Zero-Waste' },
            { id: 'Festive', label: '🪔 Festive Gifting' },
            { id: 'Winter', label: '❄️ Winter Care' }
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedSeason(s.id)}
              className={`px-3 py-1.5 rounded-full border text-xs font-sans whitespace-nowrap transition cursor-pointer min-h-[32px] ${
                selectedSeason === s.id
                  ? 'bg-primary text-primary-contrast border-primary font-semibold shadow-soft-xs'
                  : 'bg-surface-raised border-line text-secondary hover:text-heading hover:bg-surface'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Result Count Status Strip */}
        <div className="flex items-center justify-between py-2.5 text-xs font-sans text-muted font-medium">
          <span>
            Showing <strong className="font-semibold text-heading">{sortedProducts.length}</strong> sustainable product{sortedProducts.length !== 1 ? 's' : ''}
          </span>
          {categoryParam !== 'All' && (
            <span className="text-muted">Department: {categoryParam}</span>
          )}
        </div>
      </div>

      {/* Main Catalog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        {FEATURES.DECISION_ENGINE && (
          <div className="mb-6">
            <PrioritiesPanel />
          </div>
        )}

        {/* Personalized For You Row (Phase 6: On-Device Learning) */}
        {FEATURES.FOR_YOU_LEARNING && (
          <div className="mb-10">
            <ForYouRow />
          </div>
        )}

        {sortedProducts.length === 0 ? (
          <ShopEmptyState
            onReset={handleResetAllFilters}
            onSearchSuggestion={(term) => updateQueryParam('q', term)}
            currentQuery={queryParam}
            onAskAgent={() => {
              window.dispatchEvent(
                new CustomEvent('ecomart-agent-query', {
                  detail: { query: `Find sustainable recommendations for ${queryParam || (selectedSeason !== 'All' ? selectedSeason + ' season essentials' : 'daily kitchen and home items')}` }
                })
              );
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} rankingDetails={product.rank ? product : null} />
              </div>
            ))}
          </div>
        )}

        {/* Curated Starter Kits Section */}
        <div className="mt-16 pt-12 border-t border-line">
          <StarterKits />
        </div>
      </div>

      {/* Mobile Bottom-Sheet Filter Drawer */}
      <ShopFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        maxPriceLimit={maxPriceLimit}
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
        onlyPlasticFree={onlyPlasticFree}
        onTogglePlasticFree={setOnlyPlasticFree}
        onlyEcoFriendly={onlyEcoFriendly}
        onToggleEcoFriendly={setOnlyEcoFriendly}
        selectedCert={selectedCert}
        onCertChange={setSelectedCert}
        availableCerts={availableCerts}
        onResetFilters={handleResetAllFilters}
        resultCount={sortedProducts.length}
      />

      {/* 2D Price vs EcoScore Pareto Frontier Modal (Feature 4) */}
      <TradeoffExplorerModal
        isOpen={isTradeoffModalOpen}
        onClose={() => setIsTradeoffModalOpen(false)}
        products={productsData}
      />

      {/* Feature 25: Curated Gift Finder Modal */}
      <GiftFinderModal
        isOpen={isGiftFinderOpen}
        onClose={() => setIsGiftFinderOpen(false)}
      />

      {/* Feature 26: Occasion Kits Modal */}
      <OccasionKitsModal
        isOpen={isOccasionKitsOpen}
        onClose={() => setIsOccasionKitsOpen(false)}
      />
    </div>
  );
}

