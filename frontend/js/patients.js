if (!localStorage.getItem("role")) {
  window.location.href = "login.html";
}
const role = localStorage.getItem("role");

// ===== DOCTORS DROPDOWN YUKLASH =====
function loadDoctorsDropdown() {
  fetch("http://localhost:3000/api/doctors")
    .then((res) => res.json())
    .then((data) => {
      const select = document.getElementById("doctor_id");
      select.innerHTML = "<option value=''>Select Doctor</option>";
      data.doctors.forEach((doc) => {
        select.innerHTML += `<option value="${doc.id}">${doc.name}</option>`;
      });
    });
}

// ===== MODAL =====
document.getElementById("openAddModal").addEventListener("click", () => {
  document.getElementById("modalTitle").innerText = "Add Patient";
  document.getElementById("editId").value = "";
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  document.getElementById("gender").value = "";
  document.getElementById("contact").value = "+998";
  document.getElementById("doctor_id").value = "";
  loadDoctorsDropdown();
  document.getElementById("modal").style.display = "flex";
});

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});

// ===== SAVE (ADD or EDIT) =====
document.getElementById("saveBtn").addEventListener("click", () => {
  const id = document.getElementById("editId").value;
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;
  const contact = document.getElementById("contact").value;
  const doctor_id = document.getElementById("doctor_id").value;
  const msg = document.getElementById("formMessage");

  const url = id
    ? `http://localhost:3000/api/patients/${id}`
    : "http://localhost:3000/api/patients";
  const method = id ? "PUT" : "POST";

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      age,
      gender,
      contact,
      doctor_id: doctor_id || null,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      msg.style.color = data.success ? "green" : "red";
      msg.innerText = data.message;
      if (data.success) {
        document.getElementById("modal").style.display = "none";
        loadPatients();
      }
    })
    .catch(() => {
      msg.style.color = "red";
      msg.innerText = "Server bilan aloqa yo'q!";
    });
});

// Add tugmasini faqat adminga ko'rsat
if (role !== "admin") {
  document.getElementById("openAddModal").style.display = "none";
}

// ===== LOAD PATIENTS =====
function loadPatients(name = "") {
  const url = name
    ? `http://localhost:3000/api/patients?name=${name}`
    : "http://localhost:3000/api/patients";

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("patientsBody");
      tbody.innerHTML = "";

      if (data.patients.length === 0) {
        tbody.innerHTML = "<tr><td colspan='7'>No patients found</td></tr>";
        return;
      }

      data.patients.forEach((p) => {
        const deleteBtn =
          role === "admin"
            ? `<button onclick="deletePatient(${p.id})">Delete</button>`
            : "";

        tbody.innerHTML += `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.name}</td>
                    <td>${p.age}</td>
                    <td>${p.gender}</td>
                    <td>${p.contact}</td>
                    <td>${p.doctor_name || "-"}</td>
                    <td>
                      ${role !== "receptionist" ? `<button onclick="editPatient(${p.id}, '${p.name}', ${p.age}, '${p.gender}', '${p.contact}', ${p.doctor_id || null})">Edit</button>` : ""}
                        ${deleteBtn}
                    </td>
                </tr>
            `;
      });
    });
}
// ===== SEARCH =====
function searchPatients() {
  const name = document.getElementById("searchInput").value;
  loadPatients(name);
}
// ===== EDIT =====
function editPatient(id, name, age, gender, contact, doctor_id) {
  document.getElementById("modalTitle").innerText = "Edit Patient";
  document.getElementById("editId").value = id;
  document.getElementById("name").value = name;
  document.getElementById("age").value = age;
  document.getElementById("gender").value = gender;
  document.getElementById("contact").value = contact;
  loadDoctorsDropdown();
  setTimeout(() => {
    document.getElementById("doctor_id").value = doctor_id || "";
  }, 300);
  document.getElementById("modal").style.display = "flex";
}

// ===== DELETE =====
function deletePatient(id) {
  if (!confirm("Are you sure?")) return;

  fetch(`http://localhost:3000/api/patients/${id}`, { method: "DELETE" })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("formMessage").style.color = data.success
        ? "green"
        : "red";
      document.getElementById("formMessage").innerText = data.message;
      if (data.success) loadPatients();
    });
}

// ------
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// Sahifa ochilganda yukla
loadPatients();
