const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  if (process.env.NODE_ENV === "DEVLOPMENT") {
    console.log("err",err);
    res.send(err.statusCode).json({
      success: false,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err };
    error.message = err.message;
    console.log("err",error);
    // Wrong Mongoose Object Id error
    if (err.name === "CastError") {
      const message = ` Resource not found. Invalid: ${err.path}`;
      error = new ErrorHandler(message, 404);
    }

    //Handling Mongoose Validation Error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map(value == value.message);
      error = new ErrorHandler(message, 400);
    }
    //Handle Mongoose Duplicate Key error
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      error = new ErrorHandler(message, 400);
    }

    // Handling expired JWT error
    if (error.name === "JsonWebTokenError") {
      const message = "JSON Web Token is invalid,Please Try Again!";
      error = new ErrorHandler(message, 500);
    }

    // Handling expired JWT token
    if (error.name === "TokenExpiredError") {
      const message = "JSON Web Token is expired.Try Again!";
      error = new ErrorHandler(message, 500);
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
