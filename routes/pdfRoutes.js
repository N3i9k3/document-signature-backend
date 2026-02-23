import express from "express";
import protect from "../middleware/authMiddleware.js";
import { generateSignedPDF } from "../controllers/pdfController.js";
import auditLogger from "../middleware/auditMiddleware.js"; // ✅ import audit middleware

const router = express.Router();

// Apply middleware to log the 'signed' action
router.post("/sign", protect, auditLogger("signed"), generateSignedPDF);

export default router;