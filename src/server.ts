// import "dotenv/config";
// import dotenv from "dotenv";
require("dotenv").config();

import connectDB from "./database/config";
import http from "http";
import app from "./app";

// const chcek = dotenv.config();
// const checkenv = (process.env.NODE_ENV = "test");

const port: number = +process.env.PORT || 4000;

const server = http.createServer(app);

async function startServer() {
  await connectDB();
  server.listen(port, () => {
    console.log(`App connected on port ${port}`);
  });
}

startServer();
