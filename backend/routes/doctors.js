const express = require("express");
const router = express.Router();
const db = require("../db/index");

// GET all doctors + search
router.get("/", (req, res) => {
  const { name, department } = req.query;

  let sql = "SELECT * FROM doctors";
  const params = [];

  if (name && department) {
    sql += " WHERE name LIKE ? AND department LIKE ?";
    params.push(`%${name}%`, `%${department}%`);
  } else if (name) {
    sql += " WHERE name LIKE ?";
    params.push(`%${name}%`);
  } else if (department) {
    sql += " WHERE department LIKE ?";
    params.push(`%${department}%`);
  }

  const doctors = db.prepare(sql).all(...params);
  res.json({ success: true, doctors });
});

// GET doctor by ID
router.get("/:id", (req, res) => {
  const doctor = db
    .prepare("SELECT * FROM doctors WHERE id = ?")
    .get(req.params.id);

  if (!doctor) {
    return res.json({ success: false, message: "Doctor not found" });
  }
  res.json({ success: true, doctor });
});

// POST add doctor
router.post("/", (req, res) => {
  const { name, specialty, department, contact } = req.body;

  if (!name || !specialty || !department || !contact) {
    return res.json({ success: false, message: "All fields required" });
  }

  const result = db
    .prepare(
      `
        INSERT INTO doctors (name, specialty, department, contact)
        VALUES (?, ?, ?, ?)
    `,
    )
    .run(name, specialty, department, contact);

  res.json({
    success: true,
    message: "Doctor added",
    id: result.lastInsertRowid,
  });
});

// PUT update doctor
router.put("/:id", (req, res) => {
  const { name, specialty, department, contact } = req.body;
  const { id } = req.params;

  const doctor = db.prepare("SELECT * FROM doctors WHERE id = ?").get(id);
  if (!doctor) {
    return res.json({ success: false, message: "Doctor not found" });
  }

  db.prepare(
    `
        UPDATE doctors SET name = ?, specialty = ?, department = ?, contact = ?
        WHERE id = ?
    `,
  ).run(name, specialty, department, contact, id);

  res.json({ success: true, message: "Doctor updated" });
});

// DELETE doctor
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const doctor = db.prepare("SELECT * FROM doctors WHERE id = ?").get(id);
  if (!doctor) {
    return res.json({ success: false, message: "Doctor not found" });
  }

  db.prepare("DELETE FROM doctors WHERE id = ?").run(id);
  res.json({ success: true, message: "Doctor deleted" });
});

module.exports = router;
