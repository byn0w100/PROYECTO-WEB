const API = (() => {
  const BASE_URL = "http://localhost:3000/api";
  function getToken() { return localStorage.getItem("linuxlab_token"); }
  function setToken(t) { localStorage.setItem("linuxlab_token", t); }
  function getUser() { const u = localStorage.getItem("linuxlab_user"); return u ? JSON.parse(u) : null; }
  function setUser(u) { localStorage.setItem("linuxlab_user", JSON.stringify(u)); }
  function isLoggedIn() { return !!getToken(); }
  function logout() { localStorage.removeItem("linuxlab_token"); localStorage.removeItem("linuxlab_user"); location.reload(); }
  function authHeaders() { return { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` }; }
  async function register(username, email, password) {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al registrar");
      setToken(data.token); setUser({ _id: data._id, username: data.username, email: data.email, xp: data.xp });
      return { success: true, data };
    } catch (err) { return { success: false, error: err.message }; }
  }
  async function login(email, password) {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Credenciales invalidas");
      setToken(data.token); setUser({ _id: data._id, username: data.username, email: data.email, xp: data.xp });
      return { success: true, data };
    } catch (err) { return { success: false, error: err.message }; }
  }
  async function saveProgress(completedLessons, xp) {
    if (!isLoggedIn()) return;
    try { await fetch(`${BASE_URL}/progress`, { method: "POST", headers: authHeaders(), body: JSON.stringify({ completedLessons: [...completedLessons], xp }) }); }
    catch (err) { console.warn("Sin sincronizar:", err.message); }
  }
  async function loadProgress() {
    if (!isLoggedIn()) return null;
    try { const res = await fetch(`${BASE_URL}/progress`, { headers: authHeaders() }); return res.ok ? await res.json() : null; }
    catch (err) { return null; }
  }
  function updateAuthUI() {
    const user = getUser();
    const btnLogin = document.getElementById("btn-login");
    const btnLogout = document.getElementById("btn-logout");
    const userInfo = document.getElementById("user-info");
    if (user && isLoggedIn()) {
      if (btnLogin) btnLogin.style.display = "none";
      if (btnLogout) btnLogout.style.display = "flex";
      if (userInfo) { userInfo.style.display = "flex"; userInfo.innerHTML = `<span class="user-avatar">👤</span><span class="user-name">${user.username}</span>`; }
    } else {
      if (btnLogin) btnLogin.style.display = "flex";
      if (btnLogout) btnLogout.style.display = "none";
      if (userInfo) userInfo.style.display = "none";
    }
  }
  return { register, login, logout, getToken, getUser, isLoggedIn, saveProgress, loadProgress, updateAuthUI };
})();
