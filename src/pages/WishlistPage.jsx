import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight, Share2, Check, Copy, QrCode } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';
import { playSound } from '../lib/audio';
import { exportWishlistCode, importWishlistCode } from '../lib/circularityEngine';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, moveAllWishlistToCart, showToast } = useCart();
  const [searchParams] = useSearchParams();
  const [copiedType, setCopiedType] = useState(null);

  // If opened via shared link ?items=id1,id2 or ?bundle=code, add missing to wishlist
  useEffect(() => {
    const bundle = searchParams.get('bundle');
    if (bundle) {
      const ids = importWishlistCode(bundle);
      ids.forEach((id) => {
        const prod = productsData.find((p) => p.id === id);
        if (prod && !wishlist.some((w) => w.id === prod.id)) {
          toggleWishlist(prod);
        }
      });
      return;
    }
    const sharedItemIds = searchParams.get('items');
    if (sharedItemIds) {
      const ids = sharedItemIds.split(',').map((s) => s.trim());
      ids.forEach((id) => {
        const prod = productsData.find((p) => p.id === id);
        if (prod && !wishlist.some((w) => w.id === prod.id)) {
          toggleWishlist(prod);
        }
      });
    }
  }, [searchParams, toggleWishlist, wishlist]);

  const handleCopyLink = () => {
    const bundleCode = exportWishlistCode(wishlist);
    const url = `${window.location.origin}/#/wishlist?bundle=${encodeURIComponent(bundleCode)}`;
    navigator.clipboard?.writeText(url);
    playSound('click');
    setCopiedType('link');
    showToast('Shareable wishlist bundle link copied to clipboard!', 'success');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleCopyTextList = () => {
    const textList = `🌿 My EcoMart Sustainable Wishlist:\n` +
      wishlist.map((p, idx) => `${idx + 1}. ${p.name} - ₹${p.price} (${p.category})`).join('\n') +
      `\n\nTotal Estimated: ₹${wishlist.reduce((acc, p) => acc + p.price, 0)}`;
    navigator.clipboard?.writeText(textList);
    playSound('click');
    setCopiedType('text');
    showToast('Wishlist text list copied!', 'success');
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-danger bg-danger/10 border border-danger/20 px-2.5 py-0.5 rounded-full">
              Saved Eco Items
            </span>
            <span className="text-xs text-muted font-medium">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-heading mt-1.5 tracking-tight">
            My Saved Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Curated conscious essentials saved for future zero-waste shopping.
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Share options */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface border border-line hover:bg-surface-sunken text-secondary text-xs font-medium transition shadow-soft-xs min-h-[44px] cursor-pointer"
            >
              {copiedType === 'link' ? <Check className="w-4 h-4 text-primary" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedType === 'link' ? 'Link Copied!' : 'Copy Share Link'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyTextList}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface border border-line hover:bg-surface-sunken text-secondary text-xs font-medium transition shadow-soft-xs min-h-[44px] cursor-pointer"
            >
              {copiedType === 'text' ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              <span>{copiedType === 'text' ? 'List Copied!' : 'Copy Text List'}</span>
            </button>

            {/* Move All to Cart (Feature 28) */}
            <button
              type="button"
              onClick={moveAllWishlistToCart}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-medium transition shadow-soft-xs min-h-[44px] cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-accent" />
              <span>Move All to Cart</span>
            </button>
          </div>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-3xl border border-line shadow-soft-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-surface-sunken text-muted flex items-center justify-center mx-auto text-2xl">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="font-serif font-bold text-lg text-heading">
            Your wishlist is empty
          </h3>
          <p className="text-xs sm:text-sm text-secondary max-w-sm mx-auto leading-relaxed font-normal">
            Click the heart icon on any product in the shop catalog to save sustainable favorites here and generate shareable links.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-medium shadow-soft-xs transition min-h-[44px]"
          >
            <span>Explore Eco Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
