import mongoose from "mongoose";

const signatureSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },

    // Internal signer (logged-in user)
    signer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // External signer (email-based)
    signerEmail: {
      type: String,
    },

    page: {
      type: Number,
      required: true,
    },

    x: {
      type: Number,
      required: true,
    },

    y: {
      type: Number,
      required: true,
    },

    // ✅ UPDATED STATUS FLOW
    status: {
      type: String,
      enum: ["Pending", "Signed", "Rejected"],
      default: "Pending",
    },

    // ✅ NEW FIELD
    rejectionReason: {
      type: String,
      default: null,
    },

    // 🔐 Tokenized access
    token: {
      type: String,
      unique: true,
    },

    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Signature", signatureSchema);