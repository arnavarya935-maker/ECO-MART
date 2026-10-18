import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight, Share2, Check, Copy } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';
import { playSound } from '../lib/audio';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, moveAllWishlistToCart, showToast } = useCart();
  const [searchParams] = useSearchParams();
  const [copiedType, setCopiedType] = useState(null);

  // If opened via shared link ?items=id1,id2, add missing to wishlist
  useEffect(() => {
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
    const itemIds = wishlist.map((p) => p.id).join(',');
    const url = `${window.location.origin}/#/wishlist?items=${encodeURIComponent(itemIds)}`;
    navigator.clipboard?.writeText(url);
    playSound('click');
    setCopiedType('link');
    showToast('Shareable wishlist link copied to clipboard!', 'success');
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
              Saved Eco Items
            </span>
            <span className="text-xs text-stone-500 font-bold">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B3B2C] mt-1.5">
            My Saved Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Curated conscious essentials saved for future zero-waste shopping.
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Share options */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition shadow-2xs min-h-[44px]"
            >
              {copiedType === 'link' ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedType === 'link' ? 'Link Copied!' : 'Copy Share Link'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyTextList}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition shadow-2xs min-h-[44px]"
            >
              {copiedType === 'text' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedType === 'text' ? 'List Copied!' : 'Copy Text List'}</span>
            </button>

            {/* Move All to Cart (Feature 28) */}
            <button
              type="button"
              onClick={moveAllWishlistToCart}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition shadow-xs min-h-[44px]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All to Cart</span>
            </button>
          </div>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto text-2xl">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-black text-lg text-stone-900">
            Your wishlist is empty
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            Click the heart icon on any product in the shop catalog to save sustainable favorites here and generate shareable links.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition"
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
