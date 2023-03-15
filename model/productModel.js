const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: [true, "Please Provide the product name"],
    maxLength: [100, " Please provide a product name with in 100 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please Provide the product price"],
    maxLength: [5, " Please provide a product price with in 100 characters"],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "Please Provide the product name"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: { type: String, required: true },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please provide a category"],
    enum: {
      values: [
        "Electronics",
        "Sports",
        "Books",
        "Clothing",
        "Shoes",
        "Grocery",
        "Home Appliances",
        "Mobile",
      ],
      message: "Please select a category",
    },
  },
  seller: { type: String, required: [true, "please provide a seller"] },
  stocks: {
    type: Number,
    required: true,
    maxLength: [5, " Please provide a product stock with in 5 characters"],
    default: 0,
  },
  noOfReviews: { type: Number, default: 0 },
  reviews: {
    type: Array,
    default: [
      {
        name: {
          type: String,
          required: true,
        },
        ratings: { type: Number, required: true },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Products = mongoose.model("Products", productSchema);
module.exports = Products;
