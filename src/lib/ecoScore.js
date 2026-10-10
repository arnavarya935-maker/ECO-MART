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
  let certExplanation = 'No independent eco-credentials verified';

  if (certCount >= 3) {
    certScore = 15;
    certExplanation = `Verified by 3+ rigorous standards: ${product.certifications.join(', ')}`;
  } else if (certCount === 2) {
    certScore = 12;
    certExplanation = `Certified by 2 standards: ${product.certifications.join(', ')}`;
  } else if (certCount === 1) {
    certScore = 8;
    certExplanation = `Single eco-standard verified: ${product.certifications[0]}`;
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

  // Grade mapping
  let grade = 'E';
  let gradeLabel = 'Conventional';
  let colorTheme = {
    badge: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    dot: 'bg-rose-500',
    bar: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-400'
  };

  if (totalScore >= 85) {
    grade = 'A';
    gradeLabel = 'Exceptional Eco-Standard';
    colorTheme = {
      badge: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800',
      dot: 'bg-emerald-600',
      bar: 'bg-emerald-600',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-500'
    };
  } else if (totalScore >= 70) {
    grade = 'B';
    gradeLabel = 'Very Good Sustainable Pick';
    colorTheme = {
      badge: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/60 dark:text-teal-200 dark:border-teal-800',
      dot: 'bg-teal-600',
      bar: 'bg-teal-600',
      text: 'text-teal-700 dark:text-teal-400',
      border: 'border-teal-500'
    };
  } else if (totalScore >= 55) {
    grade = 'C';
    gradeLabel = 'Moderate Environmental Impact';
    colorTheme = {
      badge: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800',
      dot: 'bg-amber-500',
      bar: 'bg-amber-500',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-500'
    };
  } else if (totalScore >= 40) {
    grade = 'D';
    gradeLabel = 'High Resource Intensity';
    colorTheme = {
      badge: 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/60 dark:text-orange-200 dark:border-orange-800',
      dot: 'bg-orange-500',
      bar: 'bg-orange-500',
      text: 'text-orange-700 dark:text-orange-400',
      border: 'border-orange-500'
    };
  }

  return {
    score: totalScore,
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
