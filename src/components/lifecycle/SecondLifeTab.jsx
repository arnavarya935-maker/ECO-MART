import React from 'react';
import {
  RotateCcw,
  Wrench,
  Trash2,
  Leaf,
  Sparkles,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

/**
 * Circular Guidance Directory by Product Category
 */
const CATEGORY_SECOND_LIFE_RULES = {
  Kitchen: {
    reuse: 'Repurpose as plant starter pots, spice holders, or workshop hardware organizers once food-contact seal degrades.',
    repair: 'Treat bamboo and wooden surfaces with cold-pressed coconut oil or beeswax polish every 6 months to prevent cracking. Tighten screws or replace silicone rings on lids.',
    dispose: 'Pure bamboo or coconut shell components are 100% home-compostable (break into small chunks to decompose in 90-120 days). Metals (stainless steel, copper) should be handed to local dry scrap recyclers (kabadiwala) for infinite remelting.',
    decompositionTime: '90–120 days (organic parts) / 100% recyclable (metal)',
    conventionalCompare: 'Conventional plastic containers take 450+ years to fragment into toxic microplastics.'
  },
  'Personal Care': {
    reuse: 'Repurpose empty glass jars or aluminum tins for travel balms, jewelry, seed storage, or desk clips.',
    repair: 'For bamboo toothbrushes, pluck nylon bristles with pliers before composting the handle. Replace safety razor blades every 5-7 shaves and collect old blades in a sealed tin for scrap metal recycling.',
    dispose: 'Pure organic soap bars and castile formulations dissolve safely in municipal greywater with zero aquatic toxicity. Compost the untreated neem or bamboo handles directly in garden soil.',
    decompositionTime: 'Handle: 4–6 months in soil / Razor body: Lifetime reusable',
    conventionalCompare: 'Plastic toothbrushes and multi-blade cartridges never biodegrade in landfills.'
  },
  Fashion: {
    reuse: 'When garments reach the end of wearable life, cut into cleaning dusters, braided doormats, or cushion filling.',
    repair: 'Patch tears with sashiko stitching; replace loose buttons or zip pulls. Wash cold and sun-dry to preserve organic cotton/linen fibers for twice the lifespan.',
    dispose: 'Pure 100% unblended organic cotton and jute can be shredded and composted in aerobic soil pits; they turn into nutrient-rich humus within 5 months.',
    decompositionTime: '3–5 months for 100% organic unblended fibers',
    conventionalCompare: 'Polyester and nylon fast fashion sheds 700,000 microfibers per wash and persists 200+ years.'
  },
  Stationery: {
    reuse: 'Repurpose sturdy notebook covers into greeting cards, bookmarks, or receipt portfolios.',
    repair: 'Refill pens with non-toxic soy or water-based ink. Flatten curled recycled pages under heavy books.',
    dispose: 'If using plantable seed-paper notebooks: tear pages into small strips, embed in loose potting soil, keep moist, and watch marigold/basil seeds sprout in 7-14 days. Metal spiral binders go to paper/metal recycling.',
    decompositionTime: '30–45 days (paper biodegrades into soil nutrients)',
    conventionalCompare: 'Plastic ballpens and PVC laminated notebooks choke municipal solid waste streams.'
  },
  Home: {
    reuse: 'Soy and beeswax candle jars become aesthetic drinking tumblers, pencil holders, or succulent planters after pouring boiling water to remove residue wax.',
    repair: 'Sand rough wooden coasters lightly and reseal with linseed oil. Dust soy candle wicks before lighting.',
    dispose: 'Residual vegetable/soy wax is non-toxic and home-compostable. Clean glass containers can be recycled infinitely without quality degradation.',
    decompositionTime: 'Wax: 60 days / Glass: 100% infinitely recyclable',
    conventionalCompare: 'Paraffin candles release benzene and toluene; plastic decor never breaks down.'
  },
  Bags: {
    reuse: 'Use durable canvas totes for grocery trips, laundry sorting, or trunk car organization.',
    repair: 'Reinforce handle stress points with heavy thread. Wax canvas bags with natural beeswax bar to renew waterproof coating.',
    dispose: 'Raw jute and organic cotton canvas decompose cleanly in compost within 120 days. Cut out any metal grommets for metal recycling first.',
    decompositionTime: '4–6 months in municipal organic waste',
    conventionalCompare: 'Single-use polyethylene polybags persist for centuries, choking urban drains.'
  }
};

const DEFAULT_RULE = {
  reuse: 'Extend product life by finding secondary utility in home storage, organization, or upcycled craft projects.',
  repair: 'Regular cleaning, tightening loose fasteners, and storing away from direct moisture multiplies product lifespan.',
  dispose: 'Separate natural bio-degradable fibers from metals or silicone parts. Dispose bio-materials into compost and dry recyclables to local scrap collectors.',
  decompositionTime: 'Category-dependent clean lifecycle',
  conventionalCompare: 'Conventional petroleum-based goods remain in landfills indefinitely.'
};

export default function SecondLifeTab({ product }) {
  if (!product) return null;

  const categoryRules = CATEGORY_SECOND_LIFE_RULES[product.category] || DEFAULT_RULE;

  const steps = [
    {
      num: '01',
      title: 'Reuse & Upcycle',
      subtitle: 'Extend primary utility',
      icon: RotateCcw,
      accent: 'emerald',
      content: categoryRules.reuse,
      actionPrompt: 'Look for second-life utility before discarding.'
    },
    {
      num: '02',
      title: 'Repair or Recycle',
      subtitle: 'Keep materials in loop',
      icon: Wrench,
      accent: 'teal',
      content: categoryRules.repair,
      actionPrompt: 'Perform basic maintenance to double active lifespan.'
    },
    {
      num: '03',
      title: 'Dispose Responsibly',
      subtitle: 'Zero toxic landfill legacy',
      icon: Trash2,
      accent: 'amber',
      content: categoryRules.dispose,
      actionPrompt: 'Segregate natural compostables from dry recyclables.'
    }
  ];

  return (
    <div className="space-y-6 text-text font-sans">
      {/* Intro Header */}
      <div className="p-4 rounded-2xl bg-surface-raised border border-line flex items-start justify-between gap-3 shadow-soft-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-heading flex items-center gap-2">
              <span>Second Life: Circular Economy Path</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                {product.category}
              </span>
            </h4>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              Responsible AI considers product end-of-life before purchase. Here is the verified 3-step circular trajectory for <strong>{product.name}</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* 3-Step Visual Path */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="p-4 rounded-2xl bg-surface-raised border border-line flex flex-col justify-between space-y-3 shadow-card hover:border-emerald-500/30 transition-all group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-surface-sunken border border-line flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs font-bold text-text-muted">
                    STEP {s.num}
                  </span>
                </div>

                <div>
                  <h5 className="font-sans font-bold text-xs text-heading flex items-center gap-1.5">
                    <span>{s.title}</span>
                  </h5>
                  <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                    {s.subtitle}
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed pt-1">
                  {s.content}
                </p>
              </div>

              <div className="pt-2 border-t border-line/60 flex items-center gap-1.5 text-[10px] text-primary font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{s.actionPrompt}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparative Degradation Footprint */}
      <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-3">
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-400" />
          <h5 className="font-sans font-bold text-xs text-heading">
            Cradle-to-Grave Decomposition Analysis
          </h5>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-surface-raised border border-emerald-500/20 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400">This Product</span>
              <span className="text-[10px] font-mono text-text-muted">Verified</span>
            </div>
            <div className="font-serif font-bold text-heading text-sm">
              {categoryRules.decompositionTime}
            </div>
            <p className="text-[11px] text-text-secondary">
              Natural biomass or infinitely reclaimable closed-loop alloys.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-raised border border-rose-500/20 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-400">Conventional Alternative</span>
              <span className="text-[10px] font-mono text-text-muted">Fossil-based</span>
            </div>
            <div className="font-serif font-bold text-heading text-sm">
              450+ Years / Indefinite
            </div>
            <p className="text-[11px] text-text-secondary">
              {categoryRules.conventionalCompare}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-text-muted pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>
            CBSE AI Ethics guideline: Responsible shopping requires transparency regarding disposal impact and post-consumer handling.
          </span>
        </div>
      </div>
    </div>
  );
}
