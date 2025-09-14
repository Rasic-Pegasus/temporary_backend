const express = require("express");
const { authenticate } = require("../middleware/auth.js");
const { createEvent, getUserEvents, getSingleEvent, editEvent, deleteEvent } = require("../controllers/eventController.js");

const router = express.Router();

router
    .get("/", authenticate, getUserEvents)
    .get("/:eventId", authenticate, getSingleEvent)
    .post("/create", authenticate, createEvent)
    .put("/:eventId", authenticate, editEvent)
    .delete("/:eventId", authenticate, deleteEvent)

module.exports = router;
