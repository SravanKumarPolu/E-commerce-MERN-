import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../config.ts';
import { setupGlobalErrorReporting } from '../utils/errorReporting';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerificationEmail: () => Promise<boolean>;
  updateProfile: (name: string, email: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
        const userData = response.data.data;
        setUser(userData);
        
        // Set up global error reporting with user info
        setupGlobalErrorReporting(userData.id, userData.email);
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
    localStorage.removeItem('userId');
    
    // Clear user info from error reporting
    setupGlobalErrorReporting();
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
        localStorage.setItem('userId', userData.id);
        
        // Set up global error reporting with user info
        setupGlobalErrorReporting(userData.id, userData.email);
        
        toast.success('Login successful!');
        return true;
      } else {
        toast.error(response.data.message || 'Login failed');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/user/register`, {
        name,
        email,
        password,
      });
      
      if (response.data.success) {
        toast.success('Registration successful! Please check your email to verify your account.');
        return true;
      } else {
        toast.error(response.data.message || 'Registration failed');
        return false;
      }
    } catch (error: any) {
      // Don't handle validation errors here as they're handled by the form
      if (error.response?.data?.errors) {
        throw error;
      }
      
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    toast.success('Logged out successfully');
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) return false;
      
      const response = await axios.post(`${backendUrl}/api/user/refresh-token`, {
        refreshToken: storedRefreshToken,
      });
      
      if (response.data.success) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
        
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        return true;
      } else {
        clearAuthData();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuthData();
      return false;
    }
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/request-password-reset`, { email });
      
      if (response.data.success) {
        return true;
      } else {
        toast.error(response.data.message || 'Password reset request failed');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Password reset request failed';
      toast.error(errorMessage);
      return false;
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/reset-password`, {
        token,
        newPassword,
      });
      
      if (response.data.success) {
        toast.success('Password reset successful! You can now log in with your new password.');
        return true;
      } else {
        toast.error(response.data.message || 'Password reset failed');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      toast.error(errorMessage);
      return false;
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/verify-email`, { token });
      
      if (response.data.success) {
        // Update user state to reflect email verification
        if (user) {
          setUser({ ...user, isEmailVerified: true });
        }
        toast.success('Email verified successfully!');
        return true;
      } else {
        toast.error(response.data.message || 'Email verification failed');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Email verification failed';
      toast.error(errorMessage);
      return false;
    }
  };

  const resendVerificationEmail = async (): Promise<boolean> => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/resend-verification`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (response.data.success) {
        toast.success('Verification email sent!');
        return true;
      } else {
        toast.error(response.data.message || 'Failed to send verification email');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send verification email';
      toast.error(errorMessage);
      return false;
    }
  };

  const updateProfile = async (name: string, email: string): Promise<boolean> => {
    try {
      const response = await axios.put(`${backendUrl}/api/user/profile`, { name, email }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (response.data.success) {
        const updatedUser = response.data.data;
        setUser(updatedUser);
        
        // Update error reporting with new user info
        setupGlobalErrorReporting(updatedUser.id, updatedUser.email);
        
        toast.success('Profile updated successfully!');
        return true;
      } else {
        toast.error(response.data.message || 'Profile update failed');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      toast.error(errorMessage);
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/change-password`, {
        currentPassword,
        newPassword,
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (response.data.success) {
        toast.success('Password changed successfully!');
        return true;
      } else {
        toast.error(response.data.message || 'Password change failed');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      toast.error(errorMessage);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    loading,
    isAuthenticated: !!user && !!accessToken,
    login,
    register,
    logout,
    refreshAccessToken,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    updateProfile,
    changePassword,
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