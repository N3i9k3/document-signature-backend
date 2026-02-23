import Audit from "../models/Audit.js";

const auditLogger = (action) => {
  return async (req, res, next) => {
    try {
      console.log("🔥 Audit middleware triggered");

      const ip =
        req.ip ||
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress;

      console.log("Body documentId:", req.body.documentId);
      console.log("Params fileId:", req.params.fileId);
      console.log("User:", req.user?._id);

      const log = await Audit.create({
        document: req.body.documentId || req.params.fileId,
        user: req.user ? req.user._id : null,
        action,
        ip,
      });

      console.log("✅ Audit created:", log._id);
    } catch (err) {
      console.error("❌ Audit logging failed:", err.message);
    }

    next();
  };
};

export default auditLogger;