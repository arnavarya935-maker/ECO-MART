import React, { useState } from 'react';
import { Scan, Sparkles, Search } from 'lucide-react';
import { Modal } from './ui/Modal';
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
        <div className="relative h-44 rounded-2xl bg-surface-sunken flex flex-col items-center justify-center overflow-hidden border border-primary/30 p-4 text-center shadow-soft-sm">
          {/* Animated Laser Scan line */}
          {scanning ? (
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_12px_var(--color-primary)] animate-bounce-subtle" />
          ) : (
            <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-primary/50 flex items-center justify-center mb-2 bg-surface/40">
              <Scan className="w-7 h-7 text-primary animate-pulse" />
            </div>
          )}

          <div className="text-xs font-serif font-bold text-heading tracking-wide">
            {scanning ? 'Decoding Optical UPC Barcode...' : 'Simulated Camera Barcode Scanner'}
          </div>
          <p className="text-[11px] text-muted max-w-xs mt-1 leading-relaxed">
            Scan conventional product barcodes to instantly discover certified Grade A plastic-free alternatives.
          </p>
        </div>

        {/* Manual Code Input Form (Graceful Fallback) */}
        <form onSubmit={handleManualSubmit} className="flex gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="Enter 13-digit EAN/UPC code..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface border border-line text-xs font-medium text-heading placeholder:text-muted focus:outline-2 focus:outline-focus min-h-[44px]"
            />
          </div>
          <Button type="submit" variant="primary" size="sm" className="min-h-[44px]">
            Scan Code
          </Button>
        </form>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-danger/10 border border-danger/30 text-danger text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Scan Result Matched Card */}
        {scanResult && targetEcoProduct && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-surface to-surface border border-primary/30 shadow-soft-sm space-y-3.5 animate-slide-up">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-danger/10 text-danger border border-danger/30">
                Conventional: Grade E
              </span>
              <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Verified Greener Swap</span>
              </span>
            </div>

            <div className="text-xs text-secondary">
              Scanned: <span className="line-through font-medium text-muted">{scanResult.name}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface border border-primary/20 flex items-center justify-between shadow-soft-xs">
              <div>
                <div className="font-serif font-bold text-sm text-heading">
                  {targetEcoProduct.name}
                </div>
                <div className="text-[11px] text-muted mt-0.5">
                  ₹{targetEcoProduct.price} • Grade A Certified • {targetEcoProduct.packaging}
                </div>
              </div>
              <Badge variant="primary" size="sm">
                Saves {scanResult.co2Saved} CO₂
              </Badge>
            </div>

            <div className="flex gap-2.5 pt-1">
              <Button
                variant="primary"
                size="sm"
                className="flex-1 min-h-[44px]"
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
                className="min-h-[44px]"
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
        <div className="space-y-2.5 pt-3 border-t border-line">
          <div className="text-[11px] font-bold text-muted uppercase tracking-wider">
            Tap a demo barcode to test:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SAMPLE_CONVENTIONAL_BARCODES.slice(0, 4).map((sample) => (
              <button
                key={sample.code}
                type="button"
                onClick={() => handleScanSimulation(sample.code)}
                className="p-3 rounded-xl border border-line bg-surface-sunken/50 hover:bg-surface hover:border-primary text-left transition-colors cursor-pointer text-xs min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus"
              >
                <div className="font-medium text-heading truncate">
                  {sample.name}
                </div>
                <div className="text-[10px] text-muted font-mono mt-0.5">
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
