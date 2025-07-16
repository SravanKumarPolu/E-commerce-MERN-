import React, { useEffect, useState } from 'react';
import { useShopContext } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

interface RealTimeOrderStatusProps {
  orderId?: string;
  currentStatus?: string;
  onStatusUpdate?: (newStatus: string) => void;
}

const RealTimeOrderStatus: React.FC<RealTimeOrderStatusProps> = ({
  orderId,
  currentStatus,
  onStatusUpdate
}) => {
  const { webSocket, user } = useShopContext();
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!webSocket.isConnected || !orderId) return;

    // Join order room for real-time updates
    webSocket.joinOrderRoom(orderId);

    // Cleanup on unmount
    return () => {
      webSocket.leaveOrderRoom(orderId);
    };
  }, [webSocket.isConnected, orderId, webSocket]);

  useEffect(() => {
    if (!webSocket.socket) return;

    const handleOrderUpdate = (data: any) => {
      if (data._id === orderId) {
        setIsUpdating(true);
        setLastUpdate(new Date());
        
        if (onStatusUpdate && data.orderStatus) {
          onStatusUpdate(data.orderStatus);
        }

        // Reset updating state after animation
        setTimeout(() => setIsUpdating(false), 2000);
      }
    };

    webSocket.socket.on('order_updated', handleOrderUpdate);

    return () => {
      webSocket.socket?.off('order_updated', handleOrderUpdate);
    };
  }, [webSocket.socket, orderId, onStatusUpdate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Order Placed':
        return <FaInfoCircle className="text-blue-500" />;
      case 'Packing':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'Shipped':
        return <FaExclamationTriangle className="text-purple-500" />;
      case 'Out for delivery':
        return <FaExclamationTriangle className="text-orange-500" />;
      case 'Delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'Cancelled':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Packing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Out for delivery':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!webSocket.isConnected) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <span>Offline</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Connection Status */}
      <div className="flex items-center space-x-2 text-sm">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-green-600">Live Updates Active</span>
      </div>

      {/* Current Status */}
      {currentStatus && (
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getStatusColor(currentStatus)}`}>
          {getStatusIcon(currentStatus)}
          <span className="font-medium">{currentStatus}</span>
        </div>
      )}

      {/* Update Animation */}
      <AnimatePresence>
        {isUpdating && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 text-sm text-green-600"
          >
            <FaBell className="animate-bounce" />
            <span>Status updated just now</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Last Update Time */}
      {lastUpdate && (
        <div className="text-xs text-gray-500">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      )}

      {/* Admin Controls */}
      {user?.role === 'admin' && orderId && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs font-medium text-gray-700 mb-2">Admin Controls</div>
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Monitoring order room: {orderId}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeOrderStatus; 