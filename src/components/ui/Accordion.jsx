import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Accordion({
  items = [], // [{ id, title, content }]
  allowMultiple = false,
  className = ''
}) {
  const [openIds, setOpenIds] = useState(new Set());

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={`divide-y divide-line border border-line rounded-2xl bg-surface-raised overflow-hidden shadow-soft-sm ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div key={item.id} className="transition-colors">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-heading hover:bg-surface-sunken transition-colors min-h-[44px]"
            >
              <span>{item.title}</span>
              <ChevronDown
                className={`w-4 h-4 text-muted transition-transform duration-200 ${
                  isOpen ? 'transform rotate-180 text-primary' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-sm text-secondary leading-relaxed border-t border-line">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
