import Signature from "../models/Signature.js";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "../utils/sendEmail.js";

export const createSignature = async (req, res) => {
  try {
    const { documentId, x, y, page, signerEmail } = req.body;

    // ✅ Validate required fields
    if (!documentId || !signerEmail || x === undefined || y === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (x < 0 || x > 1 || y < 0 || y > 1) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    // 🔐 Generate secure token
    const token = uuidv4();

    // ⬇ Create the signature in DB (matches schema)
    const signature = await Signature.create({
      documentId,        // <-- matches your schema
      signerEmail,
      x,
      y,
      page: page || 1,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
    });

    // ✉️ Send email to external signer
    const link = `http://localhost:3000/public-sign/${token}`;
    await sendEmail(signerEmail, link);

    res.status(201).json({
      message: "Signature created and email sent",
      signature,
    });
  } catch (error) {
    console.error("Create signature error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getSignaturesByDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    // 🔹 Query matches schema
    const signatures = await Signature.find({ documentId });

    res.status(200).json(signatures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateSignatureStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const signature = await Signature.findById(id);

    if (!signature) {
      return res.status(404).json({ message: "Signature not found" });
    }

    signature.status = "Signed";
    await signature.save();

    res.status(200).json({ signature });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateSignaturePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { x, y } = req.body;

    if (x < 0 || x > 1 || y < 0 || y > 1) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    const signature = await Signature.findById(id);

    if (!signature) {
      return res.status(404).json({ message: "Signature not found" });
    }

    signature.x = x;
    signature.y = y;

    await signature.save();

    res.status(200).json({ signature });
  } catch (error) {
    console.error("Update position error:", error);
    res.status(500).json({ message: error.message });
  }
};
