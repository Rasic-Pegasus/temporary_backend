const { sgMail, senderEmailAddress } = require('../config/sendgrid');

async function sendEmail(formData) {
  const { firstname, lastname, phone, description, viewerEmail, organizerEmail } = formData;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f6f9; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); overflow: hidden;">
      
      <!-- Header -->
      <div style="background-color: #1a73e8; padding: 16px; text-align: center; color: #ffffff;">
        <h2 style="margin: 0; font-size: 20px;">📩 New Contact Form Submission</h2>
      </div>

      <!-- Body -->
      <div style="padding: 20px;">
        <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
          <tr>
            <td style="padding: 10px; font-weight: bold; width: 30%; background-color: #f9f9f9;">First Name</td>
            <td style="padding: 10px;">${firstname}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; background-color: #ffffff;">Last Name</td>
            <td style="padding: 10px;">${lastname}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; background-color: #f9f9f9;">Email</td>
            <td style="padding: 10px;">${viewerEmail}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; background-color: #ffffff;">Phone</td>
            <td style="padding: 10px;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; background-color: #f9f9f9;">Description</td>
            <td style="padding: 10px;">${description}</td>
          </tr>
        </table>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f1f1; padding: 12px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0;">This message was sent via your event website contact form.</p>
      </div>
    </div>
  </div>
  `;

  const msg = {
    to: organizerEmail,
    from: senderEmailAddress,
    replyTo: viewerEmail,
    subject: `Query from ${firstname}`,
    html,
  };

  try {
    const response = await sgMail.send(msg);
    console.log('Email sent successfully:', response);
  } catch (err) {
    console.error('Failed to send email:', err);

    const error = new Error("Failed to send email");
    error.statusCode = err.code || 500;
    throw error;
  }
}

module.exports = sendEmail;
