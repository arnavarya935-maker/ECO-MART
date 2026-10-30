const defaultSupabaseUrl = 'https://whrcgknnxkfmrnpmjyrm.supabase.co';
const defaultSupabaseAnonKey = 'sb_publishable_jPgE14w6iF-UJgdwhd0q5w_Clj-qPrO';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function cleanSupabaseUrl(url) {
  if (!url || typeof url !== 'string') return '';
  return url.trim().replace(/\/+$/, '').replace(/\/rest\/v1\/?$/i, '').replace(/\/auth\/v1\/?$/i, '').replace(/\/+$/, '');
}

const supabaseUrl = (rawUrl && typeof rawUrl === 'string' && rawUrl.startsWith('http') && rawUrl !== 'your_supabase_url_here')
  ? cleanSupabaseUrl(rawUrl)
  : defaultSupabaseUrl;

const supabaseAnonKey = (rawAnonKey && typeof rawAnonKey === 'string' && rawAnonKey !== 'your_supabase_anon_key_here')
  ? rawAnonKey.trim()
  : defaultSupabaseAnonKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  typeof supabaseUrl === 'string' &&
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey &&
  typeof supabaseAnonKey === 'string' &&
  supabaseAnonKey !== 'your_supabase_anon_key_here'
);

let clientPromise = null;

/**
 * Get or initialize the Supabase client dynamically to keep initial bundle small
 */
export async function getSupabase() {
  if (!isSupabaseConfigured) return null;
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) => {
      return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    });
  }
  return clientPromise;
}

/**
 * Sign in with Google using Supabase Auth OAuth flow
 */
export async function loginWithSupabaseGoogle() {
  const client = await getSupabase();
  if (!client) throw new Error('Supabase is not configured.');
  const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo
    }
  });
  if (error) throw error;
  return data;
}

/**
 * Sign in with Email/Password using Supabase
 */
export async function loginWithSupabaseEmail(email, password) {
  const client = await getSupabase();
  if (!client) throw new Error('Supabase is not configured.');
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

/**
 * Sign up with Email/Password using Supabase
 */
export async function signupWithSupabaseEmail(name, email, password) {
  const client = await getSupabase();
  if (!client) throw new Error('Supabase is not configured.');
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });
  if (error) throw error;
  return data;
}

/**
 * Canonical product mapper from Supabase row to Eco Sense app shape.
 * Never silently drops a product: provides safe defaults for all optional fields,
 * and logs a clear console warning for genuinely invalid rows (missing id/name).
 */
export function mapSupabaseProduct(row) {
  if (!row || typeof row !== 'object') {
    console.warn('[mapSupabaseProduct] Skipping invalid non-object row:', row);
    return null;
  }

  if (!row.id || !row.name) {
    console.warn('[mapSupabaseProduct] Skipping row missing mandatory id or name:', row);
    return null;
  }

  const category = (row.category || 'Kitchen').trim();
  const catSlug = category.toLowerCase().replace(/[\s&_]+/g, '-');
  const safeId = String(row.id).trim();
  const defaultImage = `/images/products/${safeId}.jpg`;
  const fallbackImage = `/images/categories/${catSlug}.svg`;
  const image = row.image || defaultImage || fallbackImage;

  return {
    id: safeId,
    name: String(row.name).trim(),
    category,
    price: typeof row.price === 'number' ? row.price : (Number(row.price) >= 0 ? Number(row.price) : 0),
    icon: row.icon || '🌿',
    badge: row.badge || '',
    description: row.description || '',
    material: row.material || 'Sustainable Material',
    packaging: row.packaging || 'plastic-free',
    carbonKg: typeof row.carbonKg === 'number' ? row.carbonKg : (Number(row.carbonKg) || 0.5),
    waterLitres: typeof row.waterLitres === 'number' ? row.waterLitres : (Number(row.waterLitres) || 50),
    plasticGrams: typeof row.plasticGrams === 'number' ? row.plasticGrams : (Number(row.plasticGrams) || 0),
    certifications: Array.isArray(row.certifications) ? row.certifications : [],
    madeInKm: typeof row.madeInKm === 'number' ? row.madeInKm : (Number(row.madeInKm) || 100),
    isEcoFriendly: Boolean(row.isEcoFriendly ?? true),
    conventionalAlternativeId: row.conventionalAlternativeId ? String(row.conventionalAlternativeId).trim() : null,
    ecoHighlights: Array.isArray(row.ecoHighlights) ? row.ecoHighlights : [],
    imageQuery: row.imageQuery || '',
    photographer: row.photographer || '',
    image,
    images: Array.isArray(row.images) && row.images.length > 0 ? row.images : [image],
    photoId: row.photoId || '',
    alt: row.alt || row.name,
    lqip: row.lqip || '',
    imageCredit: row.imageCredit && typeof row.imageCredit === 'object' ? row.imageCredit : {},
    barcode: row.barcode || '',
    tags: Array.isArray(row.tags) ? row.tags : [],
    inStock: row.inStock !== false,
    rating: typeof row.rating === 'number' ? row.rating : (row.isEcoFriendly ? 4.8 : 4.0),
    created_at: row.created_at || null
  };
}

/**
 * Fetch all products directly from Supabase and map to canonical product shape.
 * Products load ONLY from Supabase — never fall back to local JSON at runtime.
 */
export async function fetchProductsFromSupabase({ from = 0, to = 999 } = {}) {
  const client = await getSupabase();
  if (!client) {
    throw new Error("Couldn't load this right now");
  }
  const { data, error } = await client
    .from('products')
    .select('*')
    .range(from, to)
    .order('id', { ascending: true });

  if (error) {
    throw error;
  }

  const rawRows = data || [];
  const mapped = rawRows.map(mapSupabaseProduct).filter(Boolean);
  return mapped;
}
