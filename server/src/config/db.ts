// import mongoose from "mongoose";
// import { env } from "./env.js";

// export async function connectDB() {
//   mongoose.set("strictQuery", true);
//   await mongoose.connect(env.MONGODB_URI);
//   console.log("[db] connected");
// }


import { env } from "./env.js";
import mongoose from "mongoose";
import dns from "node:dns/promises";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}