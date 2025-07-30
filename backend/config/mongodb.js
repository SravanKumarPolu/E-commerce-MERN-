import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const fullUri = process.env.MONGODB_URI;
    console.log('🔌 Connecting to MongoDB:', fullUri);

    await mongoose.connect(fullUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected:', mongoose.connection.name);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // force crash so Render retries
  }
};

export default connectDB;
