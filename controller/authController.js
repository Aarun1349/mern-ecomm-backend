const User = require("../model/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmails");
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

  sendToken(newUser, 200, res);
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
    // console.log(email, password, isPasswordMatched);
    return next(new ErrorHandler("Invalid credentials", 401));
  }
  sendToken(user, 200, res);
  //   const token = user.getJwtToken();
  //   res.status(200).json({
  //     success: true,
  //     token,
  //   });
});

// forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  console.log("USER EMAIl",req.body.email);
  console.log("USER",user);
  if (!user) {
    return next(new ErrorHandler("user not found with this email", 404));
  }
  // get reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/reset/${resetToken}`;
  const message = `your password reset token is as follow :\n\n${resetUrl}\n\nIf you have not requested this eamil,then ignore it`;
  try {
    await sendEmail({
      email: user.email,
      subject: `ShopIT Password Recovery`,
      message: message,
    });
    res.status(200).json({
          success: true,
          message:`password recovery email sent successfully to ${user.email}`,
        });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Logout user => /api/v1/logout
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
  res.status(200).json({
    success: true,
    message: "User logout successfully",
  });
});
