const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Check for the CLOUDINARY_URL variable and configure automatically
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    url: process.env.CLOUDINARY_URL
  });
} else {
  throw new Error('Cloudinary URL not found in environment variables');
}

module.exports = cloudinary;
