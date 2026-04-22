// SIGNUP
function signup() {
  let uEl = document.getElementById("user");
  let pEl = document.getElementById("pass");

  if (!uEl || !pEl) return alert("Input fields missing");

  let u = uEl.value.trim();
  let p = pEl.value.trim();

  if (!u || !p) {
    alert("Fill all fields");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users") || "[]");

  if (users.find(x => x.user === u)) {
    alert("User already exists");
    return;
  }

  users.push({ user: u, pass: p });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Signup successful");
  location.href = "login.html";
}


// LOGIN
function login() {
  let uEl = document.getElementById("luser");
  let pEl = document.getElementById("lpass");

  if (!uEl || !pEl) return alert("Input fields missing");

  let u = uEl.value.trim();
  let p = pEl.value.trim();

  let users = JSON.parse(localStorage.getItem("users") || "[]");

  let valid = users.find(x => x.user === u && x.pass === p);

  if (valid) {
    localStorage.setItem("login", u);
    location.href = "index.html";
  } else {
    alert("Invalid credentials");
  }
}


// AUTH CHECK
function checkAuth() {
  if (!localStorage.getItem("login")) {
    location.href = "login.html";
  }
}


// LOGOUT
function logout() {
  localStorage.removeItem("login");
  location.href = "login.html";
}