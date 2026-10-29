/**
 * Environmental Equivalence Conversion Constants
 * Note: These conversion multipliers are approximate common estimates used for human-scale illustrations.
 * 1. Tree Carbon Sequestration: ~21.77 kg CO2 / year absorbed by 1 mature tree (approximate common estimate)
 * 2. Passenger Car Kilometre: ~0.12 kg CO2 / km driven in an average petrol car (approximate common estimate)
 * 3. Plastic Bottle Equivalence: ~20 grams virgin plastic per 500ml water bottle (approximate common estimate)
 * 4. Tap Water Shower Equivalence: ~65 Litres per standard 8-minute shower (approximate common estimate)
 */

export const CONVERSION_CONSTANTS = {
  // 1 mature tree absorbs ~21.77 kg CO2 per year (approximate)
  KG_CO2_PER_TREE_YEAR: 21.77,

  // 1 km driven in an average petrol passenger car emits ~0.12 kg CO2 (approximate)
  KG_CO2_PER_KM_DRIVEN: 0.12,

  // 1 single-use 500ml PET bottle weighs ~20 grams (approximate)
  GRAMS_PLASTIC_PER_BOTTLE: 20,

  // 1 standard 8-minute shower consumes ~65 Litres of water (approximate)
  LITRES_WATER_PER_SHOWER: 65
};

/**
 * Calculates human-scale approximate equivalences
 * All results are labelled as approximate estimates.
 * @param {{ co2Kg?: number, plasticGrams?: number, waterLitres?: number }} metrics
 * @returns {{ trees: string, kmDriven: string, bottles: string, showers: string }}
 */
export function calculateEquivalences({ co2Kg = 0, plasticGrams = 0, waterLitres = 0 } = {}) {
  const trees = (co2Kg / CONVERSION_CONSTANTS.KG_CO2_PER_TREE_YEAR).toFixed(1);
  const kmDriven = Math.round(co2Kg / CONVERSION_CONSTANTS.KG_CO2_PER_KM_DRIVEN);
  const bottles = Math.round(plasticGrams / CONVERSION_CONSTANTS.GRAMS_PLASTIC_PER_BOTTLE);
  const showers = Math.round(waterLitres / CONVERSION_CONSTANTS.LITRES_WATER_PER_SHOWER);

  return {
    trees: `~${trees} mature trees (annual CO₂ absorption)`,
    kmDriven: `~${kmDriven.toLocaleString()} km in average passenger car drive`,
    bottles: `~${bottles.toLocaleString()} single-use 500ml plastic bottles avoided`,
    showers: `~${showers.toLocaleString()} standard showers of freshwater conserved`
  };
}
