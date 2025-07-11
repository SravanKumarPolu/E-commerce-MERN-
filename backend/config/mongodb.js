import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on('connected', () => {
    // Database connected successfully
  });
  await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
}

export default connectDB;