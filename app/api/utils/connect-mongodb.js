import { connect } from "mongoose";
const mongodbUri = process.env.MONGODB_URI;

const connectMongoDB = async () => {
  console.log("Connecting to MongoDB...");
  await connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
  });
  console.log("Connected to MongoDB!");
};

export default connectMongoDB;
