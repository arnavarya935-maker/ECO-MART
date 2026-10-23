import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import CategoryCarbonBarChart from '../src/components/impact/CategoryCarbonBarChart.jsx';
import HabitLineChart from '../src/components/impact/HabitLineChart.jsx';
import TrustScoreHistogram from '../src/components/impact/TrustScoreHistogram.jsx';
import WhatIfCartSimulator from '../src/components/impact/WhatIfCartSimulator.jsx';
import { CartProvider } from '../src/context/CartContext.jsx';

function renderWithProviders(component) {
  return renderToString(
    <CartProvider>
      {component}
    </CartProvider>
  );
}

describe('Feature 1 & 2: Impact Command Center & What-If Simulator', () => {
  it('renders CategoryCarbonBarChart with drilldown and table view support', () => {
    const html = renderWithProviders(<CategoryCarbonBarChart />);
    expect(html).toContain('Lifecycle Impact by Product Category');
    expect(html).toContain('View as Table');
    expect(html).toContain('Computed from 64 SKUs');
    expect(html).toContain('CO₂e');
    expect(html).toContain('Plastic');
    expect(html).toContain('Water');
  });

  it('renders HabitLineChart with compound trajectory and timeframe selector', () => {
    const html = renderWithProviders(<HabitLineChart />);
    expect(html).toContain('Trajectory');
    expect(html).toContain('View Table');
    expect(html).toContain('Compound Habit Model');
    expect(html).toContain('Cumulative');
    expect(html).toContain('Week 1');
  });

  it('renders TrustScoreHistogram with calibrated bins from 0 to 100', () => {
    const html = renderWithProviders(<TrustScoreHistogram />);
    expect(html).toContain('Greenwashing Trust Score Distribution');
    expect(html).toContain('View as Table');
    expect(html).toContain('Severe Greenwashing Risk');
    expect(html).toContain('Verified Sustainable');
  });

  it('renders WhatIfCartSimulator with sliders, delta badges, and 1-tap swap buttons', () => {
    const html = renderWithProviders(<WhatIfCartSimulator />);
    expect(html).toContain('What-If Cart Simulator');
    expect(html).toContain('Swap All to Eco');
    expect(html).toContain('CO₂ Emission Delta');
    expect(html).toContain('Plastic Waste Diverted');
    expect(html).toContain('Freshwater Conserved');
    expect(html).toContain('Swap to Eco Choice');
  });
});
