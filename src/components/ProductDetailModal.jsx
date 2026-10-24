import React, { useState } from 'react';
import { ShoppingBag, Wind, Droplets, Ban, MapPin, Award, CheckCircle, Sparkles, RefreshCw, QrCode, Ruler } from 'lucide-react';
import { calculateEcoScore, compareProductImpact, detectGreenwashing } from '../lib/ecoScore';
import { compareProductToBenchmark } from '../lib/decisionEngine';
import EcoScoreBadge from './EcoScoreBadge';
import EcoScorePopover from './EcoScorePopover';
import ProductGallery from './ProductGallery';
import ProductLifecycleTimeline from './lifecycle/ProductLifecycleTimeline';
import LifecycleTimelineScrubber from './lifecycle/LifecycleTimelineScrubber';
import SecondLifeTab from './lifecycle/SecondLifeTab';
import AIEthicsCard from './decision/AIEthicsCard';
import BrandTransparencyCard from './detective/BrandTransparencyCard';
import GreenwashLexiconHighlighter from './detective/GreenwashLexiconHighlighter';
import ProductScaleVisualModal from './product/ProductScaleVisualModal';
import ProductPassportQRModal from './product/ProductPassportQRModal';
import Modal from './ui/Modal';
import { useCart } from '../context/CartContext';

export default function ProductDetailModal({ product, onClose }) {
  const { addToCart, allProducts, getProductReviews, addReview, setIsAgentOpen } = useCart();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'lifecycle' | 'reviews'
  const [quantity, setQuantity] = useState(1);
  const [showFormulaPopover, setShowFormulaPopover] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isScaleModalOpen, setIsScaleModalOpen] = useState(false);
  const [isPassportQROpen, setIsPassportQROpen] = useState(false);
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
  const greenwashing = detectGreenwashing(product);
  const benchmark = compareProductToBenchmark(product);

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

  const modalTitle = (
    <div className="flex items-center gap-2.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary-subtle border border-primary/20 px-2.5 py-1 rounded-full">
        {product.category}
      </span>
      <span className="text-xs text-muted">ID: {product.id}</span>
    </div>
  );

  return (
    <Modal
      isOpen={!!product}
      onClose={onClose}
      title={modalTitle}
      maxWidth="max-w-2xl"
      className="p-0"
    >
      <div className="space-y-6">
          {/* Top Showcase Banner with Gallery */}
          <div className="space-y-5">
            <ProductGallery product={product} />

            <div className="p-5 rounded-2xl bg-surface-sunken border border-line shadow-soft-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <EcoScoreBadge scoreData={ecoScoreData} product={product} size="lg" />
                  {benchmark && (
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-surface-raised border border-line text-heading">
                      vs {product.category} Avg: <strong className={benchmark.carbonDiffPct <= 0 ? 'text-primary' : 'text-danger'}>{benchmark.carbonDiffPct > 0 ? `+${benchmark.carbonDiffPct}%` : `${benchmark.carbonDiffPct}%`} CO₂e</strong>
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowFormulaPopover(true)}
                  className="text-xs font-semibold text-primary hover:text-primary-hover underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
                >
                  Score Breakdown →
                </button>
              </div>
              <h2 id="product-modal-title" className="text-2xl font-serif font-bold text-heading leading-tight">
                {product.name}
              </h2>
              <p className="text-sm text-secondary mt-2 leading-relaxed">
                {product.description}
              </p>

              {/* Greenwashing Flag */}
              {greenwashing.isGreenwashed && (
                <div className="mt-3 p-3 rounded-xl bg-warning-subtle border border-warning/30 text-heading text-xs space-y-0.5">
                  <div className="font-bold flex items-center gap-1.5 text-accent">
                    <span>⚠️ Check the claims</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-secondary font-medium">
                    {greenwashing.reason}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Modal Tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-surface-sunken rounded-2xl border border-line">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-sans font-bold transition-all min-h-[36px] cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-surface-raised text-heading shadow-soft-xs border border-line'
                  : 'text-muted hover:text-heading'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('secondlife')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-sans font-bold transition-all min-h-[36px] cursor-pointer ${
                activeTab === 'secondlife'
                  ? 'bg-surface-raised text-emerald-400 shadow-soft-xs border border-emerald-500/30 font-bold'
                  : 'text-muted hover:text-heading'
              }`}
            >
              Second Life
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lifecycle')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-sans font-bold transition-all min-h-[36px] cursor-pointer ${
                activeTab === 'lifecycle'
                  ? 'bg-surface-raised text-heading shadow-soft-xs border border-line'
                  : 'text-muted hover:text-heading'
              }`}
            >
              5 Stages
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ethics')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-sans font-bold transition-all min-h-[36px] cursor-pointer ${
                activeTab === 'ethics'
                  ? 'bg-surface-raised text-amber-400 shadow-soft-xs border border-amber-400/30 font-bold'
                  : 'text-muted hover:text-heading'
              }`}
            >
              AI Ethics
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('transparency')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-sans font-bold transition-all min-h-[36px] cursor-pointer ${
                activeTab === 'transparency'
                  ? 'bg-surface-raised text-primary shadow-soft-xs border border-primary/30 font-bold'
                  : 'text-muted hover:text-heading'
              }`}
            >
              Transparency
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-sans font-bold transition-all min-h-[36px] cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-surface-raised text-heading shadow-soft-xs border border-line'
                  : 'text-muted hover:text-heading'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Environmental Impact Metrics Grid */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
                  Lifecycle Environmental Footprint
                </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-surface-raised border border-line shadow-soft-sm">
                <div className="flex items-center gap-1.5 text-xs text-muted mb-1">
                  <Wind className="w-4 h-4 text-primary" />
                  <span>Carbon</span>
                </div>
                <div className="text-lg font-serif font-bold text-heading">
                  {product.carbonKg} <span className="text-xs font-normal text-muted">kg CO₂e</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-raised border border-line shadow-soft-sm">
                <div className="flex items-center gap-1.5 text-xs text-muted mb-1">
                  <Droplets className="w-4 h-4 text-secondary" />
                  <span>Freshwater</span>
                </div>
                <div className="text-lg font-serif font-bold text-heading">
                  {product.waterLitres} <span className="text-xs font-normal text-muted">Litres</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-raised border border-line shadow-soft-sm">
                <div className="flex items-center gap-1.5 text-xs text-muted mb-1">
                  <Ban className="w-4 h-4 text-accent" />
                  <span>Plastic Waste</span>
                </div>
                <div className="text-lg font-serif font-bold text-heading">
                  {product.plasticGrams} <span className="text-xs font-normal text-muted">grams</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-raised border border-line shadow-soft-sm">
                <div className="flex items-center gap-1.5 text-xs text-muted mb-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Distance</span>
                </div>
                <div className="text-lg font-serif font-bold text-heading">
                  {product.madeInKm} <span className="text-xs font-normal text-muted">km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Materials & Packaging Specification */}
          <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-2.5">
            <div className="flex items-start gap-2">
              <span className="text-xs font-bold text-muted uppercase tracking-wider w-24 shrink-0">Material:</span>
              <span className="text-sm font-medium text-heading">
                <GreenwashLexiconHighlighter text={product.material} />
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs font-bold text-muted uppercase tracking-wider w-24 shrink-0">Packaging:</span>
              <span className="text-sm font-medium capitalize text-heading">
                {product.packaging} ({product.packaging === 'plastic-free' ? 'Compostable / Biodegradable' : product.packaging === 'recycled' ? 'Post-Consumer Recycled Paper' : 'Conventional Virgin Plastic'})
              </span>
            </div>

            {product.certifications && product.certifications.length > 0 && (
              <div className="flex items-start gap-2 pt-2 border-t border-line">
                <span className="text-xs font-bold text-muted uppercase tracking-wider w-24 shrink-0">Certifications:</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.certifications.map((c, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary border border-primary/20"
                    >
                      <Award className="w-3 h-3 text-primary" /> {c}
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
                ? 'bg-primary-subtle border-primary/20'
                : 'bg-accent-subtle border-accent/20'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 font-bold text-sm text-heading">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>
                    {product.isEcoFriendly ? 'Savings vs Conventional Equivalent' : 'Greener Alternative Available!'}
                  </span>
                </div>
                <span className="text-xs font-semibold text-secondary">
                  {product.isEcoFriendly ? `vs ${alternativeProduct.name}` : `Upgrade to ${alternativeProduct.name}`}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center my-3 bg-surface-raised p-3 rounded-xl border border-line shadow-soft-sm">
                <div>
                  <div className="text-xs text-muted font-medium">CO₂ Avoided</div>
                  <div className="text-base font-serif font-bold text-primary mt-0.5">
                    +{comparison.co2Saved} kg
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted font-medium">Plastic Diverted</div>
                  <div className="text-base font-serif font-bold text-accent mt-0.5">
                    +{comparison.plasticSaved} g
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted font-medium">Water Conserved</div>
                  <div className="text-base font-serif font-bold text-secondary mt-0.5">
                    +{comparison.waterSaved} L
                  </div>
                </div>
              </div>

              {!product.isEcoFriendly && alternativeProduct && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-accent font-medium">
                    This item has a lower Eco-Score.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(alternativeProduct, quantity);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverted font-semibold text-xs shadow-soft-sm min-h-[44px] transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-text-inverted" />
                    <span>Choose Greener Swap</span>
                  </button>
                </div>
              )}
            </div>
          )}
          </div>
        )}

          {/* Tab 2: Second Life Circular Path */}
          {activeTab === 'secondlife' && (
            <SecondLifeTab product={product} />
          )}

          {/* Tab 3: Lifecycle Timeline (Scrubber + 5 Stages) */}
          {activeTab === 'lifecycle' && (
            <div className="space-y-6">
              <LifecycleTimelineScrubber product={product} />
              <ProductLifecycleTimeline product={product} />
            </div>
          )}

          {/* Tab 4: AI Recommendation Ethics & Transparency Card */}
          {activeTab === 'ethics' && (
            <AIEthicsCard product={product} />
          )}

          {/* Tab: Brand Transparency Scorecard */}
          {activeTab === 'transparency' && (
            <BrandTransparencyCard product={product} />
          )}

          {/* Tab 3: Customer Reviews */}
          {activeTab === 'reviews' && (
            <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="font-serif font-bold text-sm text-heading flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-primary" />
                  Verified Eco Reviews ({reviews.length})
                </h3>
                <span className="text-[11px] text-muted">Real feedback from zero-waste shoppers</span>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3.5 py-1.5 rounded-xl bg-surface-raised border border-line text-heading text-xs font-semibold hover:bg-surface-sunken transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
              >
                {showReviewForm ? 'Cancel' : '+ Write Review'}
              </button>
            </div>

            {/* Review form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl bg-surface-raised border border-line space-y-3 shadow-soft-sm">
                <div className="text-xs font-semibold text-secondary">Rate this product:</div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      aria-label={`Rate ${star} stars`}
                      className="p-1.5 rounded-lg focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
                    >
                      <Sparkles
                        className={`w-5 h-5 ${
                          star <= newRating
                            ? 'text-accent fill-accent'
                            : 'text-muted/40'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-secondary ml-2">{newRating} of 5 Stars</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Your Name (e.g. Diya K.)"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-raised border border-line text-xs text-heading placeholder:text-muted focus-visible:outline-2 focus-visible:outline-focus min-h-[44px]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Your review / eco experience..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-raised border border-line text-xs text-heading placeholder:text-muted focus-visible:outline-2 focus-visible:outline-focus min-h-[44px]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverted text-xs font-bold shadow-soft-sm transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
                >
                  Submit Verified Eco Review
                </button>
              </form>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <div className="text-center py-4 text-xs text-muted">
                No reviews yet. Be the first conscious shopper to leave feedback!
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-xl bg-surface-raised border border-line text-xs shadow-soft-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-heading">
                        <span>{rev.author}</span>
                        {rev.verifiedEco && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-primary-subtle text-primary text-[10px] font-semibold border border-primary/20">
                            <CheckCircle className="w-3 h-3 text-primary" /> Verified Eco Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-accent mb-1">
                      {'★'.repeat(rev.rating)}
                      {'☆'.repeat(5 - rev.rating)}
                    </div>
                    <p className="text-text text-[11px] leading-relaxed font-normal">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

        {/* Modal Bottom Sticky Checkout Bar */}
        <div className="p-4 px-6 border-t border-line bg-surface-raised/95 backdrop-blur-xs flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-muted tracking-wider">Unit Price</div>
              <div className="text-xl font-serif font-bold text-heading">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center border border-line rounded-xl overflow-hidden bg-surface-sunken min-h-[44px]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-10 h-10 flex items-center justify-center text-secondary hover:bg-surface-raised transition-colors font-bold text-sm focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
              >
                -
              </button>
              <span className="px-3.5 text-sm font-semibold text-heading select-none">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="w-10 h-10 flex items-center justify-center text-secondary hover:bg-surface-raised transition-colors font-bold text-sm focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsScaleModalOpen(true)}
              className="min-h-[44px] flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-line hover:border-primary/50 text-secondary hover:text-primary font-medium text-xs transition cursor-pointer"
              title="Compare physical dimensions with smartphone, mug, and laptop"
            >
              <Ruler className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">Scale View</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPassportQROpen(true)}
              className="min-h-[44px] flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-line hover:border-primary/50 text-secondary hover:text-primary font-medium text-xs transition cursor-pointer"
              title="Product Passport QR Code"
            >
              <QrCode className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">Passport QR</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                setIsAgentOpen(true);
                window.dispatchEvent(
                  new CustomEvent('ecomart-agent-query', {
                    detail: {
                      query: `Evaluate the lifecycle, packaging claims, and carbon footprint of ${product.name}`,
                      contextProduct: product
                    }
                  })
                );
              }}
              className="min-h-[44px] flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-line hover:border-primary/50 text-secondary hover:text-primary font-medium text-xs transition cursor-pointer"
              title="Ask Eco Agent about this item"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">Ask Agent</span>
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              className="min-h-[44px] flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-sm shadow-soft-sm transition-all focus-visible:outline-2 focus-visible:outline-focus cursor-pointer active:scale-98"
            >
              <ShoppingBag className="w-4 h-4 text-primary-contrast" />
              <span>Add to Cart (₹{(product.price * quantity).toLocaleString('en-IN')})</span>
            </button>
          </div>
        </div>

        {/* Feature 50: Physical Scale Visual Modal */}
        {isScaleModalOpen && (
          <ProductScaleVisualModal
            isOpen={isScaleModalOpen}
            onClose={() => setIsScaleModalOpen(false)}
            product={product}
          />
        )}

        {/* Feature 61: Product Passport QR Modal */}
        {isPassportQROpen && (
          <ProductPassportQRModal
            isOpen={isPassportQROpen}
            onClose={() => setIsPassportQROpen(false)}
            product={product}
          />
        )}

        {showFormulaPopover && (
          <EcoScorePopover
            product={product}
            scoreData={ecoScoreData}
            onClose={() => setShowFormulaPopover(false)}
          />
        )}
    </Modal>
  );
}
