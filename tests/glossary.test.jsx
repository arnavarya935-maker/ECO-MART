import { describe, it, expect } from 'vitest';
import { GLOSSARY_TERMS, searchGlossary, findGlossaryTerm } from '../src/lib/glossary';

describe('Glossary Knowledge Base', () => {
  it('contains at least 10 verified environmental terms with sources', () => {
    expect(GLOSSARY_TERMS.length).toBeGreaterThanOrEqual(10);
    GLOSSARY_TERMS.forEach((term) => {
      expect(term.term).toBeTruthy();
      expect(term.category).toBeTruthy();
      expect(term.shortDef).toBeTruthy();
      expect(term.fullDef).toBeTruthy();
      expect(term.source).toBeTruthy();
    });
  });

  it('searches glossary terms accurately by query substring', () => {
    const results = searchGlossary('carbon');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((r) => r.term.includes('Carbon'))).toBe(true);
  });

  it('finds exact or close term matches', () => {
    const term = findGlossaryTerm('greenwashing');
    expect(term).not.toBeNull();
    expect(term.category).toBe('Regulatory');
  });

  it('returns empty array or full list safely on boundary queries', () => {
    expect(searchGlossary('').length).toBe(GLOSSARY_TERMS.length);
    expect(searchGlossary('nonexistentxyz123').length).toBe(0);
    expect(findGlossaryTerm(null)).toBeNull();
  });
});
