const express = require("express");
const router = express.Router();
const {
  registerUser,
  deleteUser,
  updateUser,
  login,
  logout,
  forgotPassword,
  resetPassword
} = require("../controller/authController");

//Register new user
router.route("/user/register").post(registerUser);
router.route("/user/:id").put(updateUser).delete(deleteUser);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);


module.exports = router;
