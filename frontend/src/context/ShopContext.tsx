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

  // Refresh products function
  const refreshProducts = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  // User login function
  const loginUser = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post<AuthResponse>('/api/user/login', { email, password });
      
      if (response.data.success && response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user || null);
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
  }, []);

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

  // Load cart data from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart data:', error);
        localStorage.removeItem('cartItems');
      }
    }
  }, []);

  // Save cart data to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = useCallback((itemId: string, color: string) => {
    if (!color) {
      toast.error("Please select a color");
      return;
    }

    const product = products.find(p => p._id === itemId);
    if (!product) {
      toast.error("Product not found");
      return;
    }

    if (!product.inStock) {
      toast.error("Product is out of stock");
      return;
    }

    setCartItems(prev => {
      const updated = { ...prev };
      if (!updated[itemId]) {
        updated[itemId] = {};
      }
      updated[itemId][color] = (updated[itemId][color] || 0) + 1;
      return updated;
    });

    toast.success("Item added to cart!");
  }, [products]);

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
  const updateQuantity = useCallback((itemId: string, color: string, quantity: number) => {
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
      
      return updated;
    });
  }, []);

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
    token,
    setToken,
    isLoggedIn,
    loginUser,
    registerUser,
    logoutUser,
    setCartItems
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
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
