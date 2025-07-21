import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';

interface WebSocketMessage {
  type?: string;
  orderId?: string;
  orderStatus?: string;
  paymentStatus?: string;
  message?: string;
  [key: string]: any;
}

interface UseWebSocketProps {
  token: string | null;
  userId?: string;
  userRole?: string;
  onOrderUpdate?: (data: WebSocketMessage) => void;
  onNewOrder?: (data: WebSocketMessage) => void;
  onPaymentUpdate?: (data: WebSocketMessage) => void;
  onShippingUpdate?: (data: WebSocketMessage) => void;
}

export const useWebSocket = ({
  token,
  userRole,
  onOrderUpdate,
  onNewOrder,
  onPaymentUpdate,
  onShippingUpdate
}: UseWebSocketProps) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  // Connect to WebSocket
  const connect = useCallback(() => {
    // Check if WebSockets are disabled via environment variable
    const isWebSocketDisabled = import.meta.env.VITE_DISABLE_WEBSOCKET === 'true';
    
    if (isWebSocketDisabled) {
      console.log('🔇 WebSocket is disabled via environment variable');
      return;
    }

    if (!token) {
      console.log('🔌 No token available, skipping WebSocket connection');
      return;
    }

    if (socketRef.current?.connected) {
      console.log('🔌 WebSocket already connected');
      return;
    }

    console.log('🔌 Connecting to WebSocket...');
    
    try {
      socketRef.current = io(backendUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: 3, // Reduced from 5 to prevent excessive reconnects
        reconnectionDelay: 2000, // Increased from 1000 for more stability
        reconnectionDelayMax: 10000, // Increased from 5000
        forceNew: true // Force new connection to prevent conflicts
      });

      // Connection events
      socketRef.current.on('connect', () => {
        console.log('🔗 WebSocket connected successfully');
        setIsConnected(true);
        setConnectionError(null);
      });

      socketRef.current.on('disconnect', (reason: string) => {
        console.log('🔌 WebSocket disconnected:', reason);
        setIsConnected(false);
        
        // Only try to reconnect for server-initiated disconnects, not client-initiated ones
        if (reason === 'io server disconnect') {
          // Server disconnected, try to reconnect after a delay
          setTimeout(() => {
            if (socketRef.current && token) {
              console.log('🔄 Attempting to reconnect after server disconnect...');
              socketRef.current.connect();
            }
          }, 3000); // Increased delay for stability
        }
      });

      socketRef.current.on('connect_error', (error: Error) => {
        console.error('🔌 WebSocket connection error:', error);
        setConnectionError(error.message);
        setIsConnected(false);
      });

      // Order update events
      socketRef.current.on('order_updated', (data: WebSocketMessage) => {
        console.log('📦 Order update received:', data);
        
        if (onOrderUpdate) {
          onOrderUpdate(data);
        }

        // Show toast notification based on update type
        if (data.type === 'payment_update') {
          toast.success(`Payment status updated: ${data.paymentStatus}`);
        } else if (data.type === 'shipping_update') {
          toast.success(`Shipping status updated: ${data.orderStatus}`);
        } else {
          toast.success(`Order status updated: ${data.orderStatus}`);
        }
      });

      // New order notification (for admin)
      socketRef.current.on('new_order', (data: WebSocketMessage) => {
        console.log('🆕 New order received:', data);
        
        if (onNewOrder) {
          onNewOrder(data);
        }

        if (userRole === 'admin') {
          toast.info(`New order received from ${data.userId?.name || 'Customer'}`);
        }
      });

      // Payment status update
      socketRef.current.on('payment_update', (data: WebSocketMessage) => {
        console.log('💳 Payment update received:', data);
        
        if (onPaymentUpdate) {
          onPaymentUpdate(data);
        }

        toast.success(`Payment ${data.paymentStatus}: Order #${data._id}`);
      });

      // Shipping update
      socketRef.current.on('shipping_update', (data: WebSocketMessage) => {
        console.log('🚚 Shipping update received:', data);
        
        if (onShippingUpdate) {
          onShippingUpdate(data);
        }

        toast.success(`Shipping status: ${data.orderStatus}`);
      });

      // User typing events (for future chat feature)
      socketRef.current.on('user_typing', (data: any) => {
        console.log('⌨️ User typing:', data);
        // Handle typing indicator
      });

      socketRef.current.on('user_stop_typing', (data: any) => {
        console.log('⌨️ User stopped typing:', data);
        // Handle typing indicator
      });

    } catch (error) {
      console.error('🔌 WebSocket connection failed:', error);
      setConnectionError('Failed to connect to WebSocket');
    }
  }, [token, backendUrl, onOrderUpdate, onNewOrder, onPaymentUpdate, onShippingUpdate, userRole]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log('🔌 Disconnecting WebSocket...');
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // Join order room
  const joinOrderRoom = useCallback((orderId: string) => {
    if (socketRef.current?.connected) {
      console.log(`📦 Joining order room: ${orderId}`);
      socketRef.current.emit('join_order_room', orderId);
    }
  }, []);

  // Leave order room
  const leaveOrderRoom = useCallback((orderId: string) => {
    if (socketRef.current?.connected) {
      console.log(`📦 Leaving order room: ${orderId}`);
      socketRef.current.emit('leave_order_room', orderId);
    }
  }, []);

  // Admin join order room
  const adminJoinOrder = useCallback((orderId: string) => {
    if (socketRef.current?.connected && userRole === 'admin') {
      console.log(`👨‍💼 Admin joining order room: ${orderId}`);
      socketRef.current.emit('admin_join_order', orderId);
    }
  }, [userRole]);

  // Admin leave order room
  const adminLeaveOrder = useCallback((orderId: string) => {
    if (socketRef.current?.connected && userRole === 'admin') {
      console.log(`👨‍💼 Admin leaving order room: ${orderId}`);
      socketRef.current.emit('admin_leave_order', orderId);
    }
  }, [userRole]);

  // Send typing indicator
  const sendTyping = useCallback((orderId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing', { orderId });
    }
  }, []);

  // Send stop typing indicator
  const sendStopTyping = useCallback((orderId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('stop_typing', { orderId });
    }
  }, []);

  // Auto-connect when token changes
  useEffect(() => {
    if (token) {
      connect();
    } else {
      disconnect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [token]); // Fixed: Removed connect and disconnect from dependencies to prevent infinite loops

  return {
    isConnected,
    connectionError,
    connect,
    disconnect,
    joinOrderRoom,
    leaveOrderRoom,
    adminJoinOrder,
    adminLeaveOrder,
    sendTyping,
    sendStopTyping,
    socket: socketRef.current
  };
}; 