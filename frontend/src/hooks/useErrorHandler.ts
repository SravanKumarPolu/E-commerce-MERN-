import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

interface ErrorHandlerOptions {
  showToast?: boolean;
  toastMessage?: string;
  logError?: boolean;
  onError?: (error: Error) => void;
  retryAttempts?: number;
  retryDelay?: number;
}

interface ErrorHandlerState {
  loading: boolean;
  error: Error | null;
  retryCount: number;
}

interface ErrorHandlerReturn {
  loading: boolean;
  error: Error | null;
  retryCount: number;
  execute: <T>(
    asyncFn: () => Promise<T>,
    options?: ErrorHandlerOptions
  ) => Promise<T | null>;
  retry: () => void;
  clearError: () => void;
  reset: () => void;
}

export const useErrorHandler = (): ErrorHandlerReturn => {
  const [state, setState] = useState<ErrorHandlerState>({
    loading: false,
    error: null,
    retryCount: 0
  });

  const [lastAsyncFn, setLastAsyncFn] = useState<(() => Promise<any>) | null>(null);
  const [lastOptions, setLastOptions] = useState<ErrorHandlerOptions | null>(null);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, retryCount: 0 });
    setLastAsyncFn(null);
    setLastOptions(null);
  }, []);

  const reportError = useCallback((error: Error, options?: ErrorHandlerOptions) => {
    // Log error if enabled
    if (options?.logError !== false) {
      console.error('Error caught by useErrorHandler:', error);
      
      // In production, send to error reporting service
      if (import.meta.env.MODE === 'production') {
        const errorReport = {
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          userId: localStorage.getItem('userId') || 'anonymous'
        };
        
        // Send to error reporting service
        // Example: Sentry.captureException(error, { extra: errorReport });
        console.error('Error report:', errorReport);
      }
    }

    // Show toast notification
    if (options?.showToast !== false) {
      const message = options?.toastMessage || getErrorMessage(error);
      toast.error(message);
    }

    // Call custom error handler
    if (options?.onError) {
      options.onError(error);
    }
  }, []);

  const getErrorMessage = (error: Error): string => {
    if (error.message.includes('fetch')) {
      return 'Network error. Please check your connection.';
    }
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    if (error.message.includes('401')) {
      return 'You are not authorized. Please log in again.';
    }
    if (error.message.includes('403')) {
      return 'You do not have permission to perform this action.';
    }
    if (error.message.includes('404')) {
      return 'The requested resource was not found.';
    }
    if (error.message.includes('500')) {
      return 'Server error. Please try again later.';
    }
    return error.message || 'An unexpected error occurred.';
  };

  const execute = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options?: ErrorHandlerOptions
  ): Promise<T | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      setLastAsyncFn(() => asyncFn);
      setLastOptions(options || null);

      const result = await asyncFn();
      
      setState(prev => ({ ...prev, loading: false, retryCount: 0 }));
      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorObj,
        retryCount: prev.retryCount + 1
      }));

      reportError(errorObj, options);
      return null;
    }
  }, [reportError]);

  const retry = useCallback(async () => {
    if (lastAsyncFn) {
      const maxRetries = lastOptions?.retryAttempts || 3;
      
      if (state.retryCount < maxRetries) {
        const delay = lastOptions?.retryDelay || 1000 * Math.pow(2, state.retryCount);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Execute the last async function again
        return execute(lastAsyncFn, lastOptions || undefined);
      } else {
        toast.error('Maximum retry attempts reached.');
      }
    }
  }, [lastAsyncFn, lastOptions, state.retryCount, execute]);

  return {
    loading: state.loading,
    error: state.error,
    retryCount: state.retryCount,
    execute,
    retry,
    clearError,
    reset
  };
};

// Utility hook for handling API calls specifically
export const useApiCall = () => {
  const errorHandler = useErrorHandler();

  const apiCall = useCallback(async <T>(
    apiFunction: () => Promise<T>,
    options?: ErrorHandlerOptions & {
      successMessage?: string;
      suppressSuccessToast?: boolean;
    }
  ): Promise<T | null> => {
    const result = await errorHandler.execute(apiFunction, options);
    
    if (result && options?.successMessage && !options?.suppressSuccessToast) {
      toast.success(options.successMessage);
    }
    
    return result;
  }, [errorHandler]);

  return {
    ...errorHandler,
    apiCall
  };
};

export default useErrorHandler; 