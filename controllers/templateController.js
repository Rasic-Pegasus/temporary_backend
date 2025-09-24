const Template = require("../models/templateModel.js");

const addTemplate = async (req, res) => {
    try {
        const { templateName, sections } = req.body;

        if (!templateName || !sections) {
            const error = new Error("Missing 'templateName' or 'sections'");
            error.statusCode = 400;
            throw error;
        }

        const newTemplate = new Template({
            templateName,
            sections,
        });

        await newTemplate.save();
        res.status(201).json({
            success: true,
            message: "Template added successfully",
            template: newTemplate
        });
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
}

module.exports = { addTemplate }