const PageContent = require('../../models/templateModel');

const addNewSection = async (req, res) => {
    try {
        const { pageName, sectionName } = req.params;
        const content = req.body;

        let page = await PageContent.findOne({ pageName });

        if (!page) {
            // Create new page and add new section if it doesn't exist at all
            page = new PageContent({
                pageName,
                sections: [{ sectionName, content }],
            });
        } else {
            // Check if section already exists
            const exists = page.sections.find(sec => sec.sectionName === sectionName);
            if (exists) {
                return res.status(400).json({ message: "Section already exists in this page" });
            }

            // Add new section
            page.sections.push({ sectionName, content });
        }

        await page.save();

        const newlyAddedSection = page.sections.find(sec => sec.sectionName === sectionName);

        res.status(201).json({ success: true, message: "Section added successfully", newlyAddedSection });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getSpecificPageContent = async (req, res) => {
    try {
        const { pageName } = req.params;

        const page = await PageContent.findOne({ pageName });

        if (!page) return res.status(404).json({ message: "Page not found" });

        res.status(200).json({ success: true, message: "Page found", page })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const getSpecificSectionContent = async (req, res) => {
    try {
        const { pageName, sectionName } = req.params;

        const pageContent = await PageContent.findOne(
            { pageName, "sections.sectionName": sectionName },
            { "sections.$": 1 }
        );

        const section = pageContent?.sections?.[0];

        if (!section) return res.status(404).json({ message: "Section not found" });

        res.status(200).json({ success: true, message: "Section found", section })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    addNewSection,
    getSpecificPageContent,
    getSpecificSectionContent,
}