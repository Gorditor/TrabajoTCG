document.addEventListener("DOMContentLoaded", () => {
  const loginTab = document.getElementById("login-tab");
  const registerTab = document.getElementById("register-tab");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
  });

  registerTab.addEventListener("click", () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = loginForm.querySelector("input[type='text']").value;
    const password = loginForm.querySelector("input[type='password']").value;

    if (username && password) {
      localStorage.setItem("usuarioIRB", username);
      window.location.href = "index.html";
    }
  });

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = registerForm.querySelector("input[type='text']").value;
    const email = registerForm.querySelector("input[type='email']").value;
    const password = registerForm.querySelector("input[type='password']").value;

    if (username && email && password) {
      localStorage.setItem("usuarioIRB", username);
      window.location.href = "index.html";
    }
  });
});
