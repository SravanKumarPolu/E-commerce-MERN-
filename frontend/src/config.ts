// Configuration file for the frontend application

export const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
export const appName = import.meta.env.VITE_APP_NAME || 'SKR E-Commerce';
export const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0';
export const nodeEnv = import.meta.env.VITE_NODE_ENV || 'development';

// Payment gateway configuration
export const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
export const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

// Currency settings
export const defaultCurrency = import.meta.env.VITE_DEFAULT_CURRENCY || 'USD';
export const currencySymbol = import.meta.env.VITE_CURRENCY_SYMBOL || '$';

// Feature flags
export const enableAnalytics = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
export const enableChatSupport = import.meta.env.VITE_ENABLE_CHAT_SUPPORT === 'true';
export const enableNotifications = import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true';

// CDN/Assets URL
export const assetsUrl = import.meta.env.VITE_ASSETS_URL || '';

// Development mode check
export const isDevelopment = nodeEnv === 'development';
export const isProduction = nodeEnv === 'production';

// Google Analytics
export const gaTrackingId = import.meta.env.VITE_GA_TRACKING_ID || '';

// API configuration
export const apiConfig = {
  baseUrl: backendUrl,
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
}; 