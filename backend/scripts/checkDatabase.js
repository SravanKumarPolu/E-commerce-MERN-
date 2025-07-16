import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const checkDatabase = async () => {
  try {
    const dbUri = `${process.env.MONGODB_URI}/e-commerce`;
    console.log('🔌 Connecting to MongoDB:', dbUri);
    
    await mongoose.connect(dbUri);
    console.log('✅ Connected to database:', mongoose.connection.db.databaseName);
    console.log('📍 Host:', mongoose.connection.host);
    console.log('🔢 Port:', mongoose.connection.port);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📚 Collections in database:');
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    // Check orders collection specifically
    const ordersCollection = mongoose.connection.db.collection('orders');
    const orderCount = await ordersCollection.countDocuments();
    console.log(`\n📦 Orders collection count: ${orderCount}`);
    
    if (orderCount > 0) {
      const sampleOrder = await ordersCollection.findOne();
      console.log('\n📄 Sample order:');
      console.log(JSON.stringify(sampleOrder, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

checkDatabase(); 