import mongoose from "mongoose";

// const MONGODB_URI = `mongodb://localhost:27017/nextjs-blog`;
const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mydatabase.1c7whlf.mongodb.net/?retryWrites=true&w=majority&appName=myDatabase`;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
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
