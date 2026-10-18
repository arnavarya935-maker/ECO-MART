import React, { useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function ShareableImpactCard() {
  const { user } = useAuth();
  const { impact } = useCart();
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef(null);

  const userName = user?.name || 'Conscious Explorer';
  const plasticSaved = `${impact.totalPlasticSavedGrams}g`;
  const co2Saved = `${impact.totalCo2SavedKg.toFixed(2)}kg`;
  const waterSaved = `${impact.totalWaterSavedLitres}L`;

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

    // Footer note
    ctx.fillStyle = '#6EE7B7';
    ctx.font = 'italic 16px sans-serif';
    ctx.fillText('🌱 Certified zero-waste metrics calculated via EcoMart transparent lifecycle formulas.', 50, 410);

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
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-md max-w-2xl mx-auto space-y-6">
      <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
          Offline Export
        </span>
        <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 mt-2">
          Shareable Impact Certificate
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Generate and download a high-resolution PNG impact certificate locally in your browser.
        </p>
      </div>

      {/* Visual Preview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B3B2C] via-[#06241B] to-[#02130D] text-white border-2 border-emerald-500/50 shadow-xl space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-emerald-600/30 pb-4">
          <div>
            <div className="text-xs font-extrabold text-emerald-400">EcoMart Certified</div>
            <div className="text-lg font-black text-white">{userName}</div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
            Circular Citizen
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-white/5 border border-emerald-500/20">
            <div className="text-base sm:text-xl font-black text-emerald-400">{plasticSaved}</div>
            <div className="text-[10px] text-stone-300 font-medium">Plastic Avoided</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-teal-500/20">
            <div className="text-base sm:text-xl font-black text-teal-400">{co2Saved}</div>
            <div className="text-[10px] text-stone-300 font-medium">CO₂ Diverted</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-cyan-500/20">
            <div className="text-base sm:text-xl font-black text-cyan-400">{waterSaved}</div>
            <div className="text-[10px] text-stone-300 font-medium">Water Saved</div>
          </div>
        </div>

        <div className="text-[11px] text-emerald-200/80 italic text-center">
          "Don't just shop. Shop with purpose."
        </div>
      </div>

      {/* Hidden Canvas for High-Res PNG Generation */}
      <canvas ref={canvasRef} className="hidden" />

      <button
        type="button"
        onClick={handleExportPng}
        disabled={downloading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition active:scale-95 cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span>{downloading ? 'Rendering Image...' : 'Download Impact Card as PNG'}</span>
      </button>
    </div>
  );
}
