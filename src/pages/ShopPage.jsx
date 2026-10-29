import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TrendingUp, Gift, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { calculateEcoScore } from '../lib/ecoScore';
import { rankProducts } from '../lib/decisionEngine';
import { FEATURES } from '../lib/features';
import { useCart } from '../context/CartContext';
import { useT } from '../context/I18nContext';
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
import Chip from '../components/ui/Chip';
import CategoryTiles from '../components/shop/CategoryTiles';
import { HOUSEHOLD_PROFILES } from '../lib/personaEngine';
import { CATEGORIES, findCategory, isMatchingCategory } from '../data/categories.js';
import { hasVerifiedCertification, CERTIFICATION_REGISTRY } from '../lib/certificationUtils.js';

const PAGE_SIZE = 24;

export default function ShopPage() {
  const { t } = useT();
  const [searchParams, setSearchParams] = useSearchParams();
  const { userPriorities } = useCart();
  const { products, loading: _loading } = useProducts();

  // 1. Read all filter states directly from URL searchParams (single source of truth)
  const categoryParam = searchParams.get('category') || 'all';
  const queryParam = searchParams.get('q') || '';
  const sortParam = searchParams.get('sort') || 'featured';
  const priceParam = searchParams.get('price');
  const gradeParam = searchParams.get('grade') || 'all';
  const plasticFreeParam = searchParams.get('plasticFree') === 'true';
  const ecoCertifiedParam = searchParams.get('ecoCertified') === 'true';
  const certParam = searchParams.get('cert') || 'all';
  const materialParam = searchParams.get('material') || 'all';
  const seasonParam = searchParams.get('season') || 'all';
  const ratingParam = Number(searchParams.get('rating')) || 0;
  const inStockParam = searchParams.get('inStock') === 'true';
  const pageParam = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  // Modals visibility state
  const isFilterDrawerOpen = searchParams.get('drawer') === 'filter';
  const [isTradeoffModalOpen, setIsTradeoffModalOpen] = React.useState(false);
  const [activeHouseholdProfile, setActiveHouseholdProfile] = React.useState('default');
  const [isGiftFinderOpen, setIsGiftFinderOpen] = React.useState(false);
  const [isOccasionKitsOpen, setIsOccasionKitsOpen] = React.useState(false);

  // Dynamic max price computed from products
  const maxPriceLimit = useMemo(() => {
    if (!products || products.length === 0) return 3000;
    return Math.max(...products.map((p) => p.price || 0), 3000);
  }, [products]);

  const activePriceRange = priceParam ? Number(priceParam) : maxPriceLimit;

  // Extract live available certifications that have source URLs
  const availableCerts = useMemo(() => {
    const certs = new Set();
    products.forEach((p) => {
      if (Array.isArray(p.certifications)) {
        p.certifications.forEach((c) => {
          const name = typeof c === 'string' ? c : c?.name;
          if (name && (CERTIFICATION_REGISTRY[name] || (typeof c === 'object' && c.sourceUrl))) {
            certs.add(name);
          }
        });
      }
    });
    return Array.from(certs).sort();
  }, [products]);

  // Count products live per category
  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const cat of CATEGORIES) {
      counts[cat.id] = products.filter((p) => isMatchingCategory(p.category, cat.id)).length;
    }
    return counts;
  }, [products]);

  // Central URL update function ensuring Back/Forward/Refresh retain full state
  const updateFilters = (updates) => {
    const next = new URLSearchParams(searchParams);

    // Reset pagination to page 1 whenever any filter other than page changes
    if (!('page' in updates)) {
      next.delete('page');
    }

    for (const [key, value] of Object.entries(updates)) {
      if (
        value === null ||
        value === undefined ||
        value === '' ||
        value === 'all' ||
        value === 'All' ||
        value === false ||
        value === 'featured' ||
        value === 0 ||
        (key === 'price' && Number(value) >= maxPriceLimit)
      ) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    }
    setSearchParams(next, { replace: true });
  };

  const handleResetAllFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
    setActiveHouseholdProfile('default');
  };

  // Filter products by combining ALL criteria with AND
  const filteredProducts = useMemo(() => {
    const q = queryParam.trim().toLowerCase();

    return products.filter((product) => {
      // 1. Search Query
      if (q) {
        const matchesName = (product.name || '').toLowerCase().includes(q);
        const matchesCat = (product.category || '').toLowerCase().includes(q);
        const matchesMat = (product.material || '').toLowerCase().includes(q);
        const matchesDesc = (product.description || '').toLowerCase().includes(q);
        const matchesTags = Array.isArray(product.tags) && product.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesCat && !matchesMat && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      // 2. Department Category (Single Source of Truth)
      if (categoryParam !== 'all' && !isMatchingCategory(product.category, categoryParam)) {
        return false;
      }

      // 3. Price Ceiling
      if (priceParam && product.price > Number(priceParam)) {
        return false;
      }

      // 4. Eco Score Grade
      if (gradeParam !== 'all') {
        const score = calculateEcoScore(product);
        if (score.grade.toUpperCase() !== gradeParam.toUpperCase()) {
          return false;
        }
      }

      // 5. Plastic-Free Packaging
      if (plasticFreeParam) {
        const isPlasticFree = product.packaging === 'plastic-free' || product.plasticGrams === 0;
        if (!isPlasticFree) return false;
      }

      // 6. Eco Certified Only (Requires verified certification with stored source URL)
      if (ecoCertifiedParam) {
        if (!hasVerifiedCertification(product)) {
          return false;
        }
      }

      // 7. Specific Third-Party Certification
      if (certParam !== 'all') {
        const hasCert =
          Array.isArray(product.certifications) &&
          product.certifications.some((c) => (typeof c === 'string' ? c : c?.name) === certParam);
        if (!hasCert) return false;
      }

      // 8. Material Filter
      if (materialParam !== 'all') {
        const mat = (product.material || '').toLowerCase();
        if (!mat.includes(materialParam.toLowerCase())) {
          return false;
        }
      }

      // 9. Seasonal & Regional Collection
      if (seasonParam !== 'all') {
        const s = seasonParam.toLowerCase();
        const mat = (product.material || '').toLowerCase();
        const cat = (product.category || '').toLowerCase();
        const name = (product.name || '').toLowerCase();

        if (s === 'monsoon') {
          const match =
            mat.includes('steel') ||
            mat.includes('neem') ||
            mat.includes('bamboo') ||
            cat.includes('kitchen') ||
            name.includes('bottle') ||
            name.includes('scrubber');
          if (!match) return false;
        } else if (s === 'summer') {
          const match =
            mat.includes('cotton') ||
            mat.includes('copper') ||
            mat.includes('clay') ||
            cat.includes('fashion') ||
            cat.includes('clothing') ||
            name.includes('bottle') ||
            name.includes('tote');
          if (!match) return false;
        } else if (s === 'festive') {
          const match =
            mat.includes('brass') ||
            mat.includes('paper') ||
            cat.includes('home') ||
            (Array.isArray(product.certifications) && product.certifications.length > 0);
          if (!match) return false;
        } else if (s === 'winter') {
          const match =
            mat.includes('wood') ||
            mat.includes('glass') ||
            cat.includes('care') ||
            cat.includes('home');
          if (!match) return false;
        }
      }

      // 10. Rating Filter
      if (ratingParam > 0) {
        const prodRating = product.rating ?? (product.isEcoFriendly ? 4.8 : 4.0);
        if (prodRating < ratingParam) return false;
      }

      // 11. In-Stock Filter
      if (inStockParam && product.inStock === false) {
        return false;
      }

      return true;
    });
  }, [
    products,
    queryParam,
    categoryParam,
    priceParam,
    gradeParam,
    plasticFreeParam,
    ecoCertifiedParam,
    certParam,
    materialParam,
    seasonParam,
    ratingParam,
    inStockParam
  ]);

  // Sort and re-rank products (My Priorities ONLY re-ranks, NEVER hides products)
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
      case 'featured':
      default:
        if (FEATURES.DECISION_ENGINE) {
          // Re-rank candidate list based on user priorities weights; never filters items out
          return rankProducts(list, userPriorities, {});
        }
        return list.sort((a, b) => (b.isEcoFriendly ? 1 : 0) - (a.isEcoFriendly ? 1 : 0));
    }
  }, [filteredProducts, sortParam, userPriorities]);

  // Pagination calculation (24 per page)
  const totalCount = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(pageParam, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + PAGE_SIZE);

  // Active filter count calculation
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (categoryParam !== 'all') count++;
    if (queryParam) count++;
    if (priceParam && Number(priceParam) < maxPriceLimit) count++;
    if (gradeParam !== 'all') count++;
    if (plasticFreeParam) count++;
    if (ecoCertifiedParam) count++;
    if (certParam !== 'all') count++;
    if (materialParam !== 'all') count++;
    if (seasonParam !== 'all') count++;
    if (ratingParam > 0) count++;
    if (inStockParam) count++;
    if (sortParam !== 'featured') count++;
    return count;
  }, [
    categoryParam,
    queryParam,
    priceParam,
    maxPriceLimit,
    gradeParam,
    plasticFreeParam,
    ecoCertifiedParam,
    certParam,
    materialParam,
    seasonParam,
    ratingParam,
    inStockParam,
    sortParam
  ]);

  const handlePageChange = (newPage) => {
    updateFilters({ page: newPage });
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleSelectHouseholdProfile = (profileId) => {
    setActiveHouseholdProfile(profileId);
    const prof = HOUSEHOLD_PROFILES[profileId];
    if (prof?.constraints) {
      const updates = {};
      if (prof.constraints.maxPrice) updates.price = prof.constraints.maxPrice;
      if (typeof prof.constraints.onlyPlasticFree === 'boolean') updates.plasticFree = prof.constraints.onlyPlasticFree;
      updateFilters(updates);
    }
  };

  const handleApplyIntent = (parsed) => {
    const updates = {};
    if (parsed.cleanQuery !== undefined && parsed.cleanQuery.trim()) {
      updates.q = parsed.cleanQuery;
    }
    const c = parsed.extractedConstraints;
    if (c.maxPrice) updates.price = c.maxPrice;
    if (c.category) {
      const cat = findCategory(c.category);
      if (cat) updates.category = cat.id;
    }
    if (c.onlyPlasticFree) updates.plasticFree = true;
    updateFilters(updates);
  };

  return (
    <div className="min-h-screen bg-surface text-text pb-28 sm:pb-20">
      {/* Page Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-primary bg-primary-subtle px-2.5 py-0.5 rounded-full border border-primary/20">
                Eco Sense Catalog
              </span>
              <span className="text-xs font-sans text-muted font-medium">
                {products.length} Products Indexed
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-heading mt-2 tracking-tight">
              Sustainable Living Catalog
            </h1>
            <p className="font-sans text-xs sm:text-sm text-secondary mt-1">
              Filter by verified materials, 0–100 lifecycle eco scores, or sort by lowest price.
            </p>
            <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-surface-sunken border border-line text-xs text-text-muted">
              <span>{t('shop.sampleNotice', 'Sample products for a school project. Prices and impact numbers are estimates.')}</span>
            </div>
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

        {/* Intent Search Bar & Household Profile Selector */}
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

        {/* Department Visual Category Showcase with Real Photos & Live Database Counts */}
        <div className="pt-2">
          <CategoryTiles
            selectedCategory={categoryParam}
            onSelectCategory={(catId) => updateFilters({ category: catId })}
            products={products}
          />
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ShopFilterBar
          searchQuery={queryParam}
          onSearchChange={(q) => updateFilters({ q })}
          category={categoryParam}
          onCategoryChange={(catId) => updateFilters({ category: catId })}
          categoryCounts={categoryCounts}
          totalCount={products.length}
          sortBy={sortParam}
          onSortChange={(s) => updateFilters({ sort: s })}
          onOpenMobileFilters={() => updateFilters({ drawer: 'filter' })}
          activeFilterCount={activeFilterCount}
        />

        {/* Filter Chips with 1-Click Clear */}
        <ShopActiveChips
          category={categoryParam}
          onClearCategory={() => updateFilters({ category: 'all' })}
          searchQuery={queryParam}
          onClearSearch={() => updateFilters({ q: '' })}
          priceRange={activePriceRange}
          maxPriceLimit={maxPriceLimit}
          onResetPrice={() => updateFilters({ price: null })}
          selectedGrade={gradeParam}
          onClearGrade={() => updateFilters({ grade: 'all' })}
          onlyPlasticFree={plasticFreeParam}
          onTogglePlasticFree={() => updateFilters({ plasticFree: false })}
          ecoCertifiedOnly={ecoCertifiedParam}
          onToggleEcoCertified={() => updateFilters({ ecoCertified: false })}
          selectedCert={certParam}
          onClearCert={() => updateFilters({ cert: 'all' })}
          selectedMaterial={materialParam}
          onClearMaterial={() => updateFilters({ material: 'all' })}
          selectedSeason={seasonParam}
          onClearSeason={() => updateFilters({ season: 'all' })}
          minRating={ratingParam}
          onClearRating={() => updateFilters({ rating: null })}
          inStockOnly={inStockParam}
          onToggleInStock={() => updateFilters({ inStock: false })}
          sortBy={sortParam}
          onResetSort={() => updateFilters({ sort: 'featured' })}
          onClearAll={handleResetAllFilters}
        />

        {/* Seasonal & Regional Living Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="text-[11px] font-mono text-muted uppercase tracking-wider shrink-0 mr-1">
            Season:
          </span>
          {[
            { id: 'all', label: 'All Seasons' },
            { id: 'monsoon', label: '🌧️ Monsoon Essentials' },
            { id: 'summer', label: '☀️ Summer Zero-Waste' },
            { id: 'festive', label: '🪔 Festive Gifting' },
            { id: 'winter', label: '❄️ Winter Care' }
          ].map((s) => (
            <Chip
              key={s.id}
              active={seasonParam?.toLowerCase() === s.id}
              onClick={() => updateFilters({ season: seasonParam?.toLowerCase() === s.id ? 'all' : s.id })}
            >
              {s.label}
            </Chip>
          ))}
        </div>

        {/* Result Count Status Strip */}
        <div className="flex items-center justify-between py-2.5 text-xs font-sans text-muted font-medium">
          <span>
            {totalCount === 0 ? (
              <span>No products match the selected filters</span>
            ) : totalCount <= PAGE_SIZE ? (
              <span>
                Showing all <strong className="font-semibold text-heading">{totalCount}</strong> product{totalCount !== 1 ? 's' : ''}
              </span>
            ) : (
              <span>
                Showing <strong className="font-semibold text-heading">{startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, totalCount)}</strong> of{' '}
                <strong className="font-semibold text-heading">{totalCount}</strong> products
              </span>
            )}
          </span>
          {categoryParam !== 'all' && (
            <span className="text-muted">
              Department: {findCategory(categoryParam)?.label || categoryParam}
            </span>
          )}
        </div>
      </div>

      {/* Main Catalog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        {FEATURES.DECISION_ENGINE && (
          <div className="mb-6">
            <PrioritiesPanel
              onSliderChange={() => {
                if (sortParam !== 'featured') {
                  updateFilters({ sort: 'featured' });
                }
              }}
            />
          </div>
        )}

        {/* Personalized For You Row */}
        {FEATURES.FOR_YOU_LEARNING && (
          <div className="mb-10">
            <ForYouRow />
          </div>
        )}

        {sortedProducts.length === 0 ? (
          <ShopEmptyState
            onReset={handleResetAllFilters}
            onSearchSuggestion={(term) => updateFilters({ q: term })}
            currentQuery={queryParam}
            onAskAgent={() => {
              window.dispatchEvent(
                new CustomEvent('ecomart-agent-query', {
                  detail: {
                    query: `Find sustainable recommendations for ${
                      queryParam || (seasonParam !== 'all' ? seasonParam + ' season essentials' : 'daily kitchen and home items')
                    }`
                  }
                })
              );
            }}
          />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} rankingDetails={product.rank ? product : null} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
                <div className="text-text-muted">
                  Page <strong className="text-heading font-semibold">{currentPage}</strong> of{' '}
                  <strong className="text-heading font-semibold">{totalPages}</strong> ({totalCount} total items)
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-surface-raised border border-line text-heading hover:bg-surface-sunken disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pNum = i + 1;
                    return (
                      <button
                        key={pNum}
                        type="button"
                        onClick={() => handlePageChange(pNum)}
                        className={`w-9 h-9 rounded-xl font-semibold border transition cursor-pointer ${
                          currentPage === pNum
                            ? 'bg-primary text-text-inverted border-primary shadow-soft-xs'
                            : 'bg-surface-raised border-line text-heading hover:bg-surface-sunken'
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-surface-raised border border-line text-heading hover:bg-surface-sunken disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Curated Starter Kits Section */}
        <div className="mt-16 pt-12 border-t border-line">
          <StarterKits />
        </div>
      </div>

      {/* Filter Drawer */}
      <ShopFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => updateFilters({ drawer: null })}
        category={categoryParam}
        onCategoryChange={(catId) => updateFilters({ category: catId })}
        priceRange={activePriceRange}
        onPriceChange={(price) => updateFilters({ price })}
        maxPriceLimit={maxPriceLimit}
        selectedGrade={gradeParam}
        onGradeChange={(grade) => updateFilters({ grade })}
        onlyPlasticFree={plasticFreeParam}
        onTogglePlasticFree={(plasticFree) => updateFilters({ plasticFree })}
        ecoCertifiedOnly={ecoCertifiedParam}
        onToggleEcoCertified={(ecoCertified) => updateFilters({ ecoCertified })}
        selectedCert={certParam}
        onCertChange={(cert) => updateFilters({ cert })}
        availableCerts={availableCerts}
        selectedMaterial={materialParam}
        onMaterialChange={(material) => updateFilters({ material })}
        selectedSeason={seasonParam}
        onSeasonChange={(season) => updateFilters({ season })}
        minRating={ratingParam}
        onRatingChange={(rating) => updateFilters({ rating })}
        inStockOnly={inStockParam}
        onToggleInStock={(inStock) => updateFilters({ inStock })}
        onResetFilters={handleResetAllFilters}
        resultCount={totalCount}
      />

      {/* Modals */}
      <TradeoffExplorerModal
        isOpen={isTradeoffModalOpen}
        onClose={() => setIsTradeoffModalOpen(false)}
        products={products}
      />

      <GiftFinderModal
        isOpen={isGiftFinderOpen}
        onClose={() => setIsGiftFinderOpen(false)}
      />

      <OccasionKitsModal
        isOpen={isOccasionKitsOpen}
        onClose={() => setIsOccasionKitsOpen(false)}
      />
    </div>
  );
}
