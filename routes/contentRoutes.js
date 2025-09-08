const express = require("express");
const router = express.Router();
const upload = require('../middleware/fileUpload');
const {
    addNewSection,
    getSpecificPageContent,
    getSpecificSectionContent,
} = require('../controllers/contentManagementControllers/globalContentController');

const {
    updateHomePageHeroSection,
    updateEducationDestionsSection,
    updateMainServicesSection,
    updateContactSection,
    updatePartnersSection,
    updateTestimonialsSection,
    updateFooterSection,
    updateStudentServicesSection
} = require('../controllers/contentManagementControllers/homepageContentController');

const {
    updateAboutUsPageHeroSection
} = require('../controllers/contentManagementControllers/aboutUsContentController');

router
    .post('/add-section/:pageName/:sectionName', addNewSection)
    .get('/get-page/:pageName', getSpecificPageContent)
    .get('/get-section/:pageName/:sectionName', getSpecificSectionContent)
    .patch('/update-section/home/hero', upload.single("image"), updateHomePageHeroSection)
    .patch('/update-section/home/education-destinations', upload.any(), updateEducationDestionsSection)
    .patch('/update-section/home/main-services', upload.any(), updateMainServicesSection)
    .patch('/update-section/home/student-services', upload.any(), updateStudentServicesSection)
    .patch('/update-section/home/contact', upload.any(), updateContactSection)
    .patch('/update-section/home/partners', upload.any(), updatePartnersSection)
    .patch('/update-section/home/testimonials', upload.any(), updateTestimonialsSection)
    .patch('/update-section/home/footer', upload.any(), updateFooterSection)
    .patch('/update-section/about-us/hero', upload.single("backgroundImage"), updateAboutUsPageHeroSection)

module.exports = router;
