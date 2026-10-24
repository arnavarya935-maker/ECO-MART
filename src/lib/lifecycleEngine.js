/**
 * Product Lifecycle Calculation Engine
 * Local-First: Derives stage data honestly from product attributes
 */

/**
 * Generates the 5 lifecycle stages for a product
 * @param {Object} product
 * @param {Array} [allProducts]
 * @returns {Array} Array of 5 stages
 */
export function getProductLifecycleStages(product, allProducts = []) {
  if (!product) return [];

  // Find conventional alternative if available
  const convId = product.conventionalAlternativeId || product.conventionalId;
  const conventionalItem = convId ? allProducts.find((p) => p.id === convId) : null;

  return [
    {
      id: 'material',
      name: 'Material',
      ecoTitle: product.material || 'Organic / Sustainable Material',
      ecoMetric: `${product.waterLitres ?? 15}L water consumed`,
      ecoMetricType: 'Estimate',
      ecoDetail: product.certifications?.length
        ? `Certified: ${product.certifications.join(', ')}`
        : 'Sourced with sustainable harvest practices',
      ecoDetailType: 'Qualitative',
      convTitle: conventionalItem ? conventionalItem.material : 'Petroleum-based Synthetic Material',
      convMetric: `${conventionalItem ? conventionalItem.waterLitres : 120}L water consumed`,
      convMetricType: 'Estimate',
      convDetail: 'Extracted from virgin non-renewable petrochemical feedstocks',
      convDetailType: 'Qualitative'
    },
    {
      id: 'making',
      name: 'Making',
      ecoTitle: 'Low-Impact Artisan Manufacturing',
      ecoMetric: `${((product.carbonKg || 0.4) * 0.5).toFixed(2)} kg CO₂e manufacturing`,
      ecoMetricType: 'Estimate',
      ecoDetail: 'Crafted without synthetic solvent baths or hazardous chlorofluorocarbons',
      ecoDetailType: 'Qualitative',
      convTitle: 'Industrial High-Heat Processing',
      convMetric: `${((conventionalItem?.carbonKg || 3.2) * 0.6).toFixed(2)} kg CO₂e manufacturing`,
      convMetricType: 'Estimate',
      convDetail: 'Energy-intensive thermal extrusion and chemical bleaching',
      convDetailType: 'Qualitative'
    },
    {
      id: 'transport',
      name: 'Transport',
      ecoTitle: `Regional Transit (~${product.madeInKm ?? 45} km haul)`,
      ecoMetric: `${((product.madeInKm ?? 45) * 0.00012).toFixed(3)} kg CO₂e freight`,
      ecoMetricType: 'Estimate',
      ecoDetail: 'Direct-from-artisan local ground transport minimizes fuel burning',
      ecoDetailType: 'Qualitative',
      convTitle: 'Global Maritime & Air Logistics (~4,500 km)',
      convMetric: `${(4500 * 0.00018).toFixed(2)} kg CO₂e freight`,
      convMetricType: 'Estimate',
      convDetail: 'Long-haul intercontinental maritime container shipping',
      convDetailType: 'Qualitative'
    },
    {
      id: 'packaging',
      name: 'Packaging',
      ecoTitle: product.packaging || 'Plastic-Free Kraft / Mycelium',
      ecoMetric: `${product.plasticGrams ?? 0}g plastic packaging`,
      ecoMetricType: 'Estimate',
      ecoDetail: 'Unbleached post-consumer recycled cardboard with soy-based ink',
      ecoDetailType: 'Qualitative',
      convTitle: 'Single-Use Virgin Plastic & Styrofoam',
      convMetric: `${conventionalItem ? conventionalItem.plasticGrams : 95}g plastic packaging`,
      convMetricType: 'Estimate',
      convDetail: 'Multi-layer non-recyclable shrink film and polystyrene bubble wrap',
      convDetailType: 'Qualitative'
    },
    {
      id: 'end-of-life',
      name: 'End of Life',
      ecoTitle: product.isEcoFriendly ? 'Compostable or Infinitely Recyclable' : 'Standard Disposal',
      ecoMetric: product.isEcoFriendly ? '0g persistent microplastics' : 'Elevated landfill volume',
      ecoMetricType: 'Estimate',
      ecoDetail: product.isEcoFriendly
        ? 'Breaks down naturally in municipal compost or returns safely to biological cycles'
        : 'Requires specialized separation facilities',
      ecoDetailType: 'Qualitative',
      convTitle: 'Landfill Accumulation (400+ years)',
      convMetric: `${conventionalItem?.plasticGrams || 95}g persistent plastic waste`,
      convMetricType: 'Estimate',
      convDetail: 'Slowly fragments into microplastics contaminating water tables and oceans',
      convDetailType: 'Qualitative'
    }
  ];
}
