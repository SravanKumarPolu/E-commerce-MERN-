import React, { ReactNode, createContext, useContext, useState, useEffect } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Define the backend URL
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// Define the shape of the context
interface ShopContextValue {
  products: any[];
  currency: string;
  delivery_fee: number;
  search: string;
  getCartAmount: () => number;
  navigate: ReturnType<typeof useNavigate>;
  addToCart: (itemId: string, size: string) => void;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  showSearch: boolean;
  getCartCount: () => number;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: Record<string, Record<string, number>>;
  setCartItems: React.Dispatch<React.SetStateAction<Record<string, Record<string, number>>>>;
  updateQuantity: (itemId: string, color: string, quantity: number) => void;
  refreshProducts: () => void;
  isLoading: boolean;
  // Authentication related
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  isLoggedIn: boolean;
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (name: string, email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
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
  const [cartItems, setCartItems] = useState<Record<string, Record<string, number>>>({});
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>(localStorage.getItem('token') || '');
  const navigate = useNavigate();

  // Computed value for login status
  const isLoggedIn = token !== '';

  // Sync token with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message || "Failed to fetch products");
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error(error?.message || "Error fetching products");
    } finally {
      setIsLoading(false);
    }
  };

  // User login function
  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
      
      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Login successful!");
        return true;
      } else {
        toast.error(response.data.message || "Login failed");
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error?.response?.data?.message || "Login failed");
      return false;
    }
  };

  // User registration function
  const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
      
      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Registration successful!");
        return true;
      } else {
        toast.error(response.data.message || "Registration failed");
        return false;
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error?.response?.data?.message || "Registration failed");
      return false;
    }
  };

  // User logout function
  const logoutUser = () => {
    setToken('');
    setCartItems({});
    toast.success("Logged out successfully!");
  };

  // Refresh products function that can be called from outside
  const refreshProducts = () => {
    fetchProducts();
    toast.info("Refreshing products...");
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto-refresh products every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchProducts();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Modified addToCart function with authentication check
  const addToCart = (itemId: string, color: string) => {
    // Check if user is logged in
    if (!isLoggedIn || !token) {
      toast.error("Please login to add items to cart");
      navigate('/login');
      return;
    }

    if (!color) {
      toast.error("Select Product Color");
      return;
    }

    setCartItems((prevCart) => {
      const updatedCart = { ...prevCart };

      if (!updatedCart[itemId]) {
        updatedCart[itemId] = {};
      }

      if (updatedCart[itemId][color]) {
        updatedCart[itemId][color] += 1;
      } else {
        updatedCart[itemId][color] = 1;
      }

      return updatedCart;
    });

    toast.success("Item added to cart");
  };

  const getCartCount = (): number => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.error('Error calculating cart count:', error);
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId: string, color: string, quantity: number) => {
    const cartData = structuredClone(cartItems);
    if (cartData[itemId] && cartData[itemId][color] !== undefined) {
      cartData[itemId][color] = quantity;
    }
    setCartItems(cartData);
  };

  const getCartAmount = (): number => {
    let totalAmount = 0;
    for (const items in cartItems) {
      const itemInfo = products.find((product) => product._id === items);
      if (itemInfo) {
        for (const color in cartItems[items])
          try {
            if (cartItems[items][color] > 0) {
              totalAmount += itemInfo.price * cartItems[items][color]
            }
          }
          catch (error) {
            console.error('Error calculating cart amount:', error);
          }
      }
    }
    return totalAmount;
  };

  const value: ShopContextValue = {
    products,
    currency,
    delivery_fee,
    search,
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
    isLoading,
    // Authentication
    token,
    setToken,
    isLoggedIn,
    loginUser,
    registerUser,
    logoutUser,
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
