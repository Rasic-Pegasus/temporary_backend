const userModel = require("../models/userModel");
const { hashedPassword, comparePassword, generateToken } = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

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

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ success: false, message: "Other user is already registered with this email. Please use another email." });
    }

    const hashPassword = await hashedPassword(password);

    userModel.create({
      name,
      email,
      password: hashPassword,
    });

    res
      .status(201)
      .send({
        success: true,
        message: 'You have been registered. Please proceed to login.'
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred during registration",
      error: error.message || error,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password: userPassword } = req.body;

    if (!email || !userPassword) {
      return res
        .status(400)
        .send({ success: false, message: "Email and Password are required" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "You are not registered yet. Please register first." });
    }

    const isPasswordMatch = await comparePassword(userPassword, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .send({ success: false, message: "Incorrect password" });
    }

    const accessToken = generateToken(user._id);

    const { password, ...userWithoutPassword } = user.toObject();

    res.status(200).send({
      success: true,
      message: "Successfully logged in",
      data: userWithoutPassword,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Login error. Please try again.", error });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const msg = {
      to: email,
      from: "sagolbaruwal3@gmail.com",
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link below to reset your password: \n\n${resetUrl}`,
      html: `<p>You requested a password reset. Click the link below to reset your password:</p><a href="${resetUrl}">Reset Password</a>`,
    };

    await sgMail.send(msg);

    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
};

const resetPassword = async (req, res) => {
  const { accessToken, newPassword } = req.body;

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Failed to reset password." });
  }
};

const changePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both old and new passwords are required.",
      });
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Old password is incorrect." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been updated successfully.",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const sendMail = async (req, res) => {
  try {
    const msg = {
      to: "sagolbaruwal4@gmail.com",
      from: "sagolbaruwal3@gmail.com",
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>HEyy</strong>",
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
    return res.status(200).json({
      success: true,
      message: `Email sent successfully to ${to}`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
};

const getallmembers = async (req, res) => {
  try {
    const allmembers = await userModel.find();

    res.status(200).json(allmembers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch members" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
  sendMail,
  getallmembers,
};
