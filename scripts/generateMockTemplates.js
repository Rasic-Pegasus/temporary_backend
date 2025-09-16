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
        templateName: "Photography Class",
        sections: [
          {
            sectionName: "hero",
            defaultContent: {
              bannerImage: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018473/landingImage_ttsh11.png",
              title: "3-Day Photography Masterclass with Sijan Tamang",
              description: "A 3-day immersive photography masterclass with Sijan Tamang — refine your eye, master creative techniques, and learn how to tell compelling stories through your lens.",
              buttonNames: ["REGISTER NOW", "VIEW SCHEDULE"],
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
          {
            sectionName: "programDetails",
            defaultContent: {
              title: "Program Details",
              schedules: [
                {
                  date: "07/12/21",
                  sessions: [
                    {
                      time: "09:00",
                      location: "Hall",
                      name: "andrey podshivalov",
                      post: "Composition and grid in Graphic Design",
                      photo: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018410/dann_wn5blk.png",
                    },
                    {
                      time: "09:00",
                      location: "Room No 7",
                      name: "alexander korolkova",
                      post: "12 principles of animation from walt disney studio",
                      photo: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018410/dann_wn5blk.png",
                    },
                    {
                      time: "09:00",
                      location: "Restaurant",
                      name: "coffee break",
                      post: "Communication, exchange of experience",
                      photo: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018410/dann_wn5blk.png",
                    },
                    {
                      time: "09:00",
                      location: "Roon No 5",
                      name: "mikhail osadchuk",
                      post: "Web interface prototyping tools",
                      photo: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018410/dann_wn5blk.png",
                    },
                    {
                      time: "09:00",
                      location: "Room No 7",
                      name: "grigory anisinkov",
                      post: "The design profession in the digital age",
                      photo: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018410/dann_wn5blk.png",
                    },
                    {
                      time: "09:00",
                      location: "Roon No 5",
                      name: "denis bashaev",
                      post: "UX design.patterns and Psychology. Best solutions",
                      photo: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018410/dann_wn5blk.png",
                    },
                    {
                      time: "09:00",
                      location: "Roon No 11",
                      name: "nnikita obukhov",
                      post: "how to increase the check of a freelancer",
                      photo: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018410/dann_wn5blk.png",
                    },
                  ],
                },
                {
                  date: "08/12/21",
                  sessions: [
                    {
                      time: "09:00",
                      location: "Room No 7",
                      name: "grigory anisinkov",
                      post: "The design profession in the digital age",
                      photo: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018410/dann_wn5blk.png",
                    },
                    {
                      time: "09:00",
                      location: "Roon No 11",
                      name: "nnikita obukhov",
                      post: "How to increase the check of a freelancer",
                      photo: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018410/dann_wn5blk.png",
                    },
                    {
                      time: "09:00",
                      location: "Roon No 5",
                      name: "denis bashaev",
                      post: "UX design.patterns and Psychology. Best solutions",
                      photo: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018410/dann_wn5blk.png",
                    },
                    {
                      time: "09:00",
                      location: "Roon No 11",
                      name: "nnikita obukhov",
                      post: "how to increase the check of a freelancer",
                      photo: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018410/dann_wn5blk.png",
                    },
                    {
                      time: "09:00",
                      location: "Restaurant",
                      name: "coffee break",
                      post: "Communication, exchange of experience",
                      photo: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018410/dann_wn5blk.png",
                    },
                  ],
                },
                {
                  date: "09/12/21",
                  sessions: [
                    {
                      time: "09:00",
                      location: "Room NO 7",
                      name: "alexander korolkova",
                      post: "12 principles of animation from walt disney studio",
                      photo: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018410/dann_wn5blk.png",
                    },
                    {
                      time: "09:00",
                      location: "Hall",
                      name: "andrey podshivalov",
                      post: "Composition and grid in Graphic Design",
                      photo: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018410/dann_wn5blk.png",
                    },
                    {
                      time: "09:00",
                      location: "Roon No 11",
                      name: "nnikita obukhov",
                      post: "how to increase the check of a freelancer",
                      photo: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018410/dann_wn5blk.png",
                    },
                  ],
                },
              ]
            }
          },
          {
            sectionName: "bookingDetails",
            defaultContent: {
              title: "Book Your Seat",
              description: "Join our 3-Day Photography Masterclass and elevate your skills from basics to mastery! Reserve your spot now and take the next step in your photography journey!",
              included: {
                title: "What is included",
                list: [
                  "3 days of hands-on photography training",
                  "Guidance on lighting, focus, framing, and tools",
                  "Access to expert techniques and methods",
                  "Individual assessment and personal consultation",
                  "Certificate of completion",
                ]
              },
              notIncluded: {
                title: "What is not included",
                list: [
                  "Travel or accommodation expenses",
                  "Personal camera equipment (participants should bring their own)",
                  "Meals and refreshments (unless otherwise specified)",
                  "Optional extras like photo editing software",
                ]
              },
              ticket: {
                ticketPrice: 3500,
                buttonName: "Buy Now",
                paymentOptions: ["khalti", "esewa", "imepay"],
                qr: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758021752/bar-code_gjwi0l.svg"
              }
            },
          },
          {
            sectionName: "locationDetails",
            defaultContent: {
              title: "Location",
              images: ["https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018472/hall_lcdaeq.png"],
              googleMapLink: "https://share.google/3EVXvZH7NUmeXxPoQ"
            }
          },
          {
            sectionName: "testimonials",
            defaultContent: {
              testimonials: [
                {
                  carouseTeamPhoto: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018472/grid3_wdgzid.png",
                  carouseTitle:
                    "Absolutely magical! Working with Shuttersoul was an unforgettable experience. From the moment we met, they made us feel completely at ease — like we were simply spending time with friends. The entire shoot felt natural and fun, and the results... breathtaking. Every photo captured real emotion, genuine connection, and stunning detail. We couldn’t be happier with how it all turned out. Truly beyond our expectations.",
                  carouseTeamName: "Jason Roy",
                  carouseTeamPost: "UI/UX Designer",
                },
                {
                  carouseTeamPhoto: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018472/grid1_kbe8sv.png",
                  carouseTitle:
                    "Absolutely magical! Working with Shuttersoul was an unforgettable experience. From the moment we met, they made us feel completely at ease — like we were simply spending time with friends. The entire shoot felt natural and fun, and the results... breathtaking.",
                  carouseTeamName: "Ishraq Khan",
                  carouseTeamPost: "Founder & CEO @Kodezi",
                },
                {
                  carouseTeamPhoto: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018471/grid2_z0eubh.png",
                  carouseTitle:
                    "Absolutely magical! Working with Shuttersoul was an unforgettable experience. From the moment we met, they made us feel completely at ease — like we were simply spending time with friends. The entire shoot felt natural and fun, and the results... breathtaking.",
                  carouseTeamName: "Sarah Johnson",
                  carouseTeamPost: "Creative Director",
                },
                {
                  carouseTeamPhoto: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018471/grid5_kbfhia.png",
                  carouseTitle:
                    "Absolutely magical! Working with Shuttersoul was an unforgettable experience. From the moment we met, they made us feel completely at ease — like we were simply spending time with friends. The entire shoot felt natural and fun, and the results... breathtaking.",
                  carouseTeamName: "Michael Smith",
                  carouseTeamPost: "Photographer",
                },
                {
                  carouseTeamPhoto: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018470/grid4_f96aas.png",
                  carouseTitle:
                    "Absolutely magical! Working with Shuttersoul was an unforgettable experience. From the moment we met, they made us feel completely at ease — like we were simply spending time with friends. The entire shoot felt natural and fun, and the results... breathtaking.",
                  carouseTeamName: "Emily Davis",
                  carouseTeamPost: "Marketing Manager",
                },
              ]
            }
          },
          {
            sectionName: "contactForm",
            defaultContent: {
              title: "Register for Pre-Booking",
              image: "https://res.cloudinary.com/dzsgn2ubp/image/upload/v1758018471/fbi_efqzwu.avif",
              buttonNames: ["Register Now", "View Ticket"],
              formFields: [
                {
                  fieldType: "input",
                  label: "First Name",
                  fieldName: "firstName", //important
                  type: "text",
                  placeholder: "First Name"
                },
                {
                  fieldType: "input",
                  label: "Last Name",
                  fieldName: "LastName",
                  type: "text",
                  placehodler: "Last Name"
                },
                {
                  fieldType: "input",
                  label: "Email Address",
                  fieldName: "email",
                  type: "email",
                  placehodler: "Email Address"
                },
                {
                  fieldType: "input",
                  label: "Phone",
                  fieldName: "phone",
                  type: "tel",
                  placehodler: "Last Name"
                },
                {
                  fieldType: "textarea",
                  label: "Description",
                  fieldName: "description",
                  placehodler: "Description"
                },
              ]
            }
          }
        ]
      },
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
