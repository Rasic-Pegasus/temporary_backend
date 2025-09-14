const express = require("express");
const { cloneWebsiteFromTemplate, getWebsite, updateWebsite, getPublicWebsite } = require("../controllers/websiteController.js");
const { authenticate } = require("../middleware/auth.js");

const router = express.Router();

router
    .get("/:websiteId", authenticate, getWebsite)
    .get("/:websiteId/public", getPublicWebsite)
    .post("/create", authenticate, cloneWebsiteFromTemplate)
    .patch("/:websiteId/:sectionId", authenticate, updateWebsite)

module.exports = router;
