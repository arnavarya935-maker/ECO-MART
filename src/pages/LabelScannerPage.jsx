import React, { useState, useRef } from 'react';
import {
  Scan,
  Upload,
  Camera,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  RotateCcw,
  Sparkles,
  Lock
} from 'lucide-react';
import { scanProductLabel, SAMPLE_LABELS } from '../lib/ai/labelScanner.js';
import ClaimRadarChart from '../components/detective/ClaimRadarChart.jsx';

export default function LabelScannerPage() {
  const [selectedSample, setSelectedSample] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Handle local image file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError('Image file exceeds the 4MB limit.');
      return;
    }

    setError(null);
    setSelectedSample(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setImagePreview(base64);
      processImage(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  // Handle offline sample selection
  const handleSelectSample = (sample) => {
    setError(null);
    setSelectedSample(sample);
    setImagePreview(null);
    setIsScanning(true);

    // Fast simulated scan for cached sample
    setTimeout(async () => {
      try {
        const result = await scanProductLabel({ sampleId: sample.id });
        setScanResult(result);
      } catch (err) {
        setError(err.message || 'Error auditing sample.');
      } finally {
        setIsScanning(false);
      }
    }, 600);
  };

  // Run audit on image
  const processImage = async (base64, mimeType) => {
    setIsScanning(true);
    setScanResult(null);
    setError(null);

    try {
      const result = await scanProductLabel({
        imageBase64: base64,
        mimeType
      });
      setScanResult(result);
    } catch (err) {
      setError(err.message || 'Failed to scan image. Please try again or select an offline sample.');
    } finally {
      setIsScanning(false);
    }
  };

  // Camera stream capture
  const startCamera = async () => {
    try {
      setCameraActive(true);
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setError('Camera access unavailable. Please use file upload.');
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg');

    // Stop camera stream
    const stream = videoRef.current.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);
    setImagePreview(base64);
    processImage(base64, 'image/jpeg');
  };

  const resetScanner = () => {
    setSelectedSample(null);
    setImagePreview(null);
    setScanResult(null);
    setError(null);
    setCameraActive(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Format radar axes for ClaimRadarChart component
  const radarAxes = scanResult?.radar_axes
    ? {
        vague_wording: scanResult.radar_axes.vague_wording || 50,
        verifiable_proof: scanResult.radar_axes.verifiable_proof || 50,
        certification:
          scanResult.radar_axes.third_party_audit || scanResult.radar_axes.certification || 50,
        specificity:
          scanResult.radar_axes.omission_risk || scanResult.radar_axes.specificity || 50,
        comparison_basis:
          scanResult.radar_axes.lifecycle_boundary || scanResult.radar_axes.comparison_basis || 50
      }
    : null;

  return (
    <div className="min-h-screen bg-sand-50 py-10 px-4 sm:px-6 lg:px-8 text-forest-900 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header & Privacy Notice */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-line shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-800 mb-3">
                <Scan className="w-3.5 h-3.5" />
                <span>AI Vision Label Auditor</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-heading">
                Product Label Scanner
              </h1>
              <p className="text-muted mt-2 text-sm sm:text-base max-w-2xl">
                Upload or capture a photo of any product label. Our AI Vision proxy extracts packaging claims and runs the Greenwashing Detective & 5-Axis Claim Radar.
              </p>
            </div>

            {/* Crucial Privacy Badge */}
            <div className="bg-sand-100 rounded-2xl p-4 border border-line text-xs space-y-1.5 max-w-xs self-start">
              <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                <Lock className="w-4 h-4" />
                <span>Image is not saved</span>
              </div>
              <p className="text-muted leading-relaxed">
                Photos are processed in volatile memory for claim extraction only and are immediately purged. Zero images are saved to disk.
              </p>
            </div>
          </div>

          {/* Quick Offline Sample Chips */}
          <div className="mt-6 pt-6 border-t border-line/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-3">
              Or Try Offline Sample Labels (100% Offline):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_LABELS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedSample?.id === sample.id
                      ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                      : 'bg-surface-raised hover:bg-sand-100 text-heading border-line'
                  }`}
                >
                  <span className="text-[10px] font-mono opacity-80 uppercase block">
                    {sample.category}
                  </span>
                  <span className="font-bold text-xs sm:text-sm block mt-0.5">
                    {sample.title}
                  </span>
                  <span className="text-[11px] opacity-75 line-clamp-1 mt-1 italic">
                    "{sample.mockPackagingText}"
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upload & Camera Capture Zone */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-line shadow-sm space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!cameraActive ? (
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              {/* File Drop / Upload */}
              <label className="flex-1 w-full border-2 border-dashed border-line hover:border-forest-900/40 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition bg-surface-raised hover:bg-sand-100/50">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-forest-900/10 flex items-center justify-center text-forest-900 mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm text-heading">
                  Upload Product Label Image
                </span>
                <span className="text-xs text-muted mt-1">
                  Drag & drop JPEG, PNG, or WebP (Max 4MB)
                </span>
              </label>

              {/* Camera Trigger */}
              <div className="text-xs text-muted font-bold uppercase sm:px-2">or</div>

              <button
                type="button"
                onClick={startCamera}
                className="w-full sm:w-auto px-6 py-8 border-2 border-dashed border-line hover:border-forest-900/40 rounded-3xl flex flex-col items-center justify-center transition bg-surface-raised hover:bg-sand-100/50 text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-forest-900/10 flex items-center justify-center text-forest-900 mb-3">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm text-heading">
                  Use Device Camera
                </span>
                <span className="text-xs text-muted mt-1">
                  Capture label directly
                </span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-w-md mx-auto text-center">
              <div className="aspect-4/3 bg-black rounded-3xl overflow-hidden relative border border-line">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={capturePhoto}
                  className="px-5 py-2.5 rounded-xl bg-forest-900 text-white font-bold text-xs hover:bg-forest-800 transition"
                >
                  Snap Label Photo
                </button>
                <button
                  onClick={() => setCameraActive(false)}
                  className="px-4 py-2.5 rounded-xl bg-sand-100 text-heading font-semibold text-xs hover:bg-sand-200 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Image Preview / Scanning Indicator */}
          {(imagePreview || selectedSample) && (
            <div className="pt-4 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Scanned Label Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-line shadow-sm"
                  />
                ) : (
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedSample.previewColor} flex items-center justify-center text-white text-xs font-mono font-bold p-2 text-center shadow-sm`}
                  >
                    SAMPLE
                  </div>
                )}
                <div>
                  <span className="text-xs font-bold text-heading block">
                    {selectedSample ? selectedSample.title : 'Custom Label Image'}
                  </span>
                  <span className="text-[11px] text-muted flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Processed in volatile RAM only</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetScanner}
                  className="p-2 rounded-xl bg-sand-100 hover:bg-sand-200 text-muted transition text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Scan Another</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading Spinner */}
        {isScanning && (
          <div className="bg-surface rounded-3xl p-10 border border-line text-center space-y-3">
            <div className="w-10 h-10 border-4 border-forest-900/20 border-t-forest-900 rounded-full animate-spin mx-auto" />
            <h3 className="font-serif font-bold text-base text-heading">
              Extracting Packaging Claims & Auditing Veracity...
            </h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              Comparing text against ISO 14021 environmental claim benchmarks and FTC Green Guides.
            </p>
          </div>
        )}

        {/* Audit Results Dashboard */}
        {scanResult && !isScanning && (
          <div className="space-y-6">
            {/* Top Score & Verdict Card */}
            <div className="bg-surface rounded-3xl p-6 sm:p-8 border-2 border-forest-900 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-forest-900/10 text-forest-900 font-bold">
                      Detective Audit Report
                    </span>
                    <span className="text-xs text-muted">
                      {scanResult.identified_product_name || 'Audited Label'}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-heading mt-2">
                    {scanResult.verdict}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted mt-1 max-w-xl">
                    {scanResult.plain_verdict_explanation}
                  </p>
                </div>

                {/* Trust Score Circular Gauge */}
                <div className="bg-sand-100 rounded-2xl p-5 border border-line text-center shrink-0 min-w-[140px]">
                  <span className="text-[10px] uppercase font-bold text-muted block">
                    Claim Trust Score
                  </span>
                  <div className="text-3xl font-black text-heading mt-1">
                    {scanResult.trust_score}
                    <span className="text-sm font-normal text-muted">/100</span>
                  </div>
                  <span
                    className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      scanResult.trust_score >= 75
                        ? 'bg-emerald-500/10 text-emerald-700'
                        : scanResult.trust_score >= 45
                        ? 'bg-amber-500/10 text-amber-700'
                        : 'bg-rose-500/10 text-rose-700'
                    }`}
                  >
                    {scanResult.trust_score >= 75
                      ? 'High Integrity'
                      : scanResult.trust_score >= 45
                      ? 'Partial Risk'
                      : 'High Risk'}
                  </span>
                </div>
              </div>

              {/* Extracted Packaging Text */}
              <div className="bg-sand-50 rounded-2xl p-4 border border-line space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-heading">
                  <FileText className="w-4 h-4 text-forest-900" />
                  <span>Extracted Label Claims</span>
                </div>
                <p className="text-xs text-muted font-mono whitespace-pre-wrap leading-relaxed">
                  {scanResult.extracted_text}
                </p>
              </div>

              {/* Flagged Phrases & Missing Proofs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Flagged Greenwashing */}
                <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Deceptive / Flagged Terms ({scanResult.flagged_phrases?.length || 0})</span>
                  </div>
                  {scanResult.flagged_phrases && scanResult.flagged_phrases.length > 0 ? (
                    <div className="space-y-2">
                      {scanResult.flagged_phrases.map((flag, idx) => (
                        <div key={idx} className="bg-surface rounded-xl p-3 border border-rose-500/20 text-xs">
                          <span className="font-bold text-rose-700 block">
                            "{flag.phrase}"
                          </span>
                          <span className="text-muted text-[11px] mt-0.5 block">
                            {flag.issue}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-700 flex items-center gap-1.5 pt-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Zero misleading buzzwords detected on packaging.</span>
                    </div>
                  )}
                </div>

                {/* Missing Certifications & Proofs */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                    <XCircle className="w-4 h-4" />
                    <span>Missing Proofs ({scanResult.missing_proofs?.length || 0})</span>
                  </div>
                  {scanResult.missing_proofs && scanResult.missing_proofs.length > 0 ? (
                    <ul className="space-y-2 text-xs text-muted">
                      {scanResult.missing_proofs.map((miss, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-surface p-2.5 rounded-xl border border-line">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{miss}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-xs text-emerald-700 flex items-center gap-1.5 pt-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>All cited claims match verified standards.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 5-Axis Claim Radar Chart */}
              {radarAxes && (
                <div className="pt-2">
                  <ClaimRadarChart
                    claimA={{
                      label: scanResult.identified_product_name || 'Scanned Label',
                      axes: radarAxes
                    }}
                  />
                </div>
              )}

              {/* Buyer Recommendation */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-emerald-900 block">
                    Responsible Buying Recommendation:
                  </span>
                  <p className="text-emerald-800 leading-relaxed">
                    {scanResult.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
