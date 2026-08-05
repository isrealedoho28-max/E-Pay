import mongoose from 'mongoose'
const mongoURI= process.env.MONGODB_URI


export const connectDB = async () => {
  
  try { await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  }catch(error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}