const express = require("express");
const router = express.Router();
const db = require("../db/index");
router.get("/", (req, res) => {
  const { name } = req.query;

  let sql =
    "SELECT patients.*, doctors.name as doctor_name FROM patients LEFT JOIN doctors ON patients.doctor_id = doctors.id";
  const params = [];

  if (name) {
    sql += " WHERE name LIKE ?";
    params.push(`%${name}%`);
  }

  const patients = db.prepare(sql).all(...params);
  res.json({ success: true, patients });
});

// GET patient by ID
router.get("/:id", (req, res) => {
  const patient = db
    .prepare("SELECT * FROM patients WHERE id = ?")
    .get(req.params.id);

  if (!patient) {
    return res.json({ success: false, message: "Patient not found" });
  }
  res.json({ success: true, patient });
});

// POST add patient
router.post("/", (req, res) => {
  const { name, age, gender, contact, doctor_id } = req.body;

  if (!name || !age || !gender || !contact) {
    return res.json({ success: false, message: "All fields required" });
  }

  // doctor_id valid tekshiruv
  if (doctor_id) {
    const doctor = db
      .prepare("SELECT id FROM doctors WHERE id = ?")
      .get(doctor_id);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }
  }

  const result = db
    .prepare(
      `
        INSERT INTO patients (name, age, gender, contact, doctor_id)
        VALUES (?, ?, ?, ?, ?)
    `,
    )
    .run(name, age, gender, contact, doctor_id || null);

  res.json({
    success: true,
    message: "Patient added",
    id: result.lastInsertRowid,
  });
});

// PUT update patient
router.put("/:id", (req, res) => {
  const { name, age, gender, contact, doctor_id } = req.body;
  const { id } = req.params;

  const patient = db.prepare("SELECT * FROM patients WHERE id = ?").get(id);
  if (!patient) {
    return res.json({ success: false, message: "Patient not found" });
  }

  if (doctor_id) {
    const doctor = db
      .prepare("SELECT id FROM doctors WHERE id = ?")
      .get(doctor_id);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }
  }

  db.prepare(
    `
        UPDATE patients SET name = ?, age = ?, gender = ?, contact = ?, doctor_id = ?
        WHERE id = ?
    `,
  ).run(name, age, gender, contact, doctor_id || null, id);

  res.json({ success: true, message: "Patient updated" });
});

// DELETE patient
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const patient = db.prepare("SELECT * FROM patients WHERE id = ?").get(id);
  if (!patient) {
    return res.json({ success: false, message: "Patient not found" });
  }

  db.prepare("DELETE FROM patients WHERE id = ?").run(id);
  res.json({ success: true, message: "Patient deleted" });
});

module.exports = router;
