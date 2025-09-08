const mongoose = require("mongoose");

const eventWebsiteSectionSchema = new mongoose.Schema(
    {
        sectionName: { type: String, required: true },
        content: { type: mongoose.Schema.Types.Mixed, required: true },
    }
);

const eventWebsiteSchema = new mongoose.Schema(
    {
        belongsToThisEvent: { type: mongoose.Schema.Types.ObjectId, ref: "Event", unique: true },
        baseTemplate: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
        sections: [eventWebsiteSectionSchema],
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("EventWebsite", eventWebsiteSchema);
