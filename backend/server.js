// const express = require('express');
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import productRoutes from "./routes/product.route.js";

dotenv.config();

// console.log('MONGODB_URI -', process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // to parse the incoming request with JSON payloads

app.use("/api/products", productRoutes); // use the productRoutes for any request that starts with /api/products

app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:5000"+PORT);
});
