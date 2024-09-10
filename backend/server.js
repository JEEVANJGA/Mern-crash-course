// const express = require('express');
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Product from "./models/product.model.js";
import mongoose, { mongo } from "mongoose";

dotenv.config();

// console.log('MONGODB_URI -', process.env.MONGO_URI);

const app = express();

app.use(express.json()); // to parse the incoming request with JSON payloads

// GET request to get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({}); // find all products
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error in fetching products - ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// POST request to add a new product
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

// PUT request to update a product
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Product ID" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      product,
      { new: true } // to return the updated product
    );
    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Error in updating product - ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// DELETE request to delete a product
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  // console.log('id -', id);

  try {
    await Product.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleting product -", error.message);
    res.status(404).json({ success: false, message: "Product not found" });
  }
});

app.listen(5000, () => {
  connectDB();
  console.log("Server started at http://localhost:5000");
});
