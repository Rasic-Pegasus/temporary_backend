const Template = require("../models/templateModel.js");

// add new template
const addTemplate = async (req, res) => {
    try {
        const { templateName, description, previewImage, sections } = req.body;

        if (!templateName || !description || !previewImage || !sections) {
            const error = new Error("Missing one or more required fields. Recheck and verify complete data are sent!");
            error.statusCode = 400;
            throw error;
        }

        const newTemplate = new Template({
            templateName,
            description,
            previewImage,
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

// get all templates
const getAllTemplates = async (_, res) => {
    try {
        const templates = await Template.find({})
            .sort({ createdAt: -1 }); // newest first

        res.status(200).json(
            {
                success: true,
                message: "Successfully fetched templates",
                data: templates,
            }
        );
    } catch (error) {
        console.error("Error fetching templates:", error);
        res.status(500).json(
            {
                success: false,
                message: "Failed to fetch templates"
            }
        );
    }
}

// get single template
const getTemplate = async (req, res) => {
    const { templateId } = req.params;

    try {
        const template = await Template.findById(templateId);
        if (!template) {
            const error = new Error("Template not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(
            {
                success: true,
                message: "Successfully fetched template",
                data: template
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

module.exports = { addTemplate, getAllTemplates, getTemplate }
