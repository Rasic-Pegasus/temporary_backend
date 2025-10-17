const express = require("express");
const { cloneWebsiteFromTemplate, getWebsite, updateSection, getPublicWebsite, deleteWebsite, publishWebsite, sendEmailToOrganizer, getSection, saveWebsite } = require("../controllers/websiteController.js");
const { authenticate } = require("../middleware/auth.js");
const upload = require('../middleware/fileUpload.js');

const router = express.Router();

router
    .get("/:websiteId", authenticate, getWebsite)
    .get("/public/:subdomain", getPublicWebsite)
    .post("/create", authenticate, cloneWebsiteFromTemplate)
    .patch("/:websiteId/save", authenticate, saveWebsite)
    .get("/:websiteId/:sectionId", authenticate, getSection)
    .patch("/:websiteId/:sectionId", authenticate, upload.any(), updateSection)
    .delete("/:websiteId", authenticate, deleteWebsite)
    .post("/publish/:websiteId", authenticate, publishWebsite)
    .post("/sendEmail", sendEmailToOrganizer)

module.exports = router;
