import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import AuthDebug from '../components/AuthDebug';

interface PayPalPayment {
  _id: string;
  paypalCaptureAmount: number;
  paypalCaptureCurrency: string;
  paypalPayeeEmail: string;
  paymentCompletedAt: string;
  userId: {
    name: string;
    email: string;
  };
  total: number;
}

interface BusinessAccountSummary {
  _id: string; // payee email
  totalPayments: number;
  totalAmount: number;
  averageAmount: number;
  lastPayment: string;
}

interface PayPalAnalyticsData {
  paypalData: Array<{
    _id: string;
    totalPayments: number;
    totalAmount: number;
    averageAmount: number;
  }>;
  businessAccountSummary: BusinessAccountSummary[];
  recentPayments: PayPalPayment[];
  summary: {
    totalPayPalPayments: number;
    totalPayPalAmount: number;
    averagePayPalAmount: number;
  };
  period: {
    start: string;
    end: string;
  };
}

const PayPalAnalytics: React.FC = () => {
  const [data, setData] = useState<PayPalAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchPayPalData();
  }, [dateRange]);

  const fetchPayPalData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      // Debug: Check if token exists
      if (!token) {
        throw new Error('No authentication token found. Please login to admin panel.');
      }
      
      console.log('🔍 PayPal Analytics Debug:');
      console.log('  - Token exists:', !!token);
      console.log('  - Token length:', token.length);
      console.log('  - Date range:', dateRange);
      
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });

      const response = await fetch(`${backendUrl}/api/analytics/paypal?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('  - Response status:', response.status);
      console.log('  - Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('  - Error response:', errorText);
        
        if (response.status === 401) {
          throw new Error('Authentication failed. Please logout and login again to admin panel.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else {
          throw new Error(`Failed to fetch PayPal data: ${response.status} ${errorText}`);
        }
      }

      const result = await response.json();
      console.log('  - Success response:', result);
      
      if (result.success && result.data) {
        setData(result.data);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('❌ PayPal Analytics Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return `${currency}0.00`;
    }
    return `${currency}${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) {
      return 'Unknown date';
    }
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-8"></div>
          <p className="text-neutral-600 font-semibold text-lg mb-2">Loading PayPal analytics...</p>
          <p className="text-caption text-neutral-500">Please wait while we fetch your payment data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-error-600 text-6xl mb-4">⚠️</div>
          <p className="text-neutral-600 font-semibold text-lg mb-2">Error loading PayPal analytics</p>
          <p className="text-caption text-neutral-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-neutral-600 font-semibold text-lg">No PayPal data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading-1 font-bold text-neutral-900">PayPal Payment Analytics</h1>
          <p className="text-body text-neutral-600 mt-2">
            Track received payments and business account performance
          </p>
        </div>
        
        {/* Date Range Selector */}
        <div className="flex gap-4">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            className="input input-bordered"
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            className="input input-bordered"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card-modern p-8 hover-lift hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center">
            <div className="p-5 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl shadow-lg shadow-success-500/20 hover:scale-110 transition-transform duration-300">
              <svg className="w-9 h-9 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-6">
              <p className="text-caption text-neutral-500 mb-3 font-semibold">Total PayPal Payments</p>
              <p className="text-heading-2 font-bold text-neutral-900">{data.summary?.totalPayPalPayments || 0}</p>
            </div>
          </div>
        </div>

        <div className="card-modern p-8 hover-lift hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center">
            <div className="p-5 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl shadow-lg shadow-primary-500/20 hover:scale-110 transition-transform duration-300">
              <svg className="w-9 h-9 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-6">
              <p className="text-caption text-neutral-500 mb-3 font-semibold">Total Amount Received</p>
              <p className="text-heading-2 font-bold text-neutral-900">{formatCurrency(data.summary?.totalPayPalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="card-modern p-8 hover-lift hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center">
            <div className="p-5 bg-gradient-to-br from-warning-100 to-warning-200 rounded-2xl shadow-lg shadow-warning-500/20 hover:scale-110 transition-transform duration-300">
              <svg className="w-9 h-9 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-6">
              <p className="text-caption text-neutral-500 mb-3 font-semibold">Average Payment</p>
              <p className="text-heading-2 font-bold text-neutral-900">{formatCurrency(data.summary?.averagePayPalAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Account Summary */}
      <div className="card-modern p-8">
        <h2 className="text-heading-2 font-bold text-neutral-900 mb-6">Business Account Summary</h2>
        <div className="space-y-6">
          {data.businessAccountSummary && data.businessAccountSummary.length > 0 ? (
            data.businessAccountSummary.map((account) => (
              <div key={account._id} className="flex items-center justify-between p-6 bg-gradient-to-r from-neutral-50 via-white to-neutral-50 rounded-2xl border border-neutral-200/60 transition-all duration-300 hover:bg-gradient-to-r hover:from-neutral-100 hover:via-white hover:to-neutral-100 hover:shadow-lg hover:shadow-neutral-900/5 hover:scale-[1.02]">
                <div>
                  <p className="font-bold text-neutral-900 text-lg mb-2">{account._id || 'Unknown Account'}</p>
                  <p className="text-body-small text-neutral-600 font-medium mb-1">
                    {account.totalPayments || 0} payments received
                  </p>
                  <p className="text-caption text-neutral-500 font-semibold">
                    Last payment: {account.lastPayment ? formatDate(account.lastPayment) : 'No payments yet'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-neutral-900 text-lg mb-2">{formatCurrency(account.totalAmount)}</p>
                  <p className="text-caption text-neutral-500">Average: {formatCurrency(account.averageAmount)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-neutral-900">No business account data</h3>
              <p className="mt-1 text-sm text-neutral-500">No PayPal business account data available yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="card-modern p-8">
        <h2 className="text-heading-2 font-bold text-neutral-900 mb-6">Recent PayPal Payments</h2>
        <div className="space-y-4">
          {data.recentPayments && data.recentPayments.length > 0 ? (
            data.recentPayments.map((payment) => (
              <div key={payment._id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-neutral-900">{payment.userId?.name || 'Unknown User'}</h3>
                  <p className="text-body-small text-neutral-600">{payment.userId?.email || 'No email'}</p>
                  <p className="text-caption text-neutral-500">{payment.paymentCompletedAt ? formatDate(payment.paymentCompletedAt) : 'Unknown date'}</p>
                </div>
                <div className="text-right">
                  <p className="text-heading-4 font-bold text-success-600">
                    {payment.paypalCaptureCurrency || 'USD'} {payment.paypalCaptureAmount || 0}
                  </p>
                  <p className="text-caption text-neutral-500">Order: {formatCurrency(payment.total)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-neutral-900">No recent payments</h3>
              <p className="mt-1 text-sm text-neutral-500">No recent PayPal payments found.</p>
            </div>
          )}
        </div>
      </div>
      <AuthDebug />
    </div>
  );
};

export default PayPalAnalytics; 