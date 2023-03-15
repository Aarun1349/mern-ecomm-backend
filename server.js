const app = require("./app");
const connectToDatabase = require("./config/database");
const dotenv = require("dotenv");

// handle Unhandled Promise rejections
process.on("uncaughtExceptions", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down... due to uncaught exception ");
  server.close(() => process.exit(1));
});

process.on("referenceError", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down... due to reference error ");
  server.close(() => process.exit(1));
});

// Setting up config file
dotenv.config({ path: "./config/config.env" });

//Connecting to database
connectToDatabase();

const server = app.listen(process.env.PORT || 8000, () => {
  console.log(
    `Server is started on PORT:${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});

// handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down... due to unhandled Promise rejections");
  server.close(() => process.exit(1));
});
