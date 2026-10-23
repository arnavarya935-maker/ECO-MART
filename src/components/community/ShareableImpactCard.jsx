import React, { useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function ShareableImpactCard({
  customPlastic,
  customCo2,
  customWater,
  purposeScoreBefore,
  purposeScoreAfter
} = {}) {
  const { user } = useAuth();
  const { impact } = useCart();
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef(null);

  const userName = user?.name || 'Conscious Explorer';
  const plasticSaved = customPlastic !== undefined ? `${customPlastic}g` : `${impact?.plasticAvoided ?? impact?.totalPlasticSavedGrams ?? 0}g`;
  const co2Saved = customCo2 !== undefined ? `${Number(customCo2).toFixed(2)}kg` : `${Number(impact?.co2Saved ?? impact?.totalCo2SavedKg ?? impact?.savedCo2 ?? 0).toFixed(2)}kg`;
  const waterSaved = customWater !== undefined ? `${customWater}L` : `${impact?.waterSaved ?? impact?.totalWaterSavedLitres ?? 0}L`;

  const handleExportPng = () => {
    setDownloading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 500;

    // Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 500);
    gradient.addColorStop(0, '#0B3B2C');
    gradient.addColorStop(0.5, '#06241B');
    gradient.addColorStop(1, '#02130D');
    ctx.fillStyle = gradient;
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(0, 0, 800, 500, 32);
    } else {
      ctx.rect(0, 0, 800, 500);
    }
    ctx.fill();

    // Decorative Emerald Border
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 4;
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(10, 10, 780, 480, 24);
    } else {
      ctx.strokeRect(10, 10, 780, 480);
    }
    ctx.stroke();

    // Brand Header
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('EcoMart • Official Environmental Ledger', 50, 70);

    ctx.fillStyle = '#A7F3D0';
    ctx.font = '16px sans-serif';
    ctx.fillText("DON'T JUST SHOP. SHOP WITH PURPOSE.", 50, 100);

    // User Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(userName, 50, 170);

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '16px sans-serif';
    ctx.fillText('Verified Circular Consumer Certificate', 50, 200);

    // Stat Boxes
    // Stat 1: Plastic
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.fillRect(50, 240, 210, 110);
    ctx.fillStyle = '#34D399';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(plasticSaved, 70, 290);
    ctx.fillStyle = '#D1FAE5';
    ctx.font = '14px sans-serif';
    ctx.fillText('Plastic Avoided', 70, 325);

    // Stat 2: CO2
    ctx.fillStyle = 'rgba(20, 184, 166, 0.15)';
    ctx.fillRect(280, 240, 210, 110);
    ctx.fillStyle = '#2DD4BF';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(co2Saved, 300, 290);
    ctx.fillStyle = '#CCFBF1';
    ctx.font = '14px sans-serif';
    ctx.fillText('CO₂ Emissions Diverted', 300, 325);

    // Stat 3: Water
    ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.fillRect(510, 240, 240, 110);
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(waterSaved, 530, 290);
    ctx.fillStyle = '#E0F2FE';
    ctx.font = '14px sans-serif';
    ctx.fillText('Freshwater Conserved', 530, 325);

    // Purpose Score Note
    if (purposeScoreAfter !== undefined) {
      ctx.fillStyle = '#34D399';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`Purpose Score: ${purposeScoreAfter}/100 (Usual Baseline: ${purposeScoreBefore || 0}/100)`, 50, 380);
    }

    // Footer note
    ctx.fillStyle = '#6EE7B7';
    ctx.font = 'italic 16px sans-serif';
    ctx.fillText('🌱 Certified zero-waste metrics calculated via EcoMart transparent lifecycle formulas.', 50, 415);

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '12px sans-serif';
    ctx.fillText(`Audited date: ${new Date().toLocaleDateString()} • Fully Offline Certified`, 50, 445);

    // Trigger PNG Download
    setTimeout(() => {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = `ecomart-impact-${userName.toLowerCase().replace(/\s+/g, '-')}.png`;
      a.href = dataUrl;
      a.click();
      setDownloading(false);
    }, 200);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm max-w-2xl mx-auto space-y-6">
      <div className="border-b border-line pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
          Offline Export
        </span>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-heading mt-2">
          Shareable Impact Certificate
        </h3>
        <p className="text-xs sm:text-sm text-secondary mt-0.5">
          Generate and download a high-resolution PNG impact certificate locally in your browser.
        </p>
      </div>

      {/* Visual Preview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-primary text-primary-contrast border border-primary shadow-soft-md space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-primary-contrast/20 pb-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary-contrast/80">EcoMart Certified</div>
            <div className="text-lg font-serif font-bold text-primary-contrast mt-0.5">{userName}</div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-primary-contrast/15 text-primary-contrast font-medium border border-primary-contrast/30">
            Circular Citizen
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-primary-contrast/10 border border-primary-contrast/20">
            <div className="text-base sm:text-xl font-serif font-bold text-primary-contrast">{plasticSaved}</div>
            <div className="text-[10px] text-primary-contrast/70 font-medium mt-0.5">Plastic Avoided</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-primary-contrast/10 border border-primary-contrast/20">
            <div className="text-base sm:text-xl font-serif font-bold text-primary-contrast">{co2Saved}</div>
            <div className="text-[10px] text-primary-contrast/70 font-medium mt-0.5">CO₂ Diverted</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-primary-contrast/10 border border-primary-contrast/20">
            <div className="text-base sm:text-xl font-serif font-bold text-primary-contrast">{waterSaved}</div>
            <div className="text-[10px] text-primary-contrast/70 font-medium mt-0.5">Water Saved</div>
          </div>
        </div>

        {purposeScoreAfter !== undefined && (
          <div className="p-3 rounded-2xl bg-primary-contrast/15 border border-primary-contrast/20 text-center">
            <span className="text-[10px] uppercase tracking-wider text-primary-contrast/80 font-semibold block">Purpose Score</span>
            <span className="text-lg font-serif font-bold text-primary-contrast">
              {purposeScoreAfter}/100
              {purposeScoreBefore !== undefined && (
                <span className="text-xs font-normal text-primary-contrast/70 ml-2">(Baseline: {purposeScoreBefore}/100)</span>
              )}
            </span>
          </div>
        )}

        <div className="text-xs text-primary-contrast/80 italic text-center font-serif">
          "Don't just shop. Shop with purpose."
        </div>
      </div>

      {/* Hidden Canvas for High-Res PNG Generation */}
      <canvas ref={canvasRef} className="hidden" />

      <button
        type="button"
        onClick={handleExportPng}
        disabled={downloading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs shadow-soft-xs transition active:scale-95 cursor-pointer min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus"
      >
        <Download className="w-4 h-4" />
        <span>{downloading ? 'Rendering Image...' : 'Download Impact Card as PNG'}</span>
      </button>
    </div>
  );
}
