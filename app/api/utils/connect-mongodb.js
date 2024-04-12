import { connect } from "mongoose";
const mongodbUri = process.env.MONGODB_URI;

const connectMongoDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connect(mongodbUri, {});
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectMongoDB;
