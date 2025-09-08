const express = require("express");
const { createEvent } = require("../controllers/eventController.js");
const { authenticate } = require("../middleware/auth.js");

const router = express.Router();

router
    .post("/create", authenticate, createEvent)
    .get("/", authenticate, getUserEvents)
    .get("/:eventId", authenticate, getSingleEvent)

module.exports = router;

// todo: update, delete the created event
