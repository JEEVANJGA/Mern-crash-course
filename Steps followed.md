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
  app.get('/', (req, res) => {
    res.send('Server is ready');
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
- 