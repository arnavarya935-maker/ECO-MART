import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { fetchProductsFromSupabase, isSupabaseConfigured } from '../lib/supabase';

const ProductsContext = createContext({
  products: [],
  loading: true,
  error: null,
  retry: () => {},
  getProductById: () => null
});

/**
 * ProductsProvider
 * Loads products ONLY from Supabase at runtime.
 * Never uses local JSON as a runtime fallback.
 * For network/database failures, sets a neutral error message ("Couldn't load this right now").
 */
export function ProductsProvider({ children, initialProducts = null }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      setError("Couldn't load this right now");
      setLoading(false);
      return;
    }

    try {
      const data = await fetchProductsFromSupabase();
      setProducts(data);
    } catch (err) {
      console.warn("Couldn't load this right now:", err.message);
      setError("Couldn't load this right now");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialProducts) {
      loadProducts();
    }
  }, [loadProducts, initialProducts]);

  const getProductById = useCallback(
    (id) => products.find((p) => p.id === id) || null,
    [products]
  );

  const contextValue = useMemo(() => ({
    products,
    loading,
    error,
    retry: loadProducts,
    getProductById
  }), [products, loading, error, loadProducts, getProductById]);

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
