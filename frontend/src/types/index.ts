export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string[];
  category: string;
  subCategory: string;
  color: string[];
  date: number;
  bestseller: boolean;
}

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string[];
  quantity: number;
  size?: string;
  color?: string;
}

export interface ShopContextType {
  products: Product[];
  currency: string;
  delivery_fee: number;
  search: string;
  setSearch: (search: string) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  cartItems: { [key: string]: number };
  addToCart: (itemId: string, size?: string) => void;
  getCartCount: () => number;
  updateQuantity: (itemId: string, size: string, quantity: number) => void;
  getCartAmount: () => number;
  navigate: (path: string) => void;
  backendUrl: string;
  setToken: (token: string) => void;
  token: string;
  setCartItems: (items: { [key: string]: number }) => void;
} 