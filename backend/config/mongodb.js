import mongoose from "mongoose";
const connectDB=async()=>{
  const dbUri = `${process.env.MONGODB_URI}/e-commerce`;
  console.log('🔌 Connecting to MongoDB:', dbUri);
  
  mongoose.connection.on('connected',()=>{
    console.log("✅ DB Connected to:", mongoose.connection.db.databaseName);
    console.log("📍 Database URL:", mongoose.connection.host + ':' + mongoose.connection.port);
  })
  
  await mongoose.connect(dbUri)
}
export default connectDB;