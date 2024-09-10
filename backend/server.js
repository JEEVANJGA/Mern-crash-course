// const express = require('express');
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Product from "./models/product.model.js";

dotenv.config();

// console.log('MONGODB_URI -', process.env.MONGO_URI);

const app = express();

app.use(express.json()); // to parse the incoming request with JSON payloads

app.post("/api/products", async (req, res) => {
  const product = req.body; // user will send the product data in the body

  if (!product.name || !product.price || !product.image) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });
  }

  const newProduct = new Product(product);

  try {
    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Error in saving product - ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.listen(5000, () => {
  connectDB();
  console.log("Server started at http://localhost:5000");
});
