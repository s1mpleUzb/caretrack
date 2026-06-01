if (!localStorage.getItem("role")) {
  window.location.href = "login.html";
}
// ===== STATS =====
fetch("http://localhost:3000/api/reports")
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      document.getElementById("totalDoctors").innerText =
        data.reports.totalDoctors;
      document.getElementById("totalPatients").innerText =
        data.reports.totalPatients;
      document.getElementById("totalDiseases").innerText =
        data.reports.totalDiseases;
    }
  });

// ===== LOAD DIAGNOSIS =====
function loadDiagnosis(severity = "") {
  let url = "http://localhost:3000/api/diseases";
  if (severity) url += `?severity=${severity}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("reportsBody");
      tbody.innerHTML = "";

      if (data.diseases.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5'>No records found</td></tr>";
        return;
      }

      data.diseases.forEach((d) => {
        const badge = `<span style="
                padding: 3px 10px;
                border-radius: 12px;
                font-size: 12px;
                background: ${d.severity === "high" ? "#ffe0e0" : d.severity === "medium" ? "#fff3cd" : "#e0f7e9"};
                color: ${d.severity === "high" ? "#c0392b" : d.severity === "medium" ? "#856404" : "#1a7a3c"};
            ">${d.severity}</span>`;

        tbody.innerHTML += `
                <tr>
                    <td>${d.id}</td>
                    <td>${d.name}</td>
                    <td>${badge}</td>
                    <td>${d.patient_id || "-"}</td>
                    <td>${d.notes || "-"}</td>
                </tr>
            `;
      });
    });
}

// ===== FILTER =====
function filterDiagnosis() {
  const severity = document.getElementById("severityFilter").value;
  loadDiagnosis(severity);
}

// --------
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// Sahifa ochilganda yukla
loadDiagnosis();
