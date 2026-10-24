import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

function getFilesRecursively(dir, extensions = ['.js', '.jsx', '.json', '.css', '.html']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath, extensions));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (extensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

describe('Forbidden Terms & Honesty Regression Suite', () => {
  const srcDir = path.resolve(__dirname, '../src');
  const files = getFilesRecursively(srcDir);

  it('scans all files in src/ for "100% offline" and finds zero occurrences', () => {
    const offending = [];
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.toLowerCase().includes('100% offline')) {
        offending.push(path.relative(srcDir, file));
      }
    }
    expect(offending).toEqual([]);
  });

  it('scans all files in src/ for "offline-native" and finds zero occurrences', () => {
    const offending = [];
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.toLowerCase().includes('offline-native')) {
        offending.push(path.relative(srcDir, file));
      }
    }
    expect(offending).toEqual([]);
  });

  it('scans all files in src/ for "Technophilia" and finds zero occurrences', () => {
    const offending = [];
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.toLowerCase().includes('technophilia')) {
        offending.push(path.relative(srcDir, file));
      }
    }
    expect(offending).toEqual([]);
  });

  it('scans all files in src/ for "Verified Impact" and finds zero occurrences', () => {
    const offending = [];
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.toLowerCase().includes('verified impact')) {
        offending.push(path.relative(srcDir, file));
      }
    }
    expect(offending).toEqual([]);
  });

  it('scans all UI files for demo mode and competition wording and finds zero occurrences', () => {
    const offendingDemo = [];
    const offendingComp = [];
    const offendingCBSE = [];

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.toLowerCase().includes('demo mode')) {
        offendingDemo.push(path.relative(srcDir, file));
      }
      if (content.toLowerCase().includes('competition')) {
        offendingComp.push(path.relative(srcDir, file));
      }
      if (content.toLowerCase().includes('cbse')) {
        offendingCBSE.push(path.relative(srcDir, file));
      }
    }

    expect(offendingDemo).toEqual([]);
    expect(offendingComp).toEqual([]);
    expect(offendingCBSE).toEqual([]);
  });

  it('preserves courtroom legal simulation roles (role: "Judge", judgeVerdict)', () => {
    const courtroomEnginePath = path.join(srcDir, 'lib/ai/courtroomEngine.js');
    expect(fs.existsSync(courtroomEnginePath)).toBe(true);
    const content = fs.readFileSync(courtroomEnginePath, 'utf8');
    expect(content).toContain("role: 'Judge'");
    expect(content).toContain('judgeVerdict');
  });

  it('ensures products.json has no blanket unverified claims or fake verified stamps', () => {
    const productsPath = path.join(srcDir, 'data/products.json');
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

    for (const product of products) {
      // Certifications should not be marked verified
      if (product.certifications) {
        for (const cert of product.certifications) {
          expect(cert.toLowerCase()).not.toContain('verified');
        }
      }
      // Name and description should not contain blanket fake eco claims
      expect(product.name.toLowerCase()).not.toContain('100% eco-friendly');
      expect(product.description.toLowerCase()).not.toContain('100% eco-friendly');
    }
  });
});
