// This is my config file where i have all the configuration settings to my
// database and middlware setups.

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB got a connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
