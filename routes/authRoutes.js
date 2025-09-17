const express = require("express");
const { registerUser, loginUser, resetPassword, forgotPassword, changePassword } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router
  .post("/register", registerUser)
  .post("/login", loginUser)
  .post("/reset-password", resetPassword)
  .post("/forgot-password", forgotPassword)
  .post("/change-password", authenticate, changePassword)

module.exports = router;
