import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';

interface DashboardData {
  today: {
    sales: number;
    orders: number;
  };
  month: {
    sales: number;
    orders: number;
    averageOrderValue: number;
  };
  totalUsers: number;
  totalProducts: number;
  recentOrders: Array<{
    _id: string;
    total: number;
    orderStatus: string;
    createdAt: string;
    userId: {
      name: string;
      email: string;
    };
  }>;
  lowStockProducts: Array<{
    _id: string;
    name: string;
    stockQuantity: number;
  }>;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/api/analytics/dashboard-summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${currency}${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-modern p-6 border-error-200 bg-error-50">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-error-800 font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card-modern p-6 text-center">
        <p className="text-neutral-600">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-1 font-bold text-neutral-900 mb-2">Dashboard</h1>
          <p className="text-body text-neutral-600">Overview of your e-commerce performance</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="btn-modern btn-secondary"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-modern p-6">
          <div className="flex items-center">
            <div className="p-3 bg-success-100 rounded-xl">
              <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-caption text-neutral-500 mb-1">Today's Sales</p>
              <p className="text-heading-3 font-bold text-neutral-900">{formatCurrency(data.today.sales)}</p>
            </div>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-xl">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-caption text-neutral-500 mb-1">Today's Orders</p>
              <p className="text-heading-3 font-bold text-neutral-900">{data.today.orders}</p>
            </div>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center">
            <div className="p-3 bg-warning-100 rounded-xl">
              <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-caption text-neutral-500 mb-1">Total Users</p>
              <p className="text-heading-3 font-bold text-neutral-900">{data.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="card-modern p-6">
          <div className="flex items-center">
            <div className="p-3 bg-error-100 rounded-xl">
              <svg className="w-6 h-6 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-caption text-neutral-500 mb-1">Total Products</p>
              <p className="text-heading-3 font-bold text-neutral-900">{data.totalProducts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="card-modern p-6">
        <h2 className="text-heading-3 font-semibold text-neutral-900 mb-6">This Month's Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-success-50 to-success-100 rounded-xl">
            <p className="text-caption text-success-600 mb-2">Total Sales</p>
            <p className="text-heading-2 font-bold text-success-700">{formatCurrency(data.month.sales)}</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
            <p className="text-caption text-primary-600 mb-2">Total Orders</p>
            <p className="text-heading-2 font-bold text-primary-700">{data.month.orders}</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-warning-50 to-warning-100 rounded-xl">
            <p className="text-caption text-warning-600 mb-2">Average Order Value</p>
            <p className="text-heading-2 font-bold text-warning-700">{formatCurrency(data.month.averageOrderValue)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="card-modern p-6">
          <h2 className="text-heading-3 font-semibold text-neutral-900 mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {data.recentOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl transition-smooth hover:bg-neutral-100">
                <div>
                  <p className="font-medium text-neutral-900">{order.userId.name}</p>
                  <p className="text-body-small text-neutral-600">{order.userId.email}</p>
                  <p className="text-caption text-neutral-500">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-neutral-900">{formatCurrency(order.total)}</p>
                  <span className={`badge ${
                    order.orderStatus === 'Delivered' ? 'badge-success' :
                    order.orderStatus === 'Cancelled' ? 'badge-error' :
                    'badge-warning'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card-modern p-6">
          <h2 className="text-heading-3 font-semibold text-neutral-900 mb-6">Low Stock Alerts</h2>
          <div className="space-y-4">
            {data.lowStockProducts.length > 0 ? (
              data.lowStockProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between p-4 bg-error-50 rounded-xl border border-error-200">
                  <div>
                    <p className="font-medium text-neutral-900">{product.name}</p>
                    <p className="text-body-small text-error-600">Low stock warning</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-error-600">{product.stockQuantity} left</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-neutral-600 font-medium">All products have sufficient stock</p>
                <p className="text-caption text-neutral-500 mt-1">Great job managing inventory!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 