const express = require("express");
const { cloneWebsiteFromTemplate, getWebsite, updateWebsite, getPublicWebsite } = require("../controllers/eventWebsiteController.js");
const { authenticate } = require("../middleware/auth.js");

const router = express.Router();

router
    .get("/:websiteId", getPublicWebsite)
    .get("/:websiteId", authenticate, getWebsite)
    .post("/create", authenticate, cloneWebsiteFromTemplate)
    .patch("/:websiteId/sections/:sectionName", authenticate, updateWebsite)

module.exports = router;
