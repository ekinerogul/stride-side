const mongoose = require("mongoose");

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is required.");
}

mongoose.connect(process.env.MONGODB_URI).catch((error) => {
  console.error("MongoDB connection failed:", error.message);
  process.exit(1);
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("we are connected to mongodb!"));
