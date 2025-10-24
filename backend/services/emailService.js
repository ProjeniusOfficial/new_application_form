// backend/services/emailService.js
const nodemailer = require('nodemailer');

// 1. Configure the email transporter
// This setup assumes you're using a Gmail App Password.
// If you're using another service (like Brevo), you'd use host/port instead:
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your email provider
  auth: {
    user: process.env.EMAIL_USER, // Your email from .env
    pass: process.env.EMAIL_PASS, // Your app password from .env
  },
});

// 2. Create the function to send the emails
const sendConfirmationEmails = async (application, downloadLink) => {
  const { fullName, email, businessName } = application;
  const adminEmail = process.env.ADMIN_EMAIL; // Get admin email from .env

  // --- Email 1: To the Applicant ---
  const applicantMailOptions = {
    from: `"PSNA Technology Foundation" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Application to PSNA Technology Foundation',
    html: `
      <p>Dear ${fullName},</p>
      <p>Thank you for submitting your application. We have successfully received it.</p>
      <p>You can view and download a copy of your submitted application by clicking the link below:</p>
      <p><a href="${downloadLink}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Download Your Application PDF</a></p>
      <p>We will review your application and get back to you soon.</p>
      <p>Best regards,<br>The PSNA Team</p>
    `,
  };

  // --- Email 2: To the Admin ---
  const adminMailOptions = {
    // --- CHANGE 1: Update the "from" name to show the applicant's name ---
    from: `"${fullName} (Application)" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    // --- CHANGE 2: Add the "replyTo" field with the user's email ---
    replyTo: email, 
    subject: `New Application Received from ${fullName} (${businessName})`,
    html: `
      <p>A new application has been submitted.</p>
      <p><strong>Applicant Name:</strong> ${fullName}</p>
      <p><strong>Business Name:</strong> ${businessName}</p>
      <p><strong>Applicant's Email (for reference):</strong> ${email}</p>
      <p>You can download their complete application PDF by clicking the link below:</p>
      <p><a href="${downloadLink}" style="padding: 10px 15px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Download Application PDF</a></p>
      <hr>
      <p><em>To respond, just click "Reply" in your email client. You will be replying directly to ${fullName} (${email}).</em></p>
    `,
  };

  // 3. Send both emails
  try {
    await transporter.sendMail(applicantMailOptions);
    console.log(`Confirmation email sent to ${email}`);
    
    await transporter.sendMail(adminMailOptions);
    console.log(`Notification email sent to admin (with replyTo: ${email})`); // Added better logging
  } catch (error) {
    console.error('Error sending emails:', error);
    // We throw the error so the main route can catch it and send a 500 status
    throw new Error('Failed to send confirmation emails.');
  }
};

module.exports = { sendConfirmationEmails };