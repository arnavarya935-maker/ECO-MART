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
      <div className="p-6 sm:p-8 rounded-3xl bg-surface-raised border border-line shadow-soft-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-surface-sunken text-primary border border-line-subtle flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-heading tracking-tight">
                Continue Where You Left Off
              </h2>
              <p className="font-sans text-xs text-muted">Recently inspected sustainable essentials</p>
            </div>
          </div>
          <Link
            to="/shop"
            className="text-xs font-sans font-medium text-primary hover:text-primary-hover flex items-center gap-1 transition"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

