const mongoose = require("mongoose");

async function connectToDB() {
  try {
    console.log("Attempting DB connection...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to DB");
  } catch (error) {
    console.error(error);
  }
}

module.exports = connectToDB;