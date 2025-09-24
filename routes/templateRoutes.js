const express = require("express");
const { authenticate } = require("../middleware/auth.js");
const { addTemplate, getAllTemplates } = require("../controllers/templateController.js");

const router = express.Router();

router
    .post("/add", authenticate, addTemplate)
    .get("/all", authenticate, getAllTemplates)

module.exports = router;
