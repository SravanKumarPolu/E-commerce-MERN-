import React, { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { apiService, Product, CartItem, Order } from "../utils/api";
import { useAuth } from "./AuthContext";
import { useErrorHandler } from "../hooks/useErrorHandler";

// Define the shape of the context
interface ShopContextValue {
  products: Product[];
  currency: string;
  delivery_fee: number;
  search: string;
  loading: boolean;
  error: string | null;
  getCartAmount: () => number;
  navigate: ReturnType<typeof useNavigate>;
  addToCart: (itemId: string, size?: string, color?: string) => Promise<void>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  showSearch: boolean;
  getCartCount: () => number;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  updateQuantity: (itemId: string, quantity: number, size?: string, color?: string) => Promise<void>;
  refreshProducts: () => Promise<Product[] | null>;
  refreshCart: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getUserOrders: () => Promise<Order[]>;
  placeOrder: (orderData: any) => Promise<Order | null>;
  retryLastOperation: () => void;
  clearError: () => void;
}

// Create the context with a default value to avoid `undefined` issues
export const ShopContext = createContext<ShopContextValue | null>(null);

interface ShopContextProviderProps {
  children: ReactNode;
}

const ShopContextProvider: React.FC<ShopContextProviderProps> = ({ children }) => {
  const currency = "$";
  const delivery_fee = 10;
  const [search, setSearch] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Use the error handler hook
  const { 
    execute, 
    retry, 
    clearError: clearErrorHandler,
    error: handlerError,
    loading: handlerLoading 
  } = useErrorHandler();

  // Combine local loading state with error handler loading
  const isLoading = loading || handlerLoading;

  // Fetch products on mount
  useEffect(() => {
    refreshProducts();
  }, []);

  // Fetch cart items when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated]);

  const refreshProducts = async () => {
    const result = await execute(
      async () => {
        const response = await apiService.getProducts();
        if (response.success && response.data) {
          setProducts(response.data);
          setError(null);
          return response.data;
        } else {
          throw new Error('Failed to fetch products');
        }
      },
      {
        toastMessage: 'Failed to load products',
        onError: (error) => {
          setError(error.message);
          setProducts([]);
        }
      }
    );

    setLoading(false);
    return result;
  };

  const refreshCart = async () => {
    if (!isAuthenticated) return;
    
    await execute(
      async () => {
        const response = await apiService.getCart();
        if (response.success && response.data) {
          setCartItems(response.data);
          return response.data;
        } else {
          throw new Error('Failed to fetch cart items');
        }
      },
      {
        showToast: false, // Don't show toast for cart refresh errors
        logError: false,
        onError: (error) => {
          console.error('Error fetching cart items:', error);
          setCartItems([]);
        }
      }
    );
  };

  const addToCart = async (itemId: string, size?: string, color?: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate('/login');
      return;
    }

    if (!size && !color) {
      toast.error("Please select size or color");
      return;
    }

    await execute(
      async () => {
        const response = await apiService.addToCart(itemId, size, color);
        if (response.success) {
          await refreshCart();
          toast.success("Item added to cart");
          return response;
        } else {
          throw new Error(response.message || "Failed to add item to cart");
        }
      },
      {
        toastMessage: 'Failed to add item to cart',
        retryAttempts: 2,
        onError: (error) => {
          console.error('Error adding to cart:', error);
        }
      }
    );
  };

  const updateQuantity = async (itemId: string, quantity: number, size?: string, color?: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to update cart");
      return;
    }

    await execute(
      async () => {
        const response = await apiService.updateCart(itemId, quantity, size, color);
        if (response.success) {
          await refreshCart();
          if (quantity === 0) {
            toast.success("Item removed from cart");
          } else {
            toast.success("Cart updated");
          }
          return response;
        } else {
          throw new Error(response.message || "Failed to update cart");
        }
      },
      {
        toastMessage: 'Failed to update cart',
        retryAttempts: 2,
        onError: (error) => {
          console.error('Error updating cart:', error);
        }
      }
    );
  };

  const getCartCount = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartAmount = (): number => {
    let totalAmount = 0;
    
    for (const cartItem of cartItems) {
      const product = products.find(p => p._id === cartItem.productId);
      if (product) {
        totalAmount += product.price * cartItem.quantity;
      }
    }
    
    return totalAmount;
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(product => product._id === id);
  };

  const getUserOrders = async (): Promise<Order[]> => {
    if (!isAuthenticated) {
      toast.error("Please login to view orders");
      return [];
    }

    const result = await execute(
      async () => {
        const response = await apiService.getUserOrders();
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error("Failed to fetch orders");
        }
      },
      {
        toastMessage: 'Failed to load orders',
        retryAttempts: 2,
        onError: (error) => {
          console.error('Error fetching orders:', error);
        }
      }
    );

    return result || [];
  };

  const placeOrder = async (orderData: {
    items: { productId: string; quantity: number; size?: string; color?: string }[];
    amount: number;
    address: {
      firstName: string;
      lastName: string;
      email: string;
      street: string;
      city: string;
      state: string;
      zipcode: string;
      country: string;
      phone: string;
    };
  }): Promise<Order | null> => {
    if (!isAuthenticated) {
      toast.error("Please login to place order");
      return null;
    }

    const result = await execute(
      async () => {
        const response = await apiService.placeOrder(orderData);
        if (response.success && response.data) {
          // Clear cart after successful order
          setCartItems([]);
          toast.success("Order placed successfully!");
          return response.data;
        } else {
          throw new Error(response.message || "Failed to place order");
        }
      },
      {
        toastMessage: 'Failed to place order',
        retryAttempts: 1,
        onError: (error) => {
          console.error('Error placing order:', error);
        }
      }
    );

    return result;
  };

  const retryLastOperation = () => {
    retry();
  };

  const clearError = () => {
    setError(null);
    clearErrorHandler();
  };

  const value: ShopContextValue = {
    products,
    currency,
    delivery_fee,
    search,
    loading: isLoading,
    error: error || handlerError?.message || null,
    setSearch,
    getCartCount,
    updateQuantity,
    showSearch,
    addToCart,
    cartItems,
    getCartAmount,
    setCartItems,
    setShowSearch,
    navigate,
    refreshProducts,
    refreshCart,
    getProductById,
    getUserOrders,
    placeOrder,
    retryLastOperation,
    clearError,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

// Custom hook to ensure safe context usage
export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShopContext must be used within a ShopContextProvider");
  }
  return context;
};

export default ShopContextProvider;
