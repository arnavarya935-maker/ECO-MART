import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Search, ArrowLeft, Barcode, Camera } from 'lucide-react';
import productsData from '../data/products.json';
import { generateBarcodeSvg } from '../lib/barcodeUtils';
import BarcodeScannerModal from '../components/BarcodeScannerModal';
import ProductDetailModal from '../components/ProductDetailModal';

export default function BarcodeDemoPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  const categories = useMemo(() => {
    const set = new Set(productsData.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredProducts = useMemo(() => {
    return productsData.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.barcode && p.barcode.includes(search));
      return matchCat && matchSearch;
    });
  }, [search, selectedCategory]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-left text-text animate-fade-in pb-24">
      {/* Top Controls (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-5 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1 text-xs text-muted hover:text-heading transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Shop</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-heading mt-1 flex items-center gap-2.5">
            <Barcode className="w-7 h-7 text-primary" />
            <span>Catalogue Barcode Sheet</span>
          </h1>
          <p className="text-xs text-secondary mt-1">
            Printable EAN-13 sample barcodes for all 124 catalog products. Scan any code with your phone or webcam!
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="px-4 py-2 rounded-xl bg-surface-raised hover:bg-surface-sunken border border-line text-heading text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-soft-xs"
          >
            <Camera className="w-4 h-4 text-primary" />
            <span>Test Scanner</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-soft-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 print:hidden">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or barcode..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-line bg-surface font-sans text-xs text-heading placeholder:text-muted focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-contrast'
                  : 'bg-surface-raised border border-line text-secondary hover:text-heading'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="text-xs text-muted font-mono flex items-center justify-between print:hidden">
        <span>Showing {filteredProducts.length} of {productsData.length} barcodes</span>
        <span>Standard: GS1 India EAN-13 (Prefix 890)</span>
      </div>

      {/* Barcode Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 print:grid-cols-3 print:gap-3">
        {filteredProducts.map((p) => {
          const svgMarkup = generateBarcodeSvg(p.barcode, {
            width: 220,
            height: 90,
            barColor: '#0f172a',
            bgColor: '#ffffff',
            showText: true
          });

          return (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-surface border border-line shadow-soft-xs space-y-2 flex flex-col justify-between print:border-black print:shadow-none print:break-inside-avoid"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-muted uppercase tracking-wider">{p.category}</span>
                  <span className="text-xs font-bold text-heading">₹{p.price}</span>
                </div>
                <h3 className="font-serif font-bold text-xs text-heading line-clamp-2 mt-0.5 leading-snug">
                  {p.name}
                </h3>
              </div>

              {/* Rendered SVG Barcode */}
              <div
                className="bg-white p-2 rounded-xl border border-line flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setActiveProduct(p)}
                title="Click to view product details"
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
              />

              <div className="flex items-center justify-between pt-1 text-[10px] text-muted font-mono border-t border-line">
                <span>SKU: {p.id}</span>
                <button
                  type="button"
                  onClick={() => setActiveProduct(p)}
                  className="text-primary hover:underline font-sans font-semibold print:hidden cursor-pointer"
                >
                  View Details →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Barcode Scanner Modal */}
      {isScannerOpen && (
        <BarcodeScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onSelectProduct={(product) => {
            setIsScannerOpen(false);
            setActiveProduct(product);
          }}
        />
      )}

      {/* Product Detail Modal */}
      {activeProduct && (
        <ProductDetailModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
        />
      )}
    </div>
  );
}
