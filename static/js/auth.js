// ===========================
// auth.js — единый модуль аутентификации
// ===========================

document.addEventListener("DOMContentLoaded", () => {
    const loginLink = document.getElementById("login-link");
    const registerLink = document.getElementById("register-link");
    const logoutLink = document.getElementById("logout-link");
    const profileLink = document.getElementById("profile-link");
    const favoritesLink = document.getElementById("favorites-link");

    // -----------------------------
    // 🔹 Проверка токенов
    // -----------------------------
    function decodeToken(token) {
        try {
            return JSON.parse(atob(token.split(".")[1]));
        } catch {
            return null;
        }
    }

    function isAuthenticated() {
        return !!localStorage.getItem("access");
    }

    function isAdmin() {
        const token = localStorage.getItem("access");
        const payload = token ? decodeToken(token) : null;
        return payload?.is_staff || payload?.is_superuser || false;
    }

    // -----------------------------
    // 🔹 Обновление интерфейса
    // -----------------------------
    function updateHeaderUI() {
        const adminPanel = document.querySelector(".admin-panel");

        if (isAuthenticated()) {
            if (loginLink) loginLink.style.display = "none";
            if (registerLink) registerLink.style.display = "none";
            if (logoutLink) logoutLink.style.display = "inline";
            if (profileLink) profileLink.style.display = "inline";
            if (favoritesLink) favoritesLink.style.display = "inline";

            if (isAdmin()) adminPanel?.classList.remove("hidden");
            else adminPanel?.classList.add("hidden");
        } else {
            if (loginLink) loginLink.style.display = "inline";
            if (registerLink) registerLink.style.display = "inline";
            if (logoutLink) logoutLink.style.display = "none";
            if (profileLink) profileLink.style.display = "none";
            if (favoritesLink) favoritesLink.style.display = "none"; 
            adminPanel?.classList.add("hidden");
        }
    }

    updateHeaderUI();

    // -----------------------------
    // 🔹 Вход (используется на login.html)
    // -----------------------------
    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("login-message");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username")?.value;
            const password = document.getElementById("password")?.value;

            try {
                const res = await fetch("/api/users/login/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem("access", data.access);
                    localStorage.setItem("refresh", data.refresh);
                    loginMessage.textContent = "✅ Успешный вход!";
                    loginMessage.style.color = "green";
                        setTimeout(() => {
                            window.location.href = "/";
                        }, 800); // 0.8 секунды
                } else {
                    const error = await res.json();
                    loginMessage.textContent = "Ошибка: " + (error.detail || JSON.stringify(error));
                    loginMessage.style.color = "red";
                }
            } catch (err) {
                alert("Ошибка подключения к серверу.");
            }
        });
    }

    // -----------------------------
    // 🔹 Выход
    // -----------------------------
    async function logout() {
        const refresh = localStorage.getItem("refresh");

        try {
            await fetch("/api/users/logout/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh }),
            });
        } catch (err) {
            console.warn("Ошибка при выходе:", err);
        }

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        updateHeaderUI();
        window.location.href = "/login/";
    }

    if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
    }

    // -----------------------------
    // 🔹 Автообновление access-токена
    // -----------------------------
    const access = localStorage.getItem("access");
    if (access) {
        const payload = decodeToken(access);
        const exp = payload?.exp ? payload.exp * 1000 : 0;

        if (Date.now() > exp) {
            console.log("⏰ Access-токен истёк, пробуем обновить...");
            const refresh = localStorage.getItem("refresh");
            if (refresh) {
                fetch("/api/users/refresh/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.access) {
                            localStorage.setItem("access", data.access);
                            console.log("🔄 Access-токен обновлён");
                        } else {
                            console.warn("Не удалось обновить токен, выходим...");
                            logout();
                        }
                    })
                    .catch(() => logout());
            } else {
                logout();
            }
        }
    }
});
