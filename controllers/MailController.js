const nodemailer = require("nodemailer");

const sendEmail = async (req, res) => {
  try {
    const { fname, lname, email, number, destination, funding } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "atulballavk@gmail.com",
        pass: process.env.PW,
      },
    });

    // Enhanced HTML email template
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
        <h1 style="color: #4CAF50; text-align: center; margin-bottom: 20px;">New Message Received</h1>
        <p style="font-size: 16px; margin-bottom: 20px;">You have received a new message from the contact form on your website:</p>
        
        <div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <p style="margin: 0;"><strong>First Name:</strong> ${fname}</p>
          <p style="margin: 0;"><strong>Last Name:</strong> ${lname}</p>
          <p style="margin: 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #4CAF50; text-decoration: none;">${email}</a></p>
          <p style="margin: 0;"><strong>Phone Number:</strong> ${number}</p>
          <p style="margin: 0;"><strong>Destination:</strong> ${destination}</p>
          <p style="margin: 0;"><strong>Funding Details:</strong> ${funding}</p>
        </div>
        
        <p style="font-size: 14px; color: #777; margin-top: 20px;">This email was sent from your website contact form. If you have any questions, please respond to this email.</p>
        <footer style="text-align: center; margin-top: 30px; font-size: 12px; color: #aaa;">
          <p>&copy; 2024 Nexus. All rights reserved.</p>
        </footer>
      </div>
    `;

    // Sending email
    const info = await transporter.sendMail({
      from: `"Nexus" <atulballavk@gmail.com>`, // sender address
      to: "drishyaa005@gmail.com", // recipient email
      subject: "New Contact Form Submission", // subject line
      html: htmlTemplate, // html body
    });

    console.log("Email sent: %s", info.messageId);

    res.status(200).send({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while sending the email.",
      error: error.message,
    });
  }
};

const sendTestEmail = async (req, res) => {
  try {
    const { name, email, number, test } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "atulballavk@gmail.com",
        pass: process.env.PW,
      },
    });

    // Enhanced HTML email template
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
        <h1 style="color: #4CAF50; text-align: center; margin-bottom: 20px;">New Message Received</h1>
        <p style="font-size: 16px; margin-bottom: 20px;">You have received a new message from the contact form on your website:</p>
        
        <div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <p style="margin: 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #4CAF50; text-decoration: none;">${email}</a></p>
          <p style="margin: 0;"><strong>Phone Number:</strong> ${number}</p>
          <p style="margin: 0;"><strong>Test Type:</strong> ${test}</p>
        </div>
        
        <p style="font-size: 14px; color: #777; margin-top: 20px;">This email was sent from your website contact form. If you have any questions, please respond to this email.</p>
        <footer style="text-align: center; margin-top: 30px; font-size: 12px; color: #aaa;">
          <p>&copy; 2024 Nexus. All rights reserved.</p>
        </footer>
      </div>
    `;

    // Sending email
    const info = await transporter.sendMail({
      from: `"Nexus" <atulballavk@gmail.com>`, // sender address
      to: "drishyaa005@gmail.com", // recipient email
      subject: "New Contact Form Submission", // subject line
      html: htmlTemplate, // html body
    });

    console.log("Email sent: %s", info.messageId);

    res.status(200).send({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while sending the email.",
      error: error.message,
    });
  }
};

module.exports = { sendEmail, sendTestEmail };
