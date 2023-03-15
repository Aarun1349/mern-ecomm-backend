const express = require("express");
const router = express.Router();
const {
  registerUser,
  deleteUser,
  updateUser,
  login,
  logout,
} = require("../controller/authController");

//Register new user
router.route("/user/register").post(registerUser);
router.route("/user/:id").put(updateUser).delete(deleteUser);
router.route("/login").post(login);
router.route("/logout").get(logout);

module.exports = router;
