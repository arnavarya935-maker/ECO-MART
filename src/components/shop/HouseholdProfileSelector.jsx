import React from 'react';
import { Users, Check } from 'lucide-react';
import { HOUSEHOLD_PROFILES } from '../../lib/personaEngine';
import { useCart } from '../../context/CartContext';

export default function HouseholdProfileSelector({ activeProfileId = 'default', onSelectProfile, className = '' }) {
  const { updateUserPriorities } = useCart();

  const profiles = Object.values(HOUSEHOLD_PROFILES);

  const handleSelect = (profile) => {
    onSelectProfile?.(profile.id);
    updateUserPriorities(profile.weights, profile.id);
  };

  return (
    <div className={`space-y-2 text-left ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-primary" />
          <span>Household &amp; Persona Profiles</span>
        </span>
        <span className="text-[10px] font-mono text-text-muted">
          Adaptive Constraints
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {profiles.map((p) => {
          const isSelected = activeProfileId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelect(p)}
              className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-primary/10 border-primary shadow-soft-xs text-heading'
                  : 'bg-surface-raised border-line hover:bg-surface text-text-secondary hover:text-heading'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{p.icon}</span>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              <div className="font-serif font-bold text-xs text-heading mt-1.5 truncate">
                {p.label}
              </div>
              <div className="text-[10px] font-mono text-primary font-medium mt-0.5 truncate">
                {p.badge}
              </div>
              <p className="text-[10px] text-text-muted mt-1 leading-tight line-clamp-2">
                {p.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
