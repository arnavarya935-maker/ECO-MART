import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scan,
  Search,
  Camera,
  Upload,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Zap,
  ZapOff,
  ShoppingBag,
  Bot,
  Check,
  FileText,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';
import { BrowserMultiFormatReader, BarcodeFormat } from '@zxing/browser';
import { DecodeHintType } from '@zxing/library';
import { Modal } from './ui/Modal';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import productsData from '../data/products.json';
import {
  validateBarcode,
  estimateEcoScoreFromExternal,
  findGreenerCatalogSwaps
} from '../lib/barcodeUtils';
import { getSupabase } from '../lib/supabase';

const SAMPLE_BARCODES = [
  { code: '3017620422003', name: 'Nutella Hazelnut Spread', category: 'Food & Pantry' },
  { code: '5449000000996', name: 'Coca-Cola Original Can', category: 'Beverages' },
  { code: '8715700421377', name: 'Heinz Tomato Ketchup', category: 'Food & Pantry' },
  { code: '3046920022606', name: 'Lindt Dark Chocolate', category: 'Confectionery' },
  { code: '8901234567890', name: 'Conventional Toothbrush', category: 'Personal Care' }
];

export default function BarcodeScannerModal({ isOpen, onClose, onSelectBarcode = null }) {
  const navigate = useNavigate();
  const { setSelectedProduct, addToCart, showToast } = useCart();
  const { products: contextProducts } = useProducts?.() || {};
  const catalogList = Array.isArray(contextProducts) && contextProducts.length > 0 ? contextProducts : productsData;

  const [barcodeInput, setBarcodeInput] = useState('');
  const [validationError, setValidationError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [hasTorch, setHasTorch] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'upload' | 'manual'

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const readerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize ZXing Reader with explicit multi-format hints
  const getReader = useCallback(() => {
    if (!readerRef.current) {
      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.CODE_128,
        BarcodeFormat.QR_CODE
      ]);
      readerRef.current = new BrowserMultiFormatReader(hints, 500);
    }
    return readerRef.current;
  }, []);

  // Stop camera tracks cleanly
  const stopCameraStream = useCallback(() => {
    if (readerRef.current) {
      try {
        // ZXing BrowserCodeReader stop
        BrowserMultiFormatReader.releaseAllStreams();
      } catch {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsTorchOn(false);
    setHasTorch(false);
  }, []);

  // Stop camera on unmount or when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopCameraStream();
      setScanResult(null);
      setErrorMsg('');
      setValidationError('');
      setBarcodeInput('');
    }
  }, [isOpen, stopCameraStream]);

  // Enumerate cameras when modal opens
  useEffect(() => {
    if (isOpen && typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setAvailableCameras(videoInputs);
        if (videoInputs.length > 0 && !selectedCameraId) {
          // Prefer back/environment camera
          const backCam = videoInputs.find((c) => /back|rear|environment/i.test(c.label));
          setSelectedCameraId(backCam ? backCam.deviceId : videoInputs[0].deviceId);
        }
      }).catch(() => {});
    }
  }, [isOpen, selectedCameraId]);

  // Start ZXing Camera Stream
  const handleStartCamera = async (overrideDeviceId = null) => {
    setErrorMsg('');
    setScanResult(null);

    // Insecure context check
    if (typeof window !== 'undefined' && window.isSecureContext === false) {
      setErrorMsg('Camera access requires HTTPS or localhost security context. Please use photo upload or manual entry.');
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMsg('Camera access is not supported by your browser. Please use photo upload or manual entry.');
      return;
    }

    stopCameraStream();
    setIsCameraActive(true);

    try {
      const deviceIdToUse = overrideDeviceId || selectedCameraId;
      const constraints = {
        video: deviceIdToUse
          ? { deviceId: { exact: deviceIdToUse } }
          : { facingMode: { ideal: 'environment' } }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      // Check for torch capability
      const track = stream.getVideoTracks()[0];
      if (track && typeof track.getCapabilities === 'function') {
        const caps = track.getCapabilities();
        if (caps.torch) {
          setHasTorch(true);
        }
      }

      // Start decoding loop via ZXing
      const reader = getReader();
      reader.decodeFromVideoElement(videoRef.current, (result, err) => {
        if (result) {
          const rawText = result.getText();
          if (rawText) {
            stopCameraStream();
            handleLookupBarcode(rawText);
          }
        }
      });
    } catch (err) {
      stopCameraStream();
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMsg('Camera permission denied. Please allow camera access in your browser settings, or use photo upload / manual entry.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMsg('No camera found on this device. Please upload a photo or enter the barcode number manually.');
      } else {
        setErrorMsg(`Camera error: ${err.message || 'Unable to open camera.'}. Please use photo upload or manual entry.`);
      }
    }
  };

  // Toggle Torch/Flashlight
  const handleToggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const nextState = !isTorchOn;
      await track.applyConstraints({
        advanced: [{ torch: nextState }]
      });
      setIsTorchOn(nextState);
    } catch {
      showToast?.('Torch not supported on this camera', 'info');
    }
  };

  // Switch camera device
  const handleSwitchCamera = async (newDeviceId) => {
    setSelectedCameraId(newDeviceId);
    if (isCameraActive) {
      await handleStartCamera(newDeviceId);
    }
  };

  // Upload photo of barcode and decode
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setScanning(true);
    setScanResult(null);

    const objectUrl = URL.createObjectURL(file);
    try {
      const reader = getReader();
      const result = await reader.decodeFromImageUrl(objectUrl);
      URL.revokeObjectURL(objectUrl);

      if (result && result.getText()) {
        handleLookupBarcode(result.getText());
      } else {
        throw new Error('No barcode detected in image');
      }
    } catch {
      URL.revokeObjectURL(objectUrl);
      setScanning(false);
      setErrorMsg("Couldn't read a barcode from this image. Please ensure the barcode is sharp, well-lit, and not cropped.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Main Barcode Lookup Cascade: (1) Supabase / Local -> (2) /api/barcode -> (3) Honest not found
  const handleLookupBarcode = async (rawCode) => {
    const code = String(rawCode || '').trim();
    if (!code) return;

    setScanning(true);
    setErrorMsg('');
    setValidationError('');
    setScanResult(null);

    // 1. Check local catalog or Supabase
    let localMatch = catalogList.find(
      (p) => p.barcode === code || p.id === code || p.sku === code
    );

    // If not found in memory, try live Supabase products table
    if (!localMatch) {
      try {
        const sb = await getSupabase();
        if (sb) {
          const { data } = await sb
            .from('products')
            .select('*')
            .or(`barcode.eq.${code},id.eq.${code}`)
            .limit(1)
            .maybeSingle();

          if (data) localMatch = data;
        }
      } catch {}
    }

    if (localMatch) {
      const ecoScoreEstimate = {
        score: localMatch.carbonKg ? Math.round(100 - localMatch.carbonKg * 10) : (localMatch.isEcoFriendly ? 90 : 45),
        grade: localMatch.isEcoFriendly ? 'A' : 'D',
        isEstimate: false,
        source: 'Eco Sense Verified Catalogue'
      };

      setScanResult({
        found: true,
        source: 'Eco Sense Catalogue',
        code,
        productName: localMatch.name,
        brand: localMatch.brand || 'Eco Sense Artisan',
        category: localMatch.category,
        image: localMatch.image,
        packaging: localMatch.packaging,
        ingredients: localMatch.material,
        catalogProduct: localMatch,
        ecoScore: ecoScoreEstimate,
        swaps: []
      });
      setScanning(false);
      return;
    }

    // 2. Query serverless proxy /api/barcode (Open Food / Beauty / Products Facts)
    try {
      const res = await fetch(`/api/barcode?code=${encodeURIComponent(code)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.found) {
          const ecoScoreEstimate = estimateEcoScoreFromExternal(data);
          const greenerSwaps = findGreenerCatalogSwaps(data, catalogList);

          setScanResult({
            found: true,
            source: data.source || 'Open Food Facts',
            code,
            productName: data.product_name,
            brand: data.brand,
            image: data.image,
            ingredients: data.ingredients_text,
            packaging: data.packaging,
            ecoScore: ecoScoreEstimate,
            swaps: greenerSwaps
          });
          setScanning(false);
          return;
        }
      }
    } catch {
      // Network failure on external registry lookup
    }

    // 3. Honest not-found result
    setScanning(false);
    setScanResult({
      found: false,
      code,
      message: `Barcode "${code}" was not found in our catalog or global public databases.`
    });
  };

  // Handle manual form submission with EAN/UPC checksum validation
  const handleManualSubmit = (e) => {
    e.preventDefault();
    setValidationError('');
    setErrorMsg('');

    const validation = validateBarcode(barcodeInput);
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }

    handleLookupBarcode(barcodeInput);
  };

  // Ask Eco Agent contextual inquiry
  const handleAskAgent = (productData) => {
    const inquiry = `Tell me about the sustainability of "${productData.productName}" (Barcode: ${productData.code}) and suggest greener swaps.`;
    window.dispatchEvent(
      new CustomEvent('ecomart-agent-query', {
        detail: { query: inquiry, contextProduct: productData.catalogProduct || null }
      })
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        stopCameraStream();
        onClose();
      }}
      title="Barcode Scanner"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {/* Navigation Tabs: Camera, Photo Upload, Manual */}
        <div className="flex border-b border-line text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setActiveTab('camera');
              setErrorMsg('');
              setValidationError('');
            }}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'camera'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-secondary hover:text-heading'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera Viewfinder</span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopCameraStream();
              setActiveTab('upload');
              setErrorMsg('');
              setValidationError('');
            }}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'upload'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-secondary hover:text-heading'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopCameraStream();
              setActiveTab('manual');
              setErrorMsg('');
              setValidationError('');
            }}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'manual'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-secondary hover:text-heading'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Type Number</span>
          </button>
        </div>

        {/* TAB 1: Live Camera Viewfinder */}
        {activeTab === 'camera' && (
          <div className="space-y-3">
            <div className="relative h-60 sm:h-64 rounded-2xl bg-surface-sunken flex flex-col items-center justify-center overflow-hidden border border-line text-center shadow-inner">
              {isCameraActive ? (
                <div className="relative w-full h-full bg-black flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Scan-frame Viewfinder Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
                    <div className="relative w-56 h-36 sm:w-64 sm:h-40 border-2 border-primary/80 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                      {/* Viewfinder Corners */}
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-3 border-l-3 border-emerald-400" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-3 border-r-3 border-emerald-400" />
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-3 border-l-3 border-emerald-400" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-3 border-r-3 border-emerald-400" />
                      {/* Animated Laser Scanning Line */}
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#34d399] animate-pulse absolute top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Camera Control Pills: Torch & Close */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    {hasTorch && (
                      <button
                        type="button"
                        onClick={handleToggleTorch}
                        className="p-2 rounded-full bg-surface/85 backdrop-blur-md text-heading hover:bg-surface transition shadow-soft-sm cursor-pointer"
                        title={isTorchOn ? 'Turn off flashlight' : 'Turn on flashlight'}
                        aria-label="Toggle flashlight"
                      >
                        {isTorchOn ? <ZapOff className="w-4 h-4 text-warning" /> : <Zap className="w-4 h-4" />}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={stopCameraStream}
                      className="px-3 py-1.5 rounded-full bg-surface/85 backdrop-blur-md text-xs font-semibold text-heading hover:bg-surface transition shadow-soft-sm cursor-pointer"
                    >
                      Close Camera
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-primary/50 flex items-center justify-center mb-2 bg-surface/40">
                    <Scan className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-xs font-bold text-heading">
                    Optical Cross-Browser Scanner
                  </div>
                  <p className="text-xs text-secondary max-w-xs mt-1">
                    Point your camera at any EAN-13, EAN-8, UPC, Code 128, or QR barcode.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleStartCamera()}
                    className="mt-3 px-4 py-2 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-soft-xs"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Open Camera</span>
                  </button>
                </div>
              )}
            </div>

            {/* Camera Switcher Dropdown (when multiple cameras available) */}
            {availableCameras.length > 1 && (
              <div className="flex items-center justify-between text-xs px-1 text-secondary">
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Camera:</span>
                </span>
                <select
                  value={selectedCameraId}
                  onChange={(e) => handleSwitchCamera(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-line text-heading text-xs"
                >
                  {availableCameras.map((cam, idx) => (
                    <option key={cam.deviceId || idx} value={cam.deviceId}>
                      {cam.label || `Camera ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Upload Photo of Barcode */}
        {activeTab === 'upload' && (
          <div className="p-6 rounded-2xl bg-surface-sunken border border-dashed border-line text-center space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-heading">Upload Barcode Image</div>
              <p className="text-xs text-secondary mt-0.5">
                Take a photo or upload an image file containing a product barcode.
              </p>
            </div>
            <button
              type="button"
              disabled={scanning}
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-semibold transition cursor-pointer inline-flex items-center gap-2 shadow-soft-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{scanning ? 'Reading Image...' : 'Choose Image File'}</span>
            </button>
          </div>
        )}

        {/* TAB 3: Manual Entry with Checksum Validation */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => {
                    setBarcodeInput(e.target.value);
                    setValidationError('');
                  }}
                  placeholder="Enter 8, 12, or 13-digit EAN/UPC..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-line text-xs font-medium text-heading placeholder:text-muted focus:outline-2 focus:outline-focus min-h-[44px]"
                />
              </div>
              <Button type="submit" variant="primary" size="sm" disabled={scanning} className="min-h-[44px] px-5">
                {scanning ? 'Searching...' : 'Look Up'}
              </Button>
            </div>
            {validationError && (
              <div className="text-xs text-danger font-medium flex items-center gap-1.5 px-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}
          </form>
        )}

        {/* Quick Sample Barcodes */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-muted">Try Real Sample Barcodes:</span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_BARCODES.map((s) => (
              <button
                key={s.code}
                type="button"
                onClick={() => {
                  stopCameraStream();
                  setActiveTab('manual');
                  setBarcodeInput(s.code);
                  setValidationError('');
                  handleLookupBarcode(s.code);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-surface-sunken hover:bg-surface-raised border border-line text-heading transition cursor-pointer"
              >
                {s.name} ({s.code.slice(-4)})
              </button>
            ))}
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div>{errorMsg}</div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/scan');
                  }}
                  className="underline font-bold hover:text-heading cursor-pointer"
                >
                  Scan the label photo instead →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {scanning && (
          <div className="py-6 flex flex-col items-center justify-center space-y-2 text-xs text-secondary">
            <RefreshCw className="w-5 h-5 animate-spin text-primary" />
            <span>Looking up barcode across Supabase & global registries...</span>
          </div>
        )}

        {/* NOT FOUND VIEW: Friendly alternative actions */}
        {scanResult && !scanResult.found && !scanning && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-heading">Barcode Not Found</h4>
                <p className="text-xs text-secondary leading-relaxed">
                  {scanResult.message}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-500/20 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/scan');
                }}
                className="px-3 py-1.5 rounded-xl bg-primary text-primary-contrast text-xs font-semibold hover:bg-primary-hover transition flex items-center gap-1.5 cursor-pointer shadow-soft-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Scan the label instead</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('manual');
                  setBarcodeInput('');
                }}
                className="px-3 py-1.5 rounded-xl bg-surface border border-line text-heading text-xs font-medium hover:bg-surface-sunken transition cursor-pointer"
              >
                Try typing another barcode
              </button>
            </div>
          </div>
        )}

        {/* FOUND RESULT VIEW: Comprehensive metadata, EcoScore estimate & swaps */}
        {scanResult && scanResult.found && !scanning && (
          <div className="p-4 rounded-2xl bg-surface-raised border border-line space-y-4 animate-slide-up">
            <div className="flex items-center justify-between text-xs">
              <Badge variant="outline" size="sm">
                Registry: {scanResult.source}
              </Badge>
              <span className="font-mono text-xs text-muted">EAN: {scanResult.code}</span>
            </div>

            {/* Product Header */}
            <div className="flex gap-3">
              {scanResult.image ? (
                <img
                  src={scanResult.image}
                  alt={scanResult.productName}
                  className="w-16 h-16 rounded-xl object-contain bg-surface-sunken border border-line p-1 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-surface-sunken border border-line flex items-center justify-center shrink-0 text-muted">
                  <Package className="w-7 h-7" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h4 className="font-serif font-bold text-sm text-heading leading-tight truncate">
                  {scanResult.productName}
                </h4>
                {scanResult.brand && (
                  <p className="text-xs text-muted mt-0.5">Brand: {scanResult.brand}</p>
                )}
                {scanResult.category && (
                  <p className="text-[11px] text-muted">Category: {scanResult.category}</p>
                )}
              </div>
            </div>

            {/* Packaging & Ingredients details */}
            {(scanResult.packaging || scanResult.ingredients) && (
              <div className="p-2.5 rounded-xl bg-surface-sunken border border-line text-xs space-y-1">
                {scanResult.packaging && (
                  <div>
                    <span className="font-semibold text-heading">Packaging: </span>
                    <span className="text-secondary">{scanResult.packaging}</span>
                  </div>
                )}
                {scanResult.ingredients && (
                  <div className="line-clamp-2">
                    <span className="font-semibold text-heading">Ingredients: </span>
                    <span className="text-secondary">{scanResult.ingredients}</span>
                  </div>
                )}
              </div>
            )}

            {/* EcoScore Estimate Breakdown */}
            {scanResult.ecoScore && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-heading flex items-center gap-1.5">
                    <span>Eco-Score:</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono text-[11px]">
                      {scanResult.ecoScore.score}/100 (Grade {scanResult.ecoScore.grade})
                    </span>
                  </span>
                  <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">
                    {scanResult.ecoScore.isEstimate ? 'Estimate' : 'Registry Verified'}
                  </span>
                </div>
                <div className="text-[11px] text-secondary leading-snug">
                  Data source: {scanResult.ecoScore.source}.
                  {scanResult.ecoScore.isEstimate && ' Calculated using reported packaging types and ingredient lifecycle indicators.'}
                </div>
              </div>
            )}

            {/* Available in Catalog CTA: Add to cart */}
            {scanResult.catalogProduct && (
              <div className="pt-2 border-t border-line flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs text-primary font-bold block">Available in Eco Sense</span>
                  <span className="text-xs font-serif font-bold text-heading">₹{scanResult.catalogProduct.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedProduct(scanResult.catalogProduct);
                      onClose();
                    }}
                  >
                    View
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      addToCart(scanResult.catalogProduct, 1);
                      showToast?.(`Added "${scanResult.catalogProduct.name}" to cart!`, 'success');
                      onClose();
                    }}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                    <span>Add to Cart</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Greener Alternatives from our Catalogue */}
            {scanResult.swaps && scanResult.swaps.length > 0 && !scanResult.catalogProduct && (
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Greener Alternatives from Eco Sense:</span>
                </div>
                <div className="space-y-1.5">
                  {scanResult.swaps.map((swap) => (
                    <div
                      key={swap.id}
                      className="p-2 rounded-lg bg-surface border border-line flex items-center justify-between text-xs gap-2"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-heading block truncate">{swap.name}</span>
                        <span className="text-[11px] font-serif font-semibold text-primary">₹{swap.price}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(swap, 1);
                          showToast?.(`Added "${swap.name}" to cart!`, 'success');
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-primary hover:bg-primary-hover text-primary-contrast font-semibold text-[11px] shrink-0 transition cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions: Ask Eco Agent & Optional Selector */}
            <div className="pt-2 border-t border-line flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleAskAgent(scanResult)}
                className="flex-1 px-3 py-2 rounded-xl bg-surface-sunken hover:bg-surface border border-line text-heading text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-primary" />
                <span>Ask Eco Agent about this</span>
              </button>

              {onSelectBarcode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onSelectBarcode(scanResult);
                    onClose();
                  }}
                >
                  Use in Auditor
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
