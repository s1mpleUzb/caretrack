const express = require("express");
const router = express.Router();
const db = require("../db/index");

// GET all diseases + filters
router.get("/", (req, res) => {
  const { severity, patient_id } = req.query;

  let sql =
    "SELECT diseases.*, patients.name as patient_name FROM diseases LEFT JOIN patients ON diseases.patient_id = patients.id";
  const params = [];
  const conditions = [];

  if (severity) {
    conditions.push("severity = ?");
    params.push(severity);
  }
  if (patient_id) {
    conditions.push("patient_id = ?");
    params.push(patient_id);
  }
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  const diseases = db.prepare(sql).all(...params);
  res.json({ success: true, diseases });
});

// GET disease by ID
router.get("/:id", (req, res) => {
  const disease = db
    .prepare("SELECT * FROM diseases WHERE id = ?")
    .get(req.params.id);

  if (!disease) {
    return res.json({ success: false, message: "Disease not found" });
  }
  res.json({ success: true, disease });
});

// POST add disease
router.post("/", (req, res) => {
  const { name, severity, notes, patient_id } = req.body;

  if (!name || !severity || !patient_id) {
    return res.json({
      success: false,
      message: "name, severity, patient_id required",
    });
  }

  const patient = db
    .prepare("SELECT id FROM patients WHERE id = ?")
    .get(patient_id);
  if (!patient) {
    return res.json({ success: false, message: "Patient not found" });
  }

  const result = db
    .prepare(
      `
        INSERT INTO diseases (name, severity, notes, patient_id)
        VALUES (?, ?, ?, ?)
    `,
    )
    .run(name, severity, notes || null, patient_id);

  res.json({
    success: true,
    message: "Disease added",
    id: result.lastInsertRowid,
  });
});

// PUT update disease
router.put("/:id", (req, res) => {
  const { name, severity, notes, patient_id } = req.body;
  const { id } = req.params;

  const disease = db.prepare("SELECT * FROM diseases WHERE id = ?").get(id);
  if (!disease) {
    return res.json({ success: false, message: "Disease not found" });
  }

  if (patient_id) {
    const patient = db
      .prepare("SELECT id FROM patients WHERE id = ?")
      .get(patient_id);
    if (!patient) {
      return res.json({ success: false, message: "Patient not found" });
    }
  }

  db.prepare(
    `
        UPDATE diseases SET name = ?, severity = ?, notes = ?, patient_id = ?
        WHERE id = ?
    `,
  ).run(name, severity, notes || null, patient_id, id);

  res.json({ success: true, message: "Disease updated" });
});

// DELETE disease
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const disease = db.prepare("SELECT * FROM diseases WHERE id = ?").get(id);
  if (!disease) {
    return res.json({ success: false, message: "Disease not found" });
  }

  db.prepare("DELETE FROM diseases WHERE id = ?").run(id);
  res.json({ success: true, message: "Disease deleted" });
});

module.exports = router;
