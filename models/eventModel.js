const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        // user reference who created the event
        organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

        // event details
        eventName: { type: String },
        description: { type: String },
        location: { type: String },
        date: { type: String },
        time: { type: String },
        expectedNumberOfPeople: { type: Number },
        phone: { type: String }, // for viewers
        email: { type: String }, // for viewers
        template: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
        website: { type: mongoose.Schema.Types.ObjectId, ref: "Website", unique: true },
        status: {
            type: String,
            enum: ["planned", "completed", "failed"], // can be easily changed later
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Event", eventSchema);
