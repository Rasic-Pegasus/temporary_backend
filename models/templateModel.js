const mongoose = require("mongoose");

// section of base template
const templateSectionSchema = new mongoose.Schema(
    {
        sectionName: { type: String, required: true },
        defaultContent: { type: mongoose.Schema.Types.Mixed, required: true },
    }
);

// pre-defined base theme
const templateSchema = new mongoose.Schema(
    {
        templateName: { type: String, required: true, unique: true },
        description: {type: String, required: true },
        previewImage: {type: String, required: true},
        sections: [templateSectionSchema],
    }
);

module.exports = mongoose.model("Template", templateSchema);
