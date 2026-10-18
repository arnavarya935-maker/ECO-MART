import React, { useState } from 'react';
import { X, ShoppingBag, Wind, Droplets, Ban, MapPin, Award, CheckCircle, Sparkles, RefreshCw } from 'lucide-react';
import { calculateEcoScore, compareProductImpact } from '../lib/ecoScore';
import EcoScoreBadge from './EcoScoreBadge';
import EcoScorePopover from './EcoScorePopover';
import ProductGallery from './ProductGallery';
import { useCart } from '../context/CartContext';

export default function ProductDetailModal({ product, onClose }) {
  const { addToCart, allProducts, getProductReviews, addReview } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showFormulaPopover, setShowFormulaPopover] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  if (!product) return null;

  const reviews = getProductReviews ? getProductReviews(product.id) : [];

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    if (addReview) {
      addReview(product.id, {
        author: reviewerName || 'Verified Eco Shopper',
        rating: newRating,
        comment: reviewComment
      });
    }
    setReviewComment('');
    setReviewerName('');
    setShowReviewForm(false);
  };

  const ecoScoreData = calculateEcoScore(product);

  // Look up alternative product (either eco alternative or conventional)
  const productMap = new Map((allProducts || []).map((p) => [p.id, p]));
  const alternativeProduct = product.conventionalAlternativeId
    ? productMap.get(product.conventionalAlternativeId)
    : null;

  let comparison = null;
  if (alternativeProduct) {
    if (product.isEcoFriendly) {
      comparison = compareProductImpact(product, alternativeProduct);
    } else {
      comparison = compareProductImpact(alternativeProduct, product);
    }
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FAF8F5] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-stone-800 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-850/70 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full">
              {product.category}
            </span>
            <span className="text-xs text-stone-500">ID: {product.id}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Showcase Banner with Gallery */}
          <div className="space-y-5">
            <ProductGallery product={product} />

            <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <EcoScoreBadge scoreData={ecoScoreData} product={product} size="lg" />
                <button
                  type="button"
                  onClick={() => setShowFormulaPopover(true)}
                  className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  Score Breakdown →
                </button>
              </div>
              <h2 className="text-2xl font-black text-stone-900 dark:text-stone-100 leading-tight">
                {product.name}
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-2">
                {product.description}
              </p>
            </div>
          </div>

          {/* Environmental Impact Metrics Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3">
              Lifecycle Environmental Footprint
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                  <Wind className="w-4 h-4 text-sky-500" />
                  <span>Carbon Footprint</span>
                </div>
                <div className="text-lg font-black text-stone-900 dark:text-stone-100">
                  {product.carbonKg} <span className="text-xs font-normal text-stone-400">kg CO₂e</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span>Freshwater Use</span>
                </div>
                <div className="text-lg font-black text-stone-900 dark:text-stone-100">
                  {product.waterLitres} <span className="text-xs font-normal text-stone-400">Litres</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                  <Ban className="w-4 h-4 text-rose-500" />
                  <span>Plastic Waste</span>
                </div>
                <div className="text-lg font-black text-stone-900 dark:text-stone-100">
                  {product.plasticGrams} <span className="text-xs font-normal text-stone-400">grams</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span>Transport Distance</span>
                </div>
                <div className="text-lg font-black text-stone-900 dark:text-stone-100">
                  {product.madeInKm} <span className="text-xs font-normal text-stone-400">km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Materials & Packaging Specification */}
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 space-y-2.5">
            <div className="flex items-start gap-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider w-24 shrink-0">Material:</span>
              <span className="text-sm font-medium text-stone-800 dark:text-stone-200">{product.material}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider w-24 shrink-0">Packaging:</span>
              <span className="text-sm font-medium capitalize text-stone-800 dark:text-stone-200">
                {product.packaging} ({product.packaging === 'plastic-free' ? 'Compostable / Biodegradable' : product.packaging === 'recycled' ? 'Post-Consumer Recycled Paper' : 'Conventional Virgin Plastic'})
              </span>
            </div>

            {product.certifications && product.certifications.length > 0 && (
              <div className="flex items-start gap-2 pt-1 border-t border-stone-100 dark:border-stone-700/60">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider w-24 shrink-0">Certifications:</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.certifications.map((c, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300"
                    >
                      <Award className="w-3 h-3" /> {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Swap Comparison Box (Eco vs Conventional Alternative) */}
          {comparison && (
            <div className={`p-4 rounded-2xl border ${
              product.isEcoFriendly
                ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    {product.isEcoFriendly ? 'Savings vs Conventional Equivalent' : 'Greener Alternative Available!'}
                  </span>
                </div>
                <span className="text-xs font-semibold text-stone-500">
                  {product.isEcoFriendly ? `vs ${alternativeProduct.name}` : `Upgrade to ${alternativeProduct.name}`}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center my-3 bg-white/70 dark:bg-stone-900/60 p-3 rounded-xl border border-stone-200/50 dark:border-stone-800">
                <div>
                  <div className="text-xs text-stone-500">CO₂ Avoided</div>
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    +{comparison.co2Saved} kg
                  </div>
                </div>
                <div>
                  <div className="text-xs text-stone-500">Plastic Diverted</div>
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    +{comparison.plasticSaved} g
                  </div>
                </div>
                <div>
                  <div className="text-xs text-stone-500">Water Conserved</div>
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    +{comparison.waterSaved} L
                  </div>
                </div>
              </div>

              {!product.isEcoFriendly && alternativeProduct && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-rose-800 dark:text-rose-300">
                    This item has a lower Eco-Score.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(alternativeProduct, quantity);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Choose Greener Swap</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Customer Reviews & Eco Feedback Section */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Verified Eco Reviews ({reviews.length})
                </h3>
                <span className="text-[11px] text-stone-500">Real feedback from zero-waste shoppers</span>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-200 transition"
              >
                {showReviewForm ? 'Cancel' : '+ Write Review'}
              </button>
            </div>

            {/* Review form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 space-y-3">
                <div className="text-xs font-bold text-stone-700 dark:text-stone-200">Rate this product:</div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 focus:outline-hidden"
                    >
                      <Sparkles
                        className={`w-5 h-5 ${
                          star <= newRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-300 dark:text-stone-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-500 ml-2">{newRating} of 5 Stars</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Name (e.g. Diya K.)"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Your review / eco experience..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition"
                >
                  Submit Verified Eco Review
                </button>
              </form>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <div className="text-center py-4 text-xs text-stone-400">
                No reviews yet. Be the first conscious shopper to leave feedback!
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/50 dark:border-stone-700/50 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-100">
                        <span>{rev.author}</span>
                        {rev.verifiedEco && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold">
                            <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified Eco Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400 mb-1">
                      {'★'.repeat(rev.rating)}
                      {'☆'.repeat(5 - rev.rating)}
                    </div>
                    <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Sticky Checkout Bar */}
        <div className="p-4 px-6 border-t border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-850/80 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Unit Price</div>
              <div className="text-xl font-black text-stone-900 dark:text-stone-100">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-xl overflow-hidden bg-stone-50 dark:bg-stone-800">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-2.5 py-1 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition font-bold"
              >
                -
              </button>
              <span className="px-3 py-1 text-sm font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-2.5 py-1 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart (₹{(product.price * quantity).toLocaleString('en-IN')})</span>
            </button>
          </div>
        </div>

        {showFormulaPopover && (
          <EcoScorePopover
            product={product}
            scoreData={ecoScoreData}
            onClose={() => setShowFormulaPopover(false)}
          />
        )}
      </div>
    </div>
  );
}
