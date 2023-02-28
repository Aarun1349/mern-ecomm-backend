const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.json());
//Import all products
const products = require("./route/productRoute");

app.use("/api/v1", products);
module.exports = app;
