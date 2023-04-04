const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/errors");
const cors = require('cors');



app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
//Import all products
const products = require("./route/productRoute");
const auth = require("./route/authRoute");
const order = require("./route/orderRoute");

//middleware to handle routes errors
app.use(errorMiddleware);

app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", order);
module.exports = app;
