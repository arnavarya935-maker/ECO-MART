/**
 * Offline-first password hashing using standard Web Crypto API (SHA-256 + salt)
 * For local browser demo & offline authentication.
 */

export function generateSalt() {
  const array = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 16; i++) array[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + ':' + salt);
  
  if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Pure JS fallback in case subtle crypto is unavailable in unusual environments
  let hash = 0;
  const str = password + ':' + salt;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(32, '0');
}

/**
 * Password Strength Meter (0 - 100)
 */
export function calculatePasswordStrength(password) {
  if (!password) return { score: 0, label: 'Empty', color: 'bg-surface-sunken' };

  let score = 0;
  if (password.length >= 8) score += 30;
  if (password.length >= 12) score += 15;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 20;
  if (/\d/.test(password)) score += 20;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;

  score = Math.min(100, score);

  if (score < 40) return { score, label: 'Weak', color: 'bg-danger', text: 'text-danger' };
  if (score < 70) return { score, label: 'Medium', color: 'bg-warning', text: 'text-warning' };
  return { score, label: 'Strong', color: 'bg-primary', text: 'text-primary' };
}
