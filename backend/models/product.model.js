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
