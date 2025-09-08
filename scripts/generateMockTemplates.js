const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Template = require("../models/templateModel");

dotenv.config();

const seedThemes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Template.deleteMany({});

    const themes = [
      {
        themeName: "Modern Theme",
        sections: [
          {
            sectionName: "hero",
            defaultContent: {
              title: "3-Day Photography Masterclass with Sijan Tamang",
              subtitle: "A 3-day immersive photography masterclass with Sijan Tamang — refine your eye, master creative techniques, and learn how to tell compelling stories through your lens.",
              buttons: ["REGISTER NOW", "VIEW SCHEDULE"],
              topics: [
                "Lighting, focus, framing, strengths and weaknesses.",
                "Tools, expert, methods and participant angagement.",
                "Individual assessment, a test, and personal consultation."
              ]
            }
          },
          {
            sectionName: "portfolio",
            defaultContent: {
              title: "Take a glimpse into my Work",
              socials: [
                {
                  title: "Website",
                  link: "websitelink.com"
                },
                {
                  title: "Instagram",
                  link: "instagram.com"
                },
                {
                  title: "Pinterest",
                  link: "pinterest.com"
                },
                {
                  title: "Youtube",
                  link: "youtube.com"
                },
              ]
            }
          },
        ]
      },
      {
        themeName: "Classic Theme",
        sections: [
          {
            sectionName: "hero",
            defaultContent: { title: "Join Us", subtitle: "Experience tradition", bg: "white" }
          },
          {
            sectionName: "schedule",
            defaultContent: { sessions: ["Opening Ceremony", "Guest Speaker", "Dinner"] }
          },
          {
            sectionName: "contact",
            defaultContent: { phone: "123-456-7890", email: "info@example.com" }
          }
        ]
      }
    ];

    await Template.insertMany(themes);

    console.log("✅ Successfully added Mock Templates!");
    process.exit();
  } catch (error) {
    console.error("❌ Error adding Mock Templates:", error);
    process.exit(1);
  }
};

seedThemes();
