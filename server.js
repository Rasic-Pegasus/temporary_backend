require("dotenv").config();

const express = require("express");

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
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

const port = process.env.PORT;

app.get("/api/test", (_, res) => {
  res.status(200).json({
    success: true,
    message: "App is working fine! Good to go!"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/template", templateRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/website", websiteRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
