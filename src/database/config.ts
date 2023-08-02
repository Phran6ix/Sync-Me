import mongoose from "mongoose";

let MONGO_URL: string; //=  process.env.DB_URL || "mongo";
console.log(process.env.DB_URL);
// console.log(MONGO_URL);

if (process.env.NODE_ENV === "production")
  MONGO_URL = process.env.MONGO_URI.replace(
    "<password>",
    `${process.env.MONGO_PASSWORD}`
  );

async function connectDB() {
  return await mongoose
    .connect(MONGO_URL || "mongodb://mongo:27017/sync-me")
    .then(() => console.log("DB connected"))
    .catch((error: any) => {
      console.error(error);
    });
}

export default connectDB;
