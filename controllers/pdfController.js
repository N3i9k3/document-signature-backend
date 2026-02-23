import fs from "fs";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import Document from "../models/Document.js";
import Signature from "../models/Signature.js";
import path from "path";

export const generateSignedPDF = async (req, res) => {
     console.log("🔥 generateSignedPDF controller hit");

  try {
    const { documentId } = req.body;

    // 1️⃣ Fetch document and its signatures
    const doc = await Document.findById(documentId);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    const signatures = await Signature.find({ documentId: documentId });

    // ✅ DEBUG 1 — Check if signatures exist
    console.log("Signatures found:", signatures);

    // 2️⃣ Load existing PDF
    const pdfPath = path.join(process.cwd(), doc.filePath);

    // ✅ DEBUG 2 — Check PDF path
    console.log("Loading PDF from:", pdfPath);

    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // 3️⃣ Embed font
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // 4️⃣ Iterate signatures
    signatures.forEach(sig => {

      // ✅ DEBUG 3 — Print full signature object
      console.log("Signature object:", sig);

      const page = pdfDoc.getPage(sig.page - 1);
      const { width, height } = page.getSize();

      console.log("Page size:", width, height);
      console.log("Relative coords:", sig.x, sig.y);

      // Convert relative → absolute
      const x = sig.x * width;
      const y = height - (sig.y * height) - 12;

      console.log("Absolute coords:", x, y);

      page.drawText("Signed", {
        x,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
    });

    // 5️⃣ Save new PDF
    const pdfBytes = await pdfDoc.save();
    const signedFileName = `signed_${Date.now()}.pdf`;
    const signedPath = path.join("uploads", signedFileName);
    fs.writeFileSync(signedPath, pdfBytes);

    // 6️⃣ Update document status
    doc.status = "Signed";
    await doc.save();

    res.json({
      message: "PDF signed successfully",
      signedFilePath: signedPath,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
