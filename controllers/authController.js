const User = require("../models/userModel");
const { hashedPassword, comparePassword, generateToken, verifyToken } = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const { sgMail, senderEmailAddress } = require("../config/sendgrid");
const validator = require("validator");
const dotenv = require("dotenv");

dotenv.config();

// register new user/event organizer
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Incoming request for registering new user:\n', req.body);

    // basic validation
    if (!name || !email || !password) {
      return res.status(400).send({
        error: "Name, email, and password are required",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).send({ error: "Invalid email format" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .send({ error: "Password must be at least 8 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ success: false, message: "Email is already registered" });
    }

    const hashPassword = await hashedPassword(password);

    User.create({
      name,
      email,
      password: hashPassword,
    });

    res.status(201).json(
      {
        success: true,
        message: 'You have been registered. Please proceed to login.'
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(
      {
        success: false,
        message: "An error occurred during registration",
        error: error.message || error,
      }
    );
  }
};

// login user and send accessToken to response
const loginUser = async (req, res) => {
  try {
    const { email, password: userPassword } = req.body;

    if (!email || !userPassword) {
      return res
        .status(400)
        .send({ success: false, message: "Email and Password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not registered yet" });
    }

    const isPasswordMatch = await comparePassword(userPassword, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .send({ success: false, message: "Incorrect password" });
    }

    // both tokens expires after 7days, needs to be changes in production mode
    const accessToken = generateToken(user._id, process.env.JWT_SECRET_ACCESS, "7d");
    const refreshToken = generateToken(user._id, process.env.JWT_SECRET_REFRESH, "7d");

    await User.findByIdAndUpdate(user._id, { refreshToken });

    const { password, ...userWithoutPassword } = user.toObject();

    res.status(200).json(
      {
        success: true,
        message: "Successfully logged in",
        data: userWithoutPassword,
        accessToken,
        refreshToken
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(
      {
        success: false,
        message: "Login failed",
        error
      }
    );
  }
};

// send reset-password-url in email to user
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      res.status(404).json({ success: false, message: "Please provide email address" })
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetToken = generateToken(user._id, process.env.JWT_SECRET_ACCESS, "5m");

    if (!resetToken) {
      return res.status(500).json({ success: false, message: "Failed to generate reset token" });
    }

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const msg = {
      to: email,
      from: senderEmailAddress,
      subject: "Reset Password",
      text: `You requested a password reset. Click the link below to reset your password: \n\n${resetUrl}`,
      html: `<p>You requested a password reset. Click the link below to reset your password:</p><a href="${resetUrl}">Reset Password</a>`,
    };

    await sgMail.send(msg);

    res.status(200).json({ success: true, message: "Password reset email sent", resetUrl });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};

// reset password api, this api is used alongside forgot-password api
const resetPassword = async (req, res) => {
  const userId = req.user.id;
  const { newPassword } = req.body;

  try {
    if (!newPassword) {
      return res.status(404).json({ message: "Enter new password" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

// update password
const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  try {
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Both old and new passwords are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json(
      {
        success: true,
        message: "Password has been updated successfully",
      }
    );
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json(
      {
        success: false,
        message: "Internal server error"
      }
    );
  }
};

// generate new access token
const refreshToken = async (req, res) => {
  const errorMessage = "Invalid refresh token!";

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      const error = new Error(errorMessage);
      error.statusCode = 403;
      throw error;
    }

    const refreshToken = authHeader.split(" ")[1];
    if (!refreshToken) {
      const error = new Error(errorMessage);
      error.statusCode = 403;
      throw error;
    }

    // verify refresh token
    const decoded = verifyToken(refreshToken, process.env.JWT_SECRET_REFRESH);
    const userId = decoded.id;

    // 7d for test only, must change expiry duration for production mode
    const accessToken = generateToken(userId, process.env.JWT_SECRET_ACCESS, "7d");

    res.status(200).json({
      success: true,
      accessToken,
    });
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

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshToken
};
