import express from "express";
import protect from "../middleware/authMiddleware.js";
import Audit from "../models/Audit.js";

const router = express.Router();

router.get("/:fileId", protect, async (req, res) => {
  try {
    const audits = await Audit.find({ document: req.params.fileId })
      .populate("user", "name email")
      .sort({ timestamp: -1 });

    res.json(audits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;