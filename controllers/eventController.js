const mongoose = require("mongoose");
const Event = require("../models/eventModel.js");
const User = require("../models/userModel.js");
const Website = require("../models/websiteModel.js")

// create new event
const createEvent = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user.id;
        const { eventName, description, location, date, time, expectedNumberOfPeople, phone, email } = req.body;

        // create the event
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

        // Update the user's event list
        await User.findByIdAndUpdate(userId, { $push: { events: event[0]._id } }, { session });

        // Commit the transaction if both operations succeed
        await session.commitTransaction();

        res.status(201).json(
            {
                success: true,
                message: "Successfully created event",
                data: event[0],
            }
        );
    } catch (error) {
        // if any one db operation fails
        await session.abortTransaction();

        console.error(error);

        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal server error";
        res.status(statusCode).json(
            {
                success: false,
                message
            }
        );
    } finally {
        session.endSession();
    }
};

// get all events of single user
const getUserEvents = async (req, res) => {
    const userId = req.user.id;

    try {
        const events = await Event.find({ organizer: userId })
            .populate({
                path: "website",
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

// get single event
const getSingleEvent = async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;

    try {
        const event = await Event.findById(eventId)
            .populate({
                path: "website",
                select: "sections baseTemplate",
            });

        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        // Ownership check
        if (event.organizer.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized to view this event" });
        }

        res.status(200).json(
            {
                success: true,
                data: event
            });
    } catch (error) {
        console.error("Error fetching single event:", error);
        res.status(500).json(
            {
                success: false,
                message: "Failed to fetch event"
            });
    }
};

// edit specific event
const updateEvent = async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            const error = new Error('Event not found');
            error.statusCode = 404;
            throw error;
        }

        // Ownership check
        if (event.organizer.toString() !== userId) {
            const error = new Error('Not authorized to edit this event');
            error.statusCode = 403;
            throw error;
        }

        const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(
            {
                success: true,
                message: "Event updated successfully",
                data: updatedEvent
            }
        );
    } catch (error) {
        console.error(error);

        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal server error";
        res.status(statusCode).json(
            {
                success: false,
                message
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
            const error = new Error('Event not found');
            error.statusCode = 404;
            throw error;
        }

        if (event.organizer.toString() !== userId) {
            const error = new Error('User not authorized to perform this operation');
            error.statusCode = 403;
            throw error;
        }

        // delete linked website if ever created
        await Website.findOneAndDelete({ belongsToThisEvent: eventId }).session(session);

        // Delete the event
        await Event.findByIdAndDelete(eventId).session(session);

        // Remove the event from the User's events list as well
        await User.findByIdAndUpdate(userId, { $pull: { events: eventId } }).session(session);

        await session.commitTransaction();

        res.status(200).json(
            {
                success: true,
                message: "Event and linked website deleted successfully"
            }
        );
    } catch (error) {
        // if any one db operation fails
        await session.abortTransaction();

        console.error(error);

        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal server error";
        res.status(statusCode).json(
            {
                success: false,
                message
            }
        );
    } finally {
        session.endSession();
    }
};

module.exports = {
    createEvent,
    getUserEvents,
    getSingleEvent,
    updateEvent,
    deleteEvent
}
