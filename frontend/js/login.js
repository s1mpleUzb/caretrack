const API_BASE = window.location.origin;

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, role }),
  })
    .then((res) => res.json())
    .then((data) => {
      const message = document.getElementById("message");
      if (data.success) {
        message.style.color = "green";
        message.style.fontSize = "30px";
        message.innerText = data.message;
        localStorage.setItem("role", data.role);
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);
      } else {
        message.style.color = "red";
        message.innerText = data.message;
      }
    })
    .catch((error) => {
      console.log(error);
    });
});
