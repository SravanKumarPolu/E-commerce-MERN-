import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Proper Atlas configuration with correct option names
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    mongoose.connection.on('connected', () => {
      console.log('📊 MongoDB connected successfully');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('🎉 MongoDB Atlas connection established');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('⏳ Server will continue running without database...');
    console.log('💡 Please check your MongoDB Atlas connection string and network');
    // Don't exit the process, allow server to start for testing
  }
}

export default connectDB;