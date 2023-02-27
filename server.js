const app = require("./app");
const connectToDatabase = require('./config/database')
const dotenv = require("dotenv");
// Setting up config file
dotenv.config({ path: "./config/config.env" });

//Connecting to database
connectToDatabase();
    
app.listen(process.env.PORT || 8000, () => {
  console.log(
    `Server is started on PORT:${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});
