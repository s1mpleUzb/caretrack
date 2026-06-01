const API_BASE = window.location.origin;

if (!localStorage.getItem("role")) {
  window.location.href = "login.html";
}

const role = localStorage.getItem("role");

document.getElementById("openAddModal").addEventListener("click", () => {
  document.getElementById("modalTitle").innerText = "Add Doctor";
  document.getElementById("editId").value = "";
  document.getElementById("name").value = "";
  document.getElementById("specialty").value = "";
  document.getElementById("department").value = "";
  document.getElementById("contact").value = "+998";
  document.getElementById("modal").style.display = "flex";
});

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});

document.getElementById("saveBtn").addEventListener("click", () => {
  const id = document.getElementById("editId").value;
  const name = document.getElementById("name").value;
  const specialty = document.getElementById("specialty").value;
  const department = document.getElementById("department").value;
  const contact = document.getElementById("contact").value;
  const msg = document.getElementById("formMessage");

  const url = id ? `${API_BASE}/api/doctors/${id}` : `${API_BASE}/api/doctors`;
  const method = id ? "PUT" : "POST";

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, specialty, department, contact }),
  })
    .then((res) => res.json())
    .then((data) => {
      msg.style.color = data.success ? "green" : "red";
      msg.innerText = data.message;
      if (data.success) {
        document.getElementById("modal").style.display = "none";
        loadDoctors();
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

function loadDoctors(name = "") {
  const url = name
    ? `${API_BASE}/api/doctors?name=${name}`
    : `${API_BASE}/api/doctors`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("doctorsBody");
      tbody.innerHTML = "";

      if (data.doctors.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6'>No doctors found</td></tr>";
        return;
      }

      data.doctors.forEach((doc) => {
        const deleteBtn =
          role === "admin"
            ? `<button onclick="deleteDoctor(${doc.id})">Delete</button>`
            : "";

        tbody.innerHTML += `
          <tr>
            <td>${doc.id}</td>
            <td>${doc.name}</td>
            <td>${doc.specialty}</td>
            <td>${doc.department}</td>
            <td>${doc.contact}</td>
            <td>
              ${role === "admin" ? `<button onclick="editDoctor(${doc.id}, '${doc.name}', '${doc.specialty}', '${doc.department}', '${doc.contact}')">Edit</button>` : ""}
              ${deleteBtn}
            </td>
          </tr>
        `;
      });
    });
}

function searchDoctors() {
  const name = document.getElementById("searchInput").value;
  loadDoctors(name);
}

function editDoctor(id, name, specialty, department, contact) {
  document.getElementById("modalTitle").innerText = "Edit Doctor";
  document.getElementById("editId").value = id;
  document.getElementById("name").value = name;
  document.getElementById("specialty").value = specialty;
  document.getElementById("department").value = department;
  document.getElementById("contact").value = contact;
  document.getElementById("modal").style.display = "flex";
}

function deleteDoctor(id) {
  if (!confirm("Are you sure?")) return;

  fetch(`${API_BASE}/api/doctors/${id}`, { method: "DELETE" })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("formMessage").style.color = data.success
        ? "green"
        : "red";
      document.getElementById("formMessage").innerText = data.message;
      if (data.success) loadDoctors();
    });
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

loadDoctors();
