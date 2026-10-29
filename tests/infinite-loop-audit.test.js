import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

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

describe('Infinite Loop & Context Memoization Audit', () => {
  it('ensures all context providers pass memoized values rather than inline objects', () => {
    const contextDir = path.resolve(process.cwd(), 'src/context');
    const files = fs.readdirSync(contextDir).filter((f) => f.endsWith('.jsx'));

    const unmemoizedProviders = [];

    for (const file of files) {
      const fullPath = path.join(contextDir, file);
      const content = fs.readFileSync(fullPath, 'utf8');

      // Check if Context.Provider is used with an inline object literal value={{ ... }}
      const inlineValuePattern = /<\w+Context\.Provider\s+value=\{\{/;
      if (inlineValuePattern.test(content)) {
        unmemoizedProviders.push(file);
      }

      // Ensure useMemo is used in the provider file
      if (!content.includes('useMemo(')) {
        unmemoizedProviders.push(`${file} (missing useMemo)`);
      }
    }

    expect(unmemoizedProviders).toEqual([]);
  });

  it('scans useEffect hooks across src/ to ensure no unguarded cyclic state setters exist', () => {
    const srcDir = path.resolve(process.cwd(), 'src');
    const files = getSourceFiles(srcDir);
    const riskyEffects = [];

    // Context functions that could trigger cascading renders if unmemoized or unguarded
    const contextFunctions = [
      'addToCart', 'removeFromCart', 'updateQuantity', 'swapItemInCart',
      'clearCart', 'showToast', 'dismissToast', 'toggleWishlist',
      'trackRecentlyViewed', 'trackCategoryBrowsing', 'recordOrder',
      'toggleTheme', 'login', 'signup', 'logout', 'addEcoPoints'
    ];

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      // Match useEffect blocks
      const effectRegex = /useEffect\s*\(\s*\(\)\s*=>\s*\{([\s\S]*?)\}\s*,\s*\[(.*?)\]\s*\)/g;
      let match;

      while ((match = effectRegex.exec(content)) !== null) {
        const body = match[1];
        const depsStr = match[2];
        const deps = depsStr.split(',').map((d) => d.trim()).filter(Boolean);

        for (const dep of deps) {
          // If the effect depends on a context function
          if (contextFunctions.includes(dep)) {
            // Check if it unconditionally calls a state setter
            // Avoid false positives on localStorage.setItem
            const setterMatch = body.match(/(?<!localStorage\.|sessionStorage\.)\bset[A-Z]\w*\s*\(/g);
            if (setterMatch && !body.includes('if (') && !body.includes('if(') && !body.includes('Ref.current')) {
              riskyEffects.push({
                file: path.relative(process.cwd(), file),
                dep,
                setters: setterMatch,
                reason: 'Unguarded setState with context function dependency'
              });
            }
          }

          // If effect depends on state variable `X` and directly calls `setX(X)` unconditionally
          const capitalized = dep.charAt(0).toUpperCase() + dep.slice(1);
          const directSetter = new RegExp(`(?<!\\.)\\bset${capitalized}\\s*\\([^)]*\\b${dep}\\b`);
          if (directSetter.test(body) && !body.includes('if (') && !body.includes('if(')) {
            riskyEffects.push({
              file: path.relative(process.cwd(), file),
              dep,
              reason: `Direct cyclic setState on dependency ${dep}`
            });
          }
        }
      }
    }

    expect(riskyEffects).toEqual([]);
  });
});
