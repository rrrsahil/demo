const mongoose = require('mongoose');
const { setServers } = require('node:dns/promises');

setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
  // console.log("🚀 connectDB called with MONGO_URI:", process.env.MONGO_URI);
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;