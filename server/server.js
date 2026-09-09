import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import readingsRouter from "./routes/readings.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({ success: true, service: "AquaShield API", message: "API is running. Use /api/health to check database status." });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, service: "AquaShield API", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});
app.use("/api/readings", readingsRouter);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`AquaShield API running on http://localhost:${PORT}`)))
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    console.error("Create server/.env and set MONGODB_URI, then restart the server.");
    process.exit(1);
  });
