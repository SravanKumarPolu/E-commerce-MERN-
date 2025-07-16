import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // Map to store user connections
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: [
          'http://localhost:3000',
          'http://localhost:5173',
          'http://localhost:5174',
          'http://localhost:5175',
          'http://localhost:5176',
          'http://localhost:5177',
          process.env.FRONTEND_URL,
          process.env.ADMIN_URL
        ].filter(Boolean),
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.token;
        
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if it's an admin token
        if (decoded.type === 'admin') {
          socket.userId = null;
          socket.userRole = 'admin';
          socket.userEmail = decoded.email;
          return next();
        }

        // For regular user tokens
        const user = await userModel.findById(decoded.id);
        if (!user || !user.isActive) {
          return next(new Error('Authentication error: User not found or inactive'));
        }

        socket.userId = user._id.toString();
        socket.userRole = user.role;
        socket.userEmail = user.email;
        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication error: Invalid token'));
      }
    });

    this.setupEventHandlers();
    console.log('🔌 WebSocket server initialized');
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔗 User connected: ${socket.userEmail} (${socket.userRole})`);
      
      // Store user connection
      if (socket.userId) {
        this.connectedUsers.set(socket.userId, socket.id);
      } else if (socket.userRole === 'admin') {
        this.connectedUsers.set('admin', socket.id);
      }

      // Join user to their personal room
      if (socket.userId) {
        socket.join(`user_${socket.userId}`);
      }
      
      // Join admin to admin room
      if (socket.userRole === 'admin') {
        socket.join('admin_room');
      }

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`🔌 User disconnected: ${socket.userEmail}`);
        
        // Remove from connected users
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
        } else if (socket.userRole === 'admin') {
          this.connectedUsers.delete('admin');
        }
      });

      // Handle join order room (for specific order updates)
      socket.on('join_order_room', (orderId) => {
        socket.join(`order_${orderId}`);
        console.log(`📦 User ${socket.userEmail} joined order room: ${orderId}`);
      });

      // Handle leave order room
      socket.on('leave_order_room', (orderId) => {
        socket.leave(`order_${orderId}`);
        console.log(`📦 User ${socket.userEmail} left order room: ${orderId}`);
      });

      // Handle admin join order room
      socket.on('admin_join_order', (orderId) => {
        if (socket.userRole === 'admin') {
          socket.join(`order_${orderId}`);
          console.log(`👨‍💼 Admin joined order room: ${orderId}`);
        }
      });

      // Handle admin leave order room
      socket.on('admin_leave_order', (orderId) => {
        if (socket.userRole === 'admin') {
          socket.leave(`order_${orderId}`);
          console.log(`👨‍💼 Admin left order room: ${orderId}`);
        }
      });

      // Handle user typing in chat (if implemented later)
      socket.on('typing', (data) => {
        socket.to(`order_${data.orderId}`).emit('user_typing', {
          userId: socket.userId,
          userEmail: socket.userEmail,
          orderId: data.orderId
        });
      });

      // Handle stop typing
      socket.on('stop_typing', (data) => {
        socket.to(`order_${data.orderId}`).emit('user_stop_typing', {
          userId: socket.userId,
          userEmail: socket.userEmail,
          orderId: data.orderId
        });
      });
    });
  }

  // Send order update to specific user
  sendOrderUpdateToUser(userId, orderData) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit('order_updated', orderData);
      console.log(`📦 Order update sent to user ${userId}`);
    }
  }

  // Send order update to order room (for real-time collaboration)
  sendOrderUpdateToRoom(orderId, orderData) {
    this.io.to(`order_${orderId}`).emit('order_updated', orderData);
    console.log(`📦 Order update sent to order room ${orderId}`);
  }

  // Send order update to admin
  sendOrderUpdateToAdmin(orderData) {
    this.io.to('admin_room').emit('order_updated', orderData);
    console.log(`👨‍💼 Order update sent to admin`);
  }

  // Send new order notification to admin
  sendNewOrderToAdmin(orderData) {
    this.io.to('admin_room').emit('new_order', orderData);
    console.log(`🆕 New order notification sent to admin`);
  }

  // Send order status update to all relevant parties
  sendOrderStatusUpdate(orderData) {
    const { _id: orderId, userId } = orderData;
    
    // Send to specific user
    this.sendOrderUpdateToUser(userId, orderData);
    
    // Send to order room
    this.sendOrderUpdateToRoom(orderId, orderData);
    
    // Send to admin
    this.sendOrderUpdateToAdmin(orderData);
  }

  // Send payment status update
  sendPaymentStatusUpdate(orderData) {
    const { _id: orderId, userId } = orderData;
    
    // Send to specific user
    this.sendOrderUpdateToUser(userId, {
      ...orderData,
      type: 'payment_update'
    });
    
    // Send to admin
    this.sendOrderUpdateToAdmin({
      ...orderData,
      type: 'payment_update'
    });
  }

  // Send shipping update
  sendShippingUpdate(orderData) {
    const { _id: orderId, userId } = orderData;
    
    // Send to specific user
    this.sendOrderUpdateToUser(userId, {
      ...orderData,
      type: 'shipping_update'
    });
    
    // Send to admin
    this.sendOrderUpdateToAdmin({
      ...orderData,
      type: 'shipping_update'
    });
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  // Get connected users info (for admin)
  getConnectedUsersInfo() {
    const users = [];
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket) {
        users.push({
          userId,
          socketId,
          userEmail: socket.userEmail,
          userRole: socket.userRole,
          connectedAt: socket.handshake.time
        });
      }
    }
    return users;
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService; 