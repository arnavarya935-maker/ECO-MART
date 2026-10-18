import React from 'react';
import { Link } from 'react-router-dom';
import { History, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';

export default function RecentlyViewedStrip() {
  const { recentlyViewed } = useCart();

  if (!recentlyViewed || recentlyViewed.length === 0) {
    return null;
  }

  // Display up to 4 most recently viewed
  const items = recentlyViewed.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-[#0B3B2C]">
                Continue Where You Left Off
              </h2>
              <p className="text-xs text-stone-500">Recently inspected sustainable essentials</p>
            </div>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
