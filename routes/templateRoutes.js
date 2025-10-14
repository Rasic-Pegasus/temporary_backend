const express = require("express");
const { authenticate } = require("../middleware/auth.js");
const { addTemplate, getAllTemplates, getTemplate } = require("../controllers/templateController.js");

const router = express.Router();

router
    .post("/add", authenticate, addTemplate)
    .get("/all", authenticate, getAllTemplates)
    .get("/:templateId", authenticate, getTemplate)

module.exports = router;
