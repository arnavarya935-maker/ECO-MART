import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function getSourceFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getSourceFiles(full));
    } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.js')) {
      results.push(full);
    }
  }
  return results;
}

describe('Hook Import & Undefined Variables Audit', () => {
  it('scans all src/ files to ensure React hooks are imported before use', () => {
    const hooks = ['useState', 'useEffect', 'useMemo', 'useRef', 'useCallback', 'useContext', 'useId', 'useReducer'];
    const srcDir = path.resolve(process.cwd(), 'src');
    const files = getSourceFiles(srcDir);
    const missingImports = [];

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      for (const hook of hooks) {
        // Match bare hook usage: not preceded by a dot
        const hookRegex = new RegExp(`(?<!\\.)\\b${hook}\\s*\\(`, 'g');
        if (hookRegex.test(content)) {
          // Check whether the hook is imported from 'react'
          const importPattern = new RegExp(`import\\s+[^;]*\\b${hook}\\b[^;]*from\\s*['"]react['"]`);
          // Or defined locally (like a custom hook or wrapper)
          const localDefPattern = new RegExp(`(?:const|function|let|var)\\s+${hook}\\b`);
          if (!importPattern.test(content) && !localDefPattern.test(content)) {
            missingImports.push({ file: path.relative(process.cwd(), file), hook });
          }
        }
      }
    }

    expect(missingImports).toEqual([]);
  });

  it('runs oxlint no-undef check across src/ and server/ with 0 errors', () => {
    try {
      // Run oxlint with -D no-undef (treat no-undef as error level)
      const output = execSync('npx oxlint -D no-undef src server api', {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
      });
      expect(output).not.toContain('error(no-undef)');
    } catch (err) {
      const stdout = err.stdout?.toString() || '';
      const stderr = err.stderr?.toString() || '';
      const full = stdout + '\n' + stderr;
      // If there are errors other than warnings, check if no-undef triggered
      const hasNoUndef = full.includes('no-undef') && full.includes('error');
      expect(hasNoUndef ? full : false).toBe(false);
    }
  });
});
