import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  uploadDocument,
  getUserDocuments
} from "../controllers/documentController.js";

const router = express.Router();

// Upload document
router.post("/upload", protect, upload.single("file"), uploadDocument);

// Fetch logged-in user's documents
router.get("/", protect, getUserDocuments);

export default router;
