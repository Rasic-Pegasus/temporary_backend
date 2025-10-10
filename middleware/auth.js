const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticate = async (req, res, next) => {
  const errorMessage = "Authentication failed. Invalid token or missing token!";

  try {
    // Get the token from the cookies
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      const error = new Error(errorMessage);
      error.statusCode = 403;
      throw error;
    }

    // Verify the access token
    const decoded = verifyToken(accessToken, process.env.JWT_SECRET_ACCESS);
    req.user = decoded;

    // Check if the user exists in the database
    const user = await User.findById(decoded.id);
    if (!user) {
      const error = new Error("User doesn't exist!");
      error.statusCode = 404;
      throw error;
    }

    // If everything is good, proceed to next middleware/api
    next();
  } catch (error) {
    console.error(error);

    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";
    res.status(statusCode).json(
      {
        success: false,
        message
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

const generateToken = (id, secret, duration) => {
  try {
    const token = jwt.sign(
      { id },
      secret,
      { expiresIn: duration, }
    );
    return token;
  } catch (err) {
    console.log(err);
  }
};

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
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
  verifyToken,
  admin,
};
