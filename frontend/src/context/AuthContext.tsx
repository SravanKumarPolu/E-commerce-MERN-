import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../config';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
  updateProfile: (name: string, email: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  resendVerificationEmail: () => Promise<boolean>;
  setToken: (token: string) => void;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load tokens from localStorage on mount
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    
    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      fetchUserProfile(storedAccessToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Set up axios interceptor for token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && 
            error.response?.data?.errorCode === 'TOKEN_EXPIRED' && 
            !originalRequest._retry) {
          
          originalRequest._retry = true;
          
          if (await refreshAccessToken()) {
            const newToken = localStorage.getItem('accessToken');
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axios(originalRequest);
            }
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const clearAuthData = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
      
      if (response.data.success) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: userData } = response.data.data;
        
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setUser(userData);
        
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        toast.success('Login successful!');
        return true;
      } else {
        toast.error(response.data.message || 'Login failed');
        return false;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
      
      if (response.data.success) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: userData } = response.data.data;
        
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setUser(userData);
        
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        toast.success('Registration successful! Please verify your email.');
        return true;
      } else {
        toast.error(response.data.message || 'Registration failed');
        return false;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (refreshToken) {
        await axios.post(`${backendUrl}/api/user/logout`, { refreshToken }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      toast.success('Logged out successfully');
    }
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      if (!refreshToken) {
        clearAuthData();
        return false;
      }

      const response = await axios.post(`${backendUrl}/api/user/refresh-token`, { refreshToken });
      
      if (response.data.success) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: userData } = response.data.data;
        
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setUser(userData);
        
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        return true;
      } else {
        clearAuthData();
        return false;
      }
    } catch (error) {
      clearAuthData();
      return false;
    }
  };

  const updateProfile = async (name: string, email: string): Promise<boolean> => {
    try {
      const response = await axios.put(`${backendUrl}/api/user/profile`, { name, email }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (response.data.success) {
        setUser(response.data.data);
        toast.success(response.data.message);
        return true;
      } else {
        toast.error(response.data.message || 'Profile update failed');
        return false;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Profile update failed');
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/change-password`, 
        { currentPassword, newPassword }, 
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        // Clear tokens as they're invalidated after password change
        setTimeout(() => {
          clearAuthData();
          window.location.href = '/login';
        }, 2000);
        return true;
      } else {
        toast.error(response.data.message || 'Password change failed');
        return false;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Password change failed');
      return false;
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/verify-email`, { token });
      
      if (response.data.success) {
        toast.success(response.data.message);
        // Refresh user profile to get updated verification status
        if (accessToken) {
          await fetchUserProfile(accessToken);
        }
        return true;
      } else {
        toast.error(response.data.message || 'Email verification failed');
        return false;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Email verification failed');
      return false;
    }
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/request-password-reset`, { email });
      
      if (response.data.success) {
        toast.success(response.data.message);
        return true;
      } else {
        toast.error(response.data.message || 'Password reset request failed');
        return false;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Password reset request failed');
      return false;
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/reset-password`, { token, newPassword });
      
      if (response.data.success) {
        toast.success(response.data.message);
        return true;
      } else {
        toast.error(response.data.message || 'Password reset failed');
        return false;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Password reset failed');
      return false;
    }
  };

  const resendVerificationEmail = async (): Promise<boolean> => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/resend-verification`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        return true;
      } else {
        toast.error(response.data.message || 'Failed to resend verification email');
        return false;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend verification email');
      return false;
    }
  };

  // Legacy function for backward compatibility
  const setToken = (token: string) => {
    setAccessToken(token);
    localStorage.setItem('accessToken', token);
    // Try to fetch user profile with the token
    fetchUserProfile(token);
  };

  const value: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    loading,
    login,
    register,
    logout,
    refreshAccessToken,
    updateProfile,
    changePassword,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    resendVerificationEmail,
    setToken,
    isAuthenticated: !!user && !!accessToken,
    isEmailVerified: user?.isEmailVerified || false
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 