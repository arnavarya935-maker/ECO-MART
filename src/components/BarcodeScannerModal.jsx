import React, { useState, useRef, useEffect } from 'react';
import { Scan, Search, Camera, XCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Modal } from './ui/Modal';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { useCart } from '../context/CartContext';
import productsData from '../data/products.json';

const SAMPLE_CONVENTIONAL_BARCODES = [
  { code: '8901234567890', name: 'Plastic Handle Nylon Toothbrush', category: 'Personal Care', matchedCatalogId: 'pers-01' },
  { code: '8905551234567', name: 'Polyester Shopping Bag', category: 'Bags & Accessories', matchedCatalogId: 'bag-01' },
  { code: '8908889990001', name: 'Petrochemical Liquid Shampoo', category: 'Personal Care', matchedCatalogId: 'care-03' }
];

export default function BarcodeScannerModal({ isOpen, onClose, onSelectBarcode = null }) {
  const { setSelectedProduct, addToCart } = useCart();
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Stop camera on unmount or close
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleStartCamera = async () => {
    setErrorMsg('');
    setIsCameraActive(true);

    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Check if browser has native BarcodeDetector API
        if ('BarcodeDetector' in window) {
          const barcodeDetector = new window.BarcodeDetector({
            formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'qr_code']
          });

          const detectLoop = async () => {
            if (!videoRef.current || !streamRef.current) return;
            try {
              const barcodes = await barcodeDetector.detect(videoRef.current);
              if (barcodes.length > 0) {
                const detectedCode = barcodes[0].rawValue;
                handleStopCamera();
                handleLookupBarcode(detectedCode);
                return;
              }
            } catch {
              // Ignore frame detection errors
            }
            if (isCameraActive) {
              requestAnimationFrame(detectLoop);
            }
          };

          requestAnimationFrame(detectLoop);
        }
      } else {
        throw new Error('Camera not supported');
      }
    } catch {
      setErrorMsg('Camera access unavailable. Please use manual barcode entry.');
      setIsCameraActive(false);
    }
  };

  const handleStopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleLookupBarcode = async (codeToSearch) => {
    const code = codeToSearch.trim();
    if (!code) return;

    setScanning(true);
    setErrorMsg('');
    setScanResult(null);

    // 1. Check local catalog products directly
    const catalogMatch = productsData.find(
      (p) => p.barcode === code || p.id === code || p.sku === code
    );

    if (catalogMatch) {
      setScanResult({
        found: true,
        source: 'EcoMart Catalog',
        productName: catalogMatch.name,
        brand: catalogMatch.brand || 'EcoMart Artisan',
        category: catalogMatch.category,
        catalogProduct: catalogMatch,
        code
      });
      setScanning(false);
      return;
    }

    // 2. Check sample conventional barcodes
    const sampleMatch = SAMPLE_CONVENTIONAL_BARCODES.find((b) => b.code === code);
    if (sampleMatch) {
      const ecoSwap = productsData.find((p) => p.id === sampleMatch.matchedCatalogId);
      setScanResult({
        found: true,
        source: 'Sample Conventional Product',
        productName: sampleMatch.name,
        category: sampleMatch.category,
        ecoSwap,
        code
      });
      setScanning(false);
      return;
    }

    // 3. Optional server-side lookup via Open Food Facts proxy
    try {
      const res = await fetch(`/api/barcode?code=${encodeURIComponent(code)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.found) {
          setScanResult({
            found: true,
            source: data.source || 'Open Food Facts',
            productName: data.product_name,
            brand: data.brand,
            ingredients: data.ingredients_text,
            packaging: data.packaging,
            code
          });
          setScanning(false);
          return;
        }
      }
    } catch {
      // Backend lookup offline or unavailable
    }

    // 4. Honest not found result
    setScanning(false);
    setErrorMsg(`Barcode "${code}" was not found in the catalog or public database.`);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    handleLookupBarcode(barcodeInput.trim());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleStopCamera();
        setScanResult(null);
        setErrorMsg('');
        setBarcodeInput('');
        onClose();
      }}
      title="Barcode Scanner"
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        {/* Viewfinder / Camera Screen */}
        <div className="relative h-48 rounded-2xl bg-surface-sunken flex flex-col items-center justify-center overflow-hidden border border-line p-4 text-center shadow-soft-sm">
          {isCameraActive ? (
            <div className="relative w-full h-full">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-xl" />
              <button
                type="button"
                onClick={handleStopCamera}
                className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-surface/80 backdrop-blur-sm text-xs font-semibold text-heading hover:bg-surface"
              >
                Close Camera
              </button>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-primary/50 flex items-center justify-center mb-2 bg-surface/40">
                <Scan className="w-6 h-6 text-primary" />
              </div>
              <div className="text-xs font-bold text-heading">
                Optical Barcode Lookup
              </div>
              <p className="text-xs text-text-muted max-w-xs mt-1">
                Reads 13-digit EAN/UPC barcodes using your camera or manual entry.
              </p>
              <button
                type="button"
                onClick={handleStartCamera}
                className="mt-3 px-3.5 py-1.5 rounded-full bg-surface-raised border border-line hover:border-primary/50 text-xs font-semibold text-heading flex items-center gap-1.5 transition cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-primary" />
                <span>Open Camera</span>
              </button>
            </>
          )}
        </div>

        {/* Manual Barcode Entry Form */}
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="Enter EAN/UPC code (e.g. 8901234567890)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-line text-xs font-medium text-heading placeholder:text-text-muted focus:outline-2 focus:outline-focus min-h-[44px]"
            />
          </div>
          <Button type="submit" variant="primary" size="sm" disabled={scanning} className="min-h-[44px]">
            {scanning ? 'Searching...' : 'Look Up'}
          </Button>
        </form>

        {/* Quick Sample Barcode Chips */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-text-muted">Sample Barcodes:</span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_CONVENTIONAL_BARCODES.map((s) => (
              <button
                key={s.code}
                type="button"
                onClick={() => {
                  setBarcodeInput(s.code);
                  handleLookupBarcode(s.code);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-surface-sunken hover:bg-surface-raised border border-line text-heading transition cursor-pointer"
              >
                {s.name} ({s.code.slice(-4)})
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Found Product Card */}
        {scanResult && scanResult.found && (
          <div className="p-4 rounded-2xl bg-surface-raised border border-line space-y-3 animate-slide-up">
            <div className="flex items-center justify-between text-xs">
              <Badge variant="outline" size="sm">
                Source: {scanResult.source}
              </Badge>
              <span className="font-mono text-xs text-text-muted">{scanResult.code}</span>
            </div>

            <div>
              <h4 className="font-serif font-bold text-base text-heading">{scanResult.productName}</h4>
              {scanResult.brand && (
                <p className="text-xs text-text-muted">Brand: {scanResult.brand}</p>
              )}
            </div>

            {scanResult.catalogProduct && (
              <div className="pt-2 border-t border-line flex items-center justify-between">
                <span className="text-xs text-primary font-semibold">Available in EcoMart</span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedProduct(scanResult.catalogProduct);
                    onClose();
                  }}
                >
                  View Product
                </Button>
              </div>
            )}

            {scanResult.ecoSwap && (
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sustainable Catalog Swap:</span>
                </div>
                <div className="text-xs font-medium text-heading">{scanResult.ecoSwap.name}</div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    addToCart(scanResult.ecoSwap);
                    onClose();
                  }}
                >
                  Add Greener Swap to Cart
                </Button>
              </div>
            )}

            {onSelectBarcode && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  onSelectBarcode(scanResult);
                  onClose();
                }}
              >
                Use this barcode in label auditor
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
