// src/App.jsx
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./layout/Layout";
import ScrollToTop from "./utils/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import AsyncErrorBoundary from "./components/AsyncErrorBoundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Collection = lazy(() => import("./pages/Collection"));
const Contact = lazy(() => import("./pages/Contact"));
const Product = lazy(() => import("./pages/Product"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Orders = lazy(() => import("./pages/Orders"));
const PlaceOrder = lazy(() => import("./pages/PlaceOrder"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Optional: preload some key routes
export const preloadHome = () => import("./pages/Home");

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
  </div>
);

// Error fallback for async operations
const AsyncErrorFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Unable to load page
      </h2>
      <p className="text-gray-600">
        Please check your internet connection and try again.
      </p>
    </div>
  </div>
);

function App() {
  const handleAppError = (error: Error, errorInfo: any) => {
    console.error('App-level error:', error, errorInfo);
    
    // In production, send to error reporting service
    if (import.meta.env.MODE === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  };

  return (
    <ErrorBoundary 
      onError={handleAppError} 
      showDetails={import.meta.env.MODE === 'development'}
    >
      <ScrollToTop />
      <AsyncErrorBoundary fallback={<AsyncErrorFallback />}>
        <Suspense fallback={<LoadingFallback />}>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:productId" element={<Product />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes with individual error boundaries */}
              <Route 
                path="/cart" 
                element={
                  <ErrorBoundary>
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="/place-order" 
                element={
                  <ErrorBoundary>
                    <ProtectedRoute>
                      <PlaceOrder />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <ErrorBoundary>
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Suspense>
      </AsyncErrorBoundary>
      
      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ErrorBoundary>
  );
}

export default App;
