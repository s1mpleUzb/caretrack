const API_BASE = window.location.origin;

if (!localStorage.getItem("role")) {
  window.location.href = "login.html";
}

const role = localStorage.getItem("role");

function loadPatientsDropdown() {
  fetch(`${API_BASE}/api/patients`)
    .then((res) => res.json())
    .then((data) => {
      const select = document.getElementById("patient_id");
      select.innerHTML = "<option value=''>Select Patient</option>";
      data.patients.forEach((p) => {
        select.innerHTML += `<option value="${p.id}">${p.name}</option>`;
      });

      const filter = document.getElementById("patientFilter");
      filter.innerHTML = "<option value=''>All Patients</option>";
      data.patients.forEach((p) => {
        filter.innerHTML += `<option value="${p.id}">${p.name}</option>`;
      });
    });
}

document.getElementById("openAddModal").addEventListener("click", () => {
  document.getElementById("modalTitle").innerText = "Add Diagnosis";
  document.getElementById("editId").value = "";
  document.getElementById("name").value = "";
  document.getElementById("severity").value = "";
  document.getElementById("notes").value = "";
  document.getElementById("patient_id").value = "";
  loadPatientsDropdown();
  document.getElementById("modal").style.display = "flex";
});

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});

document.getElementById("saveBtn").addEventListener("click", () => {
  const id = document.getElementById("editId").value;
  const name = document.getElementById("name").value;
  const severity = document.getElementById("severity").value;
  const notes = document.getElementById("notes").value;
  const patient_id = document.getElementById("patient_id").value;
  const msg = document.getElementById("formMessage");

  const url = id
    ? `${API_BASE}/api/diseases/${id}`
    : `${API_BASE}/api/diseases`;
  const method = id ? "PUT" : "POST";

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, severity, notes, patient_id }),
  })
    .then((res) => res.json())
    .then((data) => {
      msg.style.color = data.success ? "green" : "red";
      msg.innerText = data.message;
      if (data.success) {
        document.getElementById("modal").style.display = "none";
        loadDiseases();
      }
    })
    .catch(() => {
      msg.style.color = "red";
      msg.innerText = "Server bilan aloqa yo'q!";
    });
});

if (role !== "admin") {
  document.getElementById("openAddModal").style.display = "none";
}

function loadDiseases(severity = "", patient_id = "") {
  let url = `${API_BASE}/api/diseases`;
  const params = [];
  if (severity) params.push(`severity=${severity}`);
  if (patient_id) params.push(`patient_id=${patient_id}`);
  if (params.length > 0) url += "?" + params.join("&");

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("diseasesBody");
      tbody.innerHTML = "";

      if (data.diseases.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6'>No diseases found</td></tr>";
        return;
      }

      data.diseases.forEach((d) => {
        const severityBadge = `<span style="
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 12px;
          background: ${d.severity === "high" ? "#ffe0e0" : d.severity === "medium" ? "#fff3cd" : "#e0f7e9"};
          color: ${d.severity === "high" ? "#c0392b" : d.severity === "medium" ? "#856404" : "#1a7a3c"};
        ">${d.severity}</span>`;

        const deleteBtn =
          role === "admin"
            ? `<button onclick="deleteDisease(${d.id})">Delete</button>`
            : "";

        tbody.innerHTML += `
          <tr>
            <td>${d.id}</td>
            <td>${d.name}</td>
            <td>${severityBadge}</td>
            <td>${d.notes || "-"}</td>
            <td>${d.patient_name || "-"}</td>
            <td>
              ${role !== "receptionist" ? `<button onclick="editDisease(${d.id}, '${d.name}', '${d.severity}', '${d.notes || ""}', ${d.patient_id || null})">Edit</button>` : ""}
              ${deleteBtn}
            </td>
          </tr>
        `;
      });
    });
}

function filterDiseases() {
  const severity = document.getElementById("severityFilter").value;
  const patient_id = document.getElementById("patientFilter").value;
  loadDiseases(severity, patient_id);
}

function editDisease(id, name, severity, notes, patient_id) {
  document.getElementById("modalTitle").innerText = "Edit Diagnosis";
  document.getElementById("editId").value = id;
  document.getElementById("name").value = name;
  document.getElementById("severity").value = severity;
  document.getElementById("notes").value = notes;
  loadPatientsDropdown();
  setTimeout(() => {
    document.getElementById("patient_id").value = patient_id || "";
  }, 300);
  document.getElementById("modal").style.display = "flex";
}

function deleteDisease(id) {
  if (!confirm("Are you sure?")) return;

  fetch(`${API_BASE}/api/diseases/${id}`, { method: "DELETE" })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("formMessage").style.color = data.success
        ? "green"
        : "red";
      document.getElementById("formMessage").innerText = data.message;
      if (data.success) loadDiseases();
    });
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

loadPatientsDropdown();
loadDiseases();
