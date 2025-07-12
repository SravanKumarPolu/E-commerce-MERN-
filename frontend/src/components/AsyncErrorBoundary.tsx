import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'react-toastify';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRetry?: () => void;
  retryCount?: number;
  maxRetries?: number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  isRetrying: boolean;
}

class AsyncErrorBoundary extends Component<Props, State> {
  private retryTimer: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (import.meta.env.MODE === 'development') {
      console.error('Async Error caught by boundary:', error);
      console.error('Error info:', errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Auto-retry for network errors
    if (this.isNetworkError(error) && this.state.retryCount < (this.props.maxRetries || 3)) {
      this.handleAutoRetry();
    }
  }

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  }

  private isNetworkError = (error: Error): boolean => {
    return error.message.includes('fetch') || 
           error.message.includes('network') ||
           error.message.includes('timeout') ||
           error.message.includes('Failed to fetch');
  };

  private handleAutoRetry = () => {
    this.setState({ isRetrying: true });
    
    this.retryTimer = setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
        isRetrying: false
      }));
      
      if (this.props.onRetry) {
        this.props.onRetry();
      }
    }, 1000 * Math.pow(2, this.state.retryCount)); // Exponential backoff
  };

  private handleManualRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false
    });

    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Show retry loading state
      if (this.state.isRetrying) {
        return (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Retrying...</p>
            </div>
          </div>
        );
      }

      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
          <div className="text-center max-w-md">
            <div className="mx-auto h-12 w-12 text-red-500 mb-4">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Unable to load content
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {this.isNetworkError(this.state.error!) 
                ? 'Please check your internet connection and try again.' 
                : 'Something went wrong while loading this content.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={this.handleManualRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
              >
                Reload Page
              </button>
            </div>

            {this.state.retryCount > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Retried {this.state.retryCount} time{this.state.retryCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AsyncErrorBoundary; 