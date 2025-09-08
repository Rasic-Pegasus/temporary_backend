const express = require("express");
const { cloneWebsiteFromTemplate, getWebsite, updateWebsite, getPublicWebsite } = require("../controllers/eventWebsiteController.js");
const { authenticate } = require("../middleware/auth.js");

const router = express.Router();

router
    .post("/:eventId/create", authenticate, cloneWebsiteFromTemplate)
    .get("/:websiteId", authenticate, getWebsite)
    .patch("/:websiteId/sections/:sectionName", authenticate, updateWebsite)
    .get("/:websiteId", getPublicWebsite)

module.exports = router;
