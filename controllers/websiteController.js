const mongoose = require("mongoose");
const Event = require("../models/eventModel.js");
const Template = require("../models/templateModel.js");
const Website = require("../models/websiteModel.js");

// clone website from template(your first website)
const cloneWebsiteFromTemplate = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user.id;
        const { eventId, templateId } = req.body;

        if (!eventId) {
            const error = new Error('EventId is missing');
            error.statusCode = 400;
            throw error;
        }

        if (!templateId) {
            const error = new Error('TemplateId is missing');
            error.statusCode = 400;
            throw error;
        }

        // fetch the event
        const event = await Event.findById(eventId).session(session);

        // additional checks to confirm the event actually exist in the database(just in case)
        if (!event) {
            const error = new Error('Event not found');
            error.statusCode = 404;
            throw error;
        }

        // if the event website has already been made
        if (event.website) {
            const error = new Error('Website already exists for this event');
            error.statusCode = 403;
            throw error;
        }

        // afterwards check if this event actually belongs to the logged in user
        if (event.organizer.toString() !== userId) {
            const error = new Error("This event doesn't belong to you");
            error.statusCode = 403;
            throw error;
        }

        // verify template existense in db with the templateId coming from client-side
        const template = await Template.findById(templateId).session(session);
        if (!template) {
            const error = new Error("Template not found");
            error.statusCode = 404;
            throw error;
        }

        // clone the actual template as event website temporarily
        const website = await Website.create([{
            belongsToThisEvent: event._id,
            baseTemplate: template._id,
            sections: template.sections.map(s => ({ sectionName: s.sectionName, content: s.defaultContent }))
        }], { session });

        // store the cloned template id in the actual event document
        event.website = website[0]._id;
        await event.save({ session });

        await session.commitTransaction();

        res.status(201).json(
            {
                success: true,
                message: "You have selected the template. Now you can proceed to its customization.",
                data: website[0]
            }
        );
    } catch (error) {
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

// get cloned website for display/edit(authenticated user)
const getWebsite = async (req, res) => {
    const { websiteId } = req.params;

    try {
        const website = await Website.findById(websiteId)
            .populate({
                path: "belongsToThisEvent",
                select: "eventName organizer",
            })
            .populate({
                path: "baseTemplate",
                select: "templateName sections",
            });

        if (!website) {
            const error = new Error("Website not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(
            {
                success: true,
                message: "Successfully fetched website",
                data: website
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

// edit the cloned website(your main website)
const updateWebsite = async (req, res) => {
    const { websiteId, sectionId } = req.params;
    const content = req.body;
    console.log(content)
    const userId = req.user.id;

    try {
        // find website and populate its event + organizer
        const website = await Website.findById(websiteId)
            .populate({
                path: "belongsToThisEvent",
                select: "organizer",
            });

        if (!website) {
            const error = new Error("Website not found");
            error.statusCode = 404;
            throw error;
        }

        // ensure current user is the event organizer
        if (website.belongsToThisEvent.organizer.toString() !== userId) {
            const error = new Error("Not authorized to edit this website");
            error.statusCode = 403;
            throw error;
        }

        // verify section existence
        const section = website.sections.find(sec => sec._id.toString() === sectionId);
        if (!section) {
            const error = new Error("Section doesn't exist in the website");
            error.statusCode = 404;
            throw error;
        }

        // update section content
        section.content = content;
        await website.save();

        return res.status(200).json(
            {
                success: true,
                message: "Successfully updated section",
                data: website
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

// get website for visitor
const getPublicWebsite = async (req, res) => {
    const { websiteId } = req.params;

    try {
        const website = await Website.findById(websiteId)
            .populate({
                path: "belongsToThisEvent",
                select: "eventName description date time location",
            })
            .populate({
                path: "baseTemplate",
                select: "templateName sections",
            });

        if (!website) {
            const error = new Error("Website not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(
            {
                success: true,
                message: "Successfully fetched website",
                data: website
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
};

module.exports = {
    cloneWebsiteFromTemplate,
    getWebsite,
    updateWebsite,
    getPublicWebsite,
}
