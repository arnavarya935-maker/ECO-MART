import React, { useState } from 'react';
import { BookOpen, HelpCircle, Info, Sparkles } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

const GLOSSARY_TERMS = [
  { term: 'Circular Economy', definition: 'An economic model designed to eliminate waste and pollution by keeping materials and products in biological or technical circulation endlessly.', category: 'Framework' },
  { term: 'Cradle-to-Cradle', definition: 'A design framework considering a product’s entire lifecycle, ensuring everything returns safely to the soil as a biological nutrient or is infinitely recycled.', category: 'Design' },
  { term: 'GOTS Certified', definition: 'Global Organic Textile Standard. The world’s highest certification for organic fibres, forbidding toxic dyes, synthetic pesticides, and child labour.', category: 'Certification' },
  { term: 'Embodied Carbon', definition: 'The sum of all greenhouse gas emissions generated during material extraction, processing, manufacturing, and transport before a product is used.', category: 'Science' },
  { term: 'Greenwashing', definition: 'Misleading marketing that exaggerates or fabricates environmental friendliness without verified metrics or independent audit data.', category: 'Audit' },
  { term: 'Microplastics', definition: 'Microscopic plastic fragments (<5mm) shedding from synthetic polyester clothing, cosmetic microbeads, and degrading plastic packaging into waterways and food chains.', category: 'Pollution' },
  { term: 'FSC Certified', definition: 'Forest Stewardship Council certification ensuring bamboo and wood are harvested from responsibly managed forests that provide environmental and social benefits.', category: 'Certification' },
  { term: 'Food Miles', definition: 'The distance food or raw materials travel from production to the consumer. EcoMart prioritizes local regional artisan clusters under 800km.', category: 'Logistics' }
];

export default function EcoGlossary() {
  const [selectedTerm, setSelectedTerm] = useState(GLOSSARY_TERMS[0]);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-md max-w-3xl mx-auto space-y-6">
      <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
          Knowledge Base
        </span>
        <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 mt-2">
          Eco Glossary & Jargon Decoder
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Hover over or click any term to demystify environmental science and certification acronyms.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {GLOSSARY_TERMS.map((item) => {
          const isSelected = selectedTerm.term === item.term;
          return (
            <Tooltip key={item.term} content={item.definition} position="top">
              <button
                type="button"
                onClick={() => setSelectedTerm(item)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                <span>{item.term}</span>
                <HelpCircle className="w-3 h-3 opacity-60" />
              </button>
            </Tooltip>
          );
        })}
      </div>

      {selectedTerm && (
        <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-black text-emerald-950 dark:text-emerald-200">
              {selectedTerm.term}
            </h4>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
              {selectedTerm.category}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
            {selectedTerm.definition}
          </p>
        </div>
      )}
    </div>
  );
}
