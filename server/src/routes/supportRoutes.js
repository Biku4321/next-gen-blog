import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createSupportTicket, getAllTickets } from "../controllers/supportController.js";

const router = express.Router();

const uploadPath = "uploads/support";
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid file type"), false);
};

const upload = multer({ storage, fileFilter });

router.post("/ticket", upload.single("file"), createSupportTicket);
router.get("/", getAllTickets);

export default router;
