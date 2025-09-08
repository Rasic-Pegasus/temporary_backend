const mongoose = require("mongoose");
const Event = require("../models/eventModel.js");
const Template = require("../models/templateModel.js");
const EventWebsite = require("../models/eventWebsiteModel.js");

// clone website from template(your first website)
const cloneWebsiteFromTemplate = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user.id;
        const { eventId } = req.params;
        const { templateId } = req.body;

        // fetch the event
        const event = await Event.findById(eventId).session(session);

        // additional checks to confirm the event actually exist in the database(just in case)
        if (!event) throw new Error("Event not found");

        // if the event website has already been made
        if (event.eventWebsite) throw new Error("Website already exists for this event.");

        // afterwards check if this event actually belongs to the logged in user
        if (event.organizer.toString() !== userId) throw new Error("Authorization check failed. This event doesn't belong to you!");

        // verify template existense in db with the templateId coming from client-side
        const template = await Template.findById(templateId).session(session);
        if (!template) throw new Error("Template not found");

        // clone the actual template as event website temporarily
        const website = await EventWebsite.create([{
            belongsToThisEvent: event._id,
            baseTemplate: template._id,
            sections: template.sections.map(s => ({ sectionName: s.sectionName, content: s.defaultContent }))
        }], { session });

        // store the cloned template id in the actual event document
        event.eventWebsite = website[0]._id;
        await event.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(
            {
                success: true,
                message: "You have selected the template. Now you can proceed to its customization.",
                data: website[0]
            }
        );
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to clone website from template. Please try again later."
            }
        );
    }
};

// get cloned website for display/edit
const getWebsite = async (req, res) => {
    const { websiteId } = req.params;

    try {
        const website = await EventWebsite.findById(websiteId)
            .populate({
                path: "belongsToThisEvent",
                select: "eventName organizer",
            })
            .populate({
                path: "baseTemplate",
                select: "templateName sections",
            });

        if (!website) {
            return res.status(404).json({ success: false, message: "Website not found" });
        }

        res.status(200).json(
            {
                success: true,
                message: "Successfully fetched website",
                data: website
            }
        );
    } catch (error) {
        console.error("Error fetching website:", error);
        res.status(500).json(
            {
                success: false,
                message: "Failed to fetch website"
            });
    }
};

// edit the cloned website(your main website)
const updateWebsite = async (req, res) => {
    const { websiteId, sectionName } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    try {
        // find website and populate its event + organizer
        const website = await EventWebsite.findById(websiteId)
            .populate({
                path: "belongsToThisEvent",
                select: "organizer",
            });

        if (!website) {
            return res.status(404).json({ success: false, message: "Website not found" });
        }

        // ensure current user is the event organizer
        if (website.belongsToThisEvent.organizer.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized to edit this website" });
        }

        // find section
        const section = website.sections.find(sec => sec.sectionName === sectionName);
        if (!section) {
            return res.status(404).json({ success: false, message: "Section not found" });
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
        console.error("❌ Error updating website section:", error);
        return res.status(500).json(
            {
                success: false,
                message: "Failed to update section"
            }
        );
    }
};

module.exports = {
    cloneWebsiteFromTemplate,
    getWebsite,
    updateWebsite
}
