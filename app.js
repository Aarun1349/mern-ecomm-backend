const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/errors");
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
//Import all products
const products = require("./route/productRoute");
const auth = require("./route/authRoute");

//middleware to handle routes errors
app.use(errorMiddleware);

app.use("/api/v1", products);
app.use("/api/v1", auth);
module.exports = app;
