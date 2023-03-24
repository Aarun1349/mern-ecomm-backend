const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please provide valid username"],
    maxLength: [30, "username should not exceed 30 characters"],
  },
  email: {
    type: String,
    unique: [true, "Email ID already exist"],
    require: [true, "Please provide valid email"],
    maxLength: [30, "email should not exceed 30 characters"],
    validate: [validator.isEmail, "Please enter valid email address"],
  },
  password: {
    type: String,
    require: [true, "Please provide password"],
    maxLength: [15, "password should not exceed 15 characters"],
    minLength: [5, "password should be at least 5 characters long"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
// Encryting password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// compare user passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Return JWT Token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

//generate password reset token
userSchema.methods.generatePasswordResetToken = async function () {
  // generate a token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // hash and set to rest token password
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //set token expired time
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};
const Users = mongoose.model("Users", userSchema);
module.exports = Users;
