/**
 * Eco-Score Calculation Engine
 * Transparent, verifiable 0-100 environmental scoring system
 * 
 * Weights:
 * - Material: 30%
 * - Packaging: 20%
 * - Carbon Footprint: 25%
 * - Certifications: 15%
 * - Shipping / Distance: 10%
 */

export function calculateEcoScore(product) {
  if (!product) return null;

  // 1. Material Evaluation (Max 30)
  let materialScore = 6;
  const matLower = (product.material || '').toLowerCase();
  
  if (
    matLower.includes('bamboo') ||
    matLower.includes('organic cotton') ||
    matLower.includes('hemp') ||
    matLower.includes('jute') ||
    matLower.includes('coconut') ||
    matLower.includes('beeswax') ||
    matLower.includes('salvaged') ||
    matLower.includes('reclaimed') ||
    matLower.includes('clay') ||
    matLower.includes('terracotta') ||
    matLower.includes('cotton rag') ||
    matLower.includes('khadi') ||
    matLower.includes('ahimsa') ||
    matLower.includes('shea butter')
  ) {
    materialScore = product.certifications && product.certifications.length > 0 ? 30 : 28;
  } else if (
    matLower.includes('copper') ||
    matLower.includes('brass') ||
    matLower.includes('recycled') ||
    matLower.includes('upcycled') ||
    matLower.includes('newsprint')
  ) {
    materialScore = 25;
  } else if (
    matLower.includes('melamine') ||
    matLower.includes('pvc') ||
    matLower.includes('polystyrene') ||
    matLower.includes('polyester') ||
    matLower.includes('polyurethane') ||
    matLower.includes('acrylic') ||
    matLower.includes('virgin')
  ) {
    materialScore = 5;
  } else {
    materialScore = product.isEcoFriendly ? 22 : 8;
  }

  // 2. Packaging Evaluation (Max 20)
  let packagingScore = 3;
  let packagingExplanation = 'Virgin single-use plastic packaging';
  if (product.packaging === 'plastic-free') {
    packagingScore = 20;
    packagingExplanation = '100% plastic-free, biodegradable / plant seed packaging';
  } else if (product.packaging === 'recycled') {
    packagingScore = 14;
    packagingExplanation = 'Post-consumer recycled paper / infinite recyclable tin packaging';
  } else {
    packagingScore = 3;
    packagingExplanation = 'Conventional virgin plastic wrapper / blister packaging';
  }

  // 3. Carbon Footprint Evaluation (Max 25)
  let carbonScore = 3;
  const carbon = Number(product.carbonKg || 0);
  let carbonExplanation = '';

  if (carbon <= 0.4) {
    carbonScore = 25;
    carbonExplanation = `Ultra-low emission profile (${carbon} kg CO2e)`;
  } else if (carbon <= 0.8) {
    carbonScore = 21;
    carbonExplanation = `Low carbon lifecycle footprint (${carbon} kg CO2e)`;
  } else if (carbon <= 1.5) {
    carbonScore = 17;
    carbonExplanation = `Moderate carbon intensity (${carbon} kg CO2e)`;
  } else if (carbon <= 3.0) {
    carbonScore = 11;
    carbonExplanation = `Elevated lifecycle carbon emissions (${carbon} kg CO2e)`;
  } else {
    carbonScore = 4;
    carbonExplanation = `High petrochemical carbon footprint (${carbon} kg CO2e)`;
  }

  // 4. Certifications Evaluation (Max 15)
  const certCount = Array.isArray(product.certifications) ? product.certifications.length : 0;
  let certScore = 2;
  let certExplanation = 'No independent eco-credentials listed';

  if (certCount >= 3) {
    certScore = 15;
    certExplanation = `Listed by seller (sample data): 3+ credentials (${product.certifications.join(', ')})`;
  } else if (certCount === 2) {
    certScore = 12;
    certExplanation = `Listed by seller (sample data): 2 credentials (${product.certifications.join(', ')})`;
  } else if (certCount === 1) {
    certScore = 8;
    certExplanation = `Listed by seller (sample data): ${product.certifications[0]}`;
  } else {
    certScore = 2;
  }

  // 5. Shipping & Distance Evaluation (Max 10)
  const distance = Number(product.madeInKm || 1000);
  let shippingScore = 2;
  let shippingExplanation = '';

  if (distance <= 150) {
    shippingScore = 10;
    shippingExplanation = `Hyperlocal craft community (${distance} km radius)`;
  } else if (distance <= 400) {
    shippingScore = 8;
    shippingExplanation = `Regional domestic sourcing (${distance} km)`;
  } else if (distance <= 1000) {
    shippingScore = 6;
    shippingExplanation = `National domestic supply chain (${distance} km)`;
  } else if (distance <= 2000) {
    shippingScore = 4;
    shippingExplanation = `Long-haul interstate freight (${distance} km)`;
  } else {
    shippingScore = 2;
    shippingExplanation = `High-mileage freight transport (${distance} km)`;
  }

  // Calculate Total (0 - 100)
  const totalScore = Math.min(
    100,
    Math.max(0, Math.round(materialScore + packagingScore + carbonScore + certScore + shippingScore))
  );

  // Grade mapping with semantic theme tokens
  let grade = 'E';
  let gradeLabel = 'Conventional';
  let colorTheme = {
    badge: 'bg-danger/10 text-danger border-danger/30',
    dot: 'bg-danger',
    bar: 'bg-danger',
    text: 'text-danger',
    border: 'border-danger/50'
  };

  if (totalScore >= 85) {
    grade = 'A';
    gradeLabel = 'Exceptional Eco-Standard';
    colorTheme = {
      badge: 'bg-primary/10 text-primary border-primary/30',
      dot: 'bg-primary',
      bar: 'bg-primary',
      text: 'text-primary',
      border: 'border-primary/50'
    };
  } else if (totalScore >= 70) {
    grade = 'B';
    gradeLabel = 'Very Good Sustainable Pick';
    colorTheme = {
      badge: 'bg-accent/10 text-accent border-accent/30',
      dot: 'bg-accent',
      bar: 'bg-accent',
      text: 'text-accent',
      border: 'border-accent/50'
    };
  } else if (totalScore >= 55) {
    grade = 'C';
    gradeLabel = 'Moderate Environmental Impact';
    colorTheme = {
      badge: 'bg-warning/10 text-warning border-warning/30',
      dot: 'bg-warning',
      bar: 'bg-warning',
      text: 'text-warning',
      border: 'border-warning/50'
    };
  } else if (totalScore >= 40) {
    grade = 'D';
    gradeLabel = 'High Resource Intensity';
    colorTheme = {
      badge: 'bg-warning/10 text-warning border-warning/30',
      dot: 'bg-warning',
      bar: 'bg-warning',
      text: 'text-warning',
      border: 'border-warning/50'
    };
  }

  // Data completeness & uncertainty margin (Feature 10: Uncertainty Bands)
  const hasSpecificLca = Boolean(product.lcaVerified || certCount >= 2);
  const uncertaintyMargin = hasSpecificLca ? 4 : certCount === 1 ? 7 : 12;
  const minScore = Math.max(0, totalScore - uncertaintyMargin);
  const maxScore = Math.min(100, totalScore + uncertaintyMargin);
  const uncertaintyReason = hasSpecificLca
    ? 'Narrow ±4 pt margin: Backed by multiple independent third-party certifications and published lifecycle factors.'
    : certCount === 1
      ? 'Moderate ±7 pt margin: Backed by single claimed certification; batch-level supply chain audit pending.'
      : 'Broader ±12 pt margin: Derived from general material category benchmarks rather than verified supplier disclosures.';

  return {
    score: totalScore,
    minScore,
    maxScore,
    uncertaintyMargin,
    uncertaintyReason,
    uncertaintyBand: `[${minScore} - ${maxScore}]`,
    grade,
    gradeLabel,
    colorTheme,
    breakdown: {
      material: {
        score: materialScore,
        max: 30,
        weight: '30%',
        name: 'Renewable & Organic Materials',
        explanation: `${product.material} (${materialScore}/30 pts)`
      },
      packaging: {
        score: packagingScore,
        max: 20,
        weight: '20%',
        name: 'Plastic-Free Packaging',
        explanation: packagingExplanation
      },
      carbon: {
        score: carbonScore,
        max: 25,
        weight: '25%',
        name: 'Carbon Lifecycle Footprint',
        explanation: carbonExplanation
      },
      certifications: {
        score: certScore,
        max: 15,
        weight: '15%',
        name: 'Third-Party Certifications',
        explanation: certExplanation
      },
      shipping: {
        score: shippingScore,
        max: 10,
        weight: '10%',
        name: 'Local Transport & Proximity',
        explanation: shippingExplanation
      }
    }
  };
}

/**
 * Compare two products (e.g., eco vs conventional swap)
 */
export function compareProductImpact(greenerProduct, conventionalProduct) {
  if (!greenerProduct || !conventionalProduct) return null;

  const greenScore = calculateEcoScore(greenerProduct);
  const convScore = calculateEcoScore(conventionalProduct);

  const co2Saved = Math.max(0, (conventionalProduct.carbonKg || 0) - (greenerProduct.carbonKg || 0));
  const plasticSaved = Math.max(0, (conventionalProduct.plasticGrams || 0) - (greenerProduct.plasticGrams || 0));
  const waterSaved = Math.max(0, (conventionalProduct.waterLitres || 0) - (greenerProduct.waterLitres || 0));
  const priceDiff = (greenerProduct.price || 0) - (conventionalProduct.price || 0);

  return {
    greenerProduct,
    conventionalProduct,
    greenScore,
    convScore,
    scoreImprovement: greenScore.score - convScore.score,
    co2Saved: Number(co2Saved.toFixed(2)),
    plasticSaved: Math.round(plasticSaved),
    waterSaved: Math.round(waterSaved),
    priceDiff,
    priceLabel: priceDiff > 0 ? `₹${priceDiff} more` : priceDiff < 0 ? `₹${Math.abs(priceDiff)} cheaper` : 'same price',
    summary: `Saves ${co2Saved.toFixed(1)} kg CO2 and ${Math.round(plasticSaved)}g plastic (${priceDiff > 0 ? `costs ₹${priceDiff} more` : 'better value!'})`
  };
}

/**
 * Detects potential greenwashing in a product.
 * Flags products whose name/description use words like eco, green, natural, sustainable,
 * but have no certifications and have a low EcoScore (< 65).
 * Does NOT flag products that have verified third-party certifications.
 */
export function detectGreenwashing(product) {
  if (!product) return { isGreenwashed: false, reason: '' };

  const certCount = Array.isArray(product.certifications) ? product.certifications.length : 0;
  // Well-certified products are verified - never flag
  if (certCount >= 1) {
    return { isGreenwashed: false, reason: '' };
  }

  const scoreData = calculateEcoScore(product);
  const score = scoreData ? scoreData.score : (product.isEcoFriendly ? 75 : 40);

  const text = `${product.name || ''} ${product.description || ''} ${(product.ecoHighlights || []).join(' ')}`.toLowerCase();
  const buzzwords = ['eco', 'green', 'natural', 'sustainable', 'pure', 'earth', 'clean', 'bio', 'organic', 'herbal'];

  const foundBuzzwords = buzzwords.filter((bw) => {
    const rx = new RegExp(`(^|[^a-zA-Z0-9])${bw}([^a-zA-Z0-9]|$)`, 'i');
    return rx.test(text);
  });

  if (foundBuzzwords.length > 0 && score < 65) {
    return {
      isGreenwashed: true,
      score,
      buzzwords: foundBuzzwords,
      badgeText: 'Check the claims',
      reason: `Claims "${foundBuzzwords.slice(0, 2).join(' / ')}" with zero verified certifications and low EcoScore (${score}/100).`
    };
  }

  return { isGreenwashed: false, reason: '' };
}

