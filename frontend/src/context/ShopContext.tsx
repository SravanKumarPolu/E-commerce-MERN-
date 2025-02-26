import React, { ReactNode, createContext, useContext, useState } from "react";

import { products } from "../assets/assets";
import { toast } from "react-toastify";

// Define the shape of the context
interface ShopContextValue {
  products: typeof products;
  currency: string;
  delivery_fee: number;
  search: string;
  addToCart: (itemId: string, size: string) => void;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  showSearch: boolean;
  getCartCount: () => number;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: Record<string, Record<string, number>>;
  setCartItems: React.Dispatch<React.SetStateAction<Record<string, Record<string, number>>>>;
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
  const value: ShopContextValue = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    getCartCount,
    showSearch,
    addToCart,
    cartItems,
    setCartItems,
    setShowSearch,
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
