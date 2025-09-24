const express = require("express");
const { authenticate } = require("../middleware/auth.js");
const { addTemplate } = require("../controllers/templateController.js");

const router = express.Router();

router
    .post("/add", authenticate, addTemplate)

module.exports = router;
