import React, { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

interface PayPalPaymentProps {
  amount: number;
  address: any;
  onSuccess: (orderData: any) => void;
  onError: (error: any) => void;
  onCancel: () => void;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({
  amount,
  address,
  onSuccess,
  onError,
  onCancel
}) => {
  const { products, cartItems, token } = useShopContext();
  const [isProcessing, setIsProcessing] = useState(false);

  // Prepare items for PayPal
  const getPayPalItems = () => {
    const items = [];
    for (const itemId in cartItems) {
      const product = products.find(p => p._id === itemId);
      if (product) {
        for (const color in cartItems[itemId]) {
          const quantity = cartItems[itemId][color];
          if (quantity > 0) {
            items.push({
              productId: itemId,
              name: product.name,
              image: product.image[0],
              price: product.price,
              quantity: quantity,
              color: color
            });
          }
        }
      }
    }
    return items;
  };

  const createOrder = async () => {
    try {
      setIsProcessing(true);
      console.log('🔄 Creating PayPal order...');
      console.log('Items:', getPayPalItems());
      console.log('Address:', address);
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/orders/paypal/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
        body: JSON.stringify({
          items: getPayPalItems(),
          address
        }),
      });

      const data = await response.json();
      console.log('PayPal order response:', data);
      
      if (data.success) {
        console.log('✅ PayPal order created successfully with USD');
        return data.orderId;
      } else {
        // Handle specific error cases from backend
        if (data.error === 'CURRENCY_NOT_SUPPORTED' || data.error === 'PAYPAL_UNAVAILABLE') {
          throw new Error(data.message || 'PayPal payment not available');
        }
        throw new Error(data.message || 'Failed to create PayPal order');
      }
    } catch (error) {
      console.error('❌ Error creating PayPal order:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const onApprove = async (data: any) => {
    try {
      setIsProcessing(true);
      console.log('🔄 Capturing PayPal payment for order:', data.orderID);
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/orders/paypal/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
        body: JSON.stringify({
          orderID: data.orderID
        }),
      });

      const result = await response.json();
      console.log('📦 Capture response:', result);
      
      if (result.success) {
        console.log('✅ PayPal payment captured successfully');
        console.log('📦 Order details:', result.order);
        console.log('💰 Capture details:', result.captureDetails);
        toast.success('Payment completed successfully!');
        onSuccess(result.order);
      } else {
        console.error('❌ Payment capture failed:', result.message);
        console.error('❌ Error details:', result.error);
        throw new Error(result.message || 'Failed to capture payment');
      }
    } catch (error) {
      console.error('❌ Error capturing payment:', error);
      toast.error('Payment failed. Please try again.');
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalError = (err: any) => {
    console.error('❌ PayPal error:', err);
    console.error('Error details:', {
      message: err.message,
      details: err.details,
      error: err.error,
      stack: err.stack
    });
    
    // Enhanced error handling with specific messages
    let errorMessage = 'PayPal payment failed. Please try again or contact support.';
    
    if (err.message) {
      if (err.message.includes('currency') || err.message.includes('CURRENCY')) {
        errorMessage = 'PayPal currency issue detected. Please try Credit/Debit Card or Cash on Delivery.';
      } else if (err.message.includes('seller') || err.message.includes('SELLER')) {
        errorMessage = 'PayPal payment not available for your region. Please try Credit/Debit Card or Cash on Delivery.';
      } else if (err.message.includes('country') || err.message.includes('COUNTRY')) {
        errorMessage = 'PayPal payment not available for your country. Please try Credit/Debit Card or Cash on Delivery.';
      } else if (err.message.includes('amount') || err.message.includes('AMOUNT')) {
        errorMessage = 'Invalid payment amount. Please check your order and try again.';
      } else if (err.message.includes('network') || err.message.includes('NETWORK')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }
    }
    
    // Check for specific PayPal error codes
    if (err.details && Array.isArray(err.details)) {
      const currencyError = err.details.find((detail: any) => 
        detail.issue && detail.issue.includes('CURRENCY')
      );
      if (currencyError) {
        errorMessage = 'PayPal currency issue detected. Please try Credit/Debit Card or Cash on Delivery.';
      }
    }
    
    toast.error(errorMessage);
    onError(err);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">PayPal Payment</h3>
          <p className="text-sm text-gray-600">Complete your purchase securely with PayPal</p>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-semibold text-lg">${amount.toFixed(2)}</span>
          </div>
        </div>

        {isProcessing && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-800 text-sm">Processing payment...</span>
            </div>
          </div>
        )}

        <div className="mb-4">
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={handlePayPalError}
            onCancel={onCancel}
            disabled={isProcessing}
          />
        </div>
        
        {/* Fallback if PayPal buttons don't load */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Having trouble with PayPal?</p>
          <button
            onClick={() => onError(new Error('PayPal not available'))}
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Try a different payment method
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayPalPayment; 