/**
 * EcoMart Circularity, Packaging & Recycling Engine
 * Deterministic and Local-First.
 */

// City-specific municipal waste segregation guidelines
export const CITY_RECYCLING_GUIDES = [
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    authority: 'BBMP Solid Waste Management',
    wetWasteColor: 'Green Bin (Organic / Food / Kitchen)',
    dryWasteColor: 'Blue Bin or Clear Bag (Paper, Plastic, Metal, Glass)',
    sanitaryWasteColor: 'Red Marked Paper Bag',
    eWastePolicy: 'Designated BBMP Ward Dry Waste Collection Centres (DWCC) every Saturday.',
    specialRules: 'Strict plastic carry bag ban enforced. Biodegradable compostables collected daily.'
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    authority: 'BMC Solid Waste Management Department',
    wetWasteColor: 'Green Bin (Compostable Organics)',
    dryWasteColor: 'Blue Bin (Dry Recyclables)',
    sanitaryWasteColor: 'Red Hazard Wrap',
    eWastePolicy: 'Drop off at authorized MPCB recyclers and designated ward drop boxes.',
    specialRules: 'Bulk waste generators must mandate on-site wet waste composting pits.'
  },
  {
    city: 'Delhi NCR',
    state: 'Delhi',
    authority: 'MCD Waste Management',
    wetWasteColor: 'Green Bin (Wet Biodegradable)',
    dryWasteColor: 'Blue Bin (Dry Recyclable Packaging)',
    sanitaryWasteColor: 'Domestic Hazardous Red Bag',
    eWastePolicy: 'DPCC authorized collection centres and residential raddi-wallah scrap network.',
    specialRules: 'Single-use plastic banned under PWM Rules. Thermocol packaging prohibited.'
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    authority: 'GHMC Swachh Auto Tippers',
    wetWasteColor: 'Green Tub (Kitchen Organics)',
    dryWasteColor: 'Blue Tub (Dry Packaging)',
    sanitaryWasteColor: 'Separate paper wrapped package',
    eWastePolicy: 'GHMC dry resource collection centres in all 30 circles.',
    specialRules: 'Segregation at source strictly checked for gated communities and apartments.'
  },
  {
    city: 'Chennai',
    state: 'Tamil Nadu',
    authority: 'Greater Chennai Corporation (GCC)',
    wetWasteColor: 'Green Bin (Wet Micro-Compost Centres)',
    dryWasteColor: 'Blue Bin (Material Recovery Facilities)',
    sanitaryWasteColor: 'Incineration Red Bag',
    eWastePolicy: 'Quarterly GCC Ward e-waste collection drives and citizen drop-off kiosks.',
    specialRules: '100% door-to-door source segregation mandatory across all 15 zones.'
  }
];

// Repair and reuse guides by category
export const REPAIR_REUSE_GUIDES = [
  {
    category: 'Kitchen',
    itemType: 'Bamboo & Woodware (Cutting Boards, Bowls, Spatulas)',
    difficulty: 'Easy (1/5)',
    timeMinutes: 15,
    tools: ['Fine sandpaper (320-grit)', 'Food-grade mineral oil or walnut oil', 'Clean cloth'],
    steps: [
      'Gently sand down surface knife grooves or raised wood grain in the direction of the fibers.',
      'Wipe clean of all wood dust with a slightly damp cloth and let dry completely.',
      'Pour 1 teaspoon of food-safe oil and buff in circular motions until the grain glows.',
      'Allow 12 hours for deep polymer absorption before next water contact.'
    ],
    lifespanExtension: '+3 to 5 Years'
  },
  {
    category: 'Personal Care',
    itemType: 'Bamboo Toothbrushes & Hair Brushes',
    difficulty: 'Easy (1/5)',
    timeMinutes: 5,
    tools: ['Pliers', 'Boiling water / Sunlight'],
    steps: [
      'For ongoing hygiene, dip bristles in boiling water with a pinch of salt for 60 seconds once monthly.',
      'At end-of-life, grip bristles firmly with pliers and pull out bio-nylon tufts.',
      'Drop tufts in dry municipal bin; toss 100% bamboo body directly into home compost or garden soil as plant marker.'
    ],
    lifespanExtension: 'Replaces 4 plastic brushes yearly'
  },
  {
    category: 'Apparel',
    itemType: 'Organic Cotton Totes & Apparel',
    difficulty: 'Moderate (2/5)',
    timeMinutes: 20,
    tools: ['Embroidery needle', 'Organic cotton thread', 'Scrap fabric patch'],
    steps: [
      'Reinforce fraying handle stress-points with a heavy "box-X" stitch.',
      'For corner holes, place a contrast scrap patch on the inside and stitch around the perimeter (Sashiko-style visible mending).',
      'Wash in cold water on gentle cycle to preserve natural botanical fibers.'
    ],
    lifespanExtension: '+4 to 8 Years'
  },
  {
    category: 'Accessories',
    itemType: 'Copper Bottles & Stainless Steel Containers',
    difficulty: 'Easy (1/5)',
    timeMinutes: 10,
    tools: ['Lemon wedge or tamarind paste', 'Salt', 'Microfiber towel'],
    steps: [
      'Sprinkle salt over a cut lemon half and rub gently over oxidized copper patina.',
      'Rinse immediately with clean lukewarm water (do not use harsh abrasive wire wool).',
      'Replace silicone lid gasket rings every 2 years to maintain leakproof vacuum seal.'
    ],
    lifespanExtension: 'Decades / Lifetime item'
  }
];

/**
 * Packaging Recyclability Analyzer
 * Dissects packaging fields and computes recyclability grade
 * @param {string|Object} packaging
 * @returns {Object}
 */
export function analyzePackaging(packaging) {
  const text = typeof packaging === 'string' ? packaging.toLowerCase() : (packaging?.type || '').toLowerCase();

  if (text.includes('plastic-free') || text.includes('paper') || text.includes('card') || text.includes('kraft')) {
    return {
      status: 'High Recyclability / Compostable',
      grade: 'A',
      recyclabilityScore: 95,
      isPlasticFree: true,
      disposalStream: 'Dry Paper Recycling or Backyard Compost',
      curbPickup: 'Accepted in all municipal blue/dry paper bins',
      instructions: 'Flatten carton boxes. If free of synthetic lamination, tear and add to garden compost.'
    };
  }

  if (text.includes('recycled') || text.includes('glass') || text.includes('tin') || text.includes('metal')) {
    return {
      status: 'Circularity Compliant',
      grade: 'B',
      recyclabilityScore: 80,
      isPlasticFree: !text.includes('plastic'),
      disposalStream: 'Dry Recyclables (Metal / Glass / Paper)',
      curbPickup: 'Accepted in municipal dry resource centres',
      instructions: 'Rinse residual contents with water before placing in dry recyclables.'
    };
  }

  return {
    status: 'Mixed / Conventional Packaging',
    grade: 'D',
    recyclabilityScore: 40,
    isPlasticFree: false,
    disposalStream: 'Mixed Municipal Waste / EPR Return Drop',
    curbPickup: 'Check local city drop-off centre for multi-layer plastic (MLP)',
    instructions: 'Separate plastic caps and thin protective film from primary cardboard.'
  };
}

/**
 * Local-First Community Second Life Board Store
 */
export const SECOND_LIFE_INITIAL_POSTS = [
  {
    id: 'post-1',
    title: 'Surplus Glass Mason Jars (Pack of 6)',
    category: 'Kitchen',
    city: 'Bengaluru',
    area: 'Indiranagar',
    condition: 'Like New (Sterilized)',
    description: 'Upcycled clean salsa and honey jars, ideal for bulk pantry pulse storage or DIY candle making.',
    date: '2026-04-10'
  },
  {
    id: 'post-2',
    title: 'Heavyweight Canvas Shopping Totes (3x)',
    category: 'Accessories',
    city: 'Mumbai',
    area: 'Bandra West',
    condition: 'Gently Used',
    description: 'Sturdy unprinted organic cotton totes from zero-waste market runs. Freshly washed in gentle eco soap.',
    date: '2026-04-12'
  },
  {
    id: 'post-3',
    title: 'Terracotta Seedling Pots (8 units)',
    category: 'Garden',
    city: 'Delhi',
    area: 'Hauz Khas',
    condition: 'Good',
    description: 'Natural clay pots with drainage holes. Perfect for kitchen herb window sills.',
    date: '2026-04-15'
  }
];

export function getSecondLifePosts() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('ecomart_second_life_posts');
      if (raw) return JSON.parse(raw);
    }
  } catch {}
  return SECOND_LIFE_INITIAL_POSTS;
}

export function addSecondLifePost(post) {
  const newPost = {
    id: `post_${Date.now()}`,
    title: post.title.trim(),
    category: post.category || 'Home',
    city: post.city || 'Bengaluru',
    area: post.area || 'City Centre',
    condition: post.condition || 'Good',
    description: post.description || '',
    date: new Date().toISOString().split('T')[0]
  };

  const existing = getSecondLifePosts();
  const updated = [newPost, ...existing];

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('ecomart_second_life_posts', JSON.stringify(updated));
    }
  } catch {}
  return updated;
}

/**
 * Generate Proactive Weekly Eco Review from simulated/local cart history
 * @param {Array} orders
 * @param {Array} cartItems
 * @returns {Object}
 */
export function generateWeeklyEcoReview(orders = [], cartItems = []) {
  const orderCount = Array.isArray(orders) ? orders.length : 0;
  const itemCount = Array.isArray(cartItems) ? cartItems.length : 0;

  const co2Avoided = (orderCount * 2.8 + itemCount * 0.4).toFixed(1);
  const plasticAvoided = orderCount * 180 + itemCount * 35;

  let highlight = 'You consistently prioritized plastic-free packaging across your selected items.';
  let suggestedImprovement = 'Explore solid soap bars to eliminate pump bottles and reduce liquid transport weight.';

  if (itemCount > 0) {
    const hasPlasticItem = cartItems.some((i) => i.product && !i.product.isEcoFriendly);
    if (hasPlasticItem) {
      suggestedImprovement = 'You have 1 conventional item in your cart. Swapping to its certified zero-waste equivalent avoids ~1.2kg CO₂.';
    }
  }

  return {
    weekRange: 'Past 7 Days (Local Summary)',
    ordersAudited: orderCount,
    co2AvoidedKg: Number(co2Avoided),
    plasticAvoidedGrams: plasticAvoided,
    highlight,
    suggestedImprovement,
    disclaimer: 'Computed locally from your browser checkout history without server telemetry.'
  };
}

/**
 * Safe client-side Wishlist Export & Import
 */
export function exportWishlistCode(wishlistItems = []) {
  const ids = Array.isArray(wishlistItems) ? wishlistItems.map((p) => (p.id || p)) : [];
  const payload = JSON.stringify({ v: 1, ids, exp: Date.now() });
  return btoa(payload);
}

export function importWishlistCode(code = '') {
  try {
    const jsonStr = atob(code.trim());
    const parsed = JSON.parse(jsonStr);
    return Array.isArray(parsed.ids) ? parsed.ids : [];
  } catch {
    return [];
  }
}
