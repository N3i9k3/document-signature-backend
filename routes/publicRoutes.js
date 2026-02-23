import express from "express";
import Signature from "../models/Signature.js";

const router = express.Router();

///////////////////////////////////////
// 1️⃣ Public POST route → add signature
///////////////////////////////////////
router.post("/sign", async (req, res) => {
  const { documentId, x, y, page, token } = req.body;

  // Validate required fields
  if (!documentId || x === undefined || y === undefined || !page || !token) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const signature = new Signature({
      documentId,
      x,
      y,
      page,
      token,
      status: "Pending", // <-- Capital P, matches enum
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h expiry example
    });

    await signature.save();
    res.status(201).json(signature); // return saved signature
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

///////////////////////////////////////
// 2️⃣ Public PATCH route → mark as signed
///////////////////////////////////////
router.patch("/sign/:signatureId", async (req, res) => {
  const { signatureId } = req.params;
  const { token } = req.query; // token passed in query

  try {
    const signature = await Signature.findOne({ _id: signatureId, token });

    if (!signature) {
      return res.status(404).json({ message: "Invalid link or signature not found" });
    }

    if (signature.expiresAt < new Date()) {
      return res.status(400).json({ message: "Link expired" });
    }

    signature.status = "Signed"; // <-- Capital S, matches enum
    await signature.save();

    res.json({ message: "Document signed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
