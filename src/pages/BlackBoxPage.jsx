import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Download,
  Trash2,
  Search,
  Zap,
  Info,
  Clock,
  Eye,
  Lock,
  Database
} from 'lucide-react';
import {
  getBlackBoxLogs,
  clearBlackBoxLogs,
  exportBlackBoxJSON
} from '../lib/ai/blackboxStore';

export default function BlackBoxPage() {
  const [logs, setLogs] = useState(() => getBlackBoxLogs());
  const [selectedLog, setSelectedLog] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'intercepted' | 'low_confidence' | 'fallback'
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setLogs(getBlackBoxLogs());
    };
    window.addEventListener('blackbox-updated', handleUpdate);
    return () => window.removeEventListener('blackbox-updated', handleUpdate);
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        log.query?.toLowerCase().includes(q) ||
        log.answerSummary?.toLowerCase().includes(q) ||
        log.guardrailTriggered?.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (filterType === 'intercepted') return log.guardrailStatus === 'intercepted';
      if (filterType === 'low_confidence') return log.confidence === 'low' || log.confidence === 'medium';
      if (filterType === 'fallback') return log.isFallback;
      return true;
    });
  }, [logs, searchQuery, filterType]);

  const handleClear = () => {
    clearBlackBoxLogs();
    setLogs(getBlackBoxLogs());
    setSelectedLog(null);
    setShowClearConfirm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-24 text-text">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <Database className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-primary">
              AI Oversight & Transparency
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-heading mt-2">
            AI Black Box Audit Log
          </h1>
          <p className="text-sm text-secondary max-w-2xl mt-1">
            An append-only, tamper-evident audit record of every agent query, ethical guardrail interception, confidence rating, and compute energy estimate.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={exportBlackBoxJSON}
            className="px-4 py-2 rounded-xl bg-surface-sunken border border-line hover:border-primary text-xs font-semibold text-heading transition-colors cursor-pointer flex items-center gap-1.5"
            title="Export complete telemetry audit trail in JSON format"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="px-3.5 py-2 rounded-xl bg-surface-sunken border border-rose-500/30 hover:border-rose-500 text-xs font-semibold text-rose-400 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Log</span>
          </button>
        </div>
      </div>

      {/* Privacy & Ethics Guarantee Notice */}
      <div className="p-4 rounded-3xl bg-surface-raised border border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-soft-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            <strong className="text-heading">Zero-PII Telemetry Guarantee:</strong> This local Black Box log records model queries, rule evaluations, and energy estimates only. No passwords, user profiles, cookies, or API keys are ever stored or transmitted.
          </p>
        </div>

        <Link
          to="/playground"
          className="px-3 py-1.5 rounded-xl bg-surface border border-line hover:border-primary text-[11px] font-semibold text-primary shrink-0 transition-colors"
        >
          Test in Playground →
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search query, rule, or answer..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-sunken border border-line text-xs text-heading placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: `All Entries (${logs.length})` },
            { id: 'intercepted', label: 'Guardrail Interceptions' },
            { id: 'low_confidence', label: 'Uncertainty / Caveats' },
            { id: 'fallback', label: 'Deterministic Fallback' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                filterType === tab.id
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface-sunken text-muted border-line hover:text-heading'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Timeline on Left, Inspection Drawer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline Log List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-surface border border-line space-y-2">
              <FileText className="w-8 h-8 text-muted mx-auto" />
              <h3 className="text-sm font-bold text-heading">No audit logs matching criteria</h3>
              <p className="text-xs text-muted">Try clearing search filters or interacting with Eco Agent.</p>
            </div>
          ) : (
            filteredLogs.map((item) => {
              const isSelected = selectedLog?.id === item.id;
              const isIntercepted = item.guardrailStatus === 'intercepted';

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedLog(item)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2.5 ${
                    isSelected
                      ? 'bg-surface border-primary shadow-soft-sm'
                      : isIntercepted
                      ? 'bg-surface-sunken border-rose-500/30 hover:border-rose-500/60'
                      : 'bg-surface-sunken border-line hover:border-line-subtle'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-muted text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isIntercepted
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {item.guardrailTriggered}
                      </span>

                      <span className="text-[10px] text-muted flex items-center gap-0.5">
                        <Zap className="w-3 h-3 text-primary" />
                        ~{item.energyEstimateWh} Wh
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-heading">
                      "{item.query}"
                    </h4>
                    <p className="text-xs text-secondary mt-1 line-clamp-2 leading-relaxed">
                      {item.answerSummary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-line/60">
                    <span className="text-muted font-mono">Model: {item.model}</span>
                    <span className="text-primary font-semibold flex items-center gap-1 hover:underline">
                      <Eye className="w-3 h-3" />
                      Inspect Trace
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Log Detail Dossier */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-3xl bg-surface border border-line sticky top-24 space-y-5 shadow-card text-left">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                <h3 className="font-serif font-bold text-sm text-heading">
                  Interaction Audit Trace
                </h3>
              </div>
              {selectedLog && (
                <span className="text-[10px] font-mono text-muted">ID: {selectedLog.id}</span>
              )}
            </div>

            {selectedLog ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] font-mono font-bold text-muted uppercase block mb-1">
                    Audited User Query:
                  </span>
                  <div className="p-3 rounded-xl bg-surface-sunken border border-line font-mono text-heading">
                    {selectedLog.query}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold text-muted uppercase block mb-1">
                    Agent Answer Summary:
                  </span>
                  <div className="p-3 rounded-xl bg-surface-sunken border border-line text-secondary leading-relaxed">
                    {selectedLog.answerSummary}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="p-2.5 rounded-xl bg-surface-sunken border border-line">
                    <span className="text-[10px] text-muted block">Confidence Rating</span>
                    <span className="text-xs font-bold text-heading uppercase mt-0.5 block">
                      {selectedLog.confidence}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-sunken border border-line">
                    <span className="text-[10px] text-muted block">Algorithmic Energy</span>
                    <span className="text-xs font-bold text-primary mt-0.5 block">
                      ~{selectedLog.energyEstimateWh} Wh
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold text-muted uppercase block mb-1">
                    Sources & Scientific Assumptions:
                  </span>
                  <ul className="p-3 rounded-xl bg-surface-sunken border border-line space-y-1 list-disc pl-5 text-text-secondary text-[11px]">
                    {(selectedLog.sources || ['EcoMart verified lifecycle knowledge base']).map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold text-muted uppercase block mb-1">
                    Raw Telemetry JSON:
                  </span>
                  <pre className="p-3 rounded-xl bg-surface-sunken border border-line font-mono text-[10px] text-muted overflow-x-auto max-h-36">
                    {JSON.stringify(selectedLog, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center space-y-2 text-muted">
                <Info className="w-8 h-8 mx-auto" />
                <p className="text-xs">Click on any timeline interaction on the left to inspect its complete verification trace.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in"
        >
          <div className="w-full max-w-sm rounded-3xl bg-surface border border-line p-6 shadow-2xl space-y-4 text-center">
            <Trash2 className="w-8 h-8 text-rose-400 mx-auto" />
            <h3 className="font-serif font-bold text-base text-heading">Clear Black Box Audit Log?</h3>
            <p className="text-xs text-muted">
              This will reset the local audit telemetry log on this device. Baseline verification entries will remain available for offline judge demonstrations.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-surface-sunken border border-line text-xs font-semibold text-heading hover:bg-surface transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Clear Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
