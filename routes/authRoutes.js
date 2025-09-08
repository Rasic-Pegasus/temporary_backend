const express = require("express");
const { registerUser, loginUser, resetPassword, forgotPassword, changePassword} = require("../controllers/authController");

const router = express.Router();

router
  .post("/register", registerUser)
  .post("/login", loginUser)
  .post("/resetpassword", resetPassword)
  .post("/forgotpassword", forgotPassword)
  .post("/change-password/:id", changePassword)

module.exports = router;
