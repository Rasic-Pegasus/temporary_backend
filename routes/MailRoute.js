const express = require("express");
const { sendEmail, sendTestEmail } = require("../controllers/MailController.js");

const router = express.Router();

router.post("/send-mail", sendEmail).post("/send-test-mail", sendTestEmail);

module.exports = router;
