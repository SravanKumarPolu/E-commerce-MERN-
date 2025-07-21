import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import AuthDebug from '../components/AuthDebug';

interface Transfer {
  id: string;
  batchId: string;
  amount: number;
  currency: string;
  recipientEmail: string;
  recipientAccountNumber: string;
  recipientRoutingNumber: string;
  status: string;
  note: string;
  createdAt: string;
  adminId: string;
}

interface TransferHistory {
  transfers: Transfer[];
  summary: {
    totalTransfers: number;
    totalAmount: number;
    averageAmount: number;
  };
}

const PayPalTransfer: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [transferHistory, setTransferHistory] = useState<TransferHistory | null>(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchTransferHistory();
  }, []);

  const fetchTransferHistory = async () => {
    try {
      setHistoryLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please login to admin panel.');
      }
      
      const response = await fetch(`${backendUrl}/api/paypal-transfer/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        if (response.status === 401) {
          throw new Error('Authentication failed. Please logout and login again to admin panel.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else {
          throw new Error(`Failed to fetch transfer history: ${response.status} ${errorText}`);
        }
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setTransferHistory(result.data);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('❌ Transfer History Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) < 0.01) {
      setError('Transfer amount must be at least $0.01');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please login to admin panel.');
      }
      
      const response = await fetch(`${backendUrl}/api/paypal-transfer/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          note: note || 'Payment transfer from admin',
          transferType: 'PAYOUT'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setSuccess(`Transfer created successfully! Batch ID: ${result.transfer.batchId}`);
        setAmount('');
        setNote('');
        // Refresh transfer history
        fetchTransferHistory();
      } else {
        throw new Error(result.message || 'Failed to create transfer');
      }
    } catch (err) {
      console.error('❌ Transfer Error:', err);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading-1 font-bold text-neutral-900">PayPal Transfer</h1>
          <p className="text-body text-neutral-600 mt-2">
            Send PayPal transfers to the specified account
          </p>
        </div>
      </div>

      {/* Transfer Form */}
      <div className="card-modern p-8">
        <h2 className="text-heading-2 font-bold text-neutral-900 mb-6">Create New Transfer</h2>
        
        {/* Account Information */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-2xl mb-6 border border-primary-200">
          <h3 className="text-heading-3 font-bold text-primary-900 mb-4">Recipient Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-caption text-primary-700 font-semibold mb-1">Account Number</p>
              <p className="text-body font-bold text-primary-900">7597988</p>
            </div>
            <div>
              <p className="text-caption text-primary-700 font-semibold mb-1">Routing Number</p>
              <p className="text-body font-bold text-primary-900">YESB0JIVAN2</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-caption text-primary-700 font-semibold mb-1">PayPal Email</p>
              <p className="text-body font-bold text-primary-900">sb-j1ksk43419843@business.example.com</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleTransfer} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-body font-semibold text-neutral-700 mb-2">
              Transfer Amount (USD)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="input input-bordered w-full"
              required
            />
            <p className="text-caption text-neutral-500 mt-1">Minimum amount: $0.01</p>
          </div>

          <div>
            <label htmlFor="note" className="block text-body font-semibold text-neutral-700 mb-2">
              Note (Optional)
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter a note for this transfer..."
              className="textarea textarea-bordered w-full"
              rows={3}
            />
          </div>

          {error && (
            <div className="alert alert-error">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Creating Transfer...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Transfer
              </>
            )}
          </button>
        </form>
      </div>

      {/* Transfer History */}
      <div className="card-modern p-8">
        <h2 className="text-heading-2 font-bold text-neutral-900 mb-6">Transfer History</h2>
        
        {historyLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="loading-spinner"></div>
            <span className="ml-3 text-neutral-600">Loading transfer history...</span>
          </div>
        ) : transferHistory ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-modern p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-success-100 to-success-200 rounded-xl">
                    <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-caption text-neutral-500 font-semibold">Total Transfers</p>
                    <p className="text-heading-3 font-bold text-neutral-900">{transferHistory.summary.totalTransfers}</p>
                  </div>
                </div>
              </div>

              <div className="card-modern p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-caption text-neutral-500 font-semibold">Total Amount</p>
                    <p className="text-heading-3 font-bold text-neutral-900">{formatCurrency(transferHistory.summary.totalAmount)}</p>
                  </div>
                </div>
              </div>

              <div className="card-modern p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-warning-100 to-warning-200 rounded-xl">
                    <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-caption text-neutral-500 font-semibold">Average Amount</p>
                    <p className="text-heading-3 font-bold text-neutral-900">{formatCurrency(transferHistory.summary.averageAmount)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transfer List */}
            <div className="space-y-4">
              {transferHistory.transfers.length > 0 ? (
                transferHistory.transfers.map((transfer) => (
                  <div key={transfer.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-neutral-900">Transfer #{transfer.batchId}</h3>
                      <p className="text-body-small text-neutral-600">{transfer.recipientEmail}</p>
                      <p className="text-caption text-neutral-500">{formatDate(transfer.createdAt)}</p>
                      {transfer.note && (
                        <p className="text-caption text-neutral-600 mt-1">"{transfer.note}"</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-heading-4 font-bold text-success-600">
                        {formatCurrency(transfer.amount)}
                      </p>
                      <span className={`badge ${transfer.status === 'SUCCESS' ? 'badge-success' : 'badge-warning'}`}>
                        {transfer.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-neutral-900">No transfers yet</h3>
                  <p className="mt-1 text-sm text-neutral-500">Create your first transfer above.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-error-600 text-6xl mb-4">⚠️</div>
            <p className="text-neutral-600 font-semibold text-lg mb-2">Error loading transfer history</p>
            <p className="text-caption text-neutral-500">{error}</p>
          </div>
        )}
      </div>
      
      <AuthDebug />
    </div>
  );
};

export default PayPalTransfer; 