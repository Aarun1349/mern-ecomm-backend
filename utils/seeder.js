const Product = require("../model/productModel");
const dotenv = require("dotenv");
const connectToDatabase = require("../config/database");

const products = require("../data/dummyProducts.json");

dotenv.config({ path: "/config/config.env" });
connectToDatabase();

const seedProduct = async () => {
    console.log(products);
  try {
    await Product.deleteMany({});
    console.log("Products are deleted successfully");
    await Product.insertMany(products);
    console.log("All products are added successfully");
    process.exit();
  } catch (error) {
    console.log("error",error.message);
    process.exit();
  }
};

seedProduct();
