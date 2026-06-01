const express = require("express");
const cors = require("cors");

require("./db/schema");

const doctorsRouter = require("./routes/doctors");
const patientsRouter = require("./routes/patients");
const diseasesRouter = require("./routes/diseases");
const authRouter = require("./routes/auth");
const reportsRouter = require("./routes/reports");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CareTrack Backend Running");
});

app.use("/api/doctors", doctorsRouter);
app.use("/api/patients", patientsRouter);
app.use("/api/diseases", diseasesRouter);
app.use("/api", authRouter);
app.use("/api/reports", reportsRouter);

app.listen(3000, () => {
  console.log("CareTrack server started: http://localhost:3000");
});
