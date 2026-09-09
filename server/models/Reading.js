import mongoose from "mongoose";

const readingSchema = new mongoose.Schema(
  {
    // ===============================
    // STATION
    // ===============================
    station: {
      type: String,
      required: true,
      trim: true
    },

    // ===============================
    // WATER PARAMETERS
    // ===============================
    ph: {
      type: Number,
      required: true,
      min: 0,
      max: 14
    },

    tds: {
      type: Number,
      required: true,
      min: 0
    },

    temperature: {
      type: Number,
      required: true
    },

    turbidity: {
      type: Number,
      required: true,
      min: 0
    },

    // ===============================
    // WATER QUALITY
    // ===============================
    qualityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    status: {
      type: String,
      enum: ["safe", "warning", "danger"],
      required: true
    },

    // ===============================
    // DETECTED ISSUES
    // ===============================
    issues: {
      type: [String],
      default: []
    },

    // ===============================
    // HEALTH RISKS
    // ===============================
    healthRisks: {
      type: [String],
      default: []
    },

    // ===============================
    // DATA SOURCE
    // ===============================
    source: {
      type: String,
      enum: ["simulation", "hardware", "manual"],
      default: "simulation"
    }
  },

  // Automatically adds:
  // createdAt
  // updatedAt
  {
    timestamps: true
  }
);

export default mongoose.model("Reading", readingSchema);