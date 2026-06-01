const db = require("./index");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id       INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role     TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS doctors (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        name       TEXT NOT NULL,
        specialty  TEXT NOT NULL,
        department TEXT NOT NULL,
        contact    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS patients (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        name       TEXT NOT NULL,
        age        INTEGER NOT NULL,
        gender     TEXT NOT NULL,
        contact    TEXT NOT NULL,
        doctor_id  INTEGER,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id)
    );

    CREATE TABLE IF NOT EXISTS diseases (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        name       TEXT NOT NULL,
        severity   TEXT NOT NULL,
        notes      TEXT,
        patient_id INTEGER,
        FOREIGN KEY (patient_id) REFERENCES patients(id)
    );
`);

// Seed data
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get();
if (userCount.count === 0) {
  db.prepare(
    `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
  ).run("admin", "admin123", "admin");
  db.prepare(
    `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
  ).run("dr_karimov", "clinic123", "clinician");
  db.prepare(
    `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
  ).run("reception1", "recep123", "receptionist");
}

const doctorCount = db.prepare("SELECT COUNT(*) as count FROM doctors").get();
if (doctorCount.count === 0) {
  db.prepare(
    `INSERT INTO doctors (name, specialty, department, contact) VALUES (?, ?, ?, ?)`,
  ).run("Dr. Karimov", "Cardiology", "Cardiology Dept", "+998901234567");
  db.prepare(
    `INSERT INTO doctors (name, specialty, department, contact) VALUES (?, ?, ?, ?)`,
  ).run("Dr. Rahimova", "Neurology", "Neurology Dept", "+998907654321");
  db.prepare(
    `INSERT INTO doctors (name, specialty, department,  contact) VALUES (?, ?, ?, ?)`,
  ).run("Dr. Toshev", "Pediatrics", "Pediatrics Dept", "+998909876543");
}

const patientCount = db.prepare("SELECT COUNT(*) as count FROM patients").get();
if (patientCount.count === 0) {
  db.prepare(
    `INSERT INTO patients (name, age, gender, contact, doctor_id) VALUES (?, ?, ?, ?, ?)`,
  ).run("Alisher Nazarov", 35, "male", "+998901112233", 1);
  db.prepare(
    `INSERT INTO patients (name, age, gender, contact, doctor_id) VALUES (?, ?, ?, ?, ?)`,
  ).run("Malika Yusupova", 28, "female", "+998903334455", 2);
  db.prepare(
    `INSERT INTO patients (name, age, gender, contact, doctor_id) VALUES (?, ?, ?, ?, ?)`,
  ).run("Jasur Mirzayev", 45, "male", "+998905556677", 1);
}

const diseaseCount = db.prepare("SELECT COUNT(*) as count FROM diseases").get();
if (diseaseCount.count === 0) {
  db.prepare(
    `INSERT INTO diseases (name, severity, notes, patient_id) VALUES (?, ?, ?, ?)`,
  ).run("Hypertension", "high", "Blood pressure 160/100", 1);
  db.prepare(
    `INSERT INTO diseases (name, severity, notes, patient_id) VALUES (?, ?, ?, ?)`,
  ).run("Migraine", "medium", "Recurring headaches", 2);
  db.prepare(
    `INSERT INTO diseases (name, severity, notes, patient_id) VALUES (?, ?, ?, ?)`,
  ).run("Diabetes", "high", "Type 2, insulin needed", 3);
}

console.log("Schema and seed data ready");
