import fs from 'node:fs';
import path from 'node:path';

// Brand names, acronyms, and technical tokens that do not require translation
const ALLOW_LIST = new Set([
  'Eco Sense', 'EcoSense', 'EcoScore', 'Eco Agent', 'EcoAgent',
  'Gemini', 'Google', 'Vercel', 'Tailwind', 'React', 'Vite',
  'ISO', 'ISO 14040', 'ISO 14021', 'FSC', 'GOTS', 'B Corp', 'ASTM', 'CPCB', 'FTC',
  'CO2', 'CO₂', 'kg', 'g', 'L', '₹', 'Rs', 'INR', 'Wh', 'kWh', 'm', 'km',
  'PWA', 'OCR', 'NLP', 'MCDM', 'AI', 'API', 'UI', 'UX', 'ID', 'SKU',
  'GitHub', 'OpenGraph', 'OK', 'URL', 'JSON', 'NaN', 'undefined',
  'Home', 'Shop', 'Tools', 'Impact', 'Learn', 'News', 'Community', 'Settings',
  'English', 'Hindi', 'Hinglish'
]);

function isIgnoredString(str) {
  const trimmed = str.trim();
  if (!trimmed) return true;
  if (/^[\d\s.,/\\+*%$#@!^&()_=\-[\]{}|;:'"<>?~`]+$/.test(trimmed)) return true; // Only punctuation/numbers
  if (/^https?:\/\//.test(trimmed)) return true; // URLs
  if (ALLOW_LIST.has(trimmed)) return true;
  if (/^(rgb|rgba|hsl|var|calc|px|rem|em|vh|vw)/.test(trimmed)) return true;
  // If only 1 or 2 characters and not a meaningful word
  if (trimmed.length <= 2 && !/^[A-Za-z]{2}$/.test(trimmed)) return true;
  return false;
}

export function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const results = [];

  // Match text between JSX tags >text<
  // Ignore lines inside comments or scripts
  const tagTextRegex = />([^<>{}\r\n]+)</g;
  let match;
  while ((match = tagTextRegex.exec(content)) !== null) {
    const text = match[1].trim();
    if (text && !isIgnoredString(text) && /[a-zA-Z]/.test(text)) {
      // Check if it's purely template or code
      if (!text.startsWith('&') || text.length > 6) {
        results.push({
          type: 'text',
          text,
          line: content.slice(0, match.index).split('\n').length
        });
      }
    }
  }

  // Match props: placeholder="...", aria-label="...", title="...", alt="..."
  const propRegex = /(placeholder|aria-label|title|alt)\s*=\s*["']([^"']+)["']/g;
  while ((match = propRegex.exec(content)) !== null) {
    const propName = match[1];
    const text = match[2].trim();
    if (text && !isIgnoredString(text) && /[a-zA-Z]/.test(text)) {
      results.push({
        type: `prop:${propName}`,
        text,
        line: content.slice(0, match.index).split('\n').length
      });
    }
  }

  return results;
}

export function scanAllFiles(rootDir = path.resolve(process.cwd(), 'src')) {
  const allResults = {};

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!['node_modules', '.git', 'dist', 'build', '__tests__', 'tests'].includes(entry.name)) {
          walk(fullPath);
        }
      } else if (/\.(jsx|tsx)$/.test(entry.name)) {
        const issues = scanFile(fullPath);
        if (issues.length > 0) {
          const relPath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');
          allResults[relPath] = issues;
        }
      }
    }
  }

  walk(rootDir);
  return allResults;
}

// When executed directly via node scripts/find-untranslated.mjs
const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('find-untranslated.mjs') ||
  process.argv[1].endsWith('find-untranslated')
);

if (isDirectRun) {
  console.log('--- Scanning for untranslated JSX text & props in src/ ---');
  const results = scanAllFiles();
  let totalIssues = 0;
  const fileCount = Object.keys(results).length;

  for (const [file, issues] of Object.entries(results)) {
    console.log(`\n📄 ${file} (${issues.length} items):`);
    for (const issue of issues.slice(0, 5)) {
      console.log(`   L${issue.line} [${issue.type}] "${issue.text}"`);
    }
    if (issues.length > 5) {
      console.log(`   ... and ${issues.length - 5} more`);
    }
    totalIssues += issues.length;
  }

  console.log(`\nSummary: Found ${totalIssues} potentially untranslated strings across ${fileCount} files.`);
}

