import React, { ReactNode, createContext, useEffect, useState } from 'react';

import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  image: string[];
  bestseller: boolean;
  description: string;   // Add missing properties
  size: string[];       // Add missing properties
  date: number;
  quantity?: number;
  // Add other properties as needed
}
// Define the shape of the context
interface ShopContextValue {
  products: Product[];
  currency: string;
  delivery_fee: number;
  search: string;
  token: string;
  backendUrl: string;
  getUserCart: (token: string) => Promise<void>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: Record<string, Record<string, number>>;
  addToCart: (itemId: string, size: string) => void;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  getCartCount: () => number;
  getCartAmount: () => number;
  updateQuantity: (itemId: string, size: string, quantity: number) => void;
  setCartItems: React.Dispatch<React.SetStateAction<Record<string, Record<string, number>>>>;
  navigate: ReturnType<typeof useNavigate>;
}

// Create the context
export const ShopContext = createContext<ShopContextValue | undefined>(undefined);

interface ShopContextProviderProps {
  children: ReactNode;
}

const ShopContextProvider: React.FC<ShopContextProviderProps> = ({ children }) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<Record<string, Record<string, number>>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [token, setToken] = useState<string>('');
  const navigate = useNavigate();

  const addToCart = async (itemId: string, size: string) => {
    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    setCartItems(cartData);
    if (token) {
      try {

        await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })
      } catch (error) {
        console.log(error)
      }
    }
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

  const updateQuantity = async (itemId: string, size: string, quantity: number) => {
    const cartData = structuredClone(cartItems);
    if (cartData[itemId] && cartData[itemId][size] !== undefined) {
      cartData[itemId][size] = quantity;
    }
    setCartItems(cartData);
    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } });
      } catch (error) {
        if (error instanceof Error) {
          console.log(error);
          toast.error(error.message);
        } else {
          console.log("An unknown error occurred");
          toast.error("An unknown error occurred");
        }
      }

    }
  };
  const getCartAmount = (): number => {
    let totalAmount = 0;
    for (const items in cartItems) {
      const itemInfo = products.find((product) => product._id === items);
      if (itemInfo) {
        for (const size in cartItems[items]) {
          try {
            if (cartItems[items][size] > 0) {
              totalAmount += itemInfo.price * cartItems[items][size];
            }
          } catch (error) {
            console.error('Error calculating cart amount:', error);
          }
        }
      }
    }
    return totalAmount;
  };
  const getProductsData = async () => {
    try {
      console.log('Backend URL:', backendUrl);
      const response = await axios.get(`${backendUrl}/api/product/list`);

      if (response.data) {
        setProducts(response.data.products)
      }
      else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const getUserCart = async (token: string) => {
    try {
      const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
      if (response.data.success) {
        setCartItems(response.data.cartData)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        toast.error(error.message);
      } else {
        console.log("An unknown error occurred");
        toast.error("An unknown error occurred");
      }
    }
  }
  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken); // Set the token only if it's not null
      getUserCart(storedToken);
    }
  }, []);

  const value: ShopContextValue = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setCartItems,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    getUserCart,

    token,
    setToken,
    navigate,
    backendUrl
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
