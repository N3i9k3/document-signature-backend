import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  action: String, // e.g., "signed", "uploaded", "rejected"
  ip: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Audit", auditSchema);