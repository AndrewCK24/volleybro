import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  // Check URI
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Please add MONGODB_URI to env");

  // Create Connection
  let dbConnection;
  const options = {};

  if (mongoose.connection.readyState === 1) {
    // If there's already a connection, use it
    dbConnection = mongoose.connection;
  } else {
    if (process.env.NODE_ENV === "development") {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      if (!global._mongooseConnect) {
        global._mongooseConnect = await mongoose.connect(uri, options);
      }
      dbConnection = global._mongooseConnect;
    } else {
      // In production mode, it's best to not use a global variable.
      dbConnection = await mongoose.connect(uri, options);
    }
  }

  return dbConnection;
};

export default connectToMongoDB;
