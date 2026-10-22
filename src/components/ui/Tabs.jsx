import React from 'react';

export default function Tabs({
  tabs = [], // [{ id, label, icon: Icon }]
  activeTab,
  onChange,
  className = ''
}) {
  return (
    <div
      role="tablist"
      className={`inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface-sunken border border-line overflow-x-auto ${className}`}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-sans font-medium whitespace-nowrap transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-focus ${
              isActive
                ? 'bg-surface-raised text-heading shadow-soft-sm font-semibold'
                : 'text-secondary hover:text-heading hover:bg-surface-raised/60'
            }`}
          >
            {Icon && <Icon className="w-4 h-4 shrink-0 text-primary" />}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
