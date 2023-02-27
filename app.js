const express = require("express");
const app = express();

app.use(express.json());

//Import all products
const products = require("./route/productRoute");

app.use("/api/v1", products);
module.exports = app;
