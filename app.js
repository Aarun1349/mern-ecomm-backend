const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const errorMiddleware = require("./middleware/errors");
app.use(express.json());
app.use(bodyParser.json());
//Import all products
const products = require("./route/productRoute");

//middleware to handle routes errors
app.use(errorMiddleware)

app.use("/api/v1", products);
module.exports = app;
