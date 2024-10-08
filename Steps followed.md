# Steps Followed :

## Backend

### Step - 1

- Setup development folders:
  - Parent folder with the app name.
  - Child folders named `frontend` and `backend`.
  - In the parent folder:
    - Run `npm init -y`.
      - The reason for keeping it in the parent folder is to facilitate easier deployment.
      - Whenever packages are installed for the backend, they will be installed in the root/parent folder.
    - Add a `.gitignore` file.

### Step - 2

- Run `npm i express mongoose dotenv`.
  - Packages get installed:
    - `express` will be used as our web framework to build APIs easily with a routing system.
    - `mongoose` will be used to interact with our database (MongoDB).
    - `dotenv` will be used to access environment variables.

### Step - 3

- Create `server.js` within the backend folder.
  - It could be named `main.js`, `app.js`, etc., following common naming conventions.
  - This will be the entry point for our API.
- Import express and create an express app.
- Add `type: module` in `package.json` to use ES6 standards during code development.
- Add basic code for setting up the express app.
- Add a command to `package.json` under scripts to run the backend solution.
  ```javascript
  "scripts": {
    "dev": "node backend/server.js"
  },
  ```
- Add `nodemon` as a dev-dependency by running `npm i nodemon -D`.
  - This package helps in re-running the solution whenever a code change is made during development.
  - Update scripts in package.json as:
  ```javascript
  "scripts": {
    "dev": "nodemon backend/server.js"
  },
  ```

### Step - 4

- Create routes:

  - Add a simple GET route:

    ```javascript
    app.get("/", (req, res) => {
      res.send("Server is ready");
    });
    ```

### Step - 5

- Create a MongoDB for learning purposes based on instructions.
- Create an `.env` file with the connection string.
- Use the `dotenv` package to access the environment variables.
- Create a `db.js` config file to define the `connectDB` method to connect to MongoDB with `mongo_uri`.
- Create a `models` folder and add a `Product` model by creating `Product.js` or `product.model.js` file:

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
      timestamps: true, // This will automatically add the createdAt and updatedAt fields in the database.
    }
  );

  const Product = mongoose.model("Product", productSchema);
  // Product is the name of the model

  export default Product;
  ```

- Within `server.js` file:

  - Create `/api/products` with POST type:

    ```javascript
    app.post("/api/products", async (req, res) => {
      const product = req.body; // User will send the product data in the body.

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

  - Create `/api/products/:id` with DELETE type:

    ```javascript
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

  - Create `/api/products` with GET type to get all products:

    ```javascript
    app.get("/api/products", async (req, res) => {
      try {
        const products = await Product.find({}); // Find all products.
        res.status(200).json({ success: true, products });
      } catch (error) {
        console.error("Error in fetching products - ", error.message);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });
    ```

  - Create `/api/products/:id` with PUT type to update a product:

    ```javascript
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
          { new: true } // To return the updated product.
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

### Step - 6

- Modularize the code:

  - Create a `routes` folder and add `product.js` or `product.route.js`.
  - Move all the API call definitions to this new file and update as below:

    ```javascript
    import express from "express";
    import mongoose from "mongoose";
    import Product from "../models/product.model.js";

    const router = express.Router();

    // GET request to get all products
    router.get("/", async (req, res) => {
      try {
        const products = await Product.find({}); // Find all products.
        res.status(200).json({ success: true, data: products });
      } catch (error) {
        console.error("Error in fetching products - ", error.message);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });

    // POST request to add a new product
    router.post("/", async (req, res) => {
      const product = req.body; // User will send the product data in the body.

      if (!product.name || !product.price || !product.image) {
        return res
          .status(400)
          .json({ success: false, message: "Please enter all fields" });
      }

      const newProduct = new Product(product);

      try {
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct });
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
          { new: true } // To return the updated product.
        );
        res.status(200).json({ success: true, data: updatedProduct });
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

  - Update `server.js` as below:

    ```javascript
    import express from "express";
    import dotenv from "dotenv";
    import { connectDB } from "./config/db.js";
    import productRoutes from "./routes/product.route.js";

    dotenv.config();

    // console.log('MONGODB_URI -', process.env.MONGO_URI);

    const app = express();

    app.use(express.json()); // To parse the incoming request with JSON payloads.

    app.use("/api/products", productRoutes); // Use the productRoutes for any request that starts with /api/products.

    app.listen(5000, () => {
      connectDB();
      console.log("Server started at http://localhost:5000");
    });
    ```

  - Now the `server.js` file is cleaner than before.
  - Further clean the `product.route.js` file by segregating the controller code to a separate file `product.controller.js` under the `controllers` folder:

    ```javascript
    import mongoose from "mongoose";
    import Product from "../models/product.model.js";

    export const getProducts = async (req, res) => {
      try {
        const products = await Product.find({}); // Find all products.
        res.status(200).json({ success: true, data: products });
      } catch (error) {
        console.error("Error in fetching products - ", error.message);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    };

    export const createProduct = async (req, res) => {
      const product = req.body; // User will send the product data in the body

      if (!product.name || !product.price || !product.image) {
        return res
          .status(400)
          .json({ success: false, message: "Please enter all fields" });
      }

      const newProduct = new Product(product);

      try {
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct });
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
          { new: true } // To return the updated product.
        );
        res.status(200).json({ success: true, data: updatedProduct });
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

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(404)
          .json({ success: false, message: "Invalid Product ID" });
      }

      try {
        await Product.findByIdAndDelete(id);
        res
          .status(200)
          .json({ success: true, message: "Product deleted successfully" });
      } catch (error) {
        console.error("Error in deleting product -", error.message);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    };
    ```

  - Update `product.route.js` as below:

    ```javascript
    import express from "express";
    import {
      getProducts,
      createProduct,
      updateProduct,
      deleteProduct,
    } from "../controllers/product.controller.js";

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

### Step - 7

- Retrieve the PORT information from the `.env` file:
  - Ensure you have a `.env` file in your project root.
  - Add a line in the `.env` file like `PORT=5000`.
  - Use a library like `dotenv` to load the environment variables in your application.
  - Example in Node.js:
    ```javascript
    require("dotenv").config();
    const port = process.env.PORT || 5000;
    console.log(`Server running on port ${port}`);
    ```

## Frontend

### Step - 1

- traverse into frontend folder
- Run `npm create vite@latest . `
  - . --> means initialize solution in current folder
  - choose React as framework/library
  - choose javascript
  - on enter it will create all required boilerplate solution.
- Add Chakra UI to the solution
  - Run `npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion`
- Add the `ChakraProvider` to main.jsx file
  ```javascript
  <ChakraProvider>
    <App />
  </ChakraProvider>
  ```
- Remove css file reference to start fresh development
- Add `react-router-dom`
  - run `npm i react-router-dom`.
- Add `BrowserRouter` to handle page routing
  ```javascript
  <BrowserRouter>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </BrowserRouter>
  ```
- Add react-icons
  - run `npm i react-icons`
- Add Chakra-ui/icons
  - run `npm i @chakra-ui/icons`
- update eslint config

  ```js
  import js from "@eslint/js";
  import globals from "globals";
  import react from "eslint-plugin-react";
  import reactHooks from "eslint-plugin-react-hooks";
  import reactRefresh from "eslint-plugin-react-refresh";

  export default [
    { ignores: ["dist"] },
    {
      files: ["**/*.{js,jsx}"],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
        parserOptions: {
          ecmaVersion: "latest",
          ecmaFeatures: { jsx: true },
          sourceType: "module",
        },
      },
      settings: { react: { version: "18.3" } },
      plugins: {
        react,
        "react-hooks": reactHooks,
        "react-refresh": reactRefresh,
      },
      rules: {
        ...js.configs.recommended.rules,
        ...react.configs.recommended.rules,
        ...react.configs["jsx-runtime"].rules,
        ...reactHooks.configs.recommended.rules,
        "react/prop-types": "off",
        "react/jsx-no-target-blank": "off",
        "react-refresh/only-export-components": [
          "warn",
          { allowConstantExport: true },
        ],
      },
    },
  ];
  ```

-

### Step - 2

- UI Layout setup
- Define basic Layout before component development

  ```javascript
  import { Box } from "@chakra-ui/react";
  import { Route, Routes } from "react-router-dom";
  // import './App.css'

  function App() {
    return (
      <Box minH={"100vh"} bg={"gray"}>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<HomePage />} /> // to be defined and
          imported
          <Route path="/create" element={<CreatePage />} /> // to be defined and
          imported
        </Routes>
      </Box>
    );
  }

  export default App;
  ```

- Delete assets folder.
- Create pages & components folder.
- create placeholder Navbar component, HomePage & CreatePage Page components.
- update App.jsx as below :

  ```javascript
  import { Box } from "@chakra-ui/react";
  import { Route, Routes } from "react-router-dom";
  import Navbar from "./components/Navbar";
  import HomePage from "./pages/HomePage";
  import CreatePage from "./pages/CreatePage";
  // import './App.css'

  function App() {
    return (
      <Box minH={"100vh"} bg={"ghostwhite"}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
        </Routes>
      </Box>
    );
  }

  export default App;
  ```

### Step - 3

- Add Navbar Component

  - Refactor App component to use color mode for background styling

    ```javascript
    import { Box, useColorModeValue } from "@chakra-ui/react";
    import { Route, Routes } from "react-router-dom";
    import Navbar from "./components/Navbar";
    import HomePage from "./pages/HomePage";
    import CreatePage from "./pages/CreatePage";
    // import './App.css'

    function App() {
      return (
        <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePage />} />
          </Routes>
        </Box>
      );
    }

    export default App;
    ```

  - create Navbar component

    ```javascript
    import {
      Button,
      Container,
      Flex,
      HStack,
      Text,
      useColorMode,
    } from "@chakra-ui/react";
    import { Link } from "react-router-dom";
    import { PlusSquareIcon } from "@chakra-ui/icons";
    import { IoMoon } from "react-icons/io5";
    import { LuSun } from "react-icons/lu";

    const Navbar = () => {
      const { colorMode, toggleColorMode } = useColorMode();

      return (
        <Container maxW={"100vw"} px={4}>
          <Flex
            h={16}
            alignItems={"center"}
            justifyContent={"space-between"}
            flexDir={{
              base: "column",
              sm: "row",
            }}
          >
            <Text
              fontSize={{ base: "22", sm: "28" }}
              fontWeight={"bold"}
              textTransform={"uppercase"}
              textAlign={"center"}
              bgGradient={"linear(to-r, cyan.400, blue.500)"}
              bgClip={"text"}
            >
              <Link to="/">Product Store 🛒</Link>
            </Text>
            <HStack spacing={2} alignItems={"center"}>
              <Link to="/create">
                <Button>
                  <PlusSquareIcon fontSize={20} />
                </Button>
              </Link>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <IoMoon /> : <LuSun size="20" />}
              </Button>
            </HStack>
          </Flex>
        </Container>
      );
    };

    export default Navbar;
    ```

- Add CreatePage Page component

  - create CreatePage component

    ```javascript
    import {
      Box,
      Button,
      Container,
      Heading,
      Input,
      useColorModeValue,
      VStack,
    } from "@chakra-ui/react";
    import { useState } from "react";

    const CreatePage = () => {
      const [newProduct, setNewProduct] = useState({
        name: null,
        price: null,
        image: null,
      });

      const handleAddPoduct = () => {
        console.log(newProduct);
      };

      return (
        <Container maxW={"container.sm"}>
          <VStack spacing={8}>
            <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
              Create New Product
            </Heading>
            <Box
              w={"full"}
              bg={useColorModeValue("white", "gray.800")}
              p={6}
              rounded={"lg"}
              shadow={"md"}
            >
              <VStack spacing={4}>
                <Input
                  placeholder={"Product name"}
                  name="name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
                <Input
                  placeholder={"Price"}
                  name="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
                <Input
                  placeholder={"Image URL"}
                  name="image"
                  value={newProduct.image}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                />
                <Button colorScheme="blue" onClick={handleAddPoduct} w={"full"}>
                  Add Product
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Container>
      );
    };

    export default CreatePage;
    ```

### Step - 4

- Setup Global state management using zustand

  - flux based state management library that works with react.
  - A small, fast, and scalable bearbones state management solution.Zustand has a comfy API based on hooks.
  - Run `npm i zustand`
  - Create a `store` folder witin `src` folder, add `products.js` file. Define Basic Global state management custom hook using zustand.

    ```js
    import { create } from "zustand";

    export const useProductStore = create((set) => ({
      products: [],
      setProducts: (products) => set({ products }),
    }));
    ```

- update vite config to handle backend calls

  - updated vite config

    ```js
    import { defineConfig } from "vite";
    import react from "@vitejs/plugin-react";

    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [react()],
      server: {
        proxy: {
          "/api": {
            target: "http://localhost:5000",
          },
        },
      },
    });
    ```

- Add `createProduct` feature to `useProductStore` in `product.js` file within `store` folder :

  - updated `product.js` file

    ```js
    import { create } from "zustand";

    export const useProductStore = create((set) => ({
      products: [],
      setProducts: (products) => set({ products }),
      createProduct: async (newProduct) => {
        if (!newProduct.name || !newProduct.image || !newProduct.price) {
          return {
            success: false,
            message: "Please fill all fields.",
          };
        }
        const res = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProduct),
        });
        const data = await res.json();
        set((state) => ({
          products: [...state.products, data.data],
        }));
        return { success: true, message: "Product added successfully." };
      },
    }));
    ```

- use `createProduct` from `useProductStore` in `CreatePage`

  - updated `CreatePage.jsx` file

    ```js
    import {
      Box,
      Button,
      Container,
      Heading,
      Input,
      useColorModeValue,
      useToast,
      VStack,
    } from "@chakra-ui/react";
    import { useState } from "react";
    import { useProductStore } from "../store/product";

    const CreatePage = () => {
      const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        image: "",
      });
      const toast = useToast();
      const { createProduct } = useProductStore();

      const handleAddPoduct = async () => {
        const { success, message } = await createProduct(newProduct);
        if (!success) {
          toast({
            title: "Error",
            description: message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Success",
            description: message,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
        setNewProduct({
          name: "",
          price: "",
          image: "",
        });
      };

      return (
        <Container maxW={"container.sm"}>
          <VStack spacing={8}>
            <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
              Create New Product
            </Heading>
            <Box
              w={"full"}
              bg={useColorModeValue("white", "gray.800")}
              p={6}
              rounded={"lg"}
              shadow={"md"}
            >
              <VStack spacing={4}>
                <Input
                  placeholder={"Product name"}
                  name="name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
                <Input
                  placeholder={"Price"}
                  name="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
                <Input
                  placeholder={"Image URL"}
                  name="image"
                  value={newProduct.image}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                />
                <Button colorScheme="blue" onClick={handleAddPoduct} w={"full"}>
                  Add Product
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Container>
      );
    };

    export default CreatePage;
    ```

### Step - 5

- Update `HomePage` component to bring in product listing feature.
- For this, first update product store with `fetchProducts` method.

  - updated `useProductStore` in `product.js` file:
    ```js
    import { create } from "zustand";

    export const useProductStore = create((set) => ({
      products: [],
      setProducts: (products) => set({ products }),
      createProduct: async (newProduct) => {
        if (!newProduct.name || !newProduct.image || !newProduct.price) {
          return {
            success: false,
            message: "Please fill all fields.",
          };
        }
        const res = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProduct),
        });
        const data = await res.json();
        set((state) => ({
          products: [...state.products, data.data],
        }));
        return { success: true, message: "Product added successfully." };
      },
      fetchProducts: async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        console.log("fetchProducts data -", data);
        set({ products: data.data });
      },
    }));
    ```

- then create a `ProductCard` component for showcasing product info within product listing view
  - create `ProductCard`

    ```js
    import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
    import {
      Box,
      Heading,
      HStack,
      IconButton,
      Image,
      Text,
      useColorModeValue,
    } from "@chakra-ui/react";

    const ProductCard = ({ product }) => {
      const textColor = useColorModeValue("gray.600", "gray.200");
      const bg = useColorModeValue("white", "gray.800");
      return (
        <Box
          shadow="lg"
          rounded={"lg"}
          overflow={"hidden"}
          transition={"all 0.3s"}
          _hover={{
            transform: "translateY(-5px)",
            shadow: "xl",
          }}
          bg={bg}
        >
          <Image
            src={product.image}
            alt={product.name}
            h={48}
            w="full"
            objectFit={"cover"}
          />
          <Box p={4}>
            <Heading as={"h3"} size={"md"} mb={2}>
              {product.name}
            </Heading>
            <Text fontWeight={"bold"} fontSize={"xl"} color={textColor}>
              ${product.price}
            </Text>
            <HStack spacing={2}>
              <IconButton icon={<EditIcon />} colorScheme="blue" />
              <IconButton icon={<DeleteIcon />} colorScheme="red" />
            </HStack>
          </Box>
        </Box>
      );
    };

    export default ProductCard;
    ```

### Step - 6

- In `ProductCard` component, inorder to implement `Delete Product` feature,
  - first update product store by adding `deleteProduct` method.
    - updated `useProductStore` in `product.js` file:
      ```js
      import { create } from 'zustand';

      export const useProductStore = create((set) => ({
          products: [],
          setProducts: (products) => set({ products }),
          createProduct: async (newProduct) => {
              if (!newProduct.name || !newProduct.image || !newProduct.price) {
                  return {
                      success: false, message: "Please fill all fields."
                  }
              }
              const res = await fetch("/api/products", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(newProduct),
              });
              const data = await res.json();
              set((state) => ({
                  products: [...state.products, data.data],
              }));
              return { success: true, message: "Product added successfully." };
          },
          fetchProducts: async () => {
              const res = await fetch("/api/products");
              const data = await res.json();
              console.log("fetchProducts data -", data);
              set({ products: data.data });
          },
          deleteProduct: async (id) => {
              const res = await fetch(`/api/products/${id}`, {
                  method: "DELETE",
              });
              const data = await res.json();
              if (!data.success) {
                  return { success: false, message: data.message };
              }
              set((state) => ({
                  products: state.products.filter((product) => product._id !== id),
              }));
              return { success: true, message: data.message };
          },
      }));

      ```
  - then update `ProductCard` component with required code changes to use the delete feature
    - updated `ProductCard` component code
      ```js
      import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
      import {
        Box,
        Heading,
        HStack,
        IconButton,
        Image,
        Text,
        useColorModeValue,
        useToast,
      } from "@chakra-ui/react";
      import { useProductStore } from "../store/product";

      const ProductCard = ({ product }) => {
        const textColor = useColorModeValue("gray.600", "gray.200");
        const bg = useColorModeValue("white", "gray.800");

        const { deleteProduct } = useProductStore();
        const toast = useToast();

        const handleDeleteProduct = async (id) => {
          const { success, message } = await deleteProduct(id);
          if (!success) {
            return toast({
              title: "Error",
              description: message,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          } else {
            return toast({
              title: "Success",
              description: message,
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }
        };

        return (
          <Box
            shadow="lg"
            rounded={"lg"}
            overflow={"hidden"}
            transition={"all 0.3s"}
            _hover={{
              transform: "translateY(-5px)",
              shadow: "xl",
            }}
            bg={bg}
          >
            <Image
              src={product.image}
              alt={product.name}
              h={48}
              w="full"
              objectFit={"cover"}
            />
            <Box p={4}>
              <Heading as={"h3"} size={"md"} mb={2}>
                {product.name}
              </Heading>
              <Text fontWeight={"bold"} fontSize={"xl"} color={textColor}>
                ${product.price}
              </Text>
              <HStack spacing={2}>
                <IconButton icon={<EditIcon />} colorScheme="blue" />
                <IconButton
                  icon={<DeleteIcon />}
                  onClick={() => handleDeleteProduct(product._id)}
                  colorScheme="red"
                />
              </HStack>
            </Box>
          </Box>
        );
      };

      export default ProductCard;

      ```
- In `ProductCard` component, inorder to implement `Update Product` feature, 
  - first update product store by adding `updateProduct` method.
    - updated `useProductStore` in `product.js` file:
      ```js
      import { create } from 'zustand';

      export const useProductStore = create((set) => ({
          products: [],
          setProducts: (products) => set({ products }),
          createProduct: async (newProduct) => {
              if (!newProduct.name || !newProduct.image || !newProduct.price) {
                  return {
                      success: false, message: "Please fill all fields."
                  }
              }
              const res = await fetch("/api/products", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(newProduct),
              });
              const data = await res.json();
              set((state) => ({
                  products: [...state.products, data.data],
              }));
              return { success: true, message: "Product added successfully." };
          },
          fetchProducts: async () => {
              const res = await fetch("/api/products");
              const data = await res.json();
              console.log("fetchProducts data -", data);
              set({ products: data.data });
          },
          deleteProduct: async (id) => {
              const res = await fetch(`/api/products/${id}`, {
                  method: "DELETE",
              });
              const data = await res.json();
              if (!data.success) {
                  return { success: false, message: data.message };
              }
              set((state) => ({
                  products: state.products.filter((product) => product._id !== id),
              }));
              return { success: true, message: data.message };
          },
          updateProduct: async (id, updatedProduct) => {
              const res = await fetch(`/api/products/${id}`, {
                  method: "PUT",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(updatedProduct),
              });
              const data = await res.json();
              if (!data.success) {
                  return { success: false, message: data.message };
              }
              set((state) => ({
                  products: state.products.map((product) =>
                      product._id === id ? data.data : product
                  ),
              }));
              return { success: true, message: data.message };
          },
      }));

      ```
  - then update `ProductCard` component with required code changes to use the delete feature
    - updated `ProductCard` component code
      ```js
      import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
      import {
        Box,
        Button,
        Heading,
        HStack,
        IconButton,
        Image,
        Input,
        Modal,
        ModalBody,
        ModalCloseButton,
        ModalContent,
        ModalFooter,
        ModalHeader,
        ModalOverlay,
        Text,
        useColorModeValue,
        useDisclosure,
        useToast,
        VStack,
      } from "@chakra-ui/react";
      import { useProductStore } from "../store/product";
      import { useState } from "react";

      const ProductCard = ({ product }) => {
        const [updatedProduct, setUpdatedProduct] = useState(product);

        const textColor = useColorModeValue("gray.600", "gray.200");
        const bg = useColorModeValue("white", "gray.800");

        const { deleteProduct, updateProduct } = useProductStore();
        const toast = useToast();

        const { isOpen, onOpen, onClose } = useDisclosure();

        const handleDeleteProduct = async (id) => {
          const { success, message } = await deleteProduct(id);
          if (!success) {
            return toast({
              title: "Error",
              description: message,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          } else {
            return toast({
              title: "Success",
              description: message,
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }
        };

        const handleUpdateProduct = async (id, updatedProduct) => {
          const { success, message } = await updateProduct(id, updatedProduct);
          onClose();
          if (!success) {
            return toast({
              title: "Error",
              description: message,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          } else {
            return toast({
              title: "Success",
              description: "Product updated successfully.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }
        };

        return (
          <Box
            shadow="lg"
            rounded={"lg"}
            overflow={"hidden"}
            transition={"all 0.3s"}
            _hover={{
              transform: "translateY(-5px)",
              shadow: "xl",
            }}
            bg={bg}
          >
            <Image
              src={product.image}
              alt={product.name}
              h={48}
              w="full"
              objectFit={"cover"}
            />
            <Box p={4}>
              <Heading as={"h3"} size={"md"} mb={2}>
                {product.name}
              </Heading>
              <Text fontWeight={"bold"} fontSize={"xl"} color={textColor}>
                ${product.price}
              </Text>
              <HStack spacing={2}>
                <IconButton icon={<EditIcon />} onClick={onOpen} colorScheme="blue" />
                <IconButton
                  icon={<DeleteIcon />}
                  onClick={() => handleDeleteProduct(product._id)}
                  colorScheme="red"
                />
              </HStack>
            </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Update Product</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4}>
                    <Input
                      placeholder={"Product name"}
                      name="name"
                      value={updatedProduct.name}
                      onChange={(e) =>
                        setUpdatedProduct({ ...updatedProduct, name: e.target.value })
                      }
                    />
                    <Input
                      placeholder={"Price"}
                      name="price"
                      type="number"
                      value={updatedProduct.price}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          price: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder={"Image URL"}
                      name="image"
                      value={updatedProduct.image}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          image: e.target.value,
                        })
                      }
                    />
                  </VStack>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => handleUpdateProduct(product._id, updatedProduct)}
                  >
                    Update
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        );
      };

      export default ProductCard;

      ```

- 

## Deployment

### Step - 1

- When development started the backend (localhost:5000) and frontend (localhost:5173) solutions were running on 2 different ports
- inorder to run both solution under same port, we will have to make few configuration changes.
- Within `backend` folder, in `server.js` file,
  - Import `path` module
  - Add this line for accesing the directory path `const __dirname = path.resolve();`
  - Below `app.use("/api/products", productRoutes); ` add below code 
    ```js
    // Serve static assets (frontend) if in production
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '/frontend/dist')));

      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
      });
    }
    ```
  - updated `server.js` file
    ```js
    // const express = require('express');
    import express from "express";
    import dotenv from "dotenv";
    import path from "path";

    import { connectDB } from "./config/db.js";

    import productRoutes from "./routes/product.route.js";

    dotenv.config();

    // console.log('MONGODB_URI -', process.env.MONGO_URI);

    const app = express();
    const PORT = process.env.PORT || 5000;

    const __dirname = path.resolve();

    app.use(express.json()); // to parse the incoming request with JSON payloads

    app.use("/api/products", productRoutes); // use the productRoutes for any request that starts with /api/products

    // Serve static assets (frontend) if in production
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '/frontend/dist')));

      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
      });
    }

    app.listen(PORT, () => {
      connectDB();
      console.log("Server started at http://localhost:" + PORT);
    });

    ```
- Within `Root` folder, in `package.json` file,
  - Add build command under `scripts` section
    - `"build": "npm install && npm install --prefix frontend && npm run build --prefix frontend"`
  - Add start command under `scripts` section
    - `"start": "node backend/server.js"`
  - The above `start` and existing dev command requires a minor modification like below :
    - `"start": "NODE_ENV=production node backend/server.js"`
    - `"dev": "NODE_ENV=development nodemon backend/server.js"`
    - specifying `NODE_ENV` helps in serving the application based on the environment.
  -  Add cross-env package
     -  run `npm install cross-env`
  -  update `build` and `start` commands like below
     -  `"start": "cross-env  NODE_ENV=production node backend/server.js"`
     -  `"dev": "cross-env  NODE_ENV=development nodemon backend/server.js"`
  -  ```js
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "dev": "cross-env  NODE_ENV=development nodemon backend/server.js",
        "build": "npm install && npm install --prefix frontend && npm run build --prefix frontend",
        "start": "cross-env  NODE_ENV=production node backend/server.js"
      }
     ```

### Step - 2

- For deployment, I am using Free tier version of `https://render.com/`.
- Create a new account, if using it for the first time
- Fill in basic fields after selecting the right repo under git connector.
- include env file info, under `Environment Variable` section.
- Deploy the Web service

## Additional Activities

### Add About Page 

- Create an About Page.
- Create a zustand store for fetching user profile details from github.
  ```js
  import { create } from 'zustand';

  const githubUserProfileApi = 'https://api.github.com/users/JEEVANJGA';  // Replace with your GitHub username
  export const useUserStore = create((set) => ({
      user: null,
      error: null,
      fetchUser: async () => {
          set({ loading: true, error: null });
          try {
              const response = await fetch(githubUserProfileApi);
              if (!response.ok) {
                  throw new Error('Failed to fetch user');
              }
              const data = await response.json();
              set({ user: data });
          } catch (error) {
              set({ error: error.message, });
          }
      },
  }));

  ```
- use the profile details to add an avatar icon along with other action buttons at top right of NavBar.
  - updated NavBar component
    ```js
    import {
      Avatar,
      Button,
      Container,
      Flex,
      HStack,
      IconButton,
      Text,
      useColorMode,
    } from "@chakra-ui/react";
    import { Link } from "react-router-dom";
    import { PlusSquareIcon } from "@chakra-ui/icons";
    import { IoMoon } from "react-icons/io5";
    import { LuSun } from "react-icons/lu";
    import { useUserStore } from "../store/user";

    const Navbar = () => {
      const { colorMode, toggleColorMode } = useColorMode();
      const { user } = useUserStore();

      return (
        <Container maxW={"100vw"} px={4}>
          <Flex
            h={16}
            alignItems={"center"}
            justifyContent={"space-between"}
            flexDir={{
              base: "column",
              sm: "row",
            }}
          >
            <Text
              fontSize={{ base: "22", sm: "28" }}
              fontWeight={"bold"}
              textTransform={"uppercase"}
              textAlign={"center"}
              bgGradient={"linear(to-r, cyan.400, blue.500)"}
              bgClip={"text"}
            >
              <Link to="/">Product Store 🛒</Link>
            </Text>
            <HStack spacing={2} alignItems={"center"}>
              <Link to="/create">
                <Button>
                  <PlusSquareIcon fontSize={20} />
                </Button>
              </Link>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <IoMoon /> : <LuSun size="20" />}
              </Button>
              <Link to="/about">
                <IconButton
                  isRound={true}
                  variant="solid"
                  aria-label="About the Developer"
                  fontSize="20px"
                  icon={
                    <Avatar size="sm" name={user?.name} src={user?.avatar_url} />
                  }
                />
              </Link>
            </HStack>
          </Flex>
        </Container>
      );
    };

    export default Navbar;

    ```
- on click of Avatar icon, navigate to About Page
- update vite.config.js file like below to handle usage of `react-icons/fa`
    ```js
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'

    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [react()],
      optimizeDeps: {
        include: ['react-icons/fa']
      },
      server:{
        proxy:{
          "/api":{
            target:"http://localhost:5000"
          }
        }
      }
    })

    ```