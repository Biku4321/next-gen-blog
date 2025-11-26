// server/src/utils/emailService.js
import nodemailer from "nodemailer";
import logger from "./logger.js";
import 'dotenv/config'
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false, // false for TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // ✅ Allow self-signed certificates
  },
});

/**
 * Send email to a recipient
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 */
export default async function sendEmail(to, subject, html) {
    try {
    console.log(`📨 Sending email to ${to} via ${process.env.EMAIL_HOST}`);
    const info = await transporter.sendMail({
      from: `"Blog Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent:", info.response);
    return true;
  } catch (err) {
    console.error("❌ Email error:", err);
    throw new Error("Email sending failed");
  }
}

