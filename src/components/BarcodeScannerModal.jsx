import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Upload,
  Keyboard,
  X,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Barcode
} from 'lucide-react';
import { createBarcodeDetector } from '../lib/barcodeScannerService';
import productsData from '../data/products.json';

export default function BarcodeScannerModal({ isOpen, onClose, onSelectProduct }) {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'upload' | 'manual'
  const [manualCode, setManualCode] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isLoadingOff, setIsLoadingOff] = useState(false);
  const [externalProduct, setExternalProduct] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const activeRef = useRef(false);
  const detectorRef = useRef(null);

  // Stop camera stream cleanly
  const stopCamera = useCallback(() => {
    activeRef.current = false;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  }, []);

  // Handle scanned / submitted code
  const handleBarcodeFound = useCallback(async (rawCode) => {
    const code = (rawCode || '').trim();
    if (!code) return;

    stopCamera();
    setStatusMessage(`Scanned barcode: ${code}. Checking catalog...`);
    setErrorMessage('');
    setExternalProduct(null);

    // 1. Look up in catalog first
    const catalogMatch = productsData.find((p) => p.barcode === code);
    if (catalogMatch) {
      setStatusMessage(`Found catalog product: "${catalogMatch.name}"!`);
      setTimeout(() => {
        if (onSelectProduct) {
          onSelectProduct(catalogMatch);
        }
        onClose();
      }, 400);
      return;
    }

    // 2. Query server-side Open Food Facts proxy
    setIsLoadingOff(true);
    setStatusMessage(`Barcode not in local catalog. Searching Open Food Facts database...`);
    try {
      const res = await fetch(`/api/barcode?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      setIsLoadingOff(false);

      if (data.found) {
        setExternalProduct(data);
        setStatusMessage('');
      } else {
        setErrorMessage(data.message || 'Product not found in Open Food Facts database.');
        setStatusMessage('');
      }
    } catch {
      setIsLoadingOff(false);
      setErrorMessage('Could not connect to product database. Check your internet connection or browse our sample catalog.');
      setStatusMessage('');
    }
  }, [stopCamera, onSelectProduct, onClose]);

  // Start Camera scanning loop
  const startCamera = useCallback(async () => {
    setErrorMessage('');
    setStatusMessage('Starting camera...');
    stopCamera();

    try {
      if (!detectorRef.current) {
        detectorRef.current = createBarcodeDetector();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      activeRef.current = true;
      setIsScanning(true);
      setStatusMessage('Aim camera at an EAN-13 barcode...');

      // Scan loop
      const scanFrame = async () => {
        if (!activeRef.current || !videoRef.current) return;

        try {
          if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            const barcodes = await detectorRef.current.detect(videoRef.current);
            if (barcodes && barcodes.length > 0) {
              const detected = barcodes[0].rawValue;
              if (detected) {
                handleBarcodeFound(detected);
                return;
              }
            }
          }
        } catch {
          // Ignore individual frame decode errors
        }

        if (activeRef.current) {
          setTimeout(scanFrame, 180);
        }
      };

      scanFrame();
    } catch (err) {
      setErrorMessage('Camera access denied or unavailable. You can upload an image or type the number below.');
      stopCamera();
    }
  }, [stopCamera, handleBarcodeFound]);

  // Photo upload handler
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');
    setStatusMessage('Analyzing photo for barcode...');
    setExternalProduct(null);

    try {
      if (!detectorRef.current) {
        detectorRef.current = createBarcodeDetector();
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = async () => {
        try {
          const barcodes = await detectorRef.current.detect(img);
          URL.revokeObjectURL(objectUrl);
          if (barcodes && barcodes.length > 0) {
            const detected = barcodes[0].rawValue;
            handleBarcodeFound(detected);
          } else {
            setErrorMessage('No barcode found in this photo. Make sure the barcode is clear, flat, and well-lit.');
            setStatusMessage('');
          }
        } catch {
          URL.revokeObjectURL(objectUrl);
          setErrorMessage('Could not process this image. Try entering the 13 digits manually.');
          setStatusMessage('');
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        setErrorMessage('Failed to load image file.');
        setStatusMessage('');
      };

      img.src = objectUrl;
    } catch {
      setErrorMessage('Barcode detector error. Please use manual barcode entry.');
      setStatusMessage('');
    }
  };

  // Manual code submission
  const handleManualSubmit = (e) => {
    e?.preventDefault();
    const clean = manualCode.replace(/[^0-9]/g, '');
    if (clean.length < 8 || clean.length > 14) {
      setErrorMessage('Please enter a valid 8 to 14 digit barcode number.');
      return;
    }
    handleBarcodeFound(clean);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, startCamera, stopCamera]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in text-left">
      <div className="bg-surface rounded-3xl border border-line shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-heading">Barcode Scanner</h2>
              <p className="text-xs text-muted">Scan catalog items or packaged foods</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-xl hover:bg-surface-sunken text-muted hover:text-heading transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-2 bg-surface-sunken border-b border-line text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('camera');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'camera' ? 'bg-surface text-primary shadow-2xs' : 'text-muted hover:text-heading'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Camera</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('upload');
              stopCamera();
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'upload' ? 'bg-surface text-primary shadow-2xs' : 'text-muted hover:text-heading'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('manual');
              stopCamera();
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'manual' ? 'bg-surface text-primary shadow-2xs' : 'text-muted hover:text-heading'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>Type Number</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Camera Tab */}
          {activeTab === 'camera' && (
            <div className="space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-line">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {isScanning && (
                  <div className="absolute inset-8 border-2 border-primary/70 rounded-xl pointer-events-none animate-pulse">
                    <div className="absolute top-1/2 inset-x-0 h-0.5 bg-primary/80 shadow-glow" />
                  </div>
                )}
                {!isScanning && !errorMessage && (
                  <div className="flex flex-col items-center gap-2 text-white/70 text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Connecting camera...</span>
                  </div>
                )}
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={startCamera}
                  className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restart Camera</span>
                </button>
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <label className="border-2 border-dashed border-line hover:border-primary/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors bg-surface-sunken">
                <Upload className="w-8 h-8 text-primary" />
                <span className="text-sm font-semibold text-heading">Upload a photo of the barcode</span>
                <span className="text-xs text-muted">Supports JPG, PNG, WebP (under 5MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Manual Input Tab */}
          {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <label className="block text-xs font-semibold text-heading">
                Enter Barcode (EAN-13 / UPC):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="e.g. 8900000000018"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-line bg-surface-sunken font-mono text-sm text-heading focus:outline-none focus:border-primary"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!manualCode.trim()}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-primary-contrast font-bold text-xs transition-colors cursor-pointer"
                >
                  Look Up
                </button>
              </div>
            </form>
          )}

          {/* Status and Error Messages */}
          {statusMessage && (
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* External Product Result Card (Open Food Facts) */}
          {externalProduct && (
            <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-muted uppercase">Open Food Facts Registry</span>
                  <h4 className="font-serif font-bold text-sm text-heading">{externalProduct.name}</h4>
                  <p className="text-xs text-secondary">{externalProduct.brand}</p>
                </div>
                {externalProduct.ecoGrade && (
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                    Eco-Grade {externalProduct.ecoGrade}
                  </span>
                )}
              </div>

              {externalProduct.packaging && (
                <div className="text-xs text-muted">
                  <strong>Packaging:</strong> {externalProduct.packaging}
                </div>
              )}

              <div className="pt-2 border-t border-line text-[11px] text-muted flex items-center justify-between">
                <span>External database match</span>
                <span className="font-mono text-[10px]">#{externalProduct.barcode}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Demo Sheet Link */}
        <div className="p-4 bg-surface-sunken border-t border-line flex items-center justify-between text-xs">
          <Link
            to="/barcodes"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-primary hover:underline font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <span>Need sample barcodes to scan? Open the demo sheet</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
