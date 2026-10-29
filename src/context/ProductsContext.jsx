import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { fetchProductsFromSupabase, isSupabaseConfigured } from '../lib/supabase';
import productsData from '../data/products.json';

const ProductsContext = createContext({
  products: [],
  loading: true,
  error: null,
  retry: () => {},
  getProductById: () => null
});

/**
 * ProductsProvider
 * Initializes with the complete 124-product catalog and synchronizes live from Supabase.
 * Guarantees that products are never empty if database credentials or network is pending.
 */
export function ProductsProvider({ children, initialProducts = productsData }) {
  const [products, setProducts] = useState(initialProducts || productsData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    if (!isSupabaseConfigured) {
      // Keep baseline catalog if Supabase credentials are not in environment
      return;
    }

    try {
      const data = await fetchProductsFromSupabase();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      }
    } catch (err) {
      console.warn("Couldn't sync live database right now:", err.message);
      // Retain existing productsData baseline so products never vanish
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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
