const express = require("express");
const cors = require("cors");
const path = require("path");

require("./db/schema");
const doctorsRouter = require("./routes/doctors");
const patientsRouter = require("./routes/patients");
const diseasesRouter = require("./routes/diseases");
const authRouter = require("./routes/auth");
const reportsRouter = require("./routes/reports");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"));
});
app.use("/api/doctors", doctorsRouter);
app.use("/api/patients", patientsRouter);
app.use("/api/diseases", diseasesRouter);
app.use("/api", authRouter);
app.use("/api/reports", reportsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
