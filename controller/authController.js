const User = require("../model/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");

// Register a new user => /api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler(`User alredy exist with ${email}`, 401));
  }
  const newUser = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "v1678870070/people/smiling-man",
      url: "https://res.cloudinary.com/diegai7ax/image/upload/v1678870070/samples/people/smiling-man.jpg",
    },
  });

  sendToken(user, 200, res);
  //   const token = newUser.getJwtToken();
  //   res.status(201).json({
  //     success: true,
  //     message: "New User Added Successfully",
  //     token,
  //     newUser,
  //   });
});

exports.deleteUser = catchAsyncError(async (req, res, next) => {
  let user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  await User.deleteOne();

  res.status(201).json({
    success: true,
    message: "User deleted successfully",
  });
});

// update user details => /api/v1/user/:id
exports.updateUser = catchAsyncError(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  try {
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log("User details updated successfully", req.body);
    res.status(200).json({
      success: true,
      message: "User details updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
});

// User Login => /api/v1/login
exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  // check email and pwd
  if (!email || !password) {
    return next(new ErrorHandler("Please provide valid credentials", 400));
  }

  // find user in database
  let user = await User.findOne({ email }).select("password");
  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }
  // check password is correct or not

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    console.log(email, password, isPasswordMatched);
    return next(new ErrorHandler("Invalid credentials", 401));
  }
  sendToken(user, 200, res);
  //   const token = user.getJwtToken();
  //   res.status(200).json({
  //     success: true,
  //     token,
  //   });
});

// Logout user => /api/v1/logout
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
  res.status(200).json({
    success: true,
    message: "User logout successfully",
  });
});
