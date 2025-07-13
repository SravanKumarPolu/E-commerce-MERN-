import React, { ReactNode, createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { 
  Product, 
  ShopContextType, 
  CartData, 
  AuthResponse, 
  ProductResponse,
  ApiResponse,
  User
} from "../types";

// Define the backend URL
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

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
  const [cartItems, setCartItems] = useState<CartData>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [token, setToken] = useState<string>(localStorage.getItem('token') || '');
  const [user, setUser] = useState<User | null>(null);

  // Computed value for login status
  const isLoggedIn = token !== '';

  // Sync token with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  // Create axios instance with interceptors
  const api = axios.create({
    baseURL: backendUrl,
    timeout: 10000,
  });

  // Request interceptor to add token
  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.token = token;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for error handling
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        setToken('');
        setUser(null);
        toast.error("Session expired. Please login again.");
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  // Fetch products from backend
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get<ProductResponse>('/api/product/list');
      
      if (response.data.success) {
        console.log("📦 Fetched products:", response.data.products.map(p => ({
          name: p.name,
          inStock: p.inStock,
          stockQuantity: p.stockQuantity
        })));
        setProducts(response.data.products);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error(error?.response?.data?.message || "Error fetching products");
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  // Load cart data from database
  const loadCartFromDatabase = useCallback(async () => {
    if (!isLoggedIn || !user?.id) return;
    
    try {
      const response = await api.post('/api/cart/get', {
        userId: user.id
      });

      if (response.data.success) {
        const dbCartData = response.data.cartData || {};
        console.log("📦 Loaded cart from database:", dbCartData);
        setCartItems(dbCartData);
      } else {
        console.error("❌ Failed to load cart from database:", response.data.message);
      }
    } catch (error: any) {
      console.error("❌ Error loading cart from database:", error);
    }
  }, [isLoggedIn, user, api]);

  // Helper function to sync localStorage cart to database
  const syncLocalCartToDatabase = useCallback(async (cartData: CartData) => {
    if (!user?.id) return;
    
    try {
      // Update user's cartData in database
      const response = await api.post('/api/cart/sync-local', {
        userId: user.id,
        cartData
      });
      
      if (response.data.success) {
        console.log("✅ Local cart synced to database");
      }
    } catch (error) {
      console.error("❌ Error syncing local cart to database:", error);
    }
  }, [user, api]);

  // Sync cart with database on user authentication
  const syncCartOnAuth = useCallback(async () => {
    if (!isLoggedIn || !user?.id) {
      console.log("🔄 Skipping cart sync - user not authenticated");
      return;
    }
    
    try {
      console.log("🔄 Starting cart sync for user:", user.id);
      
      // First, try to load cart from database
      const response = await api.post('/api/cart/get', {
        userId: user.id
      });

      if (response.data.success) {
        const dbCartData = response.data.cartData || {};
        console.log("📦 Database cart data:", dbCartData);
        
        // If database has cart data, use it
        if (Object.keys(dbCartData).length > 0) {
          console.log("✅ Using database cart data");
          setCartItems(dbCartData);
        } else {
          console.log("📭 Database cart is empty, checking localStorage");
          
          // If database is empty but localStorage has data, sync localStorage to database
          const localCart = localStorage.getItem('cartItems');
          if (localCart) {
            try {
              const parsedLocalCart = JSON.parse(localCart);
              console.log("📱 localStorage cart:", parsedLocalCart);
              
              if (Object.keys(parsedLocalCart).length > 0) {
                console.log("📤 Syncing localStorage cart to database");
                await syncLocalCartToDatabase(parsedLocalCart);
                // Keep the current cart state (from localStorage)
                setCartItems(parsedLocalCart);
              } else {
                console.log("📭 Both database and localStorage are empty");
              }
            } catch (error) {
              console.error("❌ Error parsing localStorage cart:", error);
            }
          } else {
            console.log("📭 No localStorage cart found");
          }
        }
      } else {
        console.error("❌ Failed to get cart from database:", response.data.message);
      }
    } catch (error: any) {
      console.error("❌ Error syncing cart:", error);
      // If API call fails, keep using localStorage cart
      console.log("🔄 Falling back to localStorage cart");
    }
  }, [isLoggedIn, user, api, syncLocalCartToDatabase]);

  // Centralized function to load and sync cart from database
  const loadAndSyncCart = useCallback(async (userId: string) => {
    try {
      console.log("🔄 Loading cart from database for user:", userId);
      
      const response = await api.post('/api/cart/get', {
        userId: userId
      });

      if (response.data.success) {
        const dbCartData = response.data.cartData || {};
        console.log("📦 Database cart data:", dbCartData);
        
        if (Object.keys(dbCartData).length > 0) {
          // Database has cart data - use it
          console.log("✅ Using database cart data");
          setCartItems(dbCartData);
          return true;
        } else {
          // Database is empty - check localStorage
          console.log("📭 Database cart empty, checking localStorage");
          const localCart = localStorage.getItem('cartItems');
          
          if (localCart) {
            try {
              const parsedLocalCart = JSON.parse(localCart);
              if (Object.keys(parsedLocalCart).length > 0) {
                console.log("📤 Syncing localStorage to database:", parsedLocalCart);
                
                // Sync localStorage to database
                await api.post('/api/cart/sync-local', {
                  userId: userId,
                  cartData: parsedLocalCart
                });
                
                setCartItems(parsedLocalCart);
                console.log("✅ Cart synced successfully");
                return true;
              }
            } catch (error) {
              console.error("❌ Error parsing localStorage cart:", error);
            }
          }
          
          // No cart data anywhere
          setCartItems({});
          return true;
        }
      } else {
        console.error("❌ Failed to load cart:", response.data.message);
        return false;
      }
    } catch (error: any) {
      console.error("❌ Error loading cart:", error);
      return false;
    }
  }, [api]);

  // User login function with proper cart loading
  const loginUser = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post<AuthResponse>('/api/user/login', { email, password });
      
      if (response.data.success && response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user || null);
        
        // Load cart immediately after setting user
        if (response.data.user?.id) {
          console.log("🔄 Loading cart after successful login");
          await loadAndSyncCart(response.data.user.id);
        }
        
        toast.success("Login successful!");
        return true;
      } else {
        toast.error(response.data.message || "Login failed");
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error?.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      return false;
    }
  }, [api, loadAndSyncCart]);

  // User registration function
  const registerUser = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post<AuthResponse>('/api/user/register', { name, email, password });
      
      if (response.data.success && response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user || null);
        toast.success("Registration successful!");
        return true;
      } else {
        // Handle validation errors
        if (response.data.errors) {
          response.data.errors.forEach((err: any) => {
            toast.error(err.message);
          });
        } else {
          toast.error(response.data.message || "Registration failed");
        }
        return false;
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle validation errors
      if (error?.response?.data?.errors) {
        error.response.data.errors.forEach((err: any) => {
          toast.error(err.message);
        });
      } else {
        const errorMessage = error?.response?.data?.message || "Registration failed";
        toast.error(errorMessage);
      }
      return false;
    }
  }, []);

  // User logout function
  const logoutUser = useCallback(() => {
    setToken('');
    setUser(null);
    setCartItems({});
    toast.success("Logged out successfully!");
    navigate('/');
  }, [navigate]);

  // Check user authentication on app load and restore cart
  const checkAuthOnLoad = useCallback(async () => {
    try {
      if (!token) {
        console.log("🔍 No token found, skipping auth check");
        setIsInitializing(false);
        return;
      }
      
      console.log("🔍 Checking authentication on page load with token:", token.substring(0, 20) + "...");
      
      // Decode token to get user ID (basic decode, not verification)
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log("🔍 Token payload:", payload);
        
        if (payload.id) {
          // Set user from token payload
          const userData = {
            id: payload.id,
            name: payload.name || '',
            email: payload.email || '',
            role: payload.role || 'user'
          };
          
          console.log("✅ Setting user from token:", userData);
          setUser(userData);
          
          // Load cart data for the authenticated user (non-blocking)
          console.log("🔄 Loading cart on page refresh for user:", payload.id);
          // Don't await this to prevent blocking the UI
          loadAndSyncCart(payload.id).catch(error => {
            console.error("❌ Error loading cart on page refresh:", error);
          });
        }
      }
    } catch (error) {
      console.error("❌ Error checking auth on load:", error);
      // If token is invalid, clear it
      setToken('');
      setUser(null);
      setCartItems({});
    } finally {
      // Always set initialization to false to unblock UI
      setIsInitializing(false);
    }
  }, [token]); // Removed loadAndSyncCart dependency to prevent infinite loop

  // Load cart data from localStorage
  useEffect(() => {
    console.log("📱 Loading cart from localStorage on mount");
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log("📱 Found cart in localStorage:", parsedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('❌ Error parsing cart data:', error);
        localStorage.removeItem('cartItems');
      }
    } else {
      console.log("📱 No cart found in localStorage");
    }
  }, []);

  // Check authentication on app load
  useEffect(() => {
    // Set a timeout to ensure initialization doesn't hang forever
    const initTimeout = setTimeout(() => {
      console.log("⏰ Initialization timeout - forcing completion");
      setIsInitializing(false);
    }, 3000); // 3 second timeout

    checkAuthOnLoad().finally(() => {
      clearTimeout(initTimeout);
    });

    return () => {
      clearTimeout(initTimeout);
    };
  }, [checkAuthOnLoad]);

  // Remove the separate cart sync effect since it's now handled in checkAuthOnLoad
  // and loginUser functions directly

  // Save cart data to localStorage
  useEffect(() => {
    console.log("💾 Saving cart to localStorage:", cartItems);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = useCallback(async (itemId: string, color: string) => {
    if (!color) {
      toast.error("Please select a color");
      return;
    }

    const product = products.find(p => p._id === itemId);
    if (!product) {
      toast.error("Product not found");
      return;
    }

    // Debug logging
    console.log("🛒 Adding to cart:", {
      productName: product.name,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
      color: color,
      isLoggedIn,
      userId: user?.id
    });

    if (!product.inStock) {
      console.error("❌ Product out of stock:", product);
      toast.error("Product is out of stock");
      return;
    }

    // Update local cart state first (for immediate UI update)
    setCartItems(prev => {
      const updated = { ...prev };
      if (!updated[itemId]) {
        updated[itemId] = {};
      }
      updated[itemId][color] = (updated[itemId][color] || 0) + 1;
      console.log("🛒 Updated local cart:", updated);
      return updated;
    });

    // If user is logged in, also save to database
    if (isLoggedIn && user?.id) {
      try {
        console.log("💾 Saving to database for user:", user.id);
        const response = await api.post('/api/cart/add', {
          userId: user.id,
          itemId,
          color
        });

        if (response.data.success) {
          console.log("✅ Cart saved to database:", response.data.cartData);
        } else {
          console.error("❌ Failed to save cart to database:", response.data.message);
          toast.error("Failed to save cart to database");
        }
      } catch (error: any) {
        console.error("❌ Error saving cart to database:", error);
        toast.error("Error saving cart to database");
      }
    } else {
      console.log("ℹ️ User not logged in, cart saved to localStorage only");
    }

    toast.success("Item added to cart!");
  }, [products, isLoggedIn, user, api]);

  // Get cart count
  const getCartCount = useCallback((): number => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const color in cartItems[itemId]) {
        totalCount += cartItems[itemId][color];
      }
    }
    return totalCount;
  }, [cartItems]);

  // Update cart quantity
  const updateQuantity = useCallback(async (itemId: string, color: string, quantity: number) => {
    console.log("🔄 Updating cart quantity:", { itemId, color, quantity, userId: user?.id });
    
    // Update local cart state first (for immediate UI update)
    setCartItems(prev => {
      const updated = { ...prev };
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        if (updated[itemId] && updated[itemId][color]) {
          delete updated[itemId][color];
          if (Object.keys(updated[itemId]).length === 0) {
            delete updated[itemId];
          }
        }
      } else {
        // Update quantity
        if (!updated[itemId]) {
          updated[itemId] = {};
        }
        updated[itemId][color] = quantity;
      }
      
      console.log("🔄 Updated local cart:", updated);
      return updated;
    });

    // If user is logged in, also update in database
    if (isLoggedIn && user?.id) {
      try {
        console.log("💾 Updating database for user:", user.id);
        const response = await api.post('/api/cart/update', {
          userId: user.id,
          itemId,
          color,
          quantity
        });

        if (response.data.success) {
          console.log("✅ Cart updated in database:", response.data.cartData);
        } else {
          console.error("❌ Failed to update cart in database:", response.data.message);
          toast.error("Failed to update cart in database");
        }
      } catch (error: any) {
        console.error("❌ Error updating cart in database:", error);
        toast.error("Error updating cart in database");
      }
    } else {
      console.log("ℹ️ User not logged in, cart updated in localStorage only");
    }
  }, [isLoggedIn, user, api]);

  // Get cart total amount
  const getCartAmount = useCallback((): number => {
    let totalAmount = 0;
    
    for (const itemId in cartItems) {
      const itemInfo = products.find(product => product._id === itemId);
      if (itemInfo) {
        for (const color in cartItems[itemId]) {
          totalAmount += itemInfo.price * cartItems[itemId][color];
        }
      }
    }
    
    return totalAmount;
  }, [cartItems, products]);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debug function to check cart state (moved after getCartCount)
  const debugCartState = useCallback(() => {
    console.log("🔍 Current Cart Debug Info:");
    console.log("- isLoggedIn:", isLoggedIn);
    console.log("- user:", user);
    console.log("- token:", token ? token.substring(0, 20) + "..." : "none");
    console.log("- cartItems:", cartItems);
    console.log("- localStorage cart:", localStorage.getItem('cartItems'));
    console.log("- Cart count:", getCartCount());
  }, [isLoggedIn, user, token, cartItems, getCartCount]);

  // Make debug function available globally
  useEffect(() => {
    (window as any).debugCart = debugCartState;
    return () => {
      delete (window as any).debugCart;
    };
  }, [debugCartState]);

  // Context value
  const value: ShopContextType = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    refreshProducts,
    isLoading,
    isInitializing,
    token,
    setToken,
    isLoggedIn,
    loginUser,
    registerUser,
    logoutUser,
    setCartItems,
    forceRefreshProducts,
    loadCartFromDatabase,
    syncCartOnAuth,
    loadAndSyncCart
  };

  return (
    <ShopContext.Provider value={value}>
      {isInitializing ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Initializing...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </ShopContext.Provider>
  );
};

// Custom hook to use the shop context
export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShopContext must be used within a ShopContextProvider');
  }
  return context;
};

export default ShopContextProvider;
