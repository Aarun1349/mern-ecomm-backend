const Product = require("../model/productModel");
const dotenv = require("dotenv");
const connectToDatabase = require("../config/database");
const products = require("../data/dummyProducts");

dotenv.config({ path: "/config/config.env" });
connectToDatabase();

const seedProducts = async () => {
  try {
    await Product.deleteMany({});
    console.log("Products are deleted successfully");
    await Product.insertMany(products);
    console.log("All products are added successfully");
    process.exit();
  } catch (error) {
    console.log("error", error.message);
    process.exit();
  }
};

seedProducts();
