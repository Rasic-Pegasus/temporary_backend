const mongoose = require("mongoose");

const websiteSectionSchema = new mongoose.Schema(
    {
        sectionName: { type: String, required: true },
        content: { type: mongoose.Schema.Types.Mixed, required: true },
    }
);

const websiteSchema = new mongoose.Schema(
    {
        belongsToThisEvent: { type: mongoose.Schema.Types.ObjectId, ref: "Event", unique: true },
        baseTemplate: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
        sections: [websiteSectionSchema],
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Website", websiteSchema);
