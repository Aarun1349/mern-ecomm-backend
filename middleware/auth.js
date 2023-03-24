// check if user is authenticated or not

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

// Authenticate the user
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  console.log("token maxAge", token);
  console.log("token expires", token.expires);

  if (!token) {
    return next(new ErrorHandler("login first", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();

  // // console.log("token",token.toString());
  // // const isTokenExpired = token => Date.now() >= (JSON.parse(atob(token.split('.')[1]))).exp * 1000;
  // // console.log('isTokenExpired',Date.now() >=JSON.parse(atob(token.split('.')[1])).exp * 1000)
  // console.log("isTokenExpired1", token);
  // console.log("isTokenExpired2", JSON.parse(atob(token.split(".")[1])));
  // const myCookie = req.cookies["token"];
  // console.log(`The cookie expires on ${myCookie.expires}`);
  // console.log(`The cookie expires in ${myCookie.maxAge} milliseconds`);
});

//Authorize user role

exports.authorizeRoles =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
