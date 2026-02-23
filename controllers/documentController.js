import Document from "../models/Document.js";

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const document = await Document.create({
      title: req.body.title || req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
      owner: req.user._id, // ✅ FIXED: use _id
      status: "Pending",
    });

    res.status(201).json({
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      owner: req.user._id, // ✅ FIXED: use _id
    }).sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: error.message });
  }
};

