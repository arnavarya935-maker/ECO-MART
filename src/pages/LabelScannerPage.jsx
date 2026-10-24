import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scan,
  Upload,
  Camera,
  Barcode,
  Search,
  ShieldAlert,
  AlertCircle,
  FileText,
  RotateCcw,
  Info,
  Newspaper
} from 'lucide-react';
import { scanProductLabel, SAMPLE_LABELS } from '../lib/ai/labelScanner.js';
import { downscaleImageToJpeg } from '../lib/imageDownscale.js';
import BarcodeScannerModal from '../components/BarcodeScannerModal.jsx';
import { useCart } from '../context/CartContext';
import productsData from '../data/products.json';

export default function LabelScannerPage() {
  const navigate = useNavigate();
  const { setSelectedProduct } = useCart();

  const [selectedSample, setSelectedSample] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [rawTextEdit, setRawTextEdit] = useState('');
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [shopMatchResult, setShopMatchResult] = useState(null);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Handle local image file upload with client-side downscaling
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    setError(null);
    setSelectedSample(null);
    setShopMatchResult(null);
    setIsProcessing(true);
    setProcessingStatus('Downscaling image & stripping EXIF metadata...');

    try {
      // Client-side downscaling: max 1600px long edge, JPEG 0.82, target < 1.5MB
      const downscaled = await downscaleImageToJpeg(file, {
        maxDimension: 1600,
        quality: 0.82
      });

      setImagePreview(downscaled.base64);
      setProcessingStatus('Transcribing printed text via Gemini Vision...');

      const result = await scanProductLabel({
        imageBase64: downscaled.base64,
        mimeType: downscaled.mimeType
      });

      setScanResult(result);
      initRawTextEdit(result);
    } catch (err) {
      setError(err.message || 'Failed to scan image. Please ensure the label is clearly illuminated.');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  // Handle sample selection (fictional product, transcription only)
  const handleSelectSample = (sample) => {
    setError(null);
    setSelectedSample(sample);
    setImagePreview(null);
    setShopMatchResult(null);
    setIsProcessing(true);
    setProcessingStatus('Loading sample transcription...');

    setTimeout(async () => {
      try {
        const result = await scanProductLabel({ sampleId: sample.id });
        setScanResult(result);
        initRawTextEdit(result);
      } catch (err) {
        setError(err.message || 'Error loading sample.');
      } finally {
        setIsProcessing(false);
        setProcessingStatus('');
      }
    }, 300);
  };

  const initRawTextEdit = (result) => {
    if (!result) return;
    if (result.raw_ocr_text) {
      setRawTextEdit(result.raw_ocr_text);
      return;
    }

    const lines = [];
    if (result.product_name) lines.push(`Product: ${result.product_name}`);
    if (result.brand) lines.push(`Brand: ${result.brand}`);
    if (result.net_quantity) lines.push(`Net Quantity: ${result.net_quantity}`);
    if (result.ingredients?.length) lines.push(`Ingredients: ${result.ingredients.join(', ')}`);
    if (result.claims?.length) lines.push(`Claims: ${result.claims.join(' | ')}`);
    if (result.certifications_printed?.length) {
      lines.push(
        `Certifications: ${result.certifications_printed.map((c) => c.name).join(', ')}`
      );
    }
    if (result.packaging_marks?.length) lines.push(`Packaging: ${result.packaging_marks.join(', ')}`);
    if (result.manufacturer) lines.push(`Manufacturer: ${result.manufacturer}`);
    if (result.batch_mfg_expiry) lines.push(`Batch/Dates: ${result.batch_mfg_expiry}`);
    if (result.barcode_number) lines.push(`Barcode: ${result.barcode_number}`);
    if (result.usage_instructions) lines.push(`Usage: ${result.usage_instructions}`);
    if (result.disposal_instructions) lines.push(`Disposal: ${result.disposal_instructions}`);
    if (result.warnings) lines.push(`Warnings: ${result.warnings}`);

    setRawTextEdit(lines.join('\n\n'));
  };

  // Webcam Stream
  const startCamera = async () => {
    try {
      setCameraActive(true);
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setError('Camera access unavailable. Please use file upload.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    stopCamera();
    setIsProcessing(true);
    setProcessingStatus('Downscaling capture & optimizing...');

    try {
      const downscaled = await downscaleImageToJpeg(dataUrl, {
        maxDimension: 1600,
        quality: 0.82
      });

      setImagePreview(downscaled.base64);
      setProcessingStatus('Transcribing printed text via Gemini Vision...');

      const result = await scanProductLabel({
        imageBase64: downscaled.base64,
        mimeType: downscaled.mimeType
      });

      setScanResult(result);
      initRawTextEdit(result);
    } catch (err) {
      setError(err.message || 'Failed to transcribe photo.');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const resetScanner = () => {
    stopCamera();
    setSelectedSample(null);
    setImagePreview(null);
    setScanResult(null);
    setRawTextEdit('');
    setError(null);
    setShopMatchResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Action Button 1: Check these claims with Greenwashing Detective
  const handleCheckClaims = () => {
    const claimsText = (scanResult?.claims || []).join('. ') || scanResult?.product_name || rawTextEdit;
    // Dispatch event to open Greenwashing Detective modal with prefilled claims
    window.dispatchEvent(
      new CustomEvent('open-greenwashing-detective', {
        detail: { prefillClaim: claimsText }
      })
    );
  };

  // Action Button 2: Find in shop (Catalog matching)
  const handleFindInShop = () => {
    if (!scanResult) return;
    const queryTerm = (scanResult.product_name || scanResult.brand || '').toLowerCase();
    const cleanBrand = (scanResult.brand || '').toLowerCase().replace(/\(fictional\)/g, '').trim();

    const matched = productsData.find((p) => {
      const pName = p.name.toLowerCase();
      const pCategory = (p.category || '').toLowerCase();
      const pMaterial = (p.material || '').toLowerCase();

      return (
        pName.includes(queryTerm) ||
        (cleanBrand && pName.includes(cleanBrand)) ||
        (queryTerm && pCategory.includes(queryTerm)) ||
        (scanResult.ingredients && scanResult.ingredients.some((i) => pMaterial.includes(i.toLowerCase())))
      );
    });

    if (matched) {
      setShopMatchResult({
        matched: true,
        product: matched,
        message: `Found matching sustainable alternative in catalog: "${matched.name}".`
      });
    } else {
      setShopMatchResult({
        matched: false,
        message: `No exact match found in catalog for "${scanResult.brand || scanResult.product_name || 'this item'}". You can browse related categories in the Shop.`
      });
    }
  };

  // Action Button 3: Related News
  const handleRelatedNews = () => {
    const topic = scanResult?.brand || scanResult?.product_name || (scanResult?.claims?.[0] ?? 'greenwashing');
    navigate(`/news?q=${encodeURIComponent(topic)}`);
  };

  // Confidence Dot Component
  const renderConfidenceDot = (level) => {
    const colors = {
      high: 'bg-primary text-primary',
      medium: 'bg-amber-500 text-amber-500',
      low: 'bg-slate-400 text-slate-400'
    };
    const c = colors[level] || colors.medium;
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-sans font-medium text-text-muted" title={`Confidence: ${level || 'medium'}`}>
        <span className={`w-2 h-2 rounded-full ${c}`} />
        <span className="capitalize">{level || 'medium'}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-surface py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-line text-xs font-medium text-heading">
            <Scan className="w-3.5 h-3.5 text-primary" />
            <span>Product Label Transcriber</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-heading">
            Label Scanner
          </h1>
          <p className="text-sm sm:text-base text-secondary max-w-3xl leading-relaxed">
            Transcribes visibly printed text from product packaging. No scoring, no verdicts, no extra fluff.
            Everything displayed is what is printed on the physical label.
          </p>

          <div className="inline-flex items-center gap-2 text-xs text-text-muted bg-surface-sunken px-3 py-1.5 rounded-xl border border-line">
            <Info className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>
              <strong>Privacy guarantee:</strong> Image is not saved. Images are downscaled client-side and processed in volatile RAM only.
            </span>
          </div>
        </div>

        {/* Input Bar: Upload / Camera / Barcode */}
        <div className="p-6 rounded-3xl bg-surface-raised border border-line shadow-soft-sm space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            {/* Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs sm:text-sm shadow-soft-sm transition cursor-pointer active:scale-98 min-h-[44px]"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Label Photo</span>
            </button>

            {/* Webcam Button */}
            {!cameraActive ? (
              <button
                type="button"
                onClick={startCamera}
                disabled={isProcessing}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-surface hover:bg-surface-sunken border border-line text-heading font-medium text-xs sm:text-sm transition cursor-pointer active:scale-98 min-h-[44px]"
              >
                <Camera className="w-4 h-4 text-primary" />
                <span>Take Photo</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-contrast font-medium text-xs sm:text-sm shadow-soft-sm cursor-pointer min-h-[44px]"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture Photo</span>
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-3 rounded-2xl bg-surface-sunken border border-line text-heading font-medium text-xs sm:text-sm cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Barcode Scanner Modal Button */}
            <button
              type="button"
              onClick={() => setBarcodeModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-surface hover:bg-surface-sunken border border-line text-heading font-medium text-xs sm:text-sm transition cursor-pointer active:scale-98 min-h-[44px]"
            >
              <Barcode className="w-4 h-4 text-accent" />
              <span>Scan Barcode</span>
            </button>

            {(scanResult || imagePreview || error) && (
              <button
                type="button"
                onClick={resetScanner}
                className="ml-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-heading transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Camera Viewfinder if Active */}
          {cameraActive && (
            <div className="relative aspect-video max-w-xl mx-auto rounded-2xl overflow-hidden border border-line bg-black">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            </div>
          )}

          {/* Sample Labels Selector */}
          <div className="pt-4 border-t border-line space-y-2.5">
            <div className="flex items-center justify-between text-xs font-medium text-text-muted">
              <span>Or inspect a sample label (transcription only, fictional product):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SAMPLE_LABELS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  disabled={isProcessing}
                  className={`text-left p-3 rounded-2xl border transition text-xs space-y-1 cursor-pointer ${
                    selectedSample?.id === sample.id
                      ? 'border-primary bg-surface-accent shadow-soft-xs'
                      : 'border-line hover:border-primary/40 bg-surface'
                  }`}
                >
                  <div className="font-serif font-bold text-heading">{sample.title}</div>
                  <div className="text-[11px] text-text-muted">{sample.labelType}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="p-8 rounded-3xl bg-surface-raised border border-line shadow-soft-sm text-center space-y-3 animate-pulse">
            <div className="w-10 h-10 mx-auto rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <div className="font-serif font-bold text-lg text-heading">Analyzing Label Image</div>
            <p className="text-xs text-text-muted">{processingStatus || 'Please wait...'}</p>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-5 rounded-2xl bg-danger/10 border border-danger/30 text-danger text-xs font-medium flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold">Scanning Issue</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        {/* Non-Label Rejection Card */}
        {scanResult && scanResult.is_product_label === false && (
          <div className="p-8 rounded-3xl bg-surface-raised border border-amber-500/30 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-xl text-heading">No Product Label Found</h3>
              <p className="text-xs sm:text-sm text-secondary max-w-md mx-auto">
                No product label found. Try a closer, well-lit photo of the label.
              </p>
              {scanResult.reason_if_not && (
                <p className="text-xs text-text-muted italic">Note: {scanResult.reason_if_not}</p>
              )}
            </div>
            <button
              type="button"
              onClick={resetScanner}
              className="px-5 py-2.5 rounded-xl bg-surface-sunken hover:bg-surface border border-line text-xs font-semibold text-heading transition cursor-pointer"
            >
              Try Another Image
            </button>
          </div>
        )}

        {/* Successful Label Transcription View */}
        {scanResult && scanResult.is_product_label !== false && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Uploaded Image View & Raw Text Box */}
            <div className="lg:col-span-5 space-y-5">
              {/* Image Preview Box */}
              <div className="p-4 rounded-3xl bg-surface-raised border border-line shadow-soft-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-medium text-heading">
                  <span>Image Scanned</span>
                  <span className="text-[11px] text-text-muted">Image is not saved</span>
                </div>

                <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-sunken border border-line flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Uploaded packaging label" className="w-full h-full object-contain" />
                  ) : (
                    <div className="p-6 text-center space-y-2">
                      <FileText className="w-10 h-10 text-primary mx-auto opacity-70" />
                      <div className="font-serif font-bold text-sm text-heading">{selectedSample?.title}</div>
                      <div className="text-xs text-text-muted">Sample label (fictional product)</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Editable Raw Transcribed Text Box */}
              <div className="p-4 rounded-3xl bg-surface-raised border border-line shadow-soft-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="raw-transcribed-text" className="text-xs font-bold text-heading">
                    {scanResult.source === 'on_device_ocr' ? 'OCR text, may contain errors' : 'Raw Text (Editable)'}
                  </label>
                  <span className="text-[11px] text-text-muted">You can edit mistakes</span>
                </div>
                <textarea
                  id="raw-transcribed-text"
                  value={rawTextEdit}
                  onChange={(e) => setRawTextEdit(e.target.value)}
                  rows={8}
                  className="w-full p-3 rounded-2xl bg-surface border border-line text-xs font-mono text-heading focus:outline-2 focus:outline-focus leading-relaxed"
                />
              </div>
            </div>

            {/* Right Column: "What the label says" Structured Card */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-surface-raised border border-line shadow-soft-sm space-y-6">
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-heading">What the label says</h2>
                    <p className="text-xs text-text-muted">Verbatim transcription of visible text.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-sans px-2.5 py-1 rounded-full bg-surface-sunken border border-line text-text-muted font-medium">
                      Legibility: <strong className="capitalize text-heading">{scanResult.legibility || 'good'}</strong>
                    </span>
                  </div>
                </div>

                {/* 1. Product Overview Group */}
                {(scanResult.product_name || scanResult.brand || scanResult.net_quantity || scanResult.barcode_number || scanResult.country_of_origin) && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Product Identity</span>
                      {renderConfidenceDot(scanResult.confidence?.product_name)}
                    </div>
                    <div className="p-4 rounded-2xl bg-surface border border-line space-y-2">
                      {scanResult.product_name && (
                        <div className="text-base font-serif font-bold text-heading">
                          {scanResult.product_name}
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {scanResult.brand && (
                          <div>
                            <span className="text-text-muted">Brand: </span>
                            <span className="font-medium text-heading">{scanResult.brand}</span>
                          </div>
                        )}
                        {scanResult.net_quantity && (
                          <div>
                            <span className="text-text-muted">Net Quantity: </span>
                            <span className="font-medium text-heading">{scanResult.net_quantity}</span>
                          </div>
                        )}
                        {scanResult.country_of_origin && (
                          <div>
                            <span className="text-text-muted">Origin: </span>
                            <span className="font-medium text-heading">{scanResult.country_of_origin}</span>
                          </div>
                        )}
                        {scanResult.barcode_number && (
                          <div>
                            <span className="text-text-muted">Barcode: </span>
                            <span className="font-mono text-heading">{scanResult.barcode_number}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Ingredients Group */}
                {scanResult.ingredients && scanResult.ingredients.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                        Ingredients (as printed)
                      </span>
                      {renderConfidenceDot(scanResult.confidence?.ingredients)}
                    </div>
                    <div className="p-4 rounded-2xl bg-surface border border-line">
                      <div className="flex flex-wrap gap-1.5">
                        {scanResult.ingredients.map((ing, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-xl bg-surface-sunken border border-line text-xs font-medium text-heading"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Claims Group */}
                {scanResult.claims && scanResult.claims.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                        Claims (verbatim phrases)
                      </span>
                      {renderConfidenceDot(scanResult.confidence?.claims)}
                    </div>
                    <div className="p-4 rounded-2xl bg-surface border border-line space-y-2">
                      {scanResult.claims.map((claim, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-heading">
                          <span className="text-primary font-bold">•</span>
                          <span className="italic">"{claim}"</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Certifications Printed Group */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Certifications Printed
                    </span>
                    {renderConfidenceDot(scanResult.confidence?.certifications)}
                  </div>
                  <div className="p-4 rounded-2xl bg-surface border border-line space-y-3">
                    {scanResult.certifications_printed && scanResult.certifications_printed.length > 0 ? (
                      <div className="space-y-2">
                        {scanResult.certifications_printed.map((cert, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-heading">{cert.name}</span>
                            <span className="text-[11px] text-text-muted">
                              {cert.has_license_number ? 'Has license number on label' : 'No license code visible'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-text-muted italic">
                        No third-party certification logos or names visible on this label.
                      </div>
                    )}
                    <div className="pt-2 border-t border-line text-[11px] text-text-muted flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Printed on label. Check the issuer's registry.</span>
                    </div>
                  </div>
                </div>

                {/* 5. Packaging Marks Group */}
                {scanResult.packaging_marks && scanResult.packaging_marks.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Packaging Marks & Recycling Symbols
                    </span>
                    <div className="p-4 rounded-2xl bg-surface border border-line">
                      <div className="flex flex-wrap gap-2">
                        {scanResult.packaging_marks.map((pm, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-xl bg-surface-sunken border border-line text-xs font-medium text-heading"
                          >
                            {pm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Manufacturer and Dates Group */}
                {(scanResult.manufacturer || scanResult.batch_mfg_expiry) && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Manufacturer & Batch Dates
                    </span>
                    <div className="p-4 rounded-2xl bg-surface border border-line space-y-2 text-xs">
                      {scanResult.manufacturer && (
                        <div>
                          <span className="text-text-muted">Manufacturer: </span>
                          <span className="font-medium text-heading">{scanResult.manufacturer}</span>
                        </div>
                      )}
                      {scanResult.batch_mfg_expiry && (
                        <div>
                          <span className="text-text-muted">Batch / Dates: </span>
                          <span className="font-mono text-heading">{scanResult.batch_mfg_expiry}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 7. Instructions & Warnings */}
                {(scanResult.usage_instructions || scanResult.disposal_instructions || scanResult.warnings) && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Instructions & Warnings
                    </span>
                    <div className="p-4 rounded-2xl bg-surface border border-line space-y-2 text-xs">
                      {scanResult.usage_instructions && (
                        <div>
                          <strong className="text-heading">Usage: </strong>
                          <span className="text-secondary">{scanResult.usage_instructions}</span>
                        </div>
                      )}
                      {scanResult.disposal_instructions && (
                        <div>
                          <strong className="text-heading">Disposal: </strong>
                          <span className="text-secondary">{scanResult.disposal_instructions}</span>
                        </div>
                      )}
                      {scanResult.warnings && (
                        <div className="text-danger">
                          <strong>Warnings: </strong>
                          <span>{scanResult.warnings}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Three Action Buttons */}
                <div className="pt-4 border-t border-line flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleCheckClaims}
                    className="flex-1 min-h-[44px] px-4 py-2.5 rounded-2xl bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-soft-sm transition cursor-pointer active:scale-98"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Check these claims</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFindInShop}
                    className="flex-1 min-h-[44px] px-4 py-2.5 rounded-2xl bg-surface hover:bg-surface-sunken border border-line text-heading font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
                  >
                    <Search className="w-4 h-4 text-primary" />
                    <span>Find in shop</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRelatedNews}
                    className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-surface hover:bg-surface-sunken border border-line text-heading font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
                  >
                    <Newspaper className="w-4 h-4 text-accent" />
                    <span>Related news</span>
                  </button>
                </div>

                {/* Inline Catalog Match Result Box */}
                {shopMatchResult && (
                  <div
                    className={`p-4 rounded-2xl border text-xs animate-slide-up space-y-2 ${
                      shopMatchResult.matched
                        ? 'bg-primary/10 border-primary/30 text-heading'
                        : 'bg-surface-sunken border-line text-secondary'
                    }`}
                  >
                    <div className="font-semibold">{shopMatchResult.message}</div>
                    {shopMatchResult.product && (
                      <div className="flex items-center justify-between pt-2 border-t border-primary/20">
                        <div>
                          <div className="font-serif font-bold text-sm text-heading">{shopMatchResult.product.name}</div>
                          <div className="text-[11px] text-text-muted">₹{shopMatchResult.product.price} • Grade {shopMatchResult.product.grade}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedProduct(shopMatchResult.product)}
                          className="px-3 py-1.5 rounded-xl bg-primary text-primary-contrast text-xs font-semibold cursor-pointer"
                        >
                          View Product
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Barcode Scanner Modal */}
        <BarcodeScannerModal
          isOpen={barcodeModalOpen}
          onClose={() => setBarcodeModalOpen(false)}
        />
      </div>
    </div>
  );
}
