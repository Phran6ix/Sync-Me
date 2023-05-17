import mongoose from "mongoose";

let MONGO_URL: string = process.env.DB_URL;

if (process.env.NODE_ENV === "production")
  MONGO_URL = process.env.MONGO_URI.replace(
    "<password>",
    `${process.env.MONGO_PASSWORD}`
  );
async function connectDB() {
  return mongoose
    .connect(MONGO_URL)
    .then(() => console.log("DB connected"))
    .catch((error: any) => {
      console.error(error);
    });
}

export default connectDB;
