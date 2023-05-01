import mongoose from "mongoose";
import { createClient } from "redis";

let MONGO_URL: string = process.env.DB_URL;
async function connectDB() {
  return mongoose
    .connect(
      `mongodb://mongo:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
    )
    .then(() => console.log("DB connected"))
    .catch((error: any) => {
      console.error(error);
    });
}

export default connectDB;
