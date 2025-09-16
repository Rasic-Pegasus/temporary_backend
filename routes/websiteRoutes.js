const express = require("express");
const { cloneWebsiteFromTemplate, getWebsite, updateWebsite, getPublicWebsite, deleteWebsite, sendEmailToOrganizer } = require("../controllers/websiteController.js");
const { authenticate } = require("../middleware/auth.js");
const upload = require('../middleware/fileUpload.js');

const router = express.Router();

router
    .get("/:websiteId", authenticate, getWebsite)
    .get("/:websiteId/public", getPublicWebsite)
    .post("/create", authenticate, cloneWebsiteFromTemplate)
    .patch("/:websiteId/:sectionId", authenticate, upload.any(), updateWebsite)
    .delete("/:websiteId/", authenticate, deleteWebsite)
    .post("/sendEmail", sendEmailToOrganizer)

module.exports = router;
