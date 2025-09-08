const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        // user reference who created the event
        organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // opt

        // event details
        eventName: { type: String, default: "" },
        description: { type: String, default: "" },
        location: { type: String, default: "" },
        date: { type: String, default: "" },
        time: { type: String, default: "" },
        expectedNumberOfPeople: { type: Number, default: 0 },
        phone: { type: String, default: "" }, // for viewers
        email: { type: String, default: "" }, // for viewers
        template: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
        eventWebsite: { type: mongoose.Schema.Types.ObjectId, ref: "EventWebsite" },
        status: {
            type: String,
            enum: ["planned", "completed", "failed"], // can be easily changed later
            default: "planned"
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Event", eventSchema);
