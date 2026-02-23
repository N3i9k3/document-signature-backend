// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // only the URI, no extra options
    console.log("MongoDB connected 🚀");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // exit if DB connection fails
  }
};

export default connectDB;
