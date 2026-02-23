import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import protect from "./middleware/authMiddleware.js";
import path from "path";
import { fileURLToPath } from "url";
import signatureRoutes from "./routes/signatureRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";

dotenv.config();



connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// 🔥 Fix static folder properly (absolute path)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/docs", documentRoutes);
app.use("/api/signatures", signatureRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/audit", auditRoutes);

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Access granted 🔐",
    user: req.user,
  });
});

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);
