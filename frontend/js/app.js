if (!localStorage.getItem("role")) {
  window.location.href = "login.html";
}
fetch("http://localhost:3000/api/reports")
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      document.getElementById("totalDoctors").innerText =
        "Doctors: " + data.reports.totalDoctors;
      document.getElementById("totalPatients").innerText =
        "Patients: " + data.reports.totalPatients;
      document.getElementById("totalDiseases").innerText =
        "Diseases: " + data.reports.totalDiseases;
    }
  })
  .catch(() => {
    console.log("Server bilan aloqa yo'q");
  });

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
