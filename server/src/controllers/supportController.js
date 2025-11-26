import SupportTicket from "../models/SupportTicket.js";
import path from "path";
import fs from "fs";
import { promises as fsp } from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "support");

/**
 * Ensure upload directory exists
 */
const ensureUploadDir = async () => {
  try {
    await fsp.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (err) {
    // If mkdir fails, let subsequent code surface the error
    console.warn("Could not create upload directory:", err.message);
  }
};

/**
 * Create and return a configured nodemailer transporter
 * Accepts self-signed cert chains by setting tls.rejectUnauthorized = false
 */
const createTransporter = () => {
  // Prefer explicit host/port if provided, otherwise try Gmail
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;
  const secure = port === 465; // true for 465, false for others

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      // allow self-signed certs in environments where that's present
      rejectUnauthorized: false,
    },
  });

  return transporter;
};

/**
 * @desc Create a new support ticket
 * @route POST /api/support/ticket
 * @access Public
 */
export const createSupportTicket = async (req, res) => {
  try {
    // Ensure upload directory exists (if using multer file storage to disk)
    await ensureUploadDir();

    const { email, category, message } = req.body;
    if (!email || !category || !message) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // If multer saved a file to disk, multer would set req.file
    let fileUrl = null;
    let attachment = null;
    if (req.file) {
      // If multer configured with destination `uploads/support`, req.file.path is available
      const relPath = path.join("/uploads/support", req.file.filename);
      fileUrl = `${req.protocol}://${req.get("host")}${relPath}`;

      // Attach file to email if desired
      attachment = {
        filename: req.file.originalname || req.file.filename,
        path: req.file.path,
      };
    }

    const ticket = await SupportTicket.create({
      email,
      category,
      message,
      fileUrl,
    });

    // Send notification email to support/admin
    try {
      const transporter = createTransporter();

      const supportEmail = process.env.SUPPORT_EMAIL || process.env.SMTP_USER;

      const htmlBody = `
        <h3>New Support Ticket</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Message:</strong><br/>${(message || "").replace(/\n/g, "<br/>")}</p>
        ${fileUrl ? `<p><strong>Attachment:</strong> <a href="${fileUrl}">${fileUrl}</a></p>` : ""}
        <hr/>
        <p>Ticket ID: ${ticket._id}</p>
      `;

      const mailOptions = {
        from: `"Blog Support" <${process.env.SMTP_USER}>`,
        to: supportEmail,
        subject: `New Support Ticket - ${category}`,
        html: htmlBody,
        attachments: attachment ? [attachment] : [],
      };

      await transporter.sendMail(mailOptions);

      // Optionally send confirmation to the user (best-effort)
      const confirmMail = {
        from: `"Blog Support" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "We've received your support request",
        html: `
          <p>Hi,</p>
          <p>Thanks for contacting support. We've received your request and will respond shortly.</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Message:</strong><br/>${(message || "").replace(/\n/g, "<br/>")}</p>
          <p>Ticket ID: <strong>${ticket._id}</strong></p>
          <p>— Blog Support Team</p>
        `,
      };

      try {
        await transporter.sendMail(confirmMail);
      } catch (err) {
        // non-fatal: log and continue
        console.warn("Warning: confirmation email failed:", err.message);
      }
    } catch (err) {
      console.warn("Email notification failed:", err.message);
      // do NOT fail the request if email can't be sent — ticket already created
    }

    return res.status(201).json({
      success: true,
      message: "Support ticket created successfully.",
      ticket,
    });
  } catch (err) {
    console.error("Support ticket error:", err);
    return res.status(500).json({ success: false, message: "Server error while creating ticket." });
  }
};

/**
 * @desc Get all support tickets (admin only)
 * @route GET /api/support
 * @access Private/Admin
 */
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 });
    return res.json({ success: true, tickets });
  } catch (err) {
    console.error("Failed to fetch support tickets:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch support tickets." });
  }
};
