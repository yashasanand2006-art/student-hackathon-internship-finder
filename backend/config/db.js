const mongoose = require('mongoose');

let isConnected = false;
let useMemoryStore = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/opportunity_nexus';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick detection if Mongo isn't running locally
    });
    isConnected = true;
    useMemoryStore = false;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Notice] Local MongoDB instance not reachable at ${uri} (${error.message}).`);
    console.log(`[DevNexus] Activating zero-config In-Memory Document Store. All CRUD, JWT auth, and bookmarks are 100% active and testable!`);
    console.log(`[DevNexus] To use real MongoDB, start 'mongod' or supply MONGODB_URI in backend/.env.`);
    isConnected = false;
    useMemoryStore = true;
    return null;
  }
};

const getDBStatus = () => ({
  isConnected,
  useMemoryStore,
  mode: useMemoryStore ? 'In-Memory ODM' : 'MongoDB / Mongoose'
});

module.exports = { connectDB, getDBStatus };
