import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scan,
  Upload,
  Camera,
  Search,
  AlertCircle,
  RotateCcw,
  Info,
  CheckCircle2,
  Bot,
  Copy,
  Check,
  LayoutDashboard,
  HeartPulse,
  Leaf,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  FileText
} from 'lucide-react';
import { scanProductLabel, SAMPLE_LABELS } from '../lib/ai/labelScanner.js';
import { downscaleImageToJpeg } from '../lib/imageDownscale.js';
import { auditLabelClaims } from '../lib/claimChecker.js';
import {
  evaluateNutritionTable,
  evaluateIngredients,
  buildOverviewSummary
} from '../lib/labelHealthRules.js';
import { useCart } from '../context/CartContext';
import productsData from '../data/products.json';

const RECYCLING_KNOWLEDGE = [
  { key: 'pet', code: 'PET 1', name: 'Polyethylene Terephthalate', recyclable: 'Widely Recyclable', tip: 'Widely collected in household recycling. Rinse and replace the cap.' },
  { key: 'hdpe', code: 'HDPE 2', name: 'High-Density Polyethylene', recyclable: 'Widely Recyclable', tip: 'Common for milk, shampoo, and detergent bottles. High recycling value.' },
  { key: 'pvc', code: 'PVC 3', name: 'Polyvinyl Chloride', recyclable: 'Rarely Recyclable Curbside', tip: 'Do not put in household bins; contaminates recycling streams.' },
  { key: 'ldpe', code: 'LDPE 4', name: 'Low-Density Polyethylene', recyclable: 'Recycle at Store Drop-offs', tip: 'Squeezable bottles and plastic wraps. Drop off at supermarket collection points.' },
  { key: 'pp', code: 'PP 5', name: 'Polypropylene', recyclable: 'Widely Recyclable', tip: 'Tubs, caps, and food containers. Check local municipal curbside pickup.' },
  { key: 'ps', code: 'PS 6', name: 'Polystyrene', recyclable: 'Not Recyclable Curbside', tip: 'Foam packaging and cups. Dispose of in general household waste.' },
  { key: 'other', code: 'OTHER 7', name: 'Mixed Plastics', recyclable: 'Specialized Facilities Only', tip: 'Multi-layer packaging. Difficult to recycle without specialist facilities.' },
  { key: 'pap 20', code: 'PAP 20', name: 'Corrugated Cardboard', recyclable: '100% Recyclable', tip: 'Flatten and place in curbside paper/cardboard bin. Keep clean and dry.' },
  { key: 'pap 21', code: 'PAP 21', name: 'Non-Corrugated Paperboard', recyclable: '100% Recyclable', tip: 'Cereal boxes and outer cartons. Widely accepted in curbside recycling.' },
  { key: 'mobius', code: 'Mobius Loop', name: 'Universal Recycling Symbol', recyclable: 'Recyclable Standard', tip: 'Indicates the packaging is capable of being recycled or contains recycled material.' }
];

export default function LabelScannerPage() {
  const navigate = useNavigate();
  const { setSelectedProduct } = useCart();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSample, setSelectedSample] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [shopMatchResult, setShopMatchResult] = useState(null);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Health and Nutrition Rule-Based In-Code Evaluations
  const nutritionEval = useMemo(() => {
    return evaluateNutritionTable(scanResult?.nutrition_table);
  }, [scanResult]);

  const ingredientEval = useMemo(() => {
    return evaluateIngredients(scanResult?.ingredients, scanResult?.product_type);
  }, [scanResult]);

  // Claim Checker Engine
  const claimAudit = useMemo(() => {
    if (!scanResult?.claims || scanResult.claims.length === 0) return null;
    const certs = scanResult.certifications_visible || scanResult.certifications_printed || [];
    return auditLabelClaims(scanResult.claims, certs);
  }, [scanResult]);

  // Overview Summary (Good vs Watch Out Highlights)
  const overviewSummary = useMemo(() => {
    if (!scanResult) return null;
    return buildOverviewSummary({
      productType: scanResult.product_type || 'other',
      productName: scanResult.name || scanResult.product_name || 'Product',
      nutritionEval,
      ingredientEval,
      claimAudit
    });
  }, [scanResult, nutritionEval, ingredientEval, claimAudit]);

  // Greener Catalogue Swaps based on product type
  const catalogueSwaps = useMemo(() => {
    if (!scanResult) return [];
    const type = (scanResult.product_type || '').toLowerCase();
    const prodName = (scanResult.name || scanResult.product_name || '').toLowerCase();

    let targetCategory = '';
    if (type === 'personal_care') targetCategory = 'Personal Care';
    else if (type === 'cleaning') targetCategory = 'Cleaning';
    else if (type === 'food' || type === 'beverage') targetCategory = 'Food & Kitchen';

    return productsData
      .filter((p) => {
        const matchesCategory = targetCategory ? p.category === targetCategory : true;
        const isBetter = ['A', 'B'].includes(p.grade);
        const notSame = p.name.toLowerCase() !== prodName;
        return matchesCategory && isBetter && notSame;
      })
      .slice(0, 3);
  }, [scanResult]);

  // Validate image resolution (minimum 400px on shortest side)
  const validateDimensions = (dataUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const shortest = Math.min(img.naturalWidth, img.naturalHeight);
        if (shortest < 400) {
          resolve({
            valid: false,
            width: img.naturalWidth,
            height: img.naturalHeight,
            message: `The photo is too low-resolution (${img.naturalWidth}×${img.naturalHeight}px). The shortest side must be at least 400px so small label text and %DV can be read accurately.`
          });
        } else {
          resolve({ valid: true, width: img.naturalWidth, height: img.naturalHeight });
        }
      };
      img.onerror = () => resolve({ valid: true, width: 0, height: 0 });
      img.src = dataUrl;
    });
  };

  // Handle local image file upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or WebP).');
      setErrorDetails(null);
      return;
    }

    setError(null);
    setErrorDetails(null);
    setSelectedSample(null);
    setShopMatchResult(null);
    setIsProcessing(true);
    setProcessingStatus('Verifying image dimensions...');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const originalDataUrl = event.target?.result;
      setImagePreview(originalDataUrl);

      // Verify shortest side >= 400px
      const dimCheck = await validateDimensions(originalDataUrl);
      if (!dimCheck.valid) {
        setIsProcessing(false);
        setError(dimCheck.message);
        setErrorDetails(`Detected dimensions: ${dimCheck.width}px × ${dimCheck.height}px. Requirement: shortest side ≥ 400px.`);
        return;
      }

      setProcessingStatus('Optimizing image for vision model...');
      try {
        const downscaled = await downscaleImageToJpeg(file, {
          maxDimension: 1280,
          quality: 0.82
        });

        setProcessingStatus('Transcribing printed facts & nutrition via Gemini Vision...');
        const result = await scanProductLabel({
          imageBase64: downscaled.base64,
          mimeType: downscaled.mimeType
        });

        setScanResult(result);
        setActiveTab('overview');
      } catch (err) {
        setError(err.message || 'Failed to scan image. Please ensure the label is clearly illuminated.');
        setErrorDetails(err.stack || String(err));
      } finally {
        setIsProcessing(false);
        setProcessingStatus('');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle sample selection
  const handleSelectSample = (sample) => {
    setError(null);
    setErrorDetails(null);
    setSelectedSample(sample);
    setImagePreview(null);
    setShopMatchResult(null);
    setIsProcessing(true);
    setProcessingStatus(`Loading ${sample.title}...`);

    setTimeout(async () => {
      try {
        const result = await scanProductLabel({ sampleId: sample.id });
        setScanResult(result);
        setActiveTab('overview');
      } catch (err) {
        setError(err.message || 'Error loading sample.');
        setErrorDetails(err.stack || String(err));
      } finally {
        setIsProcessing(false);
        setProcessingStatus('');
      }
    }, 250);
  };

  // Webcam Stream
  const startCamera = async () => {
    try {
      setCameraActive(true);
      setError(null);
      setErrorDetails(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Camera access unavailable. Please use file upload.');
      setErrorDetails(err.message || String(err));
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
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    stopCamera();
    setImagePreview(dataUrl);

    // Verify shortest side >= 400px
    const dimCheck = await validateDimensions(dataUrl);
    if (!dimCheck.valid) {
      setError(dimCheck.message);
      setErrorDetails(`Captured resolution: ${dimCheck.width}px × ${dimCheck.height}px.`);
      return;
    }

    setIsProcessing(true);
    setProcessingStatus('Optimizing capture & reading printed text...');

    try {
      const downscaled = await downscaleImageToJpeg(dataUrl, {
        maxDimension: 1280,
        quality: 0.82
      });

      const result = await scanProductLabel({
        imageBase64: downscaled.base64,
        mimeType: downscaled.mimeType
      });

      setScanResult(result);
      setActiveTab('overview');
    } catch (err) {
      setError(err.message || 'Failed to read photo.');
      setErrorDetails(err.stack || String(err));
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
    setError(null);
    setErrorDetails(null);
    setShopMatchResult(null);
    setActiveTab('overview');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Ask Eco Agent CTA
  const handleAskEcoAgent = () => {
    const name = scanResult?.name || scanResult?.product_name || 'this scanned product';
    const type = scanResult?.product_type || 'product';
    let details = `I scanned a ${type} label for "${name}".`;
    if (nutritionEval.hasNutrition) {
      details += ` It has nutrition facts table.`;
    }
    if (ingredientEval.hasIngredients) {
      details += ` Ingredients: ${(scanResult?.ingredients || []).slice(0, 8).join(', ')}.`;
    }
    const query = `Can you explain the health and environmental effects of this scanned ${type} (${name})? ${details}`;

    window.dispatchEvent(
      new CustomEvent('ecomart-open-chat', {
        detail: { initialQuery: query, scanContext: scanResult }
      })
    );
    window.dispatchEvent(
      new CustomEvent('ecomart-agent-query', {
        detail: { query, context: { scannedProduct: scanResult } }
      })
    );
  };

  // Copy verbatim text
  const handleCopyVerbatimText = () => {
    const text = scanResult?.raw_transcription || '';
    if (navigator.clipboard && text) {
      navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  // Find in shop catalog match
  const handleFindInShop = () => {
    if (!scanResult) return;
    const queryTerm = (scanResult.name || scanResult.product_name || scanResult.brand || '').toLowerCase();
    const matched = productsData.find((p) => {
      const pName = p.name.toLowerCase();
      const pCategory = (p.category || '').toLowerCase();
      return pName.includes(queryTerm) || (queryTerm && pCategory.includes(queryTerm));
    });

    if (matched) {
      setShopMatchResult({
        matched: true,
        product: matched,
        message: `Found matching sustainable alternative in catalogue: "${matched.name}".`
      });
    } else {
      setShopMatchResult({
        matched: false,
        message: `No exact product match found in catalogue for "${scanResult.brand || scanResult.name || 'this item'}". See recommended eco swaps in the Environment tab.`
      });
    }
  };

  return (
    <div className="min-h-screen bg-surface py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-line text-xs font-medium text-heading">
            <Scan className="w-3.5 h-3.5 text-primary" />
            <span>Product Label Health & Environmental Explainer</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-heading">
            Label Scanner
          </h1>
          <p className="text-sm sm:text-base text-secondary max-w-3xl leading-relaxed">
            Reads the packaging label of any packaged food, drink, personal care, or cleaning item. Explains the positive and harmful effects on your health and the environment in clear, simple language.
          </p>

          <div className="inline-flex items-center gap-2 text-xs text-text-muted bg-surface-sunken px-3 py-1.5 rounded-xl border border-line">
            <Info className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>
              <strong>Privacy guarantee:</strong> Photos are processed in transient memory only and never saved to disk.
            </span>
          </div>
        </div>

        {/* Input Bar: Upload / Camera */}
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
              <span>Or inspect a benchmark sample label:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
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
                  <div className="font-serif font-bold text-heading truncate">{sample.title}</div>
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
            <div className="font-serif font-bold text-lg text-heading">Analyzing Product Label</div>
            <p className="text-xs text-text-muted">{processingStatus || 'Please wait...'}</p>
          </div>
        )}

        {/* Error Notification with Image Preview & Collapsible Technical Details */}
        {error && (
          <div className="p-6 rounded-3xl bg-surface-raised border border-danger/30 space-y-4">
            <div className="flex items-start gap-3 text-danger">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-serif font-bold text-base text-heading">Image Quality or Processing Notice</div>
                <div className="text-xs sm:text-sm text-secondary">{error}</div>
              </div>
            </div>

            {/* Photo preview for rejected low-res images */}
            {imagePreview && (
              <div className="p-3 rounded-2xl bg-surface border border-line max-w-xs space-y-1.5">
                <div className="text-[11px] font-medium text-text-muted">Uploaded Image Preview:</div>
                <div className="aspect-video rounded-xl overflow-hidden bg-surface-sunken flex items-center justify-center">
                  <img src={imagePreview} alt="Uploaded rejected preview" className="w-full h-full object-contain" />
                </div>
              </div>
            )}

            {/* Collapsible Technical Details */}
            {errorDetails && (
              <div className="pt-2 border-t border-line/60">
                <button
                  type="button"
                  onClick={() => setShowTechDetails((prev) => !prev)}
                  className="flex items-center gap-1.5 text-xs text-text-muted hover:text-heading font-medium cursor-pointer"
                >
                  {showTechDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  <span>{showTechDetails ? 'Hide Technical Details' : 'Show Technical Details'}</span>
                </button>
                {showTechDetails && (
                  <pre className="mt-2 p-3 rounded-xl bg-surface-sunken border border-line text-[11px] font-mono text-secondary overflow-x-auto">
                    {errorDetails}
                  </pre>
                )}
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={resetScanner}
                className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-sunken border border-line text-xs font-semibold text-heading cursor-pointer"
              >
                Choose Another Photo
              </button>
            </div>
          </div>
        )}

        {/* Unreadable Label Card with Retake Advice */}
        {scanResult && scanResult.readable === false && scanResult.is_product_label !== false && (
          <div className="p-8 rounded-3xl bg-surface-raised border border-amber-500/30 text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-xl text-heading">Label Text Is Unreadable</h3>
              <p className="text-xs sm:text-sm text-secondary max-w-lg mx-auto leading-relaxed">
                {scanResult.unreadable_reason || 'The text on this packaging label is blurry or unreadable.'}
              </p>
            </div>

            {/* Retake Advice Tips */}
            <div className="max-w-md mx-auto text-left p-4 rounded-2xl bg-surface border border-line text-xs space-y-2">
              <div className="font-bold text-heading flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Tips for a clearer photo:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-secondary">
                <li>Use good natural lighting and avoid harsh flash glare.</li>
                <li>Hold your phone steady until the camera focuses on the small print.</li>
                <li>Frame the nutrition panel or ingredient list closely.</li>
                <li>Wipe your camera lens with a clean cloth.</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={resetScanner}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-contrast text-xs font-semibold hover:bg-primary-hover transition cursor-pointer"
            >
              Retake / Choose Another Photo
            </button>
          </div>
        )}

        {/* Non-Label Photo Card */}
        {scanResult && scanResult.is_product_label === false && (
          <div className="p-8 rounded-3xl bg-surface-raised border border-amber-500/30 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-xl text-heading">No Product Label Detected</h3>
              <p className="text-xs sm:text-sm text-secondary max-w-md mx-auto">
                {scanResult.reason_if_not || 'No product packaging or label detected in this photo. Please photograph a physical product label.'}
              </p>
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

        {/* Successful Readable Label View with 4 Clear Tabs */}
        {scanResult && scanResult.readable !== false && scanResult.is_product_label !== false && (
          <div className="space-y-6">
            {/* Top Bar: Product Identity Badge, Confidence Indicator & Ask Eco Agent CTA */}
            <div className="p-6 rounded-3xl bg-surface-raised border border-line shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-primary/15 text-primary border border-primary/20">
                    {scanResult.product_type ? scanResult.product_type.replace('_', ' ') : 'Product'}
                  </span>
                  {scanResult.brand && (
                    <span className="text-xs text-text-muted font-medium">by {scanResult.brand}</span>
                  )}
                  {/* Confidence Indicator */}
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-text-muted bg-surface-sunken px-2.5 py-0.5 rounded-full border border-line ml-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        scanResult.confidence?.nutrition === 'high' || scanResult.legibility === 'good'
                          ? 'bg-emerald-500'
                          : scanResult.legibility === 'partial'
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                      }`}
                    />
                    <span>Confidence: <strong>{scanResult.legibility || 'high'}</strong></span>
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-heading">
                  {scanResult.name || scanResult.product_name || 'Scanned Product'}
                </h2>
                {scanResult.serving_size && (
                  <div className="text-xs text-text-muted">
                    Serving size: <span className="font-semibold text-heading">{scanResult.serving_size}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleAskEcoAgent}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-primary text-primary-contrast text-xs font-semibold hover:bg-primary-hover shadow-soft-sm transition cursor-pointer active:scale-95"
                >
                  <Bot className="w-4 h-4" />
                  <span>Ask Eco Agent about this</span>
                </button>
                <button
                  type="button"
                  onClick={handleFindInShop}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-surface hover:bg-surface-sunken border border-line text-heading text-xs font-semibold transition cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-primary" />
                  <span>Find in Shop</span>
                </button>
              </div>
            </div>

            {/* Shop Match Toast if Clicked */}
            {shopMatchResult && (
              <div
                className={`p-4 rounded-2xl border text-xs animate-slide-up flex items-center justify-between gap-3 ${
                  shopMatchResult.matched
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-heading'
                    : 'bg-surface-sunken border-line text-secondary'
                }`}
              >
                <span>{shopMatchResult.message}</span>
                {shopMatchResult.product && (
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(shopMatchResult.product)}
                    className="px-3 py-1.5 rounded-xl bg-primary text-primary-contrast text-xs font-semibold cursor-pointer shrink-0"
                  >
                    View Product (₹{shopMatchResult.product.price})
                  </button>
                )}
              </div>
            )}

            {/* 4 Clear Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-line pb-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-surface-raised border border-line text-primary shadow-soft-xs'
                    : 'text-text-muted hover:text-heading hover:bg-surface-raised/50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('health')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'health'
                    ? 'bg-surface-raised border border-line text-primary shadow-soft-xs'
                    : 'text-text-muted hover:text-heading hover:bg-surface-raised/50'
                }`}
              >
                <HeartPulse className="w-4 h-4" />
                <span>Health & Nutrition</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('environment')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'environment'
                    ? 'bg-surface-raised border border-line text-primary shadow-soft-xs'
                    : 'text-text-muted hover:text-heading hover:bg-surface-raised/50'
                }`}
              >
                <Leaf className="w-4 h-4" />
                <span>Environment & Packaging</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('fulltext')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'fulltext'
                    ? 'bg-surface-raised border border-line text-primary shadow-soft-xs'
                    : 'text-text-muted hover:text-heading hover:bg-surface-raised/50'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Full Text (Transcription)</span>
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Short Plain-Language Summary */}
                <div className="p-6 rounded-3xl bg-surface-raised border border-line shadow-soft-sm space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-text-muted">Plain-Language Summary</div>
                  <p className="text-sm sm:text-base text-heading leading-relaxed">
                    {overviewSummary?.shortSummary || 'Product label scanned and transcribed from packaging.'}
                  </p>
                </div>

                {/* Side-by-Side: "Good" (green) and "Watch out" (amber) cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Good Card (Green) */}
                  <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/30 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 className="w-5 h-5" />
                      <h3 className="font-serif font-bold text-lg text-heading">Good Highlights</h3>
                    </div>

                    {overviewSummary?.goodList && overviewSummary.goodList.length > 0 ? (
                      <div className="space-y-3">
                        {overviewSummary.goodList.map((item, i) => (
                          <div key={i} className="p-3.5 rounded-2xl bg-surface border border-emerald-500/20 space-y-1">
                            <div className="text-xs font-bold text-heading">{item.title}</div>
                            <div className="text-xs text-secondary leading-relaxed">{item.why}</div>
                            {item.traceableTo && (
                              <div className="text-[11px] text-text-muted italic pt-1 border-t border-line/60">
                                Traceable to: {item.traceableTo}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-text-muted italic p-3">
                        No specific nutritional or environmental benefits detected from the visible text.
                      </div>
                    )}
                  </div>

                  {/* Watch Out Card (Amber) - Never Scary Red */}
                  <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/30 space-y-4">
                    <div className="flex items-center gap-2 text-amber-700">
                      <AlertTriangle className="w-5 h-5" />
                      <h3 className="font-serif font-bold text-lg text-heading">Points to Watch</h3>
                    </div>

                    {overviewSummary?.watchOutList && overviewSummary.watchOutList.length > 0 ? (
                      <div className="space-y-3">
                        {overviewSummary.watchOutList.map((item, i) => (
                          <div key={i} className="p-3.5 rounded-2xl bg-surface border border-amber-500/20 space-y-1">
                            <div className="text-xs font-bold text-heading">{item.title}</div>
                            <div className="text-xs text-secondary leading-relaxed">{item.why}</div>
                            {item.traceableTo && (
                              <div className="text-[11px] text-text-muted italic pt-1 border-t border-line/60">
                                Traceable to: {item.traceableTo}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-text-muted italic p-3">
                        No notable ingredients of concern or high sodium/sugars detected.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: HEALTH (Packaged food, drinks, personal care) */}
            {activeTab === 'health' && (
              <div className="space-y-6">
                {/* 1. NUTRITION TABLE (Computed in Code) */}
                {nutritionEval.hasNutrition ? (
                  <div className="p-6 sm:p-8 rounded-3xl bg-surface-raised border border-line shadow-soft-sm space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-4">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-heading">Nutrition Facts Panel</h3>
                        <p className="text-xs text-text-muted">
                          Evaluated strictly in code: ≤5% DV is low, 10–19% is moderate/good, ≥20% is high.
                        </p>
                      </div>
                      <div className="text-xs text-text-muted bg-surface-sunken px-3 py-1 rounded-xl border border-line self-start">
                        Rule: 5/20 Daily Value Standard
                      </div>
                    </div>

                    <div className="space-y-3">
                      {nutritionEval.evaluatedNutrients.map((item, idx) => {
                        const dv = item.dv_percent;
                        const percentageWidth = dv !== null ? Math.min(dv, 100) : 0;
                        return (
                          <div key={idx} className="p-3.5 rounded-2xl bg-surface border border-line space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-heading">{item.nutrient}</span>
                              <div className="flex items-center gap-2">
                                {item.amount && <span className="text-text-muted font-medium">{item.amount}</span>}
                                {dv !== null ? (
                                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${item.badgeColor}`}>
                                    {dv}% DV
                                  </span>
                                ) : (
                                  <span className="text-text-muted text-[11px]">No %DV</span>
                                )}
                              </div>
                            </div>

                            {/* Horizontal Progress Bar for %DV */}
                            {dv !== null && (
                              <div className="space-y-1">
                                <div className="w-full h-2 rounded-full bg-surface-sunken overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      item.status === 'high'
                                        ? 'bg-amber-500'
                                        : item.status === 'excellent' || item.status === 'good'
                                        ? 'bg-emerald-500'
                                        : 'bg-primary/70'
                                    }`}
                                    style={{ width: `${percentageWidth}%` }}
                                  />
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-text-muted">
                                  <span>{item.ruleUsed}</span>
                                  {item.explanation && <span className="text-secondary">{item.explanation}</span>}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-3xl bg-surface-raised border border-line text-xs text-text-muted italic">
                    No nutrition facts panel printed on this label (typical for non-food items or front-of-pack labels).
                  </div>
                )}

                {/* 2. NOTABLE INGREDIENTS KNOWLEDGE BASE EVALUATION */}
                <div className="p-6 sm:p-8 rounded-3xl bg-surface-raised border border-line shadow-soft-sm space-y-5">
                  <div className="border-b border-line pb-4">
                    <h3 className="font-serif text-xl font-bold text-heading">Ingredient Effects Analysis</h3>
                    <p className="text-xs text-text-muted">
                      Checked against our objective database of compounds (added sugars, palm oil, sulfates, parabens, etc.).
                    </p>
                  </div>

                  {ingredientEval.hasIngredients ? (
                    <div className="space-y-4">
                      {ingredientEval.notableIngredients.length > 0 ? (
                        ingredientEval.notableIngredients.map((ing, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-surface border border-line space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="font-serif font-bold text-sm text-heading">{ing.name}</div>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-sunken border border-line text-text-muted">
                                Evidence: {ing.evidenceLevel}
                              </span>
                            </div>

                            <p className="text-xs text-secondary leading-relaxed">
                              <strong>What it is: </strong>{ing.whatItIs}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              {ing.possibleGoodEffect && (
                                <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-800">
                                  <strong>Why it is used: </strong>{ing.possibleGoodEffect}
                                </div>
                              )}
                              {ing.possibleConcern && (
                                <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-800">
                                  <strong>Possible consideration: </strong>{ing.possibleConcern}
                                </div>
                              )}
                            </div>

                            {ing.whoShouldBeCareful && (
                              <div className="text-[11px] text-text-muted">
                                <strong>Who should be careful: </strong>{ing.whoShouldBeCareful}
                              </div>
                            )}

                            <div className="text-[11px] text-text-muted italic pt-1 border-t border-line/60">
                              Printed on label as: "{ing.printedText}"
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 rounded-2xl bg-surface border border-line text-xs text-secondary">
                          No high-priority notable additives or synthetic compounds flagged in this ingredient list.
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Honest missing ingredient list message */
                    <div className="p-5 rounded-2xl bg-surface-sunken border border-line text-xs text-secondary leading-relaxed">
                      {ingredientEval.message || 'Ingredient effects cannot be assessed from this photo because no ingredient list was detected on the label.'}
                    </div>
                  )}

                  {/* Highlighted Allergens */}
                  {ingredientEval.allergens && ingredientEval.allergens.length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                      <div className="font-bold text-xs text-heading flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Declared Allergens Detected</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {ingredientEval.allergens.map((alg, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-xl bg-surface font-semibold text-xs text-heading border border-amber-500/40 capitalize">
                            {alg}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Permanent Health Disclaimer */}
                  <div className="p-4 rounded-2xl bg-surface-sunken border border-line text-[11px] text-text-muted flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      General information only, not medical advice. Check with a doctor or dietitian if you have a health condition or allergy.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ENVIRONMENT */}
            {activeTab === 'environment' && (
              <div className="space-y-6">
                {/* 1. Packaging Material & Recyclability */}
                <div className="p-6 sm:p-8 rounded-3xl bg-surface-raised border border-line shadow-soft-sm space-y-4">
                  <h3 className="font-serif text-xl font-bold text-heading">Packaging Material & Recyclability</h3>

                  {scanResult.packaging_material || (scanResult.recycling_symbols && scanResult.recycling_symbols.length > 0) ? (
                    <div className="space-y-3">
                      {scanResult.packaging_material && (
                        <div className="p-4 rounded-2xl bg-surface border border-line text-xs space-y-1">
                          <span className="text-text-muted">Detected Material Format:</span>
                          <div className="font-serif font-bold text-base text-heading">{scanResult.packaging_material}</div>
                        </div>
                      )}

                      {/* Recycling symbols with plain explanations */}
                      {scanResult.recycling_symbols && scanResult.recycling_symbols.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-bold text-heading">Recycling Symbols & How to Dispose:</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {scanResult.recycling_symbols.map((sym, i) => {
                              const match = RECYCLING_KNOWLEDGE.find((k) =>
                                sym.toLowerCase().includes(k.key)
                              );
                              return (
                                <div key={i} className="p-3.5 rounded-2xl bg-surface border border-line space-y-1.5 text-xs">
                                  <div className="flex items-center justify-between">
                                    <span className="font-serif font-bold text-heading">{sym}</span>
                                    {match && (
                                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/15 text-emerald-800">
                                        {match.recyclable}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-secondary leading-relaxed">
                                    {match?.tip || 'Check your municipal curbside plastic/paper recycling bin requirements.'}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-text-muted italic p-3">
                      No environmental or packaging recycling codes detected on this visible label.
                    </div>
                  )}
                </div>

                {/* 2. Environmental Claims Audit (Claim Checker) */}
                <div className="p-6 sm:p-8 rounded-3xl bg-surface-raised border border-line shadow-soft-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-heading">Environmental Claims Audit</h3>
                      <p className="text-xs text-text-muted">Audited by the Greenwashing Detective claim engine.</p>
                    </div>
                    {claimAudit && (
                      <span className="px-3 py-1 rounded-xl text-xs font-bold bg-surface-sunken border border-line text-heading">
                        Grade {claimAudit.finalGrade}
                      </span>
                    )}
                  </div>

                  {claimAudit?.claimAudits && claimAudit.claimAudits.length > 0 ? (
                    <div className="space-y-3">
                      {claimAudit.claimAudits.map((item, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-surface border border-line space-y-1.5 text-xs">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-heading italic">"{item.claim}"</span>
                            <span
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase shrink-0 ${
                                item.category === 'supported'
                                  ? 'bg-emerald-500/15 text-emerald-700'
                                  : item.category === 'vague'
                                  ? 'bg-amber-500/15 text-amber-700'
                                  : 'bg-surface-sunken text-heading'
                              }`}
                            >
                              {item.verdict}
                            </span>
                          </div>
                          <p className="text-secondary leading-relaxed">{item.reasoning}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-text-muted italic p-3">
                      No environmental buzzwords or green claims printed on this label.
                    </div>
                  )}
                </div>

                {/* 3. Greener Catalogue Swaps from Supabase Catalogue */}
                {catalogueSwaps.length > 0 && (
                  <div className="p-6 sm:p-8 rounded-3xl bg-surface-raised border border-line shadow-soft-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-serif text-xl font-bold text-heading">Greener Alternatives in Our Shop</h3>
                        <p className="text-xs text-text-muted">Products in this category with superior eco ratings (Grades A & B).</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate('/shop')}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <span>Browse all</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {catalogueSwaps.map((prod) => (
                        <div key={prod.id} className="p-4 rounded-2xl bg-surface border border-line space-y-3 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-700">
                                Grade {prod.grade}
                              </span>
                              <span className="font-mono text-xs font-bold text-heading">₹{prod.price}</span>
                            </div>
                            <div className="font-serif font-bold text-sm text-heading line-clamp-1">{prod.name}</div>
                            <div className="text-[11px] text-text-muted line-clamp-2">{prod.description}</div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedProduct(prod)}
                            className="w-full py-2 rounded-xl bg-surface-sunken hover:bg-surface border border-line text-xs font-semibold text-heading transition cursor-pointer"
                          >
                            View Alternative
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: FULL TEXT */}
            {activeTab === 'fulltext' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-surface-raised border border-line shadow-soft-sm space-y-4">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-heading">Verbatim Label Transcription</h3>
                    <p className="text-xs text-text-muted">Accurate transcription of visibly printed text.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyVerbatimText}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-sunken border border-line text-xs font-semibold text-heading cursor-pointer"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-line font-mono text-xs text-heading leading-relaxed whitespace-pre-wrap select-all">
                  {scanResult.raw_transcription || 'No printed text transcribed.'}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
