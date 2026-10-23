import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productsData from '../data/products.json';
import { useCart } from '../context/CartContext';
import { calculateEcoScore, compareProductImpact, detectGreenwashing } from '../lib/ecoScore';
import ProductGallery from '../components/ProductGallery';
import EcoScoreBadge from '../components/EcoScoreBadge';
import EcoScorePopover from '../components/EcoScorePopover';
import ProductCard from '../components/ProductCard';
import ProductLifecycleTimeline from '../components/lifecycle/ProductLifecycleTimeline';
import { playSound } from '../lib/audio';
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  Check,
  ShieldCheck,
  Sparkles,
  Leaf,
  Droplets,
  Wind,
  Ban,
  MapPin,
  RefreshCw,
  Plus,
  Minus
} from 'lucide-react';

export default function ProductPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('lifecycle');
  const navigate = useNavigate();
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    addRecentlyViewed
  } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showScorePopover, setShowScorePopover] = useState(false);

  // Find product
  const product = useMemo(() => {
    return productsData.find((p) => p.id === id) || null;
  }, [id]);

  // Track recently viewed
  React.useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product, addRecentlyViewed]);

  // Calculate eco score
  const ecoScore = useMemo(() => {
    return product ? calculateEcoScore(product) : null;
  }, [product]);

  // Conventional or eco swap comparison
  const swapComparison = useMemo(() => {
    if (!product || !product.conventionalAlternativeId) return null;
    const altProduct = productsData.find((p) => p.id === product.conventionalAlternativeId);
    if (!altProduct) return null;

    const eco = product.isEcoFriendly ? product : altProduct;
    const conv = product.isEcoFriendly ? altProduct : product;
    return {
      alternative: altProduct,
      comparison: compareProductImpact(eco, conv)
    };
  }, [product]);

  // Related products
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return productsData
      .filter((p) => p.category === product.category && p.id !== product.id && p.isEcoFriendly)
      .slice(0, 3);
  }, [product]);

  // Greenwashing check
  const greenwashing = useMemo(() => detectGreenwashing(product), [product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-heading mb-3">Product Not Found</h2>
        <p className="text-secondary mb-6 font-sans">The sustainable item you are looking for may have moved or doesn't exist.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-full bg-primary text-primary-contrast font-sans font-medium hover:bg-primary-hover transition shadow-soft-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop Catalog
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    playSound('pop');
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    playSound('click');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-surface text-text pb-28 sm:pb-20">
      {/* Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs font-sans text-muted font-medium overflow-x-auto whitespace-nowrap py-1">
          <Link to="/" className="hover:text-heading transition">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-heading transition">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-heading transition">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-heading font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface-raised rounded-3xl p-4 sm:p-6 border border-line shadow-soft-sm relative">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 z-10 p-2.5 rounded-full bg-surface-raised/90 hover:bg-surface-sunken text-heading shadow-soft-sm border border-line transition min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2.5 rounded-full bg-surface-raised/90 hover:bg-surface-sunken text-heading shadow-soft-sm border border-line transition min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                  title="Share product link"
                  aria-label="Share product"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-primary" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`p-2.5 rounded-full bg-surface-raised/90 hover:bg-surface-sunken shadow-soft-sm border border-line transition min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer ${
                    isFavorited ? 'text-danger fill-danger border-danger/30' : 'text-heading'
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Gallery Component */}
              <ProductGallery
                product={product}
              />
            </div>

            {/* Left Column Tabs: Lifecycle Timeline vs Impact Delta */}
            <div className="flex items-center gap-1 p-1 bg-surface-sunken rounded-2xl border border-line">
              <button
                type="button"
                onClick={() => setActiveTab('lifecycle')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-sans font-bold transition-all min-h-[40px] cursor-pointer ${
                  activeTab === 'lifecycle'
                    ? 'bg-surface-raised text-heading shadow-soft-xs border border-line'
                    : 'text-muted hover:text-heading'
                }`}
              >
                Lifecycle Explorer (5 Stages)
              </button>
              {swapComparison && (
                <button
                  type="button"
                  onClick={() => setActiveTab('comparison')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-sans font-bold transition-all min-h-[40px] cursor-pointer ${
                    activeTab === 'comparison'
                      ? 'bg-surface-raised text-heading shadow-soft-xs border border-line'
                      : 'text-muted hover:text-heading'
                  }`}
                >
                  Conventional Delta & Swap
                </button>
              )}
            </div>

            {/* Tab 1: Lifecycle Explorer */}
            {activeTab === 'lifecycle' && (
              <ProductLifecycleTimeline product={product} />
            )}

            {/* Tab 2: Impact vs Conventional Comparison */}
            {activeTab === 'comparison' && swapComparison && (
              <div className="bg-surface-raised rounded-3xl p-6 border border-line shadow-soft-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="font-serif text-lg font-bold text-heading tracking-tight">
                      Lifecycle Impact vs Conventional Choice
                    </h3>
                  </div>
                  <span className="text-[11px] font-sans font-semibold px-2.5 py-1 rounded-full bg-primary-subtle text-primary border border-primary/20">
                    Transparent Lifecycle
                  </span>
                </div>

                <p className="text-xs font-sans text-secondary leading-relaxed">
                  Compared to traditional alternative <strong className="font-semibold text-heading">{swapComparison.alternative.name}</strong>, choosing this conscious item avoids:
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-primary-subtle border border-primary/20 text-center">
                    <div className="flex items-center justify-center text-primary mb-1">
                      <Wind className="w-4 h-4" />
                    </div>
                    <div className="font-serif text-lg font-bold text-heading">
                      {swapComparison.comparison.co2Saved > 0 ? `-${swapComparison.comparison.co2Saved} kg` : '0 kg'}
                    </div>
                    <div className="text-[11px] font-sans font-medium text-primary">CO₂ Avoided</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-accent-subtle border border-accent/20 text-center">
                    <div className="flex items-center justify-center text-accent mb-1">
                      <Ban className="w-4 h-4" />
                    </div>
                    <div className="font-serif text-lg font-bold text-accent">
                      {swapComparison.comparison.plasticSaved > 0 ? `-${swapComparison.comparison.plasticSaved} g` : '0 g'}
                    </div>
                    <div className="text-[11px] font-sans font-medium text-accent">Plastic Diverted</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-secondary-subtle border border-secondary/20 text-center">
                    <div className="flex items-center justify-center text-secondary mb-1">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div className="font-serif text-lg font-bold text-secondary">
                      {swapComparison.comparison.waterSaved > 0 ? `-${swapComparison.comparison.waterSaved} L` : '0 L'}
                    </div>
                    <div className="text-[11px] font-sans font-medium text-secondary">Water Saved</div>
                  </div>
                </div>

                {/* Swap and Save strip */}
                <div className="p-4 rounded-2xl bg-surface-sunken border border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-primary block">
                      🌱 Smart Swap Recommendation
                    </span>
                    <span className="text-xs font-sans text-secondary">
                      {swapComparison.comparison.summary}
                    </span>
                  </div>
                  {product.isEcoFriendly ? (
                    <span className="px-3.5 py-1.5 rounded-xl bg-primary-subtle text-primary border border-primary/20 text-xs font-sans font-semibold shrink-0 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Best Eco Option
                    </span>
                  ) : (
                    <Link
                      to={`/product/${swapComparison.alternative.id}`}
                      className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverted text-xs font-sans font-medium shrink-0 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Upgrade to Eco Version
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Buy Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-raised rounded-3xl p-6 sm:p-8 border border-line shadow-soft-md lg:sticky lg:top-24 space-y-6">
              {/* Category & Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-sans font-semibold uppercase tracking-wider text-heading px-3 py-1 rounded-full bg-surface-sunken border border-line">
                  {product.category}
                </span>
                {product.badge && (
                  <span className="text-xs font-sans font-semibold px-3 py-1 rounded-full bg-accent-subtle text-accent border border-accent/20">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-heading tracking-tight leading-snug">
                  {product.name}
                </h1>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-3xl font-serif font-bold text-heading">₹{product.price}</span>
                  <span className="text-xs font-sans text-muted">Taxes included</span>
                  <span className="text-xs font-sans font-semibold text-primary bg-primary-subtle px-2.5 py-0.5 rounded-md border border-primary/20">
                    In Stock (Offline Ready)
                  </span>
                </div>
              </div>

              {/* Greenwashing Flag (Check the claims) */}
              {greenwashing.isGreenwashed && (
                <div className="p-3.5 rounded-2xl bg-warning-subtle border border-warning/30 text-heading text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-accent">
                    <span>⚠️ Check the claims</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-secondary font-medium">
                    {greenwashing.reason}
                  </p>
                </div>
              )}

              {/* Eco Score Interactive Badge */}
              {ecoScore && (
                <div className="p-4 rounded-2xl bg-surface-sunken border border-line flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <EcoScoreBadge
                      score={ecoScore.score}
                      grade={ecoScore.grade}
                      size="lg"
                      onClick={() => setShowScorePopover(true)}
                    />
                    <div>
                      <div className="text-xs font-sans font-bold text-heading">
                        Eco-Score: {ecoScore.score}/100 ({ecoScore.gradeLabel})
                      </div>
                      <div className="text-[11px] font-sans text-primary font-medium">
                        Click for 5-pillar lifecycle audit
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowScorePopover(true)}
                    className="text-xs font-sans font-semibold text-primary hover:text-primary-hover underline underline-offset-2 cursor-pointer"
                  >
                    View Breakdown
                  </button>
                </div>
              )}

              {/* Description */}
              <p className="text-sm font-sans text-secondary leading-relaxed">
                {product.description}
              </p>

              {/* Material & Certifications */}
              <div className="space-y-3 pt-3 border-t border-line font-sans">
                <div className="flex items-start gap-2.5 text-xs">
                  <Leaf className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-heading">Material: </span>
                    <span className="text-secondary">{product.material}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-heading">Origin: </span>
                    <span className="text-secondary">Local Artisan Cluster (~{product.madeInKm} km away)</span>
                  </div>
                </div>

                {product.certifications && product.certifications.length > 0 && (
                  <div className="flex items-start gap-2.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-heading">Verified: </span>
                      <span className="text-secondary">{product.certifications.join(', ')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity & Buy Panel Actions */}
              <div className="space-y-4 pt-4 border-t border-line">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-semibold text-heading">Quantity</span>
                  <div className="flex items-center gap-2 border border-line rounded-2xl p-1 bg-surface-sunken">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 min-h-[36px] min-w-[36px] rounded-xl hover:bg-surface-raised text-heading transition flex items-center justify-center cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-sans font-bold text-heading">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 min-h-[36px] min-w-[36px] rounded-xl hover:bg-surface-raised text-heading transition flex items-center justify-center cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 px-6 min-h-[44px] rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-sans font-semibold text-sm flex items-center justify-center gap-2 shadow-soft-sm transition-all cursor-pointer active:scale-98"
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4 text-primary-contrast animate-bounce" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 text-primary-contrast" />
                        <span>Add to Cart • ₹{product.price * quantity}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className={`p-3.5 rounded-2xl border border-line hover:bg-surface-sunken transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer ${
                      isFavorited ? 'text-danger fill-danger border-danger/30' : 'text-heading'
                    }`}
                    aria-label="Toggle wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-line">
            <h2 className="font-serif text-2xl font-bold text-heading mb-6 tracking-tight">
              More Sustainable Alternatives in {product.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Add-to-Cart Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-surface-raised/95 backdrop-blur-md border-t border-line p-3 sm:hidden z-40 flex items-center justify-between gap-3 shadow-soft-lg">
        <div>
          <div className="text-base font-serif font-bold text-heading leading-none">₹{product.price}</div>
          <div className="text-[10px] font-sans text-primary font-semibold mt-0.5">Grade {ecoScore?.grade || 'A'} Eco Standard</div>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-3 px-5 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-sans font-semibold text-xs flex items-center justify-center gap-2 transition-all min-h-[44px] cursor-pointer shadow-soft-sm active:scale-98"
        >
          {addedAnimation ? <Check className="w-4 h-4 text-primary-contrast" /> : <ShoppingCart className="w-4 h-4 text-primary-contrast" />}
          <span>{addedAnimation ? 'Added!' : 'Add to Cart'}</span>
        </button>
      </div>

      {/* Eco Score Popover Modal */}
      {showScorePopover && ecoScore && (
        <EcoScorePopover
          scoreData={ecoScore}
          productName={product.name}
          onClose={() => setShowScorePopover(false)}
        />
      )}
    </div>
  );
}

