import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productsData from '../data/products.json';
import { useCart } from '../context/CartContext';
import { calculateEcoScore, compareProductImpact } from '../lib/ecoScore';
import ProductGallery from '../components/ProductGallery';
import EcoScoreBadge from '../components/EcoScoreBadge';
import EcoScorePopover from '../components/EcoScorePopover';
import ProductCard from '../components/ProductCard';
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

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-stone-900 mb-3">Product Not Found</h2>
        <p className="text-stone-600 mb-6">The sustainable item you are looking for may have moved or doesn't exist.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition"
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
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 pb-28 sm:pb-20">
      {/* Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium overflow-x-auto whitespace-nowrap py-1">
          <Link to="/" className="hover:text-emerald-700 transition">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-emerald-700 transition">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-emerald-700 transition">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-stone-850 font-bold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-xs relative">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 z-10 p-2.5 rounded-full bg-white/90 hover:bg-stone-100 text-stone-700 shadow-sm border border-stone-200 transition"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2.5 rounded-full bg-white/90 hover:bg-stone-100 text-stone-700 shadow-sm border border-stone-200 transition"
                  title="Share product link"
                  aria-label="Share product"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`p-2.5 rounded-full bg-white/90 hover:bg-stone-100 shadow-sm border border-stone-200 transition ${
                    isFavorited ? 'text-rose-500 fill-rose-500' : 'text-stone-700'
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Gallery Component */}
              <ProductGallery
                images={product.images || [product.image]}
                name={product.name}
                category={product.category}
                fallbackIcon={product.icon}
              />
            </div>

            {/* Impact vs Conventional Comparison (Feature 13) */}
            {swapComparison && (
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-extrabold text-base text-stone-900">
                      Lifecycle Impact vs Conventional Choice
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Transparent Lifecycle
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Compared to traditional alternative <strong>{swapComparison.alternative.name}</strong>, choosing this conscious item avoids:
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#E8F5EE] border border-emerald-200/60 text-center">
                    <div className="flex items-center justify-center text-emerald-700 mb-1">
                      <Wind className="w-4 h-4" />
                    </div>
                    <div className="font-black text-lg text-emerald-800">
                      {swapComparison.comparison.co2Saved > 0 ? `-${swapComparison.comparison.co2Saved} kg` : '0 kg'}
                    </div>
                    <div className="text-[11px] font-bold text-emerald-700">CO₂ Avoided</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/60 text-center">
                    <div className="flex items-center justify-center text-amber-700 mb-1">
                      <Ban className="w-4 h-4" />
                    </div>
                    <div className="font-black text-lg text-amber-800">
                      {swapComparison.comparison.plasticSaved > 0 ? `-${swapComparison.comparison.plasticSaved} g` : '0 g'}
                    </div>
                    <div className="text-[11px] font-bold text-amber-700">Plastic Diverted</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200/60 text-center">
                    <div className="flex items-center justify-center text-sky-700 mb-1">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div className="font-black text-lg text-sky-800">
                      {swapComparison.comparison.waterSaved > 0 ? `-${swapComparison.comparison.waterSaved} L` : '0 L'}
                    </div>
                    <div className="text-[11px] font-bold text-sky-700">Water Saved</div>
                  </div>
                </div>

                {/* Swap and Save strip */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                      🌱 Smart Swap Recommendation
                    </span>
                    <span className="text-xs text-stone-700 font-medium">
                      {swapComparison.comparison.summary}
                    </span>
                  </div>
                  {product.isEcoFriendly ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Best Eco Option
                    </span>
                  ) : (
                    <Link
                      to={`/product/${swapComparison.alternative.id}`}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition"
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
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs lg:sticky lg:top-24 space-y-6">
              {/* Category & Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/50">
                  {product.category}
                </span>
                {product.badge && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/50">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-snug">
                  {product.name}
                </h1>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-stone-900">₹{product.price}</span>
                  <span className="text-xs text-stone-500 font-semibold">Taxes included</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/40">
                    In Stock (Offline Ready)
                  </span>
                </div>
              </div>

              {/* Eco Score Interactive Badge */}
              {ecoScore && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#E8F5EE] to-white border border-emerald-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <EcoScoreBadge
                      score={ecoScore.score}
                      grade={ecoScore.grade}
                      size="lg"
                      onClick={() => setShowScorePopover(true)}
                    />
                    <div>
                      <div className="text-xs font-extrabold text-[#0B3B2C]">
                        Eco-Score: {ecoScore.score}/100 ({ecoScore.gradeLabel})
                      </div>
                      <div className="text-[11px] text-emerald-700 font-medium">
                        Click for 5-pillar lifecycle audit
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowScorePopover(true)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-2"
                  >
                    View Breakdown
                  </button>
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Material & Certifications */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div className="flex items-start gap-2.5 text-xs">
                  <Leaf className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-850">Material: </span>
                    <span className="text-stone-600">{product.material}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-850">Origin: </span>
                    <span className="text-stone-600">Local Artisan Cluster (~{product.madeInKm} km away)</span>
                  </div>
                </div>

                {product.certifications && product.certifications.length > 0 && (
                  <div className="flex items-start gap-2.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-850">Verified: </span>
                      <span className="text-stone-600">{product.certifications.join(', ')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity & Buy Panel Actions */}
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700">Quantity</span>
                  <div className="flex items-center gap-2 border border-stone-200 rounded-xl p-1 bg-stone-50">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1.5 rounded-lg hover:bg-white text-stone-700 transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-extrabold text-stone-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1.5 rounded-lg hover:bg-white text-stone-700 transition"
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
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-98 min-h-[44px]"
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-200 animate-bounce" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart • ₹{product.price * quantity}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className={`p-3.5 rounded-2xl border border-stone-200 hover:bg-stone-50 transition min-h-[44px] min-w-[44px] flex items-center justify-center ${
                      isFavorited ? 'text-rose-500 fill-rose-500 border-rose-200' : 'text-stone-700'
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
          <div className="mt-16 pt-12 border-t border-stone-200">
            <h2 className="text-xl font-extrabold text-[#0B3B2C] mb-6">
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

      {/* Mobile Sticky Add-to-Cart Bar (Feature 13) */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 sm:hidden z-40 flex items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="text-base font-black text-stone-900 leading-none">₹{product.price}</div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Grade {ecoScore?.grade || 'A'} Eco Standard</div>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-3 px-5 rounded-2xl bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition active:scale-95 min-h-[44px]"
        >
          {addedAnimation ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
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
