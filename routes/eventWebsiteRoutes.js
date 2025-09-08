const express = require("express");
const { cloneWebsiteFromTemplate, getWebsite, updateWebsite } = require("../controllers/eventWebsiteController.js");
const { authenticate } = require("../middleware/auth.js");

const router = express.Router();

router
    .post("/:eventId/create", authenticate, cloneWebsiteFromTemplate)
    .get("/:websiteId", authenticate, getWebsite)
    .patch("/:websiteId/sections/:sectionName", authenticate, updateWebsite)

module.exports = router;
