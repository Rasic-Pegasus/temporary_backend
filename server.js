require("dotenv").config();

const express = require("express");
const cookieParser = require('cookie-parser');

const authRoutes = require("./routes/authRoutes");
const templateRoutes = require("./routes/templateRoutes");
const eventRoutes = require("./routes/eventRoutes");
const websiteRoutes = require("./routes/websiteRoutes");

const connectDB = require("./config/db");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const FRONTEND_URL = process.env.FRONTEND_URL;

// CORS configuration
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

const port = process.env.PORT;

app.get("/test", (_, res) => {
  res.status(200).json({
    success: true,
    message: "App is working fine! Good to go!"
  });
});

app.use("/auth", authRoutes);
app.use("/template", templateRoutes);
app.use("/event", eventRoutes);
app.use("/website", websiteRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
