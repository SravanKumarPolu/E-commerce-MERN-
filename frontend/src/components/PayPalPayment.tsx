import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
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
  const { products, cartItems } = useShopContext();
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
              name: product.name,
              unit_amount: {
                currency_code: 'USD',
                value: product.price.toFixed(2)
              },
              quantity: quantity.toString(),
              category: 'PHYSICAL_GOODS'
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
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/orders/paypal/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: getPayPalItems(),
          address,
          currency: 'USD'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        return data.orderId;
      } else {
        throw new Error(data.message || 'Failed to create PayPal order');
      }
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      toast.error('Failed to create PayPal order');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const onApprove = async (data: any) => {
    try {
      setIsProcessing(true);
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/orders/paypal/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderID: data.orderID
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Payment completed successfully!');
        onSuccess(result.order);
      } else {
        throw new Error(result.message || 'Failed to capture payment');
      }
    } catch (error) {
      console.error('Error capturing payment:', error);
      toast.error('Payment failed');
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalError = (err: any) => {
    console.error('PayPal error:', err);
    toast.error('PayPal payment failed');
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

        <PayPalScriptProvider 
          options={{ 
            clientId: "AbOtiWHzUtnR9K6vDyyfTHQw0px-yRPwUngXPDoN7HbRZSkyMR65KNCvNEqvEldeouNwTwRKihtu1pCl",
            currency: "USD"
          }}
        >
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={handlePayPalError}
            onCancel={onCancel}
            disabled={isProcessing}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default PayPalPayment; 