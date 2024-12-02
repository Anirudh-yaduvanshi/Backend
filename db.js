const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');
const mongoURI1 = "mongodb+srv://inotebook:VBPGMOehIJrJIm9j@cluster0.e64x6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const mongoURI = "mongodb://localhost:27017/"

const connectToMongo = async () => {
  try {
    // await MongoClient(mongoURI1).connect();
    await mongoose.connect(mongoURI1);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
};

module.exports = connectToMongo;