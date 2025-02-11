import React, { ReactNode, createContext } from 'react';

import { products } from '../assets/assets';

interface ShopContextValue {
  products: typeof products; // Add this line
  currency: string;
  delivery_fee: number;
}

// Create the context
export const ShopContext = createContext<ShopContextValue | undefined>(undefined);

interface ShopContextProviderProps {
  children: ReactNode;
}

const ShopContextProvider: React.FC<ShopContextProviderProps> = ({ children }) => {
  const currency = "$";
  const delivery_fee = 10;

  const value: ShopContextValue = {
    products, // Now products is properly typed
    currency,
    delivery_fee,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
