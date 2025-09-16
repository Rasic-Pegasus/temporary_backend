const mongoose = require("mongoose");
const Event = require("../models/eventModel.js");
const Template = require("../models/templateModel.js");
const Website = require("../models/websiteModel.js");
const sendEmail = require("../helpers/sendEmail");
const uploadToCloudinary = require("../helpers/uploadToCloudinary.js");

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
    const userId = req.user.id;
    const content = req.body;
    const images = req.files;

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

        if (images && images.length > 0) {
            const uploadedImages = {};

            for (const image of images) {
                const result = await uploadToCloudinary(
                    image.buffer,
                    "website_section_images"
                );

                // if the field already exists, push into array (for gallery/multi-images)
                if (uploadedImages[image.fieldname]) {
                    uploadedImages[image.fieldname].push(result.secure_url);
                } else {
                    uploadedImages[image.fieldname] = [result.secure_url];
                }
            }

            // Merge uploaded images with body content
            // If only one image was uploaded for a field, store it as string instead of array
            for (const field in uploadedImages) {
                if (uploadedImages[field].length === 1) {
                    content[field] = uploadedImages[field][0];
                } else {
                    content[field] = uploadedImages[field];
                }
            }
        }

        // Update section content
        section.content = { ...section.content, ...content };
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
                select: "eventName description date time location email",
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

// delete website for visitor
const deleteWebsite = async (req, res) => {
    const userId = req.user.id;
    const { websiteId } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const website = await Website.findById(websiteId)
            .populate({
                path: "belongsToThisEvent",
                select: "organizer",
            })
            .session(session);

        if (!website) {
            const error = new Error("Website not found");
            error.statusCode = 404;
            throw error;
        }

        // ensure current user is the event organizer
        if (website.belongsToThisEvent.organizer.toString() !== userId) {
            const error = new Error("Not authorized to delete this website");
            error.statusCode = 403;
            throw error;
        }

        // delete the website
        await Website.findByIdAndDelete(websiteId).session(session);

        // clear website reference from event
        await Event.findByIdAndUpdate(
            website.belongsToThisEvent._id,
            { $unset: { website: "" } },
            { new: true }
        ).session(session);

        await session.commitTransaction();

        res.status(200).json(
            {
                success: true,
                message: "Successfully deleted website"
            });
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

// send email to organizer from website viewer
const sendEmailToOrganizer = async (req, res) => {
    const formData = req.body;

    try {
        if (!formData.viewerEmail) {
            const error = new Error("Please provide your email address");
            error.statusCode = 400;
            throw error;
        }

        // for developer only while testing
        if (!formData.organizerEmail) {
            const error = new Error("Please include organizer email address in the request body");
            error.statusCode = 400;
            throw error;
        }

        await sendEmail(formData);

        res.status(200).json(
            {
                success: true,
                message: "Thank you for reaching out! We’ve received your email and will get back to you as soon as possible",
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

module.exports = {
    cloneWebsiteFromTemplate,
    getWebsite,
    updateWebsite,
    getPublicWebsite,
    deleteWebsite,
    sendEmailToOrganizer
}
