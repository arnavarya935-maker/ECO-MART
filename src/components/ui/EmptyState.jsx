import React from 'react';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  emoji = '🌱',
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = ''
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-surface-raised border border-line max-w-lg mx-auto shadow-soft-sm ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-surface-accent text-heading flex items-center justify-center text-3xl mb-4 shadow-soft-xs border border-primary/20">
        {Icon ? <Icon className="w-8 h-8 text-primary" /> : emoji}
      </div>

      <h3 className="font-serif text-xl sm:text-2xl font-bold text-heading tracking-tight mb-2">
        {title}
      </h3>

      <p className="text-sm text-secondary max-w-sm mb-6 leading-relaxed font-normal">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionLabel && (
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && (
          <Button variant="secondary" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
