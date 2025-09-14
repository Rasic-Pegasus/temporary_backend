const express = require("express");
const { authenticate } = require("../middleware/auth.js");
const { createEvent, getUserEvents, getSingleEvent, updateEvent, deleteEvent } = require("../controllers/eventController.js");

const router = express.Router();

router
    .get("/", authenticate, getUserEvents)
    .get("/:eventId", authenticate, getSingleEvent)
    .post("/create", authenticate, createEvent)
    .patch("/:eventId", authenticate, updateEvent)
    .delete("/:eventId", authenticate, deleteEvent)

module.exports = router;
