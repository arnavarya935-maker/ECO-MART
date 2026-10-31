import { calculateEcoScore } from './ecoScore.js';

/**
 * Calculates environmental savings and plain-language equivalents for cart items
 * compared to conventional alternatives.
 */
export function calculateCartImpact(cartItems, allProducts) {
  if (!cartItems || cartItems.length === 0) {
    return {
      totalItems: 0,
      totalPrice: 0,
      co2Saved: 0,
      plasticAvoided: 0,
      waterSaved: 0,
      savedCo2: 0,
      totalCo2SavedKg: 0,
      totalPlasticSavedGrams: 0,
      totalWaterSavedLitres: 0,
      averageEcoScore: 0,
      averageScore: 0,
      averageGrade: 'N/A',
      grade: 'N/A',
      ecoPoints: 0,
      equivalents: {
        plasticBottles: 0,
        carKm: 0,
        daysDrinkingWater: 0,
        treeMonths: 0
      },
      badges: [],
      potentialSwaps: []
    };
  }

  const productMap = new Map((allProducts || []).map((p) => [p.id, p]));

  let totalPrice = 0;
  let totalCount = 0;
  let totalScoreSum = 0;
  let co2SavedSum = 0;
  let plasticAvoidedSum = 0;
  let waterSavedSum = 0;
  let plasticPackagingCount = 0;
  const potentialSwaps = [];

  cartItems.forEach((item) => {
    const product = item.product || item;
    const qty = item.quantity || 1;

    totalPrice += (product.price || 0) * qty;
    totalCount += qty;

    const ecoStats = calculateEcoScore(product);
    totalScoreSum += (ecoStats ? ecoStats.score : 50) * qty;

    if (product.packaging === 'plastic') {
      plasticPackagingCount += qty;
    }

    // Check if this item is conventional and has a greener swap
    if (!product.isEcoFriendly && product.conventionalAlternativeId) {
      const greener = productMap.get(product.conventionalAlternativeId);
      if (greener) {
        potentialSwaps.push({
          cartItem: item,
          conventional: product,
          greenerAlternative: greener,
          qty
        });
      }
    }

    // Savings computation
    if (product.isEcoFriendly) {
      let baselineCarbon = (product.carbonKg || 0) * 4.5;
      let baselinePlastic = 150;
      let baselineWater = (product.waterLitres || 0) * 3;

      if (product.conventionalAlternativeId) {
        const conv = productMap.get(product.conventionalAlternativeId);
        if (conv) {
          baselineCarbon = conv.carbonKg || baselineCarbon;
          baselinePlastic = conv.plasticGrams || baselinePlastic;
          baselineWater = conv.waterLitres || baselineWater;
        }
      }

      const itemCo2Saved = Math.max(0, baselineCarbon - (product.carbonKg || 0)) * qty;
      const itemPlasticAvoided = Math.max(0, baselinePlastic - (product.plasticGrams || 0)) * qty;
      const itemWaterSaved = Math.max(0, baselineWater - (product.waterLitres || 0)) * qty;

      co2SavedSum += itemCo2Saved;
      plasticAvoidedSum += itemPlasticAvoided;
      waterSavedSum += itemWaterSaved;
    }
  });

  const avgScore = totalCount > 0 ? Math.round(totalScoreSum / totalCount) : 0;

  // Grade of whole cart
  let averageGrade = 'E';
  if (avgScore >= 85) averageGrade = 'A';
  else if (avgScore >= 70) averageGrade = 'B';
  else if (avgScore >= 55) averageGrade = 'C';
  else if (avgScore >= 40) averageGrade = 'D';

  // Badges Earned
  const badges = [];
  if (avgScore >= 50 && totalCount >= 1) {
    badges.push({
      id: 'starter',
      name: 'Green Starter',
      description: 'First steps towards responsible conscious shopping',
      icon: '🌱',
      level: 1,
      unlocked: true,
      accent: 'emerald'
    });
  }
  if (avgScore >= 75 && totalCount >= 2) {
    badges.push({
      id: 'protector',
      name: 'Planet Protector',
      description: 'Cart maintains an average Grade B or above',
      icon: '🛡️',
      level: 2,
      unlocked: true,
      accent: 'teal'
    });
  }
  if (avgScore >= 85 && plasticPackagingCount === 0 && totalCount >= 2) {
    badges.push({
      id: 'champion',
      name: 'Eco Champion',
      description: 'Masterclass zero-waste cart with plastic-free packaging',
      icon: '👑',
      level: 3,
      unlocked: true,
      accent: 'amber'
    });
  }

  // Plain-language real-world equivalents
  const plasticBottles = Math.floor(plasticAvoidedSum / 20); // 1 500ml PET bottle ≈ 20g
  const carKm = Number((co2SavedSum / 0.12).toFixed(1)); // 1 km avg car ≈ 120g CO2
  const daysDrinkingWater = Math.floor(waterSavedSum / 3); // 3L daily consumption
  const treeMonths = Number(((co2SavedSum / 21) * 12).toFixed(1)); // Mature tree absorbs ~21kg/year

  const ecoPoints = Math.round(avgScore * totalCount * 12);

  const co2SavedNum = Number(co2SavedSum.toFixed(2));
  const plasticAvoidedNum = Math.round(plasticAvoidedSum);
  const waterSavedNum = Math.round(waterSavedSum);

  return {
    totalItems: totalCount,
    totalPrice,
    co2Saved: co2SavedNum,
    plasticAvoided: plasticAvoidedNum,
    waterSaved: waterSavedNum,
    savedCo2: co2SavedNum,
    totalCo2SavedKg: co2SavedNum,
    totalPlasticSavedGrams: plasticAvoidedNum,
    totalWaterSavedLitres: waterSavedNum,
    averageEcoScore: avgScore,
    averageScore: avgScore,
    averageGrade,
    grade: averageGrade,
    ecoPoints,
    equivalents: {
      plasticBottles,
      carKm,
      daysDrinkingWater,
      treeMonths
    },
    badges,
    potentialSwaps
  };
}
