const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/socialapp");
  }
  catch (err) {
    console.error("Could not connect to database");
    console.error(err);
    process.exit();
  }
};

const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect();
  }
  catch (err) {
    console.error("Error when disconnecting from database");
    console.error(err);
    process.exit();
  }
};

module.exports = { connectToDatabase, disconnectFromDatabase };