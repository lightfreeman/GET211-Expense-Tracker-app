// REGISTER USER function
function registerUser(event) {
  event.preventDefault();

  const form = event.target;
  const fullname = form.fullname.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const confirm = form.confirm.value;

  if (!fullname || !email || !password || !confirm) {
    alert("All fields are required");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }

  fetch("../backend/auth/register.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullname, email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        alert("Registration successful. Please login.");
        window.location.href = "login.html";
      } else {
        alert("Registration failed. Email may already exist.");
      }
    })
    .catch(err => console.error("Error:", err));
}


// LOGIN USER function
function loginUser(event) {
  event.preventDefault();

  const form = event.target;
  const email = form.email.value.trim();
  const password = form.password.value;

  if (!email || !password) {
    alert("Email and password required");
    return;
  }

  fetch("../backend/auth/login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid login credentials");
    }
  })
  .catch(err => console.error("Error:", err));
}


// LOGOUT USER function 
function logoutUser() {
  fetch("../backend/auth/logout.php")
    .then(() => window.location.href = "/GET211-Expense-Tracker-app/index.html")
    .catch(err => console.error("Error:", err));
}
