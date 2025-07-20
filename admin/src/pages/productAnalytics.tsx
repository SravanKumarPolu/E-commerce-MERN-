import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';

// Auth Debug Component
const AuthDebug: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<string>('Checking...');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    
    if (!storedToken) {
      setAuthStatus('❌ No token found');
      return;
    }
    
    setAuthStatus('🔍 Token found, testing...');
  }, []);

  const testAuth = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setAuthStatus('❌ No token found');
        return;
      }

      setAuthStatus('🔄 Testing authentication...');
      
      const response = await fetch(`${backendUrl}/api/analytics/products`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Product Analytics API Response:', data);
        setAuthStatus('✅ Authentication successful!');
      } else {
        const errorData = await response.text();
        console.error('❌ Product Analytics API Error:', errorData);
        setAuthStatus(`❌ Auth failed: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Product Analytics API Error:', error);
      setAuthStatus('❌ Network error');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">🔍 Auth Debug</h3>
        <button
          onClick={testAuth}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          Test Auth
        </button>
      </div>
      <div className="text-xs space-y-1">
        <p><strong>Status:</strong> {authStatus}</p>
        <p><strong>Token:</strong> {token ? '✅ Present' : '❌ Missing'}</p>
        <p><strong>Backend:</strong> {backendUrl}</p>
      </div>
    </div>
  );
};

interface TopProduct {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    image: string[];
    category: string;
    subCategory: string;
  };
  views: number;
  addToCartCount: number;
  purchaseCount: number;
  revenue: number;
  conversionRate: number;
}

interface ProductStats {
  totalViews: number;
  totalAddToCart: number;
  totalPurchases: number;
  totalRevenue: number;
  averageConversionRate: number;
}

interface CategoryPerformance {
  _id: string;
  totalViews: number;
  totalAddToCart: number;
  totalPurchases: number;
  totalRevenue: number;
  productCount: number;
}

interface ProductAnalyticsData {
  topProducts: TopProduct[];
  productStats: ProductStats;
  categoryPerformance: CategoryPerformance[];
}

const ProductAnalytics: React.FC = () => {
  const [data, setData] = useState<ProductAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metric, setMetric] = useState('revenue');
  const [limit, setLimit] = useState(10);
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchProductData();
  }, [metric, limit, category]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      console.log('🔍 Product Analytics Debug: Token found:', !!token);
      
      if (!token) {
        throw new Error('No authentication token found. Please login to admin panel.');
      }

      const params = new URLSearchParams({
        metric,
        limit: limit.toString()
      });

      if (category) {
        params.append('category', category);
      }

      const url = `${backendUrl}/api/analytics/products?${params}`;
      console.log('🔍 Product Analytics Debug: Fetching from:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('🔍 Product Analytics Debug: Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Product Analytics API Error:', errorText);
        throw new Error(`Failed to fetch product data: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Product Analytics API Response:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'API returned unsuccessful response');
      }
      
      setData(result.data);
    } catch (err) {
      console.error('❌ Product Analytics Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${currency}${amount.toFixed(2)}`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatPercentage = (num: number) => {
    return `${(num * 100).toFixed(2)}%`;
  };

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'revenue':
        return 'Revenue';
      case 'views':
        return 'Views';
      case 'addToCartCount':
        return 'Add to Cart';
      case 'purchaseCount':
        return 'Purchases';
      default:
        return 'Revenue';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-semibold text-red-800">Product Analytics Error</h2>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          
          <div className="bg-white p-4 rounded border border-red-200">
            <h3 className="font-semibold text-red-800 mb-2">Troubleshooting Steps:</h3>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Check if you're logged in to the admin panel</li>
              <li>• Verify the backend server is running on port 3001</li>
              <li>• Check browser console for additional error details</li>
              <li>• Try refreshing the page or logging out and back in</li>
              <li>• Ensure there are products in the database</li>
            </ul>
          </div>
          
          <div className="mt-4">
            <button
              onClick={fetchProductData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mr-2"
            >
              Retry
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
        <AuthDebug />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-semibold text-blue-800">No Product Performance Data</h2>
          </div>
          <p className="text-blue-700 mb-4">
            No product performance data is available yet. This is normal if products haven't been viewed, added to cart, or purchased.
          </p>
          
          <div className="bg-white p-4 rounded border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">To generate data:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Go to your main application (not admin panel)</li>
              <li>• Browse and view products (tracks views)</li>
              <li>• Add products to cart (tracks add to cart)</li>
              <li>• Make purchases (tracks purchases and revenue)</li>
              <li>• Return to this page to see the analytics</li>
            </ul>
          </div>
          
          <div className="mt-4">
            <button
              onClick={fetchProductData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>
        <AuthDebug />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Product Performance Analytics</h1>
        <button
          onClick={fetchProductData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by Metric</label>
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="revenue">Revenue</option>
              <option value="views">Views</option>
              <option value="addToCartCount">Add to Cart</option>
              <option value="purchaseCount">Purchases</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Products</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
              <option value={20}>Top 20</option>
              <option value={50}>Top 50</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Filter</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="iPhone">iPhone</option>
              <option value="iPad">iPad</option>
              <option value="Mac">Mac</option>
              <option value="Watch">Watch</option>
              <option value="AirPods">AirPods</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.productStats?.totalViews || 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Add to Cart</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.productStats?.totalAddToCart || 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Purchases</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.productStats?.totalPurchases || 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.productStats?.totalRevenue || 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Conversion</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(data.productStats?.averageConversionRate || 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Products by {getMetricLabel(metric)}</h2>
        <div className="space-y-4">
          {data.topProducts && data.topProducts.length > 0 ? (
            data.topProducts.map((product, index) => (
              <div key={product._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.productId?.image?.[0] || '/placeholder-product.jpg'}
                      alt={product.productId?.name || 'Product'}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-product.jpg';
                      }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{product.productId?.name || 'Unknown Product'}</p>
                      <p className="text-sm text-gray-600">
                        {product.productId?.category || 'Unknown'} • {product.productId?.subCategory || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-500">{formatCurrency(product.productId?.price || 0)}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {metric === 'revenue' ? formatCurrency(product.revenue || 0) :
                     metric === 'views' ? formatNumber(product.views || 0) :
                     metric === 'addToCartCount' ? formatNumber(product.addToCartCount || 0) :
                     formatNumber(product.purchaseCount || 0)}
                  </p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Views: {formatNumber(product.views || 0)}</p>
                    <p>Add to Cart: {formatNumber(product.addToCartCount || 0)}</p>
                    <p>Purchases: {formatNumber(product.purchaseCount || 0)}</p>
                    <p>Conversion: {formatPercentage(product.conversionRate || 0)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">No product performance data available yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.categoryPerformance && data.categoryPerformance.length > 0 ? (
            data.categoryPerformance.map((category) => (
              <div key={category._id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{category._id || 'Unknown Category'}</h3>
                  <span className="text-sm text-gray-600">{category.productCount || 0} products</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Views:</span>
                    <span className="text-sm font-medium">{formatNumber(category.totalViews || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Add to Cart:</span>
                    <span className="text-sm font-medium">{formatNumber(category.totalAddToCart || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Purchases:</span>
                    <span className="text-sm font-medium">{formatNumber(category.totalPurchases || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Revenue:</span>
                    <span className="text-sm font-medium">{formatCurrency(category.totalRevenue || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Conversion:</span>
                    <span className="text-sm font-medium">
                      {formatPercentage((category.totalViews || 0) > 0 ? (category.totalPurchases || 0) / (category.totalViews || 0) : 0)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No category data</h3>
              <p className="mt-1 text-sm text-gray-500">No category performance data available yet.</p>
            </div>
          )}
        </div>
      </div>
      <AuthDebug />
    </div>
  );
};

export default ProductAnalytics; 