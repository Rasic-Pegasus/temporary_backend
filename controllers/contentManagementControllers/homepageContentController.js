const PageContent = require('../../models/templateModel');
const cloudinary = require('../../config/cloudinary');
const fs = require('fs');

const updateHomePageHeroSection = async (req, res) => {
    try {
        const updatedContent = req.body;
        const image = req.file;

        if (image) {
            const result = await cloudinary.uploader.upload(image.path, {
                folder: 'section_images'
            })

            updatedContent.image = result.secure_url;

            fs.unlinkSync(image.path);
        }

        const updateResult = await PageContent.findOneAndUpdate(
            { pageName: 'home', "sections.sectionName": 'hero' },
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

const updateEducationDestionsSection = async (req, res) => {
    try {
        const updatedContent = req.body;
        const images = req.files;

        // console.log(updatedContent)
        // console.log(images)

        const updatedDestinations = [];
        if (images.length > 0) {
            for (let i = 0; i < updatedContent.destinations.length; i++) {
                const destination = updatedContent.destinations[i];
                const uploadedImage = images.find(image => image.fieldname.includes(i));

                if (uploadedImage) {
                    const result = await cloudinary.uploader.upload(uploadedImage.path, {
                        folder: 'section_images'
                    });

                    destination.image = result.secure_url;


                    fs.unlinkSync(uploadedImage.path);
                }
                // this pushed document obj is modified if there is any new image upload, if not then still push the old document
                // this ensures that only fields that needs update are updated without impacting other fields 
                updatedDestinations.push(destination);
            }

            updatedContent.destinations = updatedDestinations;
        }

        // console.log(updatedContent)
        const updateResult = await PageContent.findOneAndUpdate(
            { pageName: 'home', "sections.sectionName": 'education-destinations' },
            { $set: { "sections.$.content": updatedContent } },
            { new: true }
        );

        if (!updateResult) {
            return res.status(404).json({ message: "Section not found" });
        }

        const updatedSection = updateResult.sections.find(sec => sec.sectionName === 'education-destinations');

        res.status(200).json({ success: true, message: "Section updated", updatedSection })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const updateMainServicesSection = async (req, res) => {
    try {
        const updatedContent = req.body;

        const updateResult = await PageContent.findOneAndUpdate(
            { pageName: 'home', "sections.sectionName": 'main-services' },
            { $set: { "sections.$.content": updatedContent } },
            { new: true }
        );

        if (!updateResult) {
            return res.status(404).json({ message: "Section not found" });
        }

        const updatedSection = updateResult.sections.find(sec => sec.sectionName === 'main-services');

        res.status(200).json({ success: true, message: "Section updated", updatedSection })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const updateStudentServicesSection = async (req, res) => {
    try {
        const updatedContent = req.body;

        console.log(updatedContent);

        const updateResult = await PageContent.findOneAndUpdate(
            { pageName: 'home', "sections.sectionName": 'student-services' },
            { $set: { "sections.$.content": updatedContent } },
            { new: true }
        );

        if (!updateResult) {
            return res.status(404).json({ message: "Section not found" });
        }

        const updatedSection = updateResult.sections.find(sec => sec.sectionName === 'student-services');

        res.status(200).json({ success: true, message: "Section updated", updatedSection })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const updateContactSection = async (req, res) => {
    try {
        const updatedContent = req.body;

        const updateResult = await PageContent.findOneAndUpdate(
            { pageName: 'home', "sections.sectionName": 'contact' },
            { $set: { "sections.$.content": updatedContent } },
            { new: true }
        );

        if (!updateResult) {
            return res.status(404).json({ message: "Section not found" });
        }

        const updatedSection = updateResult.sections.find(sec => sec.sectionName === 'contact');

        res.status(200).json({ success: true, message: "Section updated", updatedSection })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const updatePartnersSection = async (req, res) => {
    try {
        const updatedContent = req.body;
        const files = req.files;

        // console.log(updatedContent)

        // if logos field doesn't exist, create one
        if (!updatedContent.logos) {
            updatedContent.logos = [];
        }

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const result = await cloudinary.uploader.upload(files[i].path, {
                    folder: 'section_images'
                })

                updatedContent.logos = [...updatedContent.logos, result.secure_url];

                fs.unlinkSync(files[i].path);
            }
        }

        // console.log(updatedContent);

        const updateResult = await PageContent.findOneAndUpdate(
            { pageName: 'home', "sections.sectionName": 'partners' },
            { $set: { "sections.$.content": updatedContent } },
            { new: true }
        );

        if (!updateResult) {
            return res.status(404).json({ message: "Section not found" });
        }

        const updatedSection = updateResult.sections.find(sec => sec.sectionName === 'partners');

        res.status(200).json({ success: true, message: "Section updated", updatedSection })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const updateTestimonialsSection = async (req, res) => {
    try {
        const updatedContent = req.body;
        const images = req.files;

        // console.log(updatedContent)
        // console.log(images)

        const updatedTestimonials = [];
        if (images.length > 0) {
            for (let i = 0; i < updatedContent.testimonials.length; i++) {
                const testimonial = updatedContent.testimonials[i];
                const uploadedImage = images.find(image => image.fieldname.includes(i));

                if (uploadedImage) {
                    const result = await cloudinary.uploader.upload(uploadedImage.path, {
                        folder: 'section_images'
                    });

                    testimonial.image = result.secure_url;


                    fs.unlinkSync(uploadedImage.path);
                }
                // this pushed testimonial obj is modified if there is any new image upload, if not then still push the old testimonial
                // this ensures that only fields that needs update are updated without impacting other fields 
                updatedTestimonials.push(testimonial);
            }

            updatedContent.testimonials = updatedTestimonials;
        }

        // console.log(updatedContent)
        const updateResult = await PageContent.findOneAndUpdate(
            { pageName: 'home', "sections.sectionName": 'testimonials' },
            { $set: { "sections.$.content": updatedContent } },
            { new: true }
        );

        if (!updateResult) {
            return res.status(404).json({ message: "Section not found" });
        }

        const updatedSection = updateResult.sections.find(sec => sec.sectionName === 'testimonials');

        res.status(200).json({ success: true, message: "Section updated", updatedSection })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const updateFooterSection = async (req, res) => {
    try {
        const updatedContent = req.body;
        const images = req.files;

        // console.log('updatedContent', updatedContent);
        // console.log('images', images);

        // if accreditations field doesn't exist, create one
        if (!updatedContent.accreditations) {
            updatedContent.accreditations = [];
        }

        if (images.length > 0) {
            const logo = images.find(image => image.fieldname === 'logo');
            if (logo) {
                const result = await cloudinary.uploader.upload(logo.path, {
                    folder: 'section_images'
                })

                updatedContent.logo = result.secure_url;

                fs.unlinkSync(logo.path);
            }

            const accreditations = images.filter(image => image.fieldname.includes('accreditations'));
            if (accreditations) {
                for (let i = 0; i < accreditations.length; i++) {
                    const result = await cloudinary.uploader.upload(accreditations[i].path, {
                        folder: 'section_images'
                    })

                    updatedContent.accreditations = [...updatedContent.accreditations, result.secure_url];

                    fs.unlinkSync(accreditations[i].path);
                }
            }
        }

        const updateResult = await PageContent.findOneAndUpdate(
            { pageName: 'home', "sections.sectionName": 'footer' },
            { $set: { "sections.$.content": updatedContent } },
            { new: true }
        );

        if (!updateResult) {
            return res.status(404).json({ message: "Section not found" });
        }

        const updatedSection = updateResult.sections.find(sec => sec.sectionName === 'footer');

        res.status(200).json({ success: true, message: "Section updated", updatedSection })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    updateHomePageHeroSection,
    updateEducationDestionsSection,
    updateMainServicesSection,
    updateStudentServicesSection,
    updateContactSection,
    updatePartnersSection,
    updateTestimonialsSection,
    updateFooterSection
}