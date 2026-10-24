import React, { useState } from 'react';
import { Sliders, RotateCcw, Sparkles, Check, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { PRIORITY_PRESETS } from '../../lib/decisionEngine';
import Slider from '../ui/Slider';

export default function PrioritiesPanel({ compact = false, className = '' }) {
  const {
    userPriorities,
    updateUserPriorities,
    activePreset,
    applyPriorityPreset,
    resetPriorities
  } = useCart();

  const [expanded, setExpanded] = useState(!compact);

  const presets = Object.values(PRIORITY_PRESETS);

  const handleSliderChange = (key, value) => {
    updateUserPriorities({ [key]: value });
  };

  const isCustom = activePreset === 'custom';

  return (
    <div
      className={`bg-surface-raised border border-line rounded-2xl shadow-card transition-all ${className}`}
    >
      {/* Header */}
      <div
        className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-sm font-bold text-heading">
                My Priorities
              </h3>
              <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-primary-subtle text-primary border border-primary/20 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Real-time MCDM
              </span>
            </div>
            <p className="text-[11px] font-sans text-muted">
              {isCustom ? 'Custom slider weights' : `${PRIORITY_PRESETS[activePreset]?.label || 'Preset'} mode active`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {expanded && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                resetPriorities();
              }}
              className="text-[11px] font-sans font-medium text-muted hover:text-heading flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-surface-sunken transition-colors cursor-pointer"
              title="Reset weights to balanced"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
          <button
            type="button"
            className="p-1 text-muted hover:text-heading transition-colors"
            aria-label={expanded ? 'Collapse priorities' : 'Expand priorities'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-3.5 sm:px-4 pb-4 pt-1 space-y-4 border-t border-line/60">
          {/* Preset Chips */}
          <div>
            <div className="text-[10px] font-sans uppercase font-bold tracking-wider text-muted mb-2">
              Optimization Presets
            </div>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => {
                const isSelected = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPriorityPreset(preset.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-primary text-primary-contrast border-primary shadow-soft-xs'
                        : 'bg-surface text-secondary hover:text-heading hover:bg-surface-sunken border-line'
                    }`}
                    title={preset.description}
                  >
                    {isSelected && <Check className="w-3 h-3 text-primary-contrast" />}
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
            <Slider
              id="priority-plastic"
              label="Plastic Minimization"
              value={userPriorities.plastic}
              min={0}
              max={100}
              step={5}
              valueDisplay={`${userPriorities.plastic}%`}
              onChange={(v) => handleSliderChange('plastic', v)}
            />
            <Slider
              id="priority-price"
              label="Affordability (Price)"
              value={userPriorities.price}
              min={0}
              max={100}
              step={5}
              valueDisplay={`${userPriorities.price}%`}
              onChange={(v) => handleSliderChange('price', v)}
            />
            <Slider
              id="priority-carbon"
              label="Carbon Reduction"
              value={userPriorities.carbon}
              min={0}
              max={100}
              step={5}
              valueDisplay={`${userPriorities.carbon}%`}
              onChange={(v) => handleSliderChange('carbon', v)}
            />
            <Slider
              id="priority-local"
              label="Local Sourcing"
              value={userPriorities.local}
              min={0}
              max={100}
              step={5}
              valueDisplay={`${userPriorities.local}%`}
              onChange={(v) => handleSliderChange('local', v)}
            />
            <Slider
              id="priority-water"
              label="Water Conservation"
              value={userPriorities.water}
              min={0}
              max={100}
              step={5}
              valueDisplay={`${userPriorities.water}%`}
              onChange={(v) => handleSliderChange('water', v)}
            />
            <Slider
              id="priority-certs"
              label="Disclosed Certifications"
              value={userPriorities.certs}
              min={0}
              max={100}
              step={5}
              valueDisplay={`${userPriorities.certs}%`}
              onChange={(v) => handleSliderChange('certs', v)}
            />
            <Slider
              id="priority-ecoscore"
              label="Baseline EcoScore"
              value={userPriorities.ecoScore}
              min={0}
              max={100}
              step={5}
              valueDisplay={`${userPriorities.ecoScore}%`}
              onChange={(v) => handleSliderChange('ecoScore', v)}
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-sans text-muted bg-surface p-2.5 rounded-xl border border-line">
            <Info className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>
              Decision Engine normalizes criteria mathematically using min-max scaling across candidate items.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
