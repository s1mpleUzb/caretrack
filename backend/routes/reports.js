const express = require("express");
const router = express.Router();
const db = require("../db/index");

router.get("/", (req, res) => {
  const doctors = db.prepare("SELECT COUNT(*) as count FROM doctors").get();
  const patients = db.prepare("SELECT COUNT(*) as count FROM patients").get();
  const diseases = db.prepare("SELECT COUNT(*) as count FROM diseases").get();

  res.json({
    success: true,
    reports: {
      totalDoctors: doctors.count,
      totalPatients: patients.count,
      totalDiseases: diseases.count,
    },
  });
});

module.exports = router;
