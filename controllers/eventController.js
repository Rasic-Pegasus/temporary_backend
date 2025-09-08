const mongoose = require("mongoose");
const Event = require("../models/eventModel.js");
const User = require("../models/userModel.js");

// create new event
const createEvent = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user.id;
        const { eventName, description, location, date, time, expectedNumberOfPeople, phone, email } = req.body;

        // save in session
        const event = await Event.create([{
            organizer: userId,
            eventName,
            description,
            location,
            date,
            time,
            expectedNumberOfPeople,
            phone,
            email
        }], { session });

        // save in session
        await User.findByIdAndUpdate(userId, { $push: { events: event[0]._id } }, { session });

        // if both db operation succeeds then only consider success
        await session.commitTransaction();
        session.endSession();

        res.status(201).json(
            {
                success: true,
                message: "Successfully created event",
                event: event[0],
            }
        );
    } catch (error) {
        // if any one db operation fails
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json(
            {
                success: false,
                message: "Failed to create event"
            }
        );
    }
};

// get all events of single user
const getUserEvents = async (req, res) => {
    const userId = req.user.id;

    try {
        const events = await Event.find({ organizer: userId })
            .populate({
                path: "eventWebsite",
                select: "sections baseTemplate",
            })
            .sort({ createdAt: -1 }); // newest first

        res.status(200).json(
            {
                success: true,
                message: "Successfully fetched user events",
                data: events,
            }
        );
    } catch (error) {
        console.error("Error fetching user events:", error);
        res.status(500).json(
            {
                success: false,
                message: "Failed to fetch user events"
            }
        );
    }
};

// edit specific event
const editEvent = async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        // Ownership check
        if (event.organizer.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to edit this event" });
        }

        // Update allowed fields
        Object.keys(updates).forEach(key => {
            event[key] = updates[key];
        });

        await event.save();
        res.status(200).json(
            {
                success: true,
                message: "Event updated successfully",
                data: event
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json(
            {
                success: true,
                message: "Failed to update event"
            }
        );
    }
};

// delete specific event
const deleteEvent = async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const event = await Event.findById(eventId).session(session);
        if (!event) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        if (event.organizer.toString() !== userId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ success: false, message: "Not authorized to delete this event" });
        }

        // delete linked website
        await EventWebsite.findOneAndDelete({ belongsToThisEvent: eventId }).session(session);

        // Delete the event
        await Event.findByIdAndDelete(eventId).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json(
            {
                success: true,
                message: "Event and linked website deleted successfully"
            }
        );
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json(
            {
                success: false,
                message: "Failed to delete event"
            }
        );
    }
};

module.exports = {
    createEvent,
    getUserEvents,
    editEvent,
    deleteEvent
}
