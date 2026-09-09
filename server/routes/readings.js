import express from "express";
import Reading from "../models/Reading.js";

const router = express.Router();


// ===============================
// QUALITY SCORE
// ===============================
function calculateQuality(ph, tds, temperature, turbidity) {
  let score = 100;

  score -= Math.min(30, Math.abs(ph - 7.2) * 18);
  score -= Math.min(30, Math.max(0, tds - 220) / 10);
  score -= Math.min(15, Math.max(0, temperature - 28) * 1.5);
  score -= Math.min(25, Math.max(0, turbidity - 1) * 5);

  return Math.max(0, Math.min(100, Math.round(score)));
}


// ===============================
// ISSUES + HEALTH RISKS
// ===============================
function buildRisks(ph, tds, temperature, turbidity) {
  const issues = [];
  const healthRisks = [];


  // ---------- pH ----------
  if (ph < 6.5 || ph > 8.5) {
    issues.push("pH outside monitored range");

    healthRisks.push(
      "Possible skin or stomach irritation"
    );
  }


  // ---------- TDS ----------
  if (tds > 500) {
    issues.push("Critical TDS");

    healthRisks.push(
      "Long-term water quality concern"
    );

  } else if (tds > 300) {
    issues.push("Elevated TDS");

    healthRisks.push(
      "Long-term water quality concern"
    );
  }


  // ---------- Temperature ----------
  if (temperature > 35) {
    issues.push("High temperature");

    healthRisks.push(
      "Increased microbial-growth risk"
    );
  }


  // ---------- Turbidity ----------
  if (turbidity > 5) {
    issues.push("High turbidity");

    healthRisks.push(
      "Possible microbial contamination risk"
    );
  }


  // ---------- Multiple Issues ----------
  if (issues.length >= 2) {
    healthRisks.push(
      "Potential health risk - water should be tested"
    );
  }


  return {
    issues,
    healthRisks
  };
}


// ===============================
// GET LATEST READING
// ===============================
router.get("/latest", async (req, res, next) => {
  try {
    const station = req.query.station;

    const reading = await Reading.findOne(
      station ? { station } : {}
    )
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      reading
    });

  } catch (error) {
    next(error);
  }
});


// ===============================
// GET READING HISTORY
// ===============================
router.get("/", async (req, res, next) => {
  try {
    const station = req.query.station;

    const limit = Math.min(
      Number(req.query.limit) || 100,
      500
    );

    const readings = await Reading.find(
      station ? { station } : {}
    )
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({
      success: true,
      readings: readings.reverse()
    });

  } catch (error) {
    next(error);
  }
});


// ===============================
// SAVE NEW READING
// ===============================
router.post("/", async (req, res, next) => {
  try {

    const {
      station,
      ph,
      tds,
      temperature,
      turbidity,
      source = "simulation"
    } = req.body;


    // ---------- Validation ----------
    if (
      !station ||
      [ph, tds, temperature, turbidity].some(
        (value) =>
          typeof value !== "number" ||
          Number.isNaN(value)
      )
    ) {

      return res.status(400).json({
        success: false,
        message:
          "station, ph, tds, temperature and turbidity are required numeric values"
      });

    }


    // ---------- Quality Score ----------
    const qualityScore = calculateQuality(
      ph,
      tds,
      temperature,
      turbidity
    );


    // ---------- Issues + Health Risks ----------
    const {
      issues,
      healthRisks
    } = buildRisks(
      ph,
      tds,
      temperature,
      turbidity
    );


    // ---------- Status ----------
    const status =
      qualityScore >= 80 && issues.length === 0
        ? "safe"
        : qualityScore >= 55
        ? "warning"
        : "danger";


    // ---------- Save to MongoDB ----------
    const reading = await Reading.create({

      station,

      ph,

      tds,

      temperature,

      turbidity,

      qualityScore,

      status,

      issues,

      healthRisks,

      source

    });


    // ---------- Response ----------
    res.status(201).json({
      success: true,
      reading
    });


  } catch (error) {
    next(error);
  }
});


// ===============================
// DELETE READINGS
// ===============================
router.delete("/", async (req, res, next) => {
  try {

    await Reading.deleteMany(
      req.query.station
        ? { station: req.query.station }
        : {}
    );

    res.json({
      success: true,
      message: "Readings cleared"
    });

  } catch (error) {
    next(error);
  }
});


export default router;