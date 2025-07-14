import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Product, ProductResponse } from '../types';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export const useProducts = (token: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch products from backend
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${backendUrl}/api/product/list`, {
        headers: token ? { 'token': token } : {},
      });
      
      const data: ProductResponse = await response.json();
      
      if (data.success) {
        console.log("📦 Fetched products:", data.products.map(p => ({
          name: p.name,
          inStock: p.inStock,
          stockQuantity: p.stockQuantity
        })));
        setProducts(data.products);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error(error?.message || "Error fetching products");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Force refresh products (clears cache)
  const forceRefreshProducts = useCallback(async () => {
    console.log("🔄 Force refreshing products...");
    await fetchProducts();
    toast.info("Products refreshed!");
  }, [fetchProducts]);

  // Refresh products function
  const refreshProducts = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    setProducts,
    isLoading,
    fetchProducts,
    refreshProducts,
    forceRefreshProducts,
  };
}; 