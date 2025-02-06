import mongoose from 'mongoose';

const MONGODB_URI = import.meta.env.VITE_MONGODB_URI;

const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Instead of process.exit, we'll throw an error to be handled by the caller
    throw new Error('Failed to connect to MongoDB');
  }
};

export default connectDB;