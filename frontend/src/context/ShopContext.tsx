import React, { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShopContextType
} from "../types";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useProducts } from "../hooks/useProducts";

// Create the context with a default value to avoid `undefined` issues
export const ShopContext = createContext<ShopContextType | null>(null);

interface ShopContextProviderProps {
  children: ReactNode;
}

const ShopContextProvider: React.FC<ShopContextProviderProps> = ({ children }) => {
  const currency = "$";
  const delivery_fee = 10;
  const navigate = useNavigate();
  
  // State management
  const [search, setSearch] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Custom hooks for separated concerns
  const auth = useAuth();
  const products = useProducts(auth.token);
  const cart = useCart(auth.token, auth.user?.id);

  // Navigation helper
  const navigateTo = (path: string) => {
    navigate(path);
  };

  // Initialize the app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Fetch products first
        await products.fetchProducts();
        
        // If user is authenticated, sync cart
        if (auth.isLoggedIn && auth.user?.id) {
          await cart.syncCartOnAuth();
        } else {
          // Load cart from localStorage for non-authenticated users
          const localCart = localStorage.getItem('cartItems');
          if (localCart) {
            try {
              const parsedCart = JSON.parse(localCart);
              cart.setCartItems(parsedCart);
            } catch (error) {
              console.error('Error parsing localStorage cart:', error);
              cart.setCartItems({});
            }
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, [auth.isLoggedIn, auth.user?.id]);

  // Sync cart when user authentication status changes
  useEffect(() => {
    if (auth.isLoggedIn && auth.user?.id && !isInitializing) {
      cart.syncCartOnAuth();
    }
  }, [auth.isLoggedIn, auth.user?.id, isInitializing]);

  // Enhanced getCartAmount that uses products
  const getCartAmount = () => {
    return cart.getCartAmount(products.products);
  };

  // Load and sync cart helper function
  const loadAndSyncCart = async (): Promise<boolean> => {
    try {
      await cart.loadCartFromDatabase();
      return true;
    } catch (error) {
      console.error('Error loading and syncing cart:', error);
      return false;
    }
  };

  const value: ShopContextType = {
    products: products.products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems: cart.cartItems,
    addToCart: cart.addToCart,
    getCartCount: cart.getCartCount,
    updateQuantity: cart.updateQuantity,
    getCartAmount,
    navigate: navigateTo,
    refreshProducts: products.refreshProducts,
    forceRefreshProducts: products.forceRefreshProducts,
    isLoading: products.isLoading || auth.isLoading,
    isInitializing,
    
    // Authentication related
    token: auth.token,
    setToken: auth.setToken,
    isLoggedIn: auth.isLoggedIn,
    user: auth.user,
    loginUser: auth.loginUser,
    registerUser: auth.registerUser,
    logoutUser: auth.logoutUser,
    
    // Cart related
    setCartItems: cart.setCartItems,
    loadCartFromDatabase: cart.loadCartFromDatabase,
    syncCartOnAuth: cart.syncCartOnAuth,
    loadAndSyncCart,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;

// Custom hook to use the ShopContext
export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShopContext must be used within a ShopContextProvider');
  }
  return context;
};
