const express = require("express");
const { registerUser, loginUser, checkAuthState, logoutUser, resetPassword, forgotPassword, changePassword, refreshAccessToken } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router
  .post("/register", registerUser)
  .post("/login", loginUser)
  .get("/checkAuthState", authenticate, checkAuthState)
  .post("/logout", authenticate, logoutUser)
  .post("/forgot-password", forgotPassword)
  .post("/reset-password", authenticate, resetPassword)
  .post("/change-password", authenticate, changePassword)
  .post("/refresh-token", refreshAccessToken)

module.exports = router;
