const PageContent = require('../../models/templateModel');
const cloudinary = require('../../config/cloudinary');
const fs = require('fs');

const updateAboutUsPageHeroSection = async (req, res) => {
    try {
        const updatedContent = req.body;
        const backgroundImage = req.file;

        if (backgroundImage) {
            const result = await cloudinary.uploader.upload(backgroundImage.path, {
                folder: 'section_images'
            })

            updatedContent.backgroundImage = result.secure_url;

            fs.unlinkSync(backgroundImage.path);
        }

        const updateResult = await PageContent.findOneAndUpdate(
            { pageName: 'about-us', "sections.sectionName": 'hero' },
            { $set: { "sections.$.content": updatedContent } },
            { new: true }
        );

        if (!updateResult) {
            return res.status(404).json({ message: "Section not found" });
        }

        const updatedSection = updateResult.sections.find(sec => sec.sectionName === 'hero');

        res.status(200).json({ success: true, message: "Section updated", updatedSection })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    updateAboutUsPageHeroSection
}