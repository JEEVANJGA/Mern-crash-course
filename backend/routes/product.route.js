import { express } from "express";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./controllers/product.controller.js";

const router = express.Router();

// GET request to get all products
router.get("/", getProducts);

// POST request to add a new product
router.post("/", createProduct);

// PUT request to update a product
router.put("/:id", updateProduct);

// DELETE request to delete a product
router.delete("/:id", deleteProduct);

export default router;
