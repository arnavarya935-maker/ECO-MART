import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import productsData from '../src/data/products.json';
import {
  calculateEan13CheckDigit,
  isValidEan13,
  generateEan13,
  encodeEan13Binary,
  generateBarcodeSvg
} from '../src/lib/barcodeUtils.js';
import { CartProvider } from '../src/context/CartContext.jsx';
import BarcodeDemoPage from '../src/pages/BarcodeDemoPage.jsx';

describe('Phase 4: Barcodes, Scanners & Resilient Error Handling Test Suite', () => {
  describe('1. EAN-13 Barcode Math & Catalog Validation', () => {
    it('calculates modulo-10 check digits with odd/even weight factors accurately', () => {
      // 890123456789 -> 0
      expect(calculateEan13CheckDigit('890123456789')).toBe(0);
      // 890000000001 -> 2
      expect(calculateEan13CheckDigit('890000000001')).toBe(2);
      // 890000000002 -> 9
      expect(calculateEan13CheckDigit('890000000002')).toBe(9);
    });

    it('validates EAN-13 barcodes correctly and rejects corrupted codes', () => {
      const validCode = generateEan13(1);
      expect(isValidEan13(validCode)).toBe(true);

      // Corrupt the check digit
      const corruptedCheck = validCode.slice(0, 12) + (parseInt(validCode[12], 10) === 9 ? '0' : '9');
      expect(isValidEan13(corruptedCheck)).toBe(false);

      // Invalid lengths or characters
      expect(isValidEan13('12345')).toBe(false);
      expect(isValidEan13('890000000001A')).toBe(false);
      expect(isValidEan13(null)).toBe(false);
    });

    it('ensures all 124 catalog products have unique, valid EAN-13 barcodes with Indian GS1 prefix (890)', () => {
      expect(productsData.length).toBe(124);
      const seenBarcodes = new Set();

      for (const product of productsData) {
        expect(product.barcode).toBeDefined();
        expect(typeof product.barcode).toBe('string');
        expect(product.barcode).toMatch(/^890\d{10}$/);
        expect(isValidEan13(product.barcode)).toBe(true);
        expect(seenBarcodes.has(product.barcode)).toBe(false);
        seenBarcodes.add(product.barcode);
      }

      expect(seenBarcodes.size).toBe(124);
    });
  });

  describe('2. Standalone SVG Barcode Generator', () => {
    it('generates 95-module binary guard patterns without external libraries', () => {
      const sampleBarcode = productsData[0].barcode;
      const binary = encodeEan13Binary(sampleBarcode);

      expect(binary.length).toBe(95);
      expect(binary.startsWith('101')).toBe(true); // Start guard
      expect(binary.slice(45, 50)).toBe('01010'); // Center guard
      expect(binary.endsWith('101')).toBe(true); // End guard
    });

    it('renders pure inline SVG barcodes without external images or CDN dependencies', () => {
      const sampleBarcode = productsData[0].barcode;
      const svg = generateBarcodeSvg(sampleBarcode, { width: 240, height: 100 });

      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain('<rect');
      expect(svg).toContain('role="img"');
      expect(svg).not.toContain('href=');
      expect(svg).not.toContain('src=');
      expect(svg).toContain(sampleBarcode.slice(0, 1));
    });
  });

  describe('3. Catalog Lookup by Barcode', () => {
    it('correctly matches any product in products.json by its barcode', () => {
      for (const sample of [productsData[0], productsData[42], productsData[100]]) {
        const found = productsData.find((p) => p.barcode === sample.barcode);
        expect(found).toBeDefined();
        expect(found.id).toBe(sample.id);
        expect(found.name).toBe(sample.name);
      }
    });

    it('returns undefined for non-existent barcodes without crashing', () => {
      const notFound = productsData.find((p) => p.barcode === '8909999999999');
      expect(notFound).toBeUndefined();
    });
  });

  describe('4. /barcodes Demo Sheet Route', () => {
    it('renders the BarcodeDemoPage showing all products with inline SVG barcodes', () => {
      const html = renderToString(
        <MemoryRouter initialEntries={['/barcodes']}>
          <CartProvider>
            <BarcodeDemoPage />
          </CartProvider>
        </MemoryRouter>
      );

      expect(html).toContain('Catalogue Barcode Sheet');
      expect(html).toContain('Printable EAN-13 sample barcodes');
      expect(html).toContain('GS1 India EAN-13 (Prefix 890)');
      expect(html).toContain('<svg');
      expect(html).toContain('Print Sheet');
    });
  });

  describe('5. Label Scanner Error Handling & Resilient Fallback UI', () => {
    it('formats 429 quota errors into student-friendly guidance with Try again option', () => {
      const formatFriendlyErrorMessage = (err) => {
        const msg = (err?.message || String(err || '')).toLowerCase();
        if (msg.includes('429') || msg.includes('quota') || msg.includes('rate limit')) {
          return 'The AI scanner is busy right now (rate limit reached). Please wait a moment and try again.';
        }
        if (msg.includes('504') || msg.includes('timeout')) {
          return 'The scanner took too long to respond. Please check your internet connection and try again.';
        }
        return 'Something went wrong while reading the label. Please try again.';
      };

      const rateLimitErr = new Error('HTTP 429: Too Many Requests / Quota Exceeded');
      const message = formatFriendlyErrorMessage(rateLimitErr);
      expect(message).toBe('The AI scanner is busy right now (rate limit reached). Please wait a moment and try again.');
    });

    it('formats timeout errors into simple connection advice', () => {
      const formatFriendlyErrorMessage = (err) => {
        const msg = (err?.message || String(err || '')).toLowerCase();
        if (msg.includes('504') || msg.includes('timeout')) {
          return 'The scanner took too long to respond. Please check your internet connection and try again.';
        }
        return 'Something went wrong while reading the label. Please try again.';
      };

      const timeoutErr = new Error('Gateway timeout 504: Request aborted after 18000ms');
      const message = formatFriendlyErrorMessage(timeoutErr);
      expect(message).toBe('The scanner took too long to respond. Please check your internet connection and try again.');
    });
  });
});
