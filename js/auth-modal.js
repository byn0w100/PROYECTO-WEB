const AuthModal = (() => {
  function init() {
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    const formLogin = document.getElementById("form-login");
    const formRegister = document.getElementById("form-register");
    const btnClose = document.getElementById("auth-close");
    const overlay = document.getElementById("auth-overlay");

    tabLogin.addEventListener("click", () => { tabLogin.classList.add("active"); tabRegister.classList.remove("active"); formLogin.style.display = "flex"; formRegister.style.display = "none"; clearErrors(); });
    tabRegister.addEventListener("click", () => { tabRegister.classList.add("active"); tabLogin.classList.remove("active"); formRegister.style.display = "flex"; formLogin.style.display = "none"; clearErrors(); });
    btnClose.addEventListener("click", close);
    overlay.addEventListener("click", close);

    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;
      const btn = document.getElementById("btn-login-submit");
      btn.textContent = "Entrando..."; btn.disabled = true;
      const result = await API.login(email, password);
      if (result.success) {
        close(); API.updateAuthUI();
        showToast("Bienvenido de nuevo, " + result.data.username + "!");
        const progress = await API.loadProgress();
        if (progress && typeof Gamification !== "undefined") {
          if (progress.xp > Gamification.getXP()) Gamification.addXP(progress.xp - Gamification.getXP(), "sync");
        }
      } else { showError("login-error", result.error); }
      btn.textContent = "Iniciar sesion"; btn.disabled = false;
    });

    formRegister.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("reg-username").value.trim();
      const email = document.getElementById("reg-email").value.trim();
      const password = document.getElementById("reg-password").value;
      const password2 = document.getElementById("reg-password2").value;
      if (password !== password2) { showError("reg-error", "Las contrasenas no coinciden"); return; }
      if (password.length < 6) { showError("reg-error", "Minimo 6 caracteres"); return; }
      const btn = document.getElementById("btn-register-submit");
      btn.textContent = "Registrando..."; btn.disabled = true;
      const result = await API.register(username, email, password);
      if (result.success) { close(); API.updateAuthUI(); showToast("Cuenta creada! Bienvenido, " + result.data.username + "!"); }
      else { showError("reg-error", result.error); }
      btn.textContent = "Crear cuenta"; btn.disabled = false;
    });
  }

  function open(tab) {
    tab = tab || "login";
    document.getElementById("auth-modal").classList.add("show");
    document.getElementById("auth-overlay").classList.add("show");
    if (tab === "register") document.getElementById("tab-register").click();
    else document.getElementById("tab-login").click();
  }

  function close() {
    document.getElementById("auth-modal").classList.remove("show");
    document.getElementById("auth-overlay").classList.remove("show");
  }

  function showError(id, msg) { var el = document.getElementById(id); if (el) { el.textContent = msg; el.style.display = "block"; } }
  function clearErrors() { ["login-error","reg-error"].forEach(function(id) { var el = document.getElementById(id); if (el) { el.textContent = ""; el.style.display = "none"; } }); }

  function showToast(msg) {
    var t = document.createElement("div");
    t.className = "auth-toast"; t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function() { t.classList.add("show"); });
    setTimeout(function() { t.classList.remove("show"); setTimeout(function() { t.remove(); }, 400); }, 3000);
  }

  return { init: init, open: open, close: close };
})();
