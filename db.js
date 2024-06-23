const mongoose = require("mongoose");
require("dotenv").config();
const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL);
const db = mongoose.connection;

db.on("connected", () => {
  console.log("✅ MongoDB Server connected...");
});
db.on("disconnected", () => {
  console.log("❌ MongoDB Server disconnected!");
});
db.on("error", (err) => {
  console.log("❓️ MongoDB connection error:", err);
});

module.exports = db;
