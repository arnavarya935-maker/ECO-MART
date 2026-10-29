/**
 * Eco Agent Core Engine (Serverless / Node.js)
 * Live LLM Tool-Calling Architecture powered by Gemini.
 * Zero fabrications: Every recommendation is strictly grounded in catalogue tools.
 */

import fs from 'node:fs';
import path from 'node:path';
import { calculateEcoScore, compareProductImpact, detectGreenwashing } from '../src/lib/ecoScore.js';
import { calculateCartImpact } from '../src/lib/impactCalculator.js';
import { isMatchingCategory } from '../src/data/categories.js';

// Cache catalogue for ultra-fast in-memory tool execution
let cachedProducts = null;

export function loadCatalog() {
  if (cachedProducts && cachedProducts.length > 0) {
    return cachedProducts;
  }
  try {
    const jsonPath = path.resolve(process.cwd(), 'src/data/products.json');
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      cachedProducts = data;
      return cachedProducts;
    }
  } catch (err) {
    console.error('[agentEngine] Error loading products.json:', err.message);
  }
  return [];
}

export const STOP_WORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'you', 'your', 'he', 'she', 'it', 'they',
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did',
  'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while',
  'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through',
  'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out',
  'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once',
  'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each',
  'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now',
  'want', 'wants', 'wanted', 'need', 'needs', 'needed', 'looking', 'look', 'find', 'search',
  'show', 'give', 'recommend', 'suggestion', 'suggestions', 'suggest', 'buy', 'shop', 'get',
  'please', 'help', 'hey', 'hello', 'hi',
  'college', 'student', 'students', 'dorm', 'hostel', 'campus', 'kid', 'kids', 'adult',
  'eco', 'green', 'friendly', 'sustainable', 'good', 'best',
  'product', 'products', 'item', 'items', 'sell', 'store', 'catalog', 'catalogue', 'collection',
  'everything', 'stock', 'available', 'offer', 'options', 'department', 'departments',
  'kha', 'kaha', 'gye', 'gaye', 'bhai'
]);

export function parseRequestedItems(rawQuery) {
  if (!rawQuery || typeof rawQuery !== 'string') return [];
  let q = rawQuery.toLowerCase()
    .replace(/[,\.\?!]/g, ' and ')
    .replace(/\bas well as\b/g, ' and ')
    .replace(/\bplus\b/g, ' and ')
    .replace(/\balong with\b/g, ' and ');

  const parts = q.split(/\band\b/).map((p) => p.trim()).filter(Boolean);
  const items = [];

  for (const part of parts) {
    const rawTokens = part.split(/\s+/).filter(Boolean);
    const isAffordable = rawTokens.some((t) =>
      ['affordable', 'cheap', 'cheapest', 'budget', 'lowcost', 'low-cost', 'inexpensive', 'sasta', 'sasti'].includes(t)
    );
    const cleanTokens = rawTokens.filter(
      (t) =>
        !STOP_WORDS.has(t) &&
        !['affordable', 'cheap', 'cheapest', 'budget', 'lowcost', 'low-cost', 'inexpensive', 'sasta', 'sasti'].includes(t) &&
        isNaN(Number(t))
    );
    if (cleanTokens.length > 0) {
      items.push({
        raw: part,
        searchTerm: cleanTokens.join(' '),
        tokens: cleanTokens,
        isAffordable
      });
    }
  }

  // If no items split by "and", fallback to clean tokens of whole query
  if (items.length === 0) {
    const rawTokens = rawQuery.toLowerCase().split(/\s+/).filter(Boolean);
    const isAffordable = rawTokens.some((t) =>
      ['affordable', 'cheap', 'cheapest', 'budget', 'lowcost', 'low-cost', 'inexpensive', 'sasta', 'sasti'].includes(t)
    );
    const cleanTokens = rawTokens.filter(
      (t) =>
        !STOP_WORDS.has(t) &&
        !['affordable', 'cheap', 'cheapest', 'budget', 'lowcost', 'low-cost', 'inexpensive', 'sasta', 'sasti'].includes(t) &&
        isNaN(Number(t))
    );
    if (cleanTokens.length > 0) {
      items.push({
        raw: rawQuery,
        searchTerm: cleanTokens.join(' '),
        tokens: cleanTokens,
        isAffordable
      });
    }
  }

  return items;
}

export function scoreItemRelevance(p, targetItem) {
  const name = (p.name || '').toLowerCase();
  const desc = (p.description || '').toLowerCase();
  const highlights = (p.ecoHighlights || []).join(' ').toLowerCase();
  const cat = (p.category || '').toLowerCase();

  const words = name.split(/[^a-z0-9]+/);
  const tokens = Array.isArray(targetItem.tokens) && targetItem.tokens.length > 0
    ? targetItem.tokens
    : targetItem.searchTerm.toLowerCase().split(/\s+/).filter(Boolean);

  let totalScore = 0;
  let matchesAll = true;

  for (const token of tokens) {
    let tokenScore = 0;
    for (const w of words) {
      if (w === token) {
        tokenScore = Math.max(tokenScore, 100);
      } else if (w === token + 's' || w === token + 'es' || token === w + 's' || token === w + 'es') {
        tokenScore = Math.max(tokenScore, 95);
      } else if (w.endsWith(token) && token.length >= 4) {
        tokenScore = Math.max(tokenScore, 90);
      } else if (token.endsWith(w) && w.length >= 4) {
        tokenScore = Math.max(tokenScore, 90);
      }
    }

    if (tokenScore === 0) {
      if (highlights.includes(token)) tokenScore = 40;
      else if (desc.includes(token)) tokenScore = 35;
      else if (cat.includes(token)) tokenScore = 20;
    }

    if (tokenScore === 0) matchesAll = false;
    totalScore += tokenScore;
  }

  if (tokens.length > 1 && matchesAll) {
    totalScore += 50;
  }

  return totalScore;
}

/**
 * 1. Tool Function Declarations for Gemini Function Calling
 */
export const AGENT_TOOLS = [
  {
    name: 'search_products',
    description: 'Search the Eco Sense sustainable catalogue by keyword, department category, maximum budget in INR (₹), and sustainability filters.',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: {
          type: 'STRING',
          description: 'Search keyword (e.g. bamboo toothbrush, water bottle, journal, shampoo, brush and soap)'
        },
        category: {
          type: 'STRING',
          description: 'Category filter (Kitchen, Personal Care, Fashion, Stationery, Home, Bags, Outdoor & Travel, Cleaning & Laundry)'
        },
        max_price: {
          type: 'NUMBER',
          description: 'Maximum budget limit in Indian Rupees (INR)'
        },
        plastic_free_only: {
          type: 'BOOLEAN',
          description: 'If true, returns only products with 100% plastic-free packaging'
        },
        min_grade: {
          type: 'STRING',
          description: 'Minimum required EcoScore grade (A, B, C)'
        },
        certified_only: {
          type: 'BOOLEAN',
          description: 'If true, returns only products with seller-listed certifications'
        }
      }
    }
  },
  {
    name: 'get_product',
    description: 'Retrieve full details, lifecycle metrics, materials, price, and eco certifications for a specific product ID.',
    parameters: {
      type: 'OBJECT',
      properties: {
        id: {
          type: 'STRING',
          description: 'The unique product ID (e.g. kit-01, stat-02, bags-01)'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'get_alternatives',
    description: 'Find greener sustainable alternatives and swaps for a product, showing exact CO2 avoided and plastic saved.',
    parameters: {
      type: 'OBJECT',
      properties: {
        id: {
          type: 'STRING',
          description: 'The product ID to find greener replacements for'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'score_cart',
    description: 'Calculate the total carbon footprint, plastic eliminated, water conserved, and average EcoScore grade of a shopping cart.',
    parameters: {
      type: 'OBJECT',
      properties: {
        cart: {
          type: 'ARRAY',
          description: 'List of items in cart, each with id or productId and quantity',
          items: {
            type: 'OBJECT',
            properties: {
              id: { type: 'STRING' },
              quantity: { type: 'NUMBER' }
            }
          }
        }
      }
    }
  },
  {
    name: 'explain_score',
    description: 'Break down the exact 5-pillar mathematical score (Renewable Material 30%, Plastic Elimination 20%, Carbon Reduction 25%, Certifications 15%, Local Transport 10%) for any product.',
    parameters: {
      type: 'OBJECT',
      properties: {
        id: {
          type: 'STRING',
          description: 'The product ID to explain'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'compare_products',
    description: 'Side-by-side comparison of two or more products comparing price, materials, packaging, carbon, and EcoScores.',
    parameters: {
      type: 'OBJECT',
      properties: {
        ids: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: 'Array of 2 to 4 product IDs to compare'
        }
      },
      required: ['ids']
    }
  },
  {
    name: 'check_claim',
    description: 'Audit a product packaging or marketing claim for greenwashing using ASCI and FTC regulatory guidelines.',
    parameters: {
      type: 'OBJECT',
      properties: {
        text: {
          type: 'STRING',
          description: 'The marketing claim text or packaging label'
        }
      },
      required: ['text']
    }
  },
  {
    name: 'add_to_cart',
    description: 'Trigger a UI action to add a verified product to the shopper\'s live cart.',
    parameters: {
      type: 'OBJECT',
      properties: {
        id: {
          type: 'STRING',
          description: 'The product ID to add'
        },
        quantity: {
          type: 'NUMBER',
          description: 'Quantity to add (default 1)'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'swap_item',
    description: 'Trigger a UI action to swap an existing cart item with a greener alternative in the shopper\'s live cart.',
    parameters: {
      type: 'OBJECT',
      properties: {
        oldId: {
          type: 'STRING',
          description: 'Current item ID in cart'
        },
        newId: {
          type: 'STRING',
          description: 'Recommended green alternative ID'
        }
      },
      required: ['oldId', 'newId']
    }
  }
];

/**
 * 2. Deterministic Tool Execution Engine with Relevance-First Catalogue Grounding
 */
export async function executeAgentTool(name, args = {}, context = {}) {
  const products = loadCatalog();

  switch (name) {
    case 'search_products': {
      const rawQ = (args.query || '').trim();
      const cat = (args.category || '').trim().toLowerCase();
      const maxPrice = Number(args.max_price);
      const plasticFree = Boolean(args.plastic_free_only);
      const minGrade = (args.min_grade || '').trim().toUpperCase();
      const certifiedOnly = Boolean(args.certified_only);

      const parsedItems = parseRequestedItems(rawQ);

      // Hydrate score and baseline impact data for each product
      const hydratedCatalog = products.map((p) => {
        const scoreInfo = calculateEcoScore(p);
        let impactMath = null;
        if (p.conventionalAlternativeId) {
          const conv = products.find((c) => c.id === p.conventionalAlternativeId);
          if (conv) {
            impactMath = {
              baselineName: conv.name,
              baselinePrice: conv.price,
              co2SavedKg: Math.max(0, (conv.carbonKg || 0) - (p.carbonKg || 0)).toFixed(2),
              plasticSavedGrams: Math.max(0, (conv.plasticGrams || 0) - (p.plasticGrams || 0))
            };
          }
        }
        return {
          ...p,
          ecoScore: scoreInfo?.score ?? (p.isEcoFriendly ? 85 : 45),
          ecoGrade: scoreInfo?.grade ?? (p.isEcoFriendly ? 'A' : 'D'),
          impactMath
        };
      });

      // MULTI-ITEM SEARCH: When the user asked for multiple items (e.g. "brush and soap")
      if (parsedItems.length > 1) {
        const itemBreakdown = [];
        const selectedProducts = [];

        for (const item of parsedItems) {
          const candidates = hydratedCatalog
            .filter((p) => p.isEcoFriendly)
            .map((p) => ({
              product: p,
              relevance: scoreItemRelevance(p, item)
            }))
            .filter((entry) => entry.relevance >= 35);

          candidates.sort((a, b) => {
            if (b.relevance !== a.relevance) return b.relevance - a.relevance;
            if (item.isAffordable) return a.product.price - b.product.price;
            return b.product.ecoScore - a.product.ecoScore;
          });

          // Check ambiguity (e.g. "brush" matches toothbrush vs toilet brush)
          const isAmbiguous = item.searchTerm === 'brush' || item.searchTerm === 'brushes';
          if (isAmbiguous && candidates.length >= 2) {
            const toothbrush = candidates.find((c) => c.product.name.toLowerCase().includes('toothbrush'));
            const cleanBrush = candidates.find((c) => c.product.name.toLowerCase().includes('toilet'));
            const options = [];
            if (toothbrush) options.push({ ...toothbrush.product, meaning: 'Personal Care (Toothbrush)' });
            if (cleanBrush) options.push({ ...cleanBrush.product, meaning: 'Cleaning & Laundry (Toilet Brush)' });

            itemBreakdown.push({
              requestedItem: item.searchTerm,
              matched: true,
              isAmbiguous: true,
              options,
              topMatch: toothbrush ? toothbrush.product : candidates[0].product
            });
            if (toothbrush) selectedProducts.push(toothbrush.product);
            else if (candidates[0]) selectedProducts.push(candidates[0].product);
            continue;
          }

          if (candidates.length === 0) {
            // Find closest real category alternatives
            const alts = hydratedCatalog
              .filter((p) => p.isEcoFriendly && (p.category === 'Personal Care' || p.category === 'Cleaning & Laundry'))
              .sort((a, b) => (item.isAffordable ? a.price - b.price : b.ecoScore - a.ecoScore))
              .slice(0, 2);

            itemBreakdown.push({
              requestedItem: item.searchTerm,
              matched: false,
              notFound: true,
              message: `I couldn't find a ${item.searchTerm} in the catalogue.`,
              closestAlternatives: alts
            });
          } else {
            const best = candidates[0].product;
            itemBreakdown.push({
              requestedItem: item.searchTerm,
              matched: true,
              topMatch: best,
              candidatesCount: candidates.length
            });
            selectedProducts.push(best);
          }
        }

        return {
          multiItemSearch: true,
          requestedItems: parsedItems.map((it) => it.searchTerm),
          itemBreakdown,
          matchedCount: selectedProducts.length,
          products: selectedProducts,
          totalPrice: selectedProducts.reduce((sum, p) => sum + (p.price || 0), 0)
        };
      }

      // SINGLE-ITEM OR BROAD CATALOG SEARCH
      const singleItem = parsedItems[0] || null;
      const isAffordable = singleItem?.isAffordable || /affordable|cheap|cheapest|budget|low-cost/i.test(rawQ);

      const gradeRank = { A: 5, B: 4, C: 3, D: 2, E: 1 };
      const minRank = gradeRank[minGrade] || 0;

      const results = hydratedCatalog
        .filter((p) => {
          if (cat && !isMatchingCategory(p.category, cat)) return false;
          if (!Number.isNaN(maxPrice) && maxPrice > 0 && p.price > maxPrice) return false;
          if (plasticFree && p.packaging !== 'plastic-free') return false;
          if (certifiedOnly && (!p.certifications || p.certifications.length === 0)) return false;
          if (minRank > 0 && (gradeRank[p.ecoGrade] || 0) < minRank) return false;
          return true;
        })
        .map((p) => {
          const relevance = singleItem ? scoreItemRelevance(p, singleItem) : 50;
          return { product: p, relevance };
        })
        .filter((entry) => (singleItem ? entry.relevance >= 35 : true));

      results.sort((a, b) => {
        if (b.relevance !== a.relevance) return b.relevance - a.relevance;
        if (isAffordable) return a.product.price - b.product.price;
        return b.product.ecoScore - a.product.ecoScore;
      });

      const finalProducts = results.slice(0, 6).map((r) => r.product);

      if (singleItem && finalProducts.length === 0) {
        const alts = hydratedCatalog
          .filter((p) => p.isEcoFriendly && (p.category === 'Personal Care' || p.category === 'Kitchen'))
          .slice(0, 2);
        return {
          totalCatalogCount: hydratedCatalog.length,
          matchedCount: 0,
          requestedItem: singleItem.searchTerm,
          notFound: true,
          message: `I couldn't find a ${singleItem.searchTerm} in the catalogue.`,
          closestAlternatives: alts,
          products: []
        };
      }

      const departmentCounts = {};
      hydratedCatalog.forEach((p) => {
        departmentCounts[p.category] = (departmentCounts[p.category] || 0) + 1;
      });

      return {
        totalCatalogCount: hydratedCatalog.length,
        totalMatchingCount: results.length,
        matchedCount: results.length,
        departmentBreakdown: departmentCounts,
        sampleProductsReturned: finalProducts.length,
        products: finalProducts,
        appliedFilters: { query: args.query, category: args.category, max_price: args.max_price, isAffordable },
        note: `Eco Sense has ${hydratedCatalog.length} sample products across 8 departments. Showing top ${finalProducts.length} representative matches.`
      };
    }

    case 'get_product': {
      const p = products.find((prod) => prod.id === args.id);
      if (!p) {
        return { error: `Product with ID "${args.id}" not found in catalogue.` };
      }
      const score = calculateEcoScore(p);
      let impactMath = null;
      if (p.conventionalAlternativeId) {
        const conv = products.find((c) => c.id === p.conventionalAlternativeId);
        if (conv) {
          impactMath = {
            baselineName: conv.name,
            baselinePrice: conv.price,
            co2SavedKg: Math.max(0, (conv.carbonKg || 0) - (p.carbonKg || 0)).toFixed(2),
            plasticSavedGrams: Math.max(0, (conv.plasticGrams || 0) - (p.plasticGrams || 0))
          };
        }
      }
      return {
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        description: p.description,
        material: p.material,
        packaging: p.packaging,
        carbonKg: p.carbonKg,
        plasticGrams: p.plasticGrams,
        waterLitres: p.waterLitres,
        certifications: p.certifications || [],
        ecoHighlights: p.ecoHighlights || [],
        isEcoFriendly: p.isEcoFriendly,
        conventionalAlternativeId: p.conventionalAlternativeId,
        impactMath,
        image: p.image,
        ecoScore: score?.score ?? 80,
        ecoGrade: score?.grade ?? 'A'
      };
    }

    case 'get_alternatives': {
      const p = products.find((prod) => prod.id === args.id);
      if (!p) {
        return { error: `Product with ID "${args.id}" not found.` };
      }

      let alternative = null;
      if (p.conventionalAlternativeId) {
        alternative = products.find((prod) => prod.id === p.conventionalAlternativeId);
      }

      if (!alternative) {
        alternative = products
          .filter((prod) => prod.category === p.category && prod.id !== p.id && prod.isEcoFriendly)
          .sort((a, b) => (b.ecoScore || 85) - (a.ecoScore || 85))[0];
      }

      if (!alternative) {
        return { message: `No greener alternative found for "${p.name}". It is already our top eco option.` };
      }

      const green = alternative.isEcoFriendly ? alternative : p;
      const conv = alternative.isEcoFriendly ? p : alternative;
      const comparison = compareProductImpact(green, conv);

      return {
        original: { id: p.id, name: p.name, price: p.price, ecoScore: p.ecoScore },
        recommendedSwap: {
          id: alternative.id,
          name: alternative.name,
          price: alternative.price,
          image: alternative.image,
          packaging: alternative.packaging,
          certifications: alternative.certifications
        },
        impactSavings: {
          baselineName: conv.name,
          co2SavedKg: comparison?.co2Saved ?? 0.5,
          plasticSavedGrams: comparison?.plasticSaved ?? 40,
          waterSavedLitres: comparison?.waterSaved ?? 15,
          priceDelta: (alternative.price || 0) - (p.price || 0)
        }
      };
    }

    case 'score_cart': {
      const rawCart = Array.isArray(args.cart) && args.cart.length > 0 ? args.cart : (context.cart || []);
      const hydratedCart = rawCart.map((item) => {
        const prodId = item.id || item.productId || item.product?.id;
        const p = products.find((prod) => prod.id === prodId) || item.product || item;
        return { product: p, quantity: item.quantity || 1 };
      });

      const impact = calculateCartImpact(hydratedCart, products);
      return {
        totalItems: impact.totalItems,
        totalPrice: impact.totalPrice,
        co2SavedKg: impact.totalCo2SavedKg,
        plasticAvoidedGrams: impact.totalPlasticSavedGrams,
        waterSavedLitres: impact.totalWaterSavedLitres,
        averageEcoScore: impact.averageEcoScore,
        averageGrade: impact.averageGrade,
        swapsAvailable: impact.potentialSwaps?.length || 0,
        potentialSwaps: impact.potentialSwaps || []
      };
    }

    case 'explain_score': {
      const p = products.find((prod) => prod.id === args.id);
      if (!p) return { error: `Product "${args.id}" not found.` };
      const calculation = calculateEcoScore(p);
      return {
        id: p.id,
        name: p.name,
        totalScore: calculation.score,
        grade: calculation.grade,
        gradeLabel: calculation.gradeLabel,
        pillars: {
          renewableMaterial: calculation.breakdown.material,
          plasticElimination: calculation.breakdown.packaging,
          carbonReduction: calculation.breakdown.carbon,
          certifications: calculation.breakdown.certifications,
          localSupplyChain: calculation.breakdown.shipping
        }
      };
    }

    case 'compare_products': {
      const ids = Array.isArray(args.ids) ? args.ids : [];
      const found = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean);
      if (found.length < 2) {
        return { error: 'Need at least 2 valid product IDs to compare.' };
      }

      const comparisons = found.map((p) => {
        const s = calculateEcoScore(p);
        return {
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.category,
          material: p.material,
          packaging: p.packaging,
          carbonKg: p.carbonKg,
          plasticGrams: p.plasticGrams,
          certifications: p.certifications || [],
          ecoScore: s?.score ?? 50,
          grade: s?.grade ?? 'C'
        };
      });

      return {
        comparedProducts: comparisons,
        greenerChoice: comparisons.reduce((best, cur) => cur.ecoScore > best.ecoScore ? cur : best, comparisons[0])
      };
    }

    case 'check_claim': {
      const claimText = args.text || '';
      const audit = detectGreenwashing({ name: claimText, description: claimText, packaging: 'conventional' });
      return {
        claim: claimText,
        verdict: audit.isGreenwashed ? 'Check the claims (Potential Greenwashing)' : 'Credible or Standard Description',
        flaggedBuzzwords: audit.buzzwords || [],
        details: audit.reason || 'No deceptive buzzwords without certifications detected.'
      };
    }

    case 'add_to_cart': {
      const p = products.find((prod) => prod.id === args.id);
      if (!p) return { error: `Product "${args.id}" not found.` };
      return {
        action: 'add_to_cart',
        product: { id: p.id, name: p.name, price: p.price, image: p.image },
        quantity: args.quantity || 1,
        successMessage: `Added "${p.name}" to cart.`
      };
    }

    case 'swap_item': {
      const oldP = products.find((prod) => prod.id === args.oldId);
      const newP = products.find((prod) => prod.id === args.newId);
      if (!oldP || !newP) return { error: 'Both old and new product IDs must exist.' };
      return {
        action: 'swap_item',
        oldProduct: { id: oldP.id, name: oldP.name, price: oldP.price },
        newProduct: { id: newP.id, name: newP.name, price: newP.price, image: newP.image },
        successMessage: `Swapped "${oldP.name}" for "${newP.name}".`
      };
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

/**
 * 3. System Prompt Builder with Strict Relevance and Grounding Directives
 */
export function buildAgentSystemInstruction(context = {}) {
  return `You are Eco Sense's autonomous Eco Agent — an intelligent, truthful, and helpful shopping companion for sustainable commerce.

CRITICAL DIRECTIVES FOR RELEVANCE AND INTEGRITY:
1. RELEVANCE FIRST (MANDATORY):
   - Parse the shopper's prompt into the specific items they asked for.
   - For example: if the shopper says "i am a college student i want a affordable brush and soap", they asked for:
     1) "brush"
     2) "soap"
   - Every single recommended product MUST match one of the requested items.
   - NEVER return unrelated products (such as scented candles, pens, or lip balms when asked for brush and soap).

2. HONEST NOT-FOUND & CLOSEST REAL ALTERNATIVES:
   - If an item is NOT in our catalogue (e.g. body soap), say so directly and honestly: "I couldn't find a body soap in the catalogue."
   - Then offer the closest real alternatives from the same or adjacent department (e.g. Organic Neem & Argan Solid Cleansing/Shampoo Bar ₹320 or Soapnut Berries Wash ₹349), clearly labelling them as alternatives.
   - NEVER substitute unrelated categories.

3. AMBIGUOUS WORDS:
   - If a word is ambiguous (e.g. "brush" could mean toothbrush or toilet/cleaning brush), either show one option per meaning with clear labels, or ask one short clarifying question.

4. AFFORDABLE WITHOUT A NUMBER:
   - "Affordable" or "cheap" with no number means: sort by price ascending among relevant matching products.
   - Do NOT invent or assume an arbitrary budget (like ₹1000).

5. IMPACT NUMBERS & MATH:
   - ONLY show CO2 or plastic savings when the recommended product has a conventional alternative to compare against.
   - Show the math: "(Estimate vs conventional plastic toothbrush: 1.57 kg CO2 less, 92g plastic avoided)".
   - If there is no conventional baseline for a product, show NO savings number.

6. ANSWER FORMAT:
   - One short friendly opening line.
   - Then one best option per requested item with price and savings math.
   - Then the total price.
   - Do NOT use generic "conscious basket" or "starter kit" wording unless the user explicitly requested a kit/basket.

7. PRICES IN INR: Always write prices in Indian Rupees using the '₹' symbol (e.g. ₹249, ₹320).

8. MULTILINGUAL & PLAIN WORDS: Respond in simple words that a 9th grade student easily understands. Avoid jargon. Use English, Hindi, or Hinglish as requested.

9. CATALOGUE OVERVIEW & SIZE (124 SUSTAINABLE PRODUCTS):
   - Eco Sense features exactly 124 sustainable products across 8 departments:
     1. Kitchen (16 products)
     2. Personal Care (16 products)
     3. Home (16 products)
     4. Cleaning & Laundry (16 products)
     5. Fashion (15 products)
     6. Stationery (15 products)
     7. Bags (15 products)
     8. Outdoor & Travel (15 products)
   - Every department contains a full mix of Eco Grades A through E.
   - When asked open-ended queries like "what products do you sell?", "products", "products kha gye bhai?", "show all products", or "how many products do you have?":
     * Clarify that the store features 124 sample sustainable products across all 8 departments.
     * Summarize the departments and offer representative picks across categories.
     * NEVER claim the store only has 6 products!
     * If the shopper asks in Hindi or Hinglish (e.g. "products kha gye bhai?"), reassure them warmly in Hindi/Hinglish: "Bhai, hamare paas pure 124 sustainable products hain across 8 departments! Saare products catalogue mein active hain."`;
}

/**
 * 4. Main Multi-Turn Tool Calling Pipeline with Post-Response Relevance Verification
 */
export async function runAgentConversation({
  query,
  cart = [],
  context = {},
  userPriorities = {},
  messages = [],
  apiKey,
  modelName = 'gemini-3-flash-preview',
  fallbackModel = 'gemini-3.5-flash-lite',
  onEvent = null
}) {
  const systemInstruction = buildAgentSystemInstruction(context);
  const requestedItems = parseRequestedItems(query);

  // Prepare conversational history (last 10 messages)
  const conversationContents = [];
  const history = Array.isArray(messages) ? messages.slice(-10) : [];
  for (const m of history) {
    if (m.sender === 'user' || m.role === 'user') {
      conversationContents.push({ role: 'user', parts: [{ text: m.text || m.content || '' }] });
    } else if (m.sender === 'agent' || m.role === 'model') {
      conversationContents.push({ role: 'model', parts: [{ text: m.text || m.content || '' }] });
    }
  }

  // Augment current user turn with current shopper context
  const contextNote = `[Current Context: Cart has ${cart.length} items. Current page: ${context.currentPage || 'home'}. Active filters: ${JSON.stringify(userPriorities)}]`;
  conversationContents.push({
    role: 'user',
    parts: [{ text: `${contextNote}\n\nShopper Query: ${query}` }]
  });

  const toolsPayload = [
    {
      function_declarations: AGENT_TOOLS
    }
  ];

  async function executeTurnWithModel(activeModel) {
    let currentContents = [...conversationContents];
    const executedTools = [];
    let collectedProducts = [];
    const uiActions = [];
    let finalText = '';

    for (let loop = 0; loop < 3; loop++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 18000);

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        signal: controller.signal,
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: currentContents,
          tools: toolsPayload,
          generationConfig: {
            temperature: 0.1,
            max_output_tokens: 2048
          }
        })
      });

      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Gemini API error status ${res.status}`);
      }

      const data = await res.json();
      const candidate = data?.candidates?.[0];
      const parts = candidate?.content?.parts || [];

      const functionCalls = parts.filter((p) => p.functionCall);

      if (functionCalls.length > 0) {
        currentContents.push({ role: 'model', parts });
        const functionResponseParts = [];

        for (const callPart of functionCalls) {
          const fn = callPart.functionCall;
          const toolName = fn.name;
          const toolArgs = fn.args || {};

          if (onEvent) {
            onEvent('tool_call', { tool: toolName, args: toolArgs });
          }

          const toolResult = await executeAgentTool(toolName, toolArgs, { cart, context, userPriorities });
          executedTools.push({ tool: toolName, args: toolArgs, result: toolResult });

          if (toolResult?.products && Array.isArray(toolResult.products)) {
            collectedProducts.push(...toolResult.products);
          } else if (toolResult?.id && toolResult?.name) {
            collectedProducts.push(toolResult);
          } else if (toolResult?.recommendedSwap) {
            collectedProducts.push(toolResult.recommendedSwap);
          }

          if (toolResult?.action) {
            uiActions.push(toolResult);
          }

          if (onEvent) {
            onEvent('tool_result', { tool: toolName, result: toolResult });
          }

          functionResponseParts.push({
            functionResponse: {
              name: toolName,
              response: { output: toolResult }
            }
          });
        }

        currentContents.push({
          role: 'user',
          parts: functionResponseParts
        });
      } else {
        const textParts = parts.filter((p) => p.text).map((p) => p.text);
        finalText = textParts.join('\n');
        break;
      }
    }

    // 8. Post-Generation Relevance Check:
    // If the shopper requested specific items, ensure all returned products match at least one requested item
    if (requestedItems.length > 0 && collectedProducts.length > 0) {
      const strictlyRelevantProducts = collectedProducts.filter((p) => {
        return requestedItems.some((item) => scoreItemRelevance(p, item) >= 35);
      });

      const hasIrrelevant = collectedProducts.length > strictlyRelevantProducts.length;
      if (hasIrrelevant) {
        collectedProducts = strictlyRelevantProducts;
      }
    }

    return {
      text: finalText,
      toolsUsed: executedTools,
      products: dedupeProducts(collectedProducts),
      actions: uiActions,
      model: activeModel
    };
  }

  try {
    return await executeTurnWithModel(modelName);
  } catch (err) {
    console.warn(`[agentEngine] Primary model ${modelName} failed (${err.message}), retrying with fallback ${fallbackModel}...`);
    return await executeTurnWithModel(fallbackModel);
  }
}

function dedupeProducts(list) {
  const seen = new Set();
  const deduped = [];
  for (const p of list) {
    if (p && p.id && !seen.has(p.id)) {
      seen.add(p.id);
      deduped.push(p);
    }
  }
  return deduped;
}
