import mongoose from "mongoose";

const MONGODB_URI = `mongodb://localhost:27017/nextjs-blog`; // Preferred

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}
async function connectDB() {
  if (cached.conn) {
    console.log("Using cached MongoDB connection");
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  console.log("Using cached MongoDB connection");
  return cached.conn;
}
export default connectDB;
