const { sgMail, senderEmailAddress } = require('../config/sendgrid');

async function sendEmail(formData) {
  const { fullname, phone, query, viewerEmail, organizerEmail } = formData;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
  <h2 style="color: #1a73e8;">New Contact Form Submission</h2>
  <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
    <tr>
      <td style="padding: 8px; font-weight: bold;">Full Name:</td>
      <td style="padding: 8px;">${fullname}</td>
    </tr>
    <tr style="background-color: #f9f9f9;">
      <td style="padding: 8px; font-weight: bold;">Email:</td>
      <td style="padding: 8px;">${organizerEmail}</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">Phone:</td>
      <td style="padding: 8px;">${phone}</td>
    </tr>
    <tr style="background-color: #f9f9f9;">
      <td style="padding: 8px; font-weight: bold;">Query:</td>
      <td style="padding: 8px;">${query}</td>
    </tr>
  </table>
  <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
    This message was sent via your event website contact form.
  </p>
</div>
  `;

  const msg = {
    to: organizerEmail,
    from: senderEmailAddress,
    replyTo: viewerEmail,
    subject: `Query from ${fullname}`,
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
