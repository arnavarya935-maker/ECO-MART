import React, { useState } from 'react';
import { Scan, Sparkles, Search } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { useCart } from '../context/CartContext';

const SAMPLE_CONVENTIONAL_BARCODES = [
  { code: '8901234567890', name: 'Single-Use Plastic Cutlery (50 pcs)', ecoId: 'kit-01', ecoName: 'Organic Bamboo Cutlery Set', plasticSaved: '145g', co2Saved: '2.1kg' },
  { code: '8909876543210', name: 'Plastic Handle Nylon Toothbrush', ecoId: 'pers-01', ecoName: 'Compostable Bamboo Toothbrush', plasticSaved: '92g', co2Saved: '1.57kg' },
  { code: '8905551234567', name: 'Synthetic Polyester Tote Bag', ecoId: 'bag-01', ecoName: 'Organic Fair-Trade Cotton Tote', plasticSaved: '120g', co2Saved: '3.2kg' },
  { code: '8908889990001', name: 'Single-Use Cling Wrap Film (30m)', ecoId: 'kit-02', ecoName: 'Pure Beeswax Food Wraps', plasticSaved: '180g', co2Saved: '1.8kg' },
  { code: '8903332221114', name: 'Petrochemical Liquid Shampoo (300ml)', ecoId: 'pers-02', ecoName: 'Organic Solid Shampoo Bar', plasticSaved: '65g', co2Saved: '2.4kg' }
];

export default function BarcodeScannerModal({ isOpen, onClose }) {
  const { setSelectedProduct, allProducts, addToCart } = useCart();
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleScanSimulation = (code) => {
    setScanning(true);
    setScanResult(null);
    setErrorMsg('');
    setBarcodeInput(code);

    setTimeout(() => {
      setScanning(false);
      const match = SAMPLE_CONVENTIONAL_BARCODES.find((b) => b.code === code);
      if (match) {
        setScanResult(match);
      } else {
        setErrorMsg('Barcode not recognized in local conventional audit index. Try one of the demo samples below.');
      }
    }, 700);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    handleScanSimulation(barcodeInput.trim());
  };

  const targetEcoProduct = scanResult ? (allProducts || []).find((p) => p.id === scanResult.ecoId) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setScanResult(null);
        setErrorMsg('');
        setBarcodeInput('');
        onClose();
      }}
      title="Barcode Eco-Swap Scanner"
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Scanner Viewfinder / Simulation Box */}
        <div className="relative h-44 rounded-2xl bg-stone-950 flex flex-col items-center justify-center overflow-hidden border border-emerald-500/30 p-4 text-center">
          {/* Animated Laser Scan line */}
          {scanning ? (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] animate-bounce-subtle" />
          ) : (
            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-emerald-400/60 flex items-center justify-center mb-2">
              <Scan className="w-8 h-8 text-emerald-400 animate-pulse" />
            </div>
          )}

          <div className="text-xs font-black text-white">
            {scanning ? 'Decoding Optical UPC Barcode...' : 'Simulated Camera Barcode Scanner'}
          </div>
          <p className="text-[11px] text-stone-400 max-w-xs mt-1">
            Scan conventional product barcodes to instantly discover certified Grade A plastic-free alternatives.
          </p>
        </div>

        {/* Manual Code Input Form (Graceful Fallback) */}
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="Enter 13-digit EAN/UPC code..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <Button type="submit" variant="primary" size="sm">
            Scan Code
          </Button>
        </form>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-800 dark:text-rose-200 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        {/* Scan Result Matched Card */}
        {scanResult && targetEcoProduct && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white dark:from-[#0D241C] dark:to-[#0D1F18] border border-emerald-300 dark:border-emerald-700 shadow-md space-y-3 animate-slide-up">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                Conventional Detected: Grade E
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Greener Swap</span>
              </span>
            </div>

            <div className="text-xs text-stone-600 dark:text-stone-300">
              Scanned: <span className="line-through font-bold text-stone-800 dark:text-stone-200">{scanResult.name}</span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <div className="font-extrabold text-xs text-[#0B3B2C] dark:text-emerald-300">
                  {targetEcoProduct.name}
                </div>
                <div className="text-[11px] text-stone-500">
                  ₹{targetEcoProduct.price} • Grade A Certified • {targetEcoProduct.packaging}
                </div>
              </div>
              <Badge variant="emerald" size="sm">
                Saves {scanResult.co2Saved} CO₂
              </Badge>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => {
                  addToCart(targetEcoProduct);
                  onClose();
                }}
              >
                Add Greener Swap to Cart
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedProduct(targetEcoProduct);
                  onClose();
                }}
              >
                Inspect Specs
              </Button>
            </div>
          </div>
        )}

        {/* Demo Barcodes Quick Selector */}
        <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Tap a demo barcode to test:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SAMPLE_CONVENTIONAL_BARCODES.slice(0, 4).map((sample) => (
              <button
                key={sample.code}
                type="button"
                onClick={() => handleScanSimulation(sample.code)}
                className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 hover:border-emerald-400 text-left transition cursor-pointer text-xs"
              >
                <div className="font-extrabold text-stone-800 dark:text-stone-200 truncate">
                  {sample.name}
                </div>
                <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                  UPC: {sample.code}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
