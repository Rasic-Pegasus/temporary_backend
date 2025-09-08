const mongoose = require("mongoose");
const Event = require("../models/eventModel.js");
const User = require("../models/userModel.js");

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

module.exports = {
    createEvent,
    getUserEvents
}
