const sgMail = require('@sendgrid/mail');

let senderEmailAddress = '';

// Check for the SENDGRID_API_KEY environment variable and configure automatically
if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_SENDER_EMAIL) {
    throw new Error('Essential SENDGRID environment variables are missing. Please complete the environment variable setup first.');
} else {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    senderEmailAddress = process.env.SENDGRID_SENDER_EMAIL;
}

module.exports = { sgMail, senderEmailAddress };
