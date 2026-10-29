/**
 * Claim Auditor & Greenwashing Checker for Label Scanner
 * Evaluates printed packaging claims against visible certifications,
 * flagging vague terms, unverified claims, and calculating an overall integrity grade.
 */

const VAGUE_TERMS_REGEX = /\b(eco[\s-]friendly|100%\s*natural|all\s*natural|pure\s*green|save\s*the\s*planet|green\s*choice|chemical[\s-]free|earth[\s-]friendly|sustainable|clean|pure|herbal|nature\'?s?\s*best)\b/i;

const KNOWN_CERT_STANDARDS = [
  { term: /organic|bio/i, certPattern: /gots|usda\s*organic|india\s*organic|jaivik\s*bharat|ecocert/i, standardName: 'Certified Organic' },
  { term: /wood|paper|timber|forest/i, certPattern: /fsc|pefc/i, standardName: 'FSC / PEFC Certified' },
  { term: /fair\s*trade|artisan/i, certPattern: /fair\s*trade|craftmark/i, standardName: 'Fair Trade Certified' },
  { term: /compostable|biodegradable/i, certPattern: /astm\s*d6400|en\s*13432|cpcb|iso\s*17088/i, standardName: 'Lab Certified Compostable' },
  { term: /cruelty[\s-]free|vegan/i, certPattern: /leaping\s*bunny|peta|vegan/i, standardName: 'Cruelty-Free / Vegan' },
  { term: /recycled|upcycled/i, certPattern: /grs|global\s*recycled\s*standard/i, standardName: 'GRS Recycled Standard' }
];

/**
 * Audits a single claim against visible certifications
 */
export function auditSingleClaim(claimText, visibleCerts = []) {
  const claim = String(claimText || '').trim();
  const certs = Array.isArray(visibleCerts) ? visibleCerts : [];
  const certNames = certs.map((c) => (typeof c === 'string' ? c : c?.name || '')).join(' ');

  // 1. Check if supported by a visible certification
  for (const mapping of KNOWN_CERT_STANDARDS) {
    if (mapping.term.test(claim) && mapping.certPattern.test(certNames)) {
      return {
        claim,
        verdict: 'supported by a visible certification',
        category: 'supported',
        gradeScore: 90,
        reasoning: `Directly supported by visible ${mapping.standardName} mark on packaging.`,
        verifiedBy: mapping.standardName
      };
    }
  }

  // Check generic cert match
  if (certs.length > 0 && /certified/i.test(claim)) {
    return {
      claim,
      verdict: 'supported by a visible certification',
      category: 'supported',
      gradeScore: 85,
      reasoning: `Supported by printed certification: "${certNames}".`,
      verifiedBy: certNames
    };
  }

  // 2. Check for vague or unqualified terms
  if (VAGUE_TERMS_REGEX.test(claim)) {
    const match = claim.match(VAGUE_TERMS_REGEX);
    return {
      claim,
      verdict: 'vague term',
      category: 'vague',
      gradeScore: 35,
      reasoning: `Uses broad, unqualified marketing term "${match ? match[0] : 'buzzword'}" prohibited by green advertising guidelines without lifecycle proof.`
    };
  }

  // 3. Specific claim without visible proof
  return {
    claim,
    verdict: 'unverified',
    category: 'unverified',
    gradeScore: 55,
    reasoning: 'Specific environmental attribute claimed on packaging without visible third-party certification number or lab standard.'
  };
}

/**
 * Audits all claims extracted from a product label
 */
export function auditLabelClaims(claims = [], visibleCerts = []) {
  if (!Array.isArray(claims) || claims.length === 0) {
    return {
      hasClaims: false,
      claimAudits: [],
      finalGrade: 'B',
      overallScore: 70,
      reasoning: 'No printed environmental marketing claims detected on this label.',
      summary: 'Clean label with no unsubstantiated marketing buzzwords.'
    };
  }

  const audits = claims.map((claim) => auditSingleClaim(claim, visibleCerts));

  const totalScore = audits.reduce((sum, a) => sum + a.gradeScore, 0);
  const avgScore = Math.round(totalScore / audits.length);

  const supportedCount = audits.filter((a) => a.category === 'supported').length;
  const vagueCount = audits.filter((a) => a.category === 'vague').length;
  const unverifiedCount = audits.filter((a) => a.category === 'unverified').length;

  let finalGrade = 'C';
  if (vagueCount === 0 && supportedCount > 0 && unverifiedCount === 0) {
    finalGrade = 'A';
  } else if (vagueCount === 0 && supportedCount >= unverifiedCount) {
    finalGrade = 'B';
  } else if (vagueCount > 0 && supportedCount === 0) {
    finalGrade = vagueCount >= 2 ? 'E' : 'D';
  } else {
    finalGrade = avgScore >= 80 ? 'A' : avgScore >= 65 ? 'B' : avgScore >= 50 ? 'C' : avgScore >= 35 ? 'D' : 'E';
  }

  let reasoning = '';
  if (vagueCount > 0) {
    reasoning = `Found ${vagueCount} vague marketing phrase(s) without verifiable proofs. Check if independent standards exist.`;
  } else if (supportedCount > 0) {
    reasoning = `All claims are backed by visible independent certifications (${supportedCount} verified).`;
  } else {
    reasoning = `Contains ${unverifiedCount} self-declared environmental statement(s) without printed certification numbers.`;
  }

  return {
    hasClaims: true,
    claimAudits: audits,
    finalGrade,
    overallScore: avgScore,
    supportedCount,
    vagueCount,
    unverifiedCount,
    reasoning,
    summary: `Grade ${finalGrade}: ${supportedCount} supported, ${unverifiedCount} unverified, ${vagueCount} vague.`
  };
}
