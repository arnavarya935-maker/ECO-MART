const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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
 * Fetch all products directly from Supabase.
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
  return data || [];
}
