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

  it('scans all files in src/ for "Seeded sample", "1428", "842.6", and "100% plastic-free" and finds zero occurrences', () => {
    const forbiddenPhrases = [
      'seeded sample',
      '1428',
      '842.6',
      '100% plastic-free'
    ];
    const violations = [];
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8').toLowerCase();
      for (const phrase of forbiddenPhrases) {
        if (content.includes(phrase)) {
          violations.push({ file: path.relative(srcDir, file), phrase });
        }
      }
    }
    expect(violations).toEqual([]);
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

  it('scans all files in src/ for "Seeded sample", "1428", "842.6", and "100% plastic-free" and finds zero occurrences', () => {
    const forbiddenPhrases = [
      'seeded sample',
      '1428',
      '842.6',
      '100% plastic-free'
    ];
    const violations = [];
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8').toLowerCase();
      for (const phrase of forbiddenPhrases) {
        if (content.includes(phrase)) {
          violations.push({ file: path.relative(srcDir, file), phrase });
        }
      }
    }
    expect(violations).toEqual([]);
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

  it('scans all files in src/ for "Seeded sample", "1428", "842.6", and "100% plastic-free" and finds zero occurrences', () => {
    const forbiddenPhrases = [
      'seeded sample',
      '1428',
      '842.6',
      '100% plastic-free'
    ];
    const violations = [];
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8').toLowerCase();
      for (const phrase of forbiddenPhrases) {
        if (content.includes(phrase)) {
          violations.push({ file: path.relative(srcDir, file), phrase });
        }
      }
    }
    expect(violations).toEqual([]);
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

  it('scans all files in src/ for "Seeded sample", "1428", "842.6", and "100% plastic-free" and finds zero occurrences', () => {
    const forbiddenPhrases = [
      'seeded sample',
      '1428',
      '842.6',
      '100% plastic-free'
    ];
    const violations = [];
    for (const file of files) {
      const fileContent = fs.readFileSync(file, 'utf8').toLowerCase();
      for (const phrase of forbiddenPhrases) {
        if (fileContent.includes(phrase)) {
          violations.push({ file: path.relative(srcDir, file), phrase });
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it('scans all files in src/ for "Seeded sample", "1428", "842.6", and "100% plastic-free" and finds zero occurrences', () => {
    const forbiddenPhrases = [
      'seeded sample',
      '1428',
      '842.6',
      '100% plastic-free'
    ];
    const violations = [];
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8').toLowerCase();
      for (const phrase of forbiddenPhrases) {
        if (content.includes(phrase)) {
          violations.push({ file: path.relative(srcDir, file), phrase });
        }
      }
    }
    expect(violations).toEqual([]);
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

  it('scans all UI files in src/ for unprovable claims (ISO 14040, zero/0% bias, independent registry)', () => {
    const allowlistPath = path.resolve(__dirname, 'claims-allowlist.json');
    const allowlist = JSON.parse(fs.readFileSync(allowlistPath, 'utf8'));
    const allowedFiles = new Set(allowlist.exceptions.map((e) => e.file.replace(/\\/g, '/')));

    const forbiddenPhrases = [
      'iso 14040',
      'zero bias',
      '0% bias',
      '0% sponsored bias',
      'zero commercial bias',
      'independent registry'
    ];

    const violations = [];

    for (const file of files) {
      const relPath = path.normalize(path.relative(path.resolve(__dirname, '..'), file)).replace(/\\/g, '/');
      if (allowedFiles.has(relPath)) continue;

      const content = fs.readFileSync(file, 'utf8').toLowerCase();
      for (const phrase of forbiddenPhrases) {
        if (content.includes(phrase)) {
          violations.push({ file: relPath, phrase });
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('scans UI components and pages for unprovable "verified" and "audited" words', () => {
    const allowlistPath = path.resolve(__dirname, 'claims-allowlist.json');
    const allowlist = JSON.parse(fs.readFileSync(allowlistPath, 'utf8'));
    const allowedFiles = new Set(allowlist.exceptions.map((e) => e.file.replace(/\\/g, '/')));

    const uiFiles = files.filter((f) => {
      const norm = f.replace(/\\/g, '/');
      return norm.includes('/src/components/') || norm.includes('/src/pages/');
    });

    const violations = [];
    // We check user-visible text (e.g. inside JSX or strings)
    for (const file of uiFiles) {
      const relPath = path.normalize(path.relative(path.resolve(__dirname, '..'), file)).replace(/\\/g, '/');
      if (allowedFiles.has(relPath)) continue;

      const content = fs.readFileSync(file, 'utf8');
      // Match word "verified" or "audited" when not preceded by "un" (e.g. unverified) or "not"
      const verifiedMatches = content.match(/\b(?<!un|not\s)verified\b/gi) || [];
      const auditedMatches = content.match(/\baudited\b/gi) || [];

      if (verifiedMatches.length > 0 || auditedMatches.length > 0) {
        violations.push({
          file: relPath,
          verified: verifiedMatches.length,
          audited: auditedMatches.length
        });
      }
    }

    expect(violations).toEqual([]);
  });
});
