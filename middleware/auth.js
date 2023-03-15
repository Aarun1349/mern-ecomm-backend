// check if user is authenticated or not

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  console.log(token,req.cookies);

  if (!token) {
    return next(new ErrorHandler("login first", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decoded',decoded)
    req.user = await User.findById(decoded.id);
  } catch (error) {
    console.log("ERROR", error);
    return next(new ErrorHandler(error, 400));
  }

  next();
});
