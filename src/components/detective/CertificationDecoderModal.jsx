import React, { useState, useMemo } from 'react';
import {
  Award,
  Search,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  X,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { CERTIFICATIONS_DATABASE } from '../../lib/transparencyEngine';

export default function CertificationDecoderModal({ isOpen, onClose }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeCert, setActiveCert] = useState(CERTIFICATIONS_DATABASE[0]);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const categories = useMemo(() => {
    const set = new Set(CERTIFICATIONS_DATABASE.map((c) => c.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredCerts = useMemo(() => {
    return CERTIFICATIONS_DATABASE.filter((cert) => {
      const matchCat = selectedCategory === 'All' || cert.category === selectedCategory;
      const matchSearch =
        !search.trim() ||
        cert.name.toLowerCase().includes(search.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(search.toLowerCase()) ||
        cert.focus.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-modals flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-surface-raised border border-line rounded-3xl shadow-soft-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-line flex items-center justify-between bg-surface-sunken">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-lg text-heading">
                  Certification Decoder &amp; Registry Guide
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Curated Reference
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Demystifying eco seals, what they guarantee, and where their audits stop.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="px-3 py-2 min-h-[44px] rounded-xl border border-line bg-surface hover:bg-surface-sunken text-text-muted hover:text-heading text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
              title="How this decoder works"
            >
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">How it works</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 min-h-[44px] min-w-[44px] rounded-xl border border-line text-text-muted hover:text-heading hover:bg-surface transition flex items-center justify-center cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* How it works drawer */}
        {showHowItWorks && (
          <div className="p-4 bg-surface border-b border-line text-xs space-y-2 animate-fade-in">
            <div className="flex items-center gap-1.5 font-serif font-bold text-heading">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>About the Certification Registry Framework</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              <strong>Honesty Standard:</strong> Certifications displayed on EcoMart products reflect manufacturer package claims. EcoMart does not issue certifications. We display official third-party registry links so you can verify active license numbers directly with issuers.
            </p>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-line bg-surface flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by certification name (e.g. FSC, GOTS, Organic)..."
              className="w-full pl-9 pr-3 py-2.5 min-h-[44px] text-xs rounded-xl bg-surface-sunken border border-line focus:outline-none focus:border-primary text-heading placeholder:text-text-muted font-sans"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-mono whitespace-nowrap transition cursor-pointer flex items-center justify-center ${
                  selectedCategory === cat
                    ? 'bg-primary text-white font-semibold'
                    : 'bg-surface-sunken border border-line text-text-secondary hover:text-heading'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Master-Detail Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Cert List */}
          <div className="md:col-span-5 border-r border-line overflow-y-auto p-3 space-y-2 max-h-[350px] md:max-h-[500px]">
            {filteredCerts.length === 0 ? (
              <div className="p-6 text-center text-xs text-text-muted">
                No matching certifications found.
              </div>
            ) : (
              filteredCerts.map((cert) => {
                const isSelected = activeCert?.id === cert.id;
                return (
                  <button
                    key={cert.id}
                    type="button"
                    onClick={() => setActiveCert(cert)}
                    className={`w-full text-left p-3 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-primary/10 border-primary/40 shadow-soft-xs'
                        : 'bg-surface hover:bg-surface-sunken border-line'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-heading">
                        {cert.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-sunken border border-line text-text-muted">
                        {cert.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-text-secondary mt-1 truncate">
                      {cert.issuer}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Cert Details Dossier */}
          <div className="md:col-span-7 overflow-y-auto p-4 sm:p-6 bg-surface-sunken/40 space-y-4">
            {activeCert ? (
              <>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                      {activeCert.category}
                    </span>
                    <span className="text-text-muted">•</span>
                    <span className="text-xs text-text-muted font-mono">{activeCert.issuer}</span>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-heading mt-1">
                    {activeCert.name}
                  </h3>
                </div>

                {/* Scope & Focus */}
                <div className="p-3.5 rounded-2xl bg-surface border border-line space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Audited Scope &amp; Core Focus
                  </span>
                  <p className="text-xs text-heading leading-relaxed">
                    {activeCert.focus}
                  </p>
                </div>

                {/* Strengths vs Limitations Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Key Assurance
                    </span>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {activeCert.strength}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Real-World Limits
                    </span>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {activeCert.limitations}
                    </p>
                  </div>
                </div>

                {/* Registry Verification Notice */}
                <div className="p-3.5 rounded-2xl bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-text-muted block">
                      Verification Registry
                    </span>
                    <span className="text-xs font-mono font-bold text-heading">
                      {activeCert.registryCheckUrl}
                    </span>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      {activeCert.disclaimer}
                    </p>
                  </div>
                  <a
                    href={`//${activeCert.registryCheckUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-sunken hover:bg-surface border border-line text-xs font-mono text-primary hover:text-heading transition self-start sm:self-auto cursor-pointer"
                  >
                    <span>Check Registry</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-xs text-text-muted">
                Select a certification from the list to view its audit scope.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
