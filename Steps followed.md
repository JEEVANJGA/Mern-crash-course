# Steps followed

## Step - 1

- setup dev folders
  - Parent folder with app name
  - child folders with name - frontend and backend
  - In Parent folder,
    - run `npm init -y`
      - reason why we are keeping it not specific to backend folder is it is going to help deployment easily
      - Whenever packages are installed for backend, it will be done on the root/parent folder.
    - Add `.gitignore` file

## Step-2

- Run `npm i express mongoose dotenv`
  - packages get installed
  - express will be used as our web framework.
    - we can build APIs easily with routing system
  - mongoose will be used to interact with our db (MongoDB)
  - dotenv package will be used to access env variables

## Step-3

- Create `server.js` within backend folder
  - could be `main.js`, `app.js`, etc. as per standard.
  - entry point for our API
- import express and create an express app
- add `type:module` in `package.json`, so that we could use ES6 standards during code development
- add basic code for setting up the express app
- add command to `package.json` under scripts to run backend solution.
- add nodemon as a dev-dependency, by running `npm i nodemon -D`
  - This package helps in re-running the solution whenever a code change is made during development.

## Step-4

- create routes

  - add a simple get route

  ```javascript
  app.get("/", (req, res) => {
    res.send("Server is ready");
  });
  ```

## Step-5

- Create a MongoDB for learning purpose based on instructions
- create env file as suggested with connection string
- Use dotenv package to access the env variables.
- create db.js config file to define connectDB method to coneect to mongoDB with mongo_uri.
- create models folder and add products model by creating Products.js or products.model.js file.

  ```javascript
  import mongoose from "mongoose";

  const productSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true, // this will automatically add the createdAt and updatedAt field in the database
    }
  );

  const Product = mongoose.model("Product", productSchema);
  // Product is the name of the model

  export default Product;
  ```

- Within server.js file

  - create `/api/products` with POST type.

    ```js
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
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });
    ```

  - create `/api/products/:id` with DELETE type

    ```js
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
    ```

  - create `/api/products` with GET type, to get all products
    ```js
    // GET request to get all products
    app.get("/api/products", async (req, res) => {
      try {
        const products = await Product.find({}); // find all products
        res.status(200).json({ success: true, products });
      } catch (error) {
        console.error("Error in fetching products - ", error.message);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });
    ```
  - create `/api/products/:id` with PUT type, to update a product

    ```js
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
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });
    ```

## Step-6

- Need to make the code modularize. For this,

  - create a route folder and add product.js or `product.route.js`
  - move all the api call definitions to this new file and update as below:

    ```js
    import { express } from "express";
    import { mongoose } from "mongoose";
    import Product from "./models/product.model.js";

    const router = express.Router();

    // GET request to get all products
    router.get("/", async (req, res) => {
      try {
        const products = await Product.find({}); // find all products
        res.status(200).json({ success: true, products });
      } catch (error) {
        console.error("Error in fetching products - ", error.message);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });

    // POST request to add a new product
    router.post("/", async (req, res) => {
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
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });

    // PUT request to update a product
    router.put("/:id", async (req, res) => {
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
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });

    // DELETE request to delete a product
    router.delete("/:id", async (req, res) => {
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

    export default router;
    ```

  - update server.js as below

    ```js
    // const express = require('express');
    import express from "express";
    import dotenv from "dotenv";
    import { connectDB } from "./config/db.js";

    import productRoutes from "./routes/product.route.js";

    dotenv.config();

    // console.log('MONGODB_URI -', process.env.MONGO_URI);

    const app = express();

    app.use(express.json()); // to parse the incoming request with JSON payloads

    app.use("/api/products", productRoutes); // use the productRoutes for any request that starts with /api/products

    app.listen(5000, () => {
      connectDB();
      console.log("Server started at http://localhost:5000");
    });
    ```

  - Now server.js file is bit more cleaner than before.
  - but we are not done yet, we could clean the product.route.js file by segregating the controller code to a seperate file `product.controller.js` under controllers folder.
    ```js
    import { mongoose } from "mongoose";
    import Product from "./models/product.model.js";

    export const getProducts = async (req, res) => {
      try {
        const products = await Product.find({}); // find all products
        res.status(200).json({ success: true, products });
      } catch (error) {
        console.error("Error in fetching products - ", error.message);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    };

    export const createProduct = async (req, res) => {
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
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    };

    export const updateProduct = async (req, res) => {
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
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    };

    export const deleteProduct = async (req, res) => {
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
    };
    ```

  - update `product.route.js` as below :
    ```js
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

    ```
  - 
