/**
 * Certification Links & Issuer Websites
 * Links to official certification issuer websites for reference.
 */

export const CERTIFICATION_REGISTRY = {
  'FSC Certified': 'https://fsc.org/en',
  'FSC Recycled': 'https://fsc.org/en',
  'FSC 100%': 'https://fsc.org/en',
  'FSC 100% Cork': 'https://fsc.org/en',
  'FSC Upcycled': 'https://fsc.org/en',
  'GOTS Organic': 'https://global-standard.org/',
  'GOTS Certified': 'https://global-standard.org/',
  'USDA Organic': 'https://www.usda.gov/topics/organic',
  'USDA Biobased': 'https://www.biopreferred.gov/',
  'Fair Trade': 'https://www.fairtrade.net/',
  'Fair Trade Certified': 'https://www.fairtrade.net/',
  'Fair Trade Handloom': 'https://www.fairtrade.net/',
  'Fair Trade Artisan': 'https://www.fairtrade.net/',
  'Fair Wage Co-op': 'https://www.fairtrade.net/',
  'OEKO-TEX Standard 100': 'https://www.oeko-tex.com/',
  'OEKO-TEX 100': 'https://www.oeko-tex.com/',
  'B Corp Certified': 'https://www.bcorporation.net/',
  'PETA Vegan': 'https://www.peta.org/living/personal-care-fashion/peta-approved-vegan-logo/',
  'PETA Approved Vegan': 'https://www.peta.org/living/personal-care-fashion/peta-approved-vegan-logo/',
  'Leaping Bunny Certified': 'https://www.leapingbunny.org/',
  'Cruelty-Free': 'https://www.leapingbunny.org/',
  'Silk Mark': 'http://silkmarkindia.com/',
  'Coir Board Certified': 'http://coirboard.gov.in/',
  'Jute Mark India': 'https://jutemarkindia.gov.in/',
  'Craftmark India': 'https://www.craftmark.org/',
  'RoHS Compliant': 'https://rohs.guide/',
  'ISO 9001': 'https://www.iso.org/iso-9001-quality-management.html',
  'Climate Neutral': 'https://www.climateneutral.org/',
  'Climate Neutral Certified': 'https://www.climateneutral.org/'
};

/**
 * Returns the source URL for a certification name if stored on product or registered in registry
 */
export function getCertificationSourceUrl(cert, product = null) {
  if (!cert) return null;

  if (typeof cert === 'object') {
    const url = cert.sourceUrl || cert.url || cert.source_url;
    if (typeof url === 'string' && url.startsWith('http')) return url;
    if (cert.name && CERTIFICATION_REGISTRY[cert.name]) {
      return CERTIFICATION_REGISTRY[cert.name];
    }
  }

  if (typeof cert === 'string') {
    if (cert.startsWith('http://') || cert.startsWith('https://')) return cert;
    if (product?.certificationUrls && product.certificationUrls[cert]) {
      return product.certificationUrls[cert];
    }
    if (CERTIFICATION_REGISTRY[cert]) {
      return CERTIFICATION_REGISTRY[cert];
    }
  }

  return null;
}

/**
 * Checks if a product has at least one seller-listed certification with a stored reference URL
 */
export function hasVerifiedCertification(product) {
  if (!product || !Array.isArray(product.certifications) || product.certifications.length === 0) {
    return false;
  }

  return product.certifications.some((cert) => {
    return Boolean(getCertificationSourceUrl(cert, product));
  });
}

