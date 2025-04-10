import React, { ReactNode, createContext, useContext, useState } from "react";

import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Define the shape of the context
interface ShopContextValue {
  products: typeof products;
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
  const navigate = useNavigate();
  const addToCart = (itemId: string, color: string) => {
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
  }
  const value: ShopContextValue = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    getCartCount, updateQuantity,
    showSearch,
    addToCart,
    cartItems,
    getCartAmount,
    setCartItems,
    setShowSearch,
    navigate,
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
