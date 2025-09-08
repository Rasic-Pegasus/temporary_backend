const express = require("express");
const { authenticate } = require("../middleware/auth.js");
const { createEvent, getUserEvents, getSingleEvent, editEvent, deleteEvent } = require("../controllers/eventController.js");

const router = express.Router();

router
    .post("/create", authenticate, createEvent)
    .get("/", authenticate, getUserEvents)
    .get("/:eventId", authenticate, getSingleEvent)
    .put("/:eventId", authenticate, editEvent)
    .delete("/:eventId", authenticate, deleteEvent)

module.exports = router;

// todo: update, delete the created event
