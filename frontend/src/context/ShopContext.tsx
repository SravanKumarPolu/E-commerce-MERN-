import React, { ReactNode, createContext, useContext } from "react";

import { products } from "../assets/assets";

// Define the shape of the context
interface ShopContextValue {
  products: typeof products;
  currency: string;
  delivery_fee: number;
}

// Create the context with a default value to avoid `undefined` issues
export const ShopContext = createContext<ShopContextValue | null>(null);

interface ShopContextProviderProps {
  children: ReactNode;
}

const ShopContextProvider: React.FC<ShopContextProviderProps> = ({ children }) => {
  const currency = "$";
  const delivery_fee = 10;

  const value: ShopContextValue = {
    products,
    currency,
    delivery_fee,
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
