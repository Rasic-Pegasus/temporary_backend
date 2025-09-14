const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/userModel");

dotenv.config();

const authenticate = async (req, res, next) => {
  const errorMessage = "Authentication failed. Invalid token or missing token!";

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      const error = new Error(errorMessage);
      error.statusCode = 403;
      throw error;
    }

    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      const error = new Error(errorMessage);
      error.statusCode = 403;
      throw error;
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;

    const user = await User.findById(decoded.id);
    if (!user) {
      const error = new Error("User doesn't exist!");
      error.statusCode = 404;
      throw error;
    }

    next();
  } catch (error) {
    console.error(error);

    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";
    res.status(statusCode).json(
      {
        success: false,
        message: message
      }
    );
  }
};

const hashedPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    console.log(err);
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (err) {
    console.log(err);
  }
};

const generateToken = (id) => {
  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (err) {
    console.log(err);
  }
};

const generateResetToken = (userId) => {
  const payload = {
    userId,
    resetPassword: true,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const verifyResetToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null; // If token is invalid or expired
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .send({ success: false, message: "Not authorized as an admin" });
  }
};

module.exports = {
  authenticate,
  hashedPassword,
  comparePassword,
  generateToken,
  generateResetToken,
  verifyResetToken,
  admin,
};
