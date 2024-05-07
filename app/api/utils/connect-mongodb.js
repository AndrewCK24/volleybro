import { connect, connection } from "mongoose";
const mongodbUri = process.env.MONGODB_URI;

const connectMongoDB = async () => {
  try {
    if (connection.readyState === 1) return;

    await connect(mongodbUri, {});
    console.log("[Connect Mongodb] Connected to MongoDB!");
  } catch (error) {
    console.error("[Connect Mongodb] error:", error);
  }
};

export default connectMongoDB;
