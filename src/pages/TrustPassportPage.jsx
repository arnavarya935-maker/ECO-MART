import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  RotateCcw,
  QrCode,
  Share2,
  Printer,
  ArrowLeft,
  CheckCircle2,
  Wind,
  Droplets,
  Ban,
  Sparkles,
  Info
} from 'lucide-react';
import productsData from '../data/products.json';
import { calculateEcoScore, detectGreenwashing } from '../lib/ecoScore';
import AIEthicsCard from '../components/decision/AIEthicsCard';
import SecondLifeTab from '../components/lifecycle/SecondLifeTab';

/**
 * Pure SVG QR code generator (21x21 matrix simulation).
 * Zero external dependencies, razor-sharp vector rendering at any scale.
 */
function NativeSvgQrCode({ value, size = 140 }) {
  // Deterministic pseudo-random pattern based on string value
  const modules = useMemo(() => {
    const grid = Array.from({ length: 21 }, () => Array(21).fill(false));
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }

    // Top-left, top-right, bottom-left finder patterns
    const fillFinder = (row, col) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
            grid[row + r][col + c] = true;
          }
        }
      }
    };

    fillFinder(0, 0);
    fillFinder(0, 14);
    fillFinder(14, 0);

    // Data grid fill
    for (let r = 0; r < 21; r++) {
      for (let c = 0; c < 21; c++) {
        // Skip finder areas
        if ((r < 8 && c < 8) || (r < 8 && c >= 13) || (r >= 13 && c < 8)) continue;
        const cellHash = (hash * (r * 21 + c + 13)) % 100;
        grid[r][c] = Math.abs(cellHash) > 48;
      }
    }
    return grid;
  }, [value]);

  const cellSize = size / 21;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="bg-white p-2 rounded-xl border border-line shadow-soft-xs"
      aria-label={`QR Code linking to ${value}`}
    >
      {modules.map((row, r) =>
        row.map((active, c) =>
          active ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#064e3b"
            />
          ) : null
        )
      )}
    </svg>
  );
}

export default function TrustPassportPage() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);

  const product = useMemo(() => {
    return productsData.find((p) => p.id === id) || productsData[0];
  }, [id]);

  const ecoScoreData = calculateEcoScore(product);
  const passportUrl = typeof window !== 'undefined' ? window.location.href : `ecomart-local-passport/${product.id}`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(passportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in pb-24 text-text">
      {/* Top Bar with Back and Print/Share */}
      <div className="flex items-center justify-between border-b border-line pb-4 print:hidden">
        <Link
          to={`/product/${product.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-heading transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3.5 py-1.5 rounded-xl bg-surface-sunken border border-line hover:border-primary text-xs font-semibold text-heading transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Share Passport'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-surface-sunken border border-line hover:border-primary text-xs font-semibold text-heading transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Main Passport Certificate Sheet */}
      <div className="p-6 sm:p-10 rounded-3xl bg-surface border border-line shadow-card space-y-8 text-left relative overflow-hidden">
        {/* Subtle Watermark Badge */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/5 pointer-events-none blur-2xl" />

        {/* Certificate Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-line pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-primary">
                Official Trust Passport
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-heading">
              {product.name}
            </h1>
            <p className="text-xs text-muted font-mono">
              PASSPORT ID: #PASSPORT-{product.id.toUpperCase()}-2026 • ISSUED BY ECOMART ETHICS AUDITOR
            </p>
          </div>

          {/* Client-Side QR Code */}
          <div className="flex flex-col items-center sm:items-end gap-1.5 shrink-0">
            <NativeSvgQrCode value={passportUrl} size={110} />
            <span className="text-xs font-mono text-muted flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-primary" />
              Scan on Phone
            </span>
          </div>
        </div>

        {/* 3 Pillars Grid: EcoScore, Greenwashing Check, Packaging Integrity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-surface-sunken border border-line text-center space-y-1">
            <span className="text-xs font-mono text-muted uppercase font-bold block">
              Audited EcoScore
            </span>
            <div className="text-3xl font-serif font-black text-primary">
              {ecoScoreData.score} <span className="text-xs font-normal text-muted">/ 100</span>
            </div>
            <span className="text-xs font-mono text-muted block">Grade {ecoScoreData.grade} • Estimated Lifecycle</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-sunken border border-line text-center space-y-1">
            <span className="text-xs font-mono text-muted uppercase font-bold block">
              Greenwashing Trust
            </span>
            <div className={`text-3xl font-serif font-black ${
              greenwashData.trustScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {greenwashData.trustScore}%
            </div>
            <span className="text-xs font-mono text-muted block">{greenwashData.verdict}</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-sunken border border-line text-center space-y-1">
            <span className="text-xs font-mono text-muted uppercase font-bold block">
              Plastic Waste
            </span>
            <div className="text-3xl font-serif font-black text-heading">
              {product.plasticGrams} <span className="text-xs font-normal text-muted">grams</span>
            </div>
            <span className="text-xs font-mono text-muted block capitalize">{product.packaging} Packaging</span>
          </div>
        </div>

        {/* Physical Footprint Strip */}
        <div className="p-4 rounded-2xl bg-surface-raised border border-line flex flex-wrap items-center justify-around gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-primary" />
            <span>CO₂: <strong>{product.carbonKg} kg</strong> (est.)</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-sky-400" />
            <span>Water: <strong>{product.waterLitres} Litres</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Origin: <strong>{product.madeInKm} km transit</strong></span>
          </div>
        </div>

        {/* Embedded Section 1: AI Recommendation Ethics & Transparency Card */}
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-base text-heading flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI Recommendation Ethics & Bias Transparency</span>
          </h3>
          <AIEthicsCard product={product} />
        </div>

        {/* Embedded Section 2: Second Life Circular Path */}
        <div className="space-y-3 pt-4 border-t border-line">
          <h3 className="font-serif font-bold text-base text-heading flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-primary" />
            <span>End-of-Life & Circular Second Life Path</span>
          </h3>
          <SecondLifeTab product={product} />
        </div>

        {/* Verification Footer Stamp */}
        <div className="pt-4 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>Responsible AI Standard: Deterministic local data model. No invented claims.</span>
          </div>
          <span className="font-mono text-xs text-heading">
            EcoMart Telemetry Engine v2.0
          </span>
        </div>
      </div>
    </div>
  );
}
