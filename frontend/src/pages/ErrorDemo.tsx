import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { reportError } from '../utils/errorReporting';
import AsyncErrorBoundary from '../components/AsyncErrorBoundary';
import ErrorBoundary from '../components/ErrorBoundary';

// Component that throws an error on purpose
const ErrorThrowingComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('This is a test error from ErrorThrowingComponent');
  }
  return (
    <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
      <p className="text-green-800">This component is working normally!</p>
    </div>
  );
};

const ErrorDemo: React.FC = () => {
  const [throwError, setThrowError] = useState(false);
  const [asyncError, setAsyncError] = useState(false);
  const { loading, error, execute, retry, clearError } = useErrorHandler();

  const handleAsyncError = async () => {
    setAsyncError(true);
    await execute(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        throw new Error('This is a test async error');
      },
      {
        toastMessage: 'Async operation failed',
        retryAttempts: 2,
        onError: (error) => {
          console.error('Async error caught:', error);
        }
      }
    );
    setAsyncError(false);
  };

  const handleNetworkError = async () => {
    await execute(
      async () => {
        // Simulate network error
        await fetch('https://nonexistent-api.example.com/data');
      },
      {
        toastMessage: 'Network request failed',
        retryAttempts: 3,
        onError: (error) => {
          console.error('Network error:', error);
        }
      }
    );
  };

  const handleManualErrorReport = () => {
    reportError(new Error('Manually reported error'), {
      context: 'ErrorDemo',
      action: 'manual_report',
      severity: 'low'
    });
    toast.info('Error reported manually');
  };

  const handlePromiseRejection = () => {
    // This will be caught by the global error handler
    Promise.reject(new Error('Unhandled promise rejection'));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Error Handling Demo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Error Boundary Demo */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Error Boundary Demo</h2>
            <p className="text-gray-600 mb-4">
              This demonstrates how error boundaries catch rendering errors and show fallback UI.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => setThrowError(!throwError)}
                className={`px-4 py-2 rounded-md font-medium ${
                  throwError
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {throwError ? 'Fix Component' : 'Break Component'}
              </button>
              
              <ErrorBoundary showDetails={true}>
                <ErrorThrowingComponent shouldThrow={throwError} />
              </ErrorBoundary>
            </div>
          </div>

          {/* Async Error Demo */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Async Error Handling</h2>
            <p className="text-gray-600 mb-4">
              This demonstrates the useErrorHandler hook with async operations.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleAsyncError}
                disabled={loading || asyncError}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Trigger Async Error'}
              </button>
              
              <button
                onClick={handleNetworkError}
                disabled={loading}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Trigger Network Error'}
              </button>
              
              {error && (
                <div className="p-3 bg-red-100 border border-red-300 rounded-md">
                  <p className="text-red-800 text-sm">{error.message}</p>
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={retry}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Retry
                    </button>
                    <button
                      onClick={clearError}
                      className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                    >
                      Clear Error
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Reporting Demo */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Error Reporting</h2>
            <p className="text-gray-600 mb-4">
              This demonstrates manual error reporting and global error handling.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleManualErrorReport}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Report Error Manually
              </button>
              
              <button
                onClick={handlePromiseRejection}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Unhandled Promise Rejection
              </button>
              
              <button
                onClick={() => {
                  // This will trigger the global error handler
                  throw new Error('Global error test');
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
              >
                Global Error Test
              </button>
            </div>
          </div>

          {/* Async Error Boundary Demo */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Async Error Boundary</h2>
            <p className="text-gray-600 mb-4">
              This demonstrates async error boundary with retry functionality.
            </p>
            
            <AsyncErrorBoundary
              maxRetries={3}
              onRetry={() => {
                console.log('Retrying async operation...');
              }}
            >
              <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg">
                <p className="text-blue-800">This content is protected by AsyncErrorBoundary</p>
              </div>
            </AsyncErrorBoundary>
          </div>
        </div>

        {/* Error Statistics */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Error Statistics</h2>
          <p className="text-gray-600 mb-4">
            Check the browser console and local storage for error reports.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              • Open browser DevTools to see error logs
            </p>
            <p className="text-sm text-gray-600">
              • Check localStorage 'errorReports' for stored errors
            </p>
            <p className="text-sm text-gray-600">
              • In production, errors would be sent to error reporting service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDemo; 