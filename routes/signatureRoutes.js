import express from "express";
import protect from "../middleware/authMiddleware.js";
import auditLogger from "../middleware/auditMiddleware.js";
import Signature from "../models/Signature.js";

import {
  createSignature,
  getSignaturesByDocument,
  updateSignatureStatus,
  updateSignaturePosition,
} from "../controllers/signatureController.js";

const router = express.Router();

// -----------------------------
// Existing Routes
// -----------------------------

// Create signature
router.post("/", protect, createSignature);

// Get signatures by document
router.get("/:documentId", protect, getSignaturesByDocument);

// Update signature position
router.put("/:id", protect, updateSignaturePosition);

// Old patch route (keep if needed)
router.patch("/:id", protect, updateSignatureStatus);


// -----------------------------
// ✅ NEW — Accept Signature
// -----------------------------
router.put(
  "/:id/accept",
  protect,
  auditLogger("signed"),
  async (req, res) => {
    try {
      const signature = await Signature.findById(req.params.id);

      if (!signature) {
        return res.status(404).json({ message: "Signature not found" });
      }

      if (signature.status !== "Pending") {
        return res.status(400).json({ message: "Already processed" });
      }

      signature.status = "Signed";
      signature.rejectionReason = null; // clear if previously set
      await signature.save();

      res.json({ message: "Signature accepted", signature });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


// -----------------------------
// ❌ NEW — Reject Signature
// -----------------------------
router.put(
  "/:id/reject",
  protect,
  auditLogger("rejected"),
  async (req, res) => {
    try {
      const { reason } = req.body;

      if (!reason) {
        return res
          .status(400)
          .json({ message: "Rejection reason is required" });
      }

      const signature = await Signature.findById(req.params.id);

      if (!signature) {
        return res.status(404).json({ message: "Signature not found" });
      }

      if (signature.status !== "Pending") {
        return res.status(400).json({ message: "Already processed" });
      }

      signature.status = "Rejected";
      signature.rejectionReason = reason;
      await signature.save();

      res.json({ message: "Signature rejected", signature });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;