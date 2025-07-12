import axios from 'axios';
import { backendUrl } from '../config';

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string[];
  category: string;
  subCategory: string;
  sizes: string[];
  colors: string[];
  bestseller: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  userId: string;
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    size?: string;
    color?: string;
  }[];
  amount: number;
  address: {
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    phone: string;
  };
  status: 'Order Placed' | 'Packing' | 'Shipped' | 'Out for delivery' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  payment: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

// API class for organized API calls
class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Product API methods
  async getProducts(): Promise<ApiResponse<Product[]>> {
    try {
      console.log('Fetching products from:', `${backendUrl}/api/product/list`);
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });
      console.log('Products response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching products:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        console.error('Request made but no response:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      throw error.response?.data || error;
    }
  }

  async getProduct(productId: string): Promise<ApiResponse<Product>> {
    try {
      const response = await axios.post(`${backendUrl}/api/product/single`, { productId });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async addProduct(formData: FormData): Promise<ApiResponse<Product>> {
    try {
      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async removeProduct(productId: string): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(`${backendUrl}/api/product/remove`, { id: productId }, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  // Cart API methods
  async getCart(): Promise<ApiResponse<CartItem[]>> {
    try {
      const response = await axios.post(`${backendUrl}/api/cart/get`, {}, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async addToCart(itemId: string, size?: string, color?: string): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(`${backendUrl}/api/cart/add`, { itemId, size, color }, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async updateCart(itemId: string, quantity: number, size?: string, color?: string): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(`${backendUrl}/api/cart/update`, { itemId, quantity, size, color }, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  // Order API methods
  async getUserOrders(): Promise<ApiResponse<Order[]>> {
    try {
      const response = await axios.post(`${backendUrl}/api/order/userorders`, {}, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getAllOrders(): Promise<ApiResponse<Order[]>> {
    try {
      const response = await axios.post(`${backendUrl}/api/order/list`, {}, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async placeOrder(orderData: {
    items: { productId: string; quantity: number; size?: string; color?: string }[];
    amount: number;
    address: {
      firstName: string;
      lastName: string;
      email: string;
      street: string;
      city: string;
      state: string;
      zipcode: string;
      country: string;
      phone: string;
    };
  }): Promise<ApiResponse<Order>> {
    try {
      const response = await axios.post(`${backendUrl}/api/order/place`, orderData, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async placeOrderStripe(orderData: {
    items: { productId: string; quantity: number; size?: string; color?: string }[];
    amount: number;
    address: {
      firstName: string;
      lastName: string;
      email: string;
      street: string;
      city: string;
      state: string;
      zipcode: string;
      country: string;
      phone: string;
    };
  }): Promise<ApiResponse<{ session_url: string }>> {
    try {
      const response = await axios.post(`${backendUrl}/api/order/stripe`, orderData, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async placeOrderRazorpay(orderData: {
    items: { productId: string; quantity: number; size?: string; color?: string }[];
    amount: number;
    address: {
      firstName: string;
      lastName: string;
      email: string;
      street: string;
      city: string;
      state: string;
      zipcode: string;
      country: string;
      phone: string;
    };
  }): Promise<ApiResponse<{ order_id: string; amount: number; currency: string }>> {
    try {
      const response = await axios.post(`${backendUrl}/api/order/razorpay`, orderData, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async verifyStripePayment(orderId: string, paymentId: string): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(`${backendUrl}/api/order/verifyStripe`, { orderId, paymentId }, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async verifyRazorpayPayment(orderId: string, paymentId: string, signature: string): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(`${backendUrl}/api/order/verifyRazorpay`, { orderId, paymentId, signature }, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(`${backendUrl}/api/order/status`, { orderId, status }, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  // User API methods (for profile management)
  async getUserProfile(): Promise<ApiResponse<any>> {
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async updateUserProfile(name: string, email: string): Promise<ApiResponse<any>> {
    try {
      const response = await axios.put(`${backendUrl}/api/user/profile`, { name, email }, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(`${backendUrl}/api/user/change-password`, { currentPassword, newPassword }, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async resendVerificationEmail(): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(`${backendUrl}/api/user/resend-verification`, {}, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}

// Export a singleton instance
export const apiService = new ApiService();

// Export individual functions for easier imports
export const {
  getProducts,
  getProduct,
  addProduct,
  removeProduct,
  getCart,
  addToCart,
  updateCart,
  getUserOrders,
  getAllOrders,
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  verifyStripePayment,
  verifyRazorpayPayment,
  updateOrderStatus,
  getUserProfile,
  updateUserProfile,
  changePassword,
  resendVerificationEmail,
} = apiService; 