import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function WishlistPage({ setActivePage }) {
  const { wishlist, moveWishlistToCart, toggleWishlist } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full">
              Saved Eco Items
            </span>
            <span className="text-xs text-stone-500 font-medium">{wishlist.length} items</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B3B2C] dark:text-stone-100 mt-1">
            My Wishlist
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Products you are considering for future sustainable shopping.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActivePage('shop')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-sm w-fit"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-stone-850 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto text-2xl">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
            Your wishlist is empty
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Click the heart icon on any product in the shop catalog to save sustainable favorites here.
          </p>
          <button
            type="button"
            onClick={() => setActivePage('shop')}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow transition"
          >
            Explore Catalog
          </button>
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
