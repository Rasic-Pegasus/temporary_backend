# Temporary Event Website Backend Repository

## 🚀 Project Overview
This is the backend repository for **Temporary Event Website** - a system to create temporary website for event. The backend is built using **Node.js, Express, and MongoDB**, providing APIs for the frontend application.


## 📌 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (using Mongoose)
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt
- **File Uploads**: Multer & Cloudinary
- **Email Services**: SendGrid
- **Security & Validation**: CORS, Validator

## 🔧 Installation
1. Clone the repository (**access required**):
   ```sh
   git clone https://github.com/Rasic-Pegasus/temporary_backend.git
   cd temporary_backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Define environment variables according to .env.example.

## 🏗️ Scripts
- **Start the server:**
  ```sh
  npm run server
  ```

## 📂 Project Structure
```
📦 temporary_backend
├── 📂 config          # Configuration files (DB connection, Cloudinary, sendgrid, etc.)
├── 📂 controller      # Business logic and request handlers
├── 📂 middleware      # Middleware (auth, fileupload)
├── 📂 models          # Mongoose models (database schemas)
├── 📂 routes          # Express routes for API endpoints\
├── 📂 scripts         # temporary script files to generate secret and templates
├── 📂 node_modules    # Dependencies
├── 📜 .env            # Environment variables
├── 📜 .env.example    # Environment variables setup example
├── 📜 .gitignore      # Ignored files and folders
├── 📜 package.json    # Project metadata and dependencies
├── 📜 package-lock.json # Dependency lockfile
├── 📜 server.js       # Main entry point for the server
└── 📜 README.md       # Documentation
```