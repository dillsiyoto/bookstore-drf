document.addEventListener("DOMContentLoaded", async () => {
    const usernameField = document.getElementById("profile-username");
    const emailField = document.getElementById("profile-email");
    const roleField = document.getElementById("profile-role");
    const form = document.getElementById("profile-form");
    const editUsername = document.getElementById("edit-username");
    const editEmail = document.getElementById("edit-email");
    const messageBox = document.getElementById("profile-message");

    // Если не авторизован — редирект на логин
    if (!localStorage.getItem("access")) {
        window.location.href = "/login/";
        return;
    }

    // Универсальный запрос с токеном
    async function apiFetch(url, options = {}) {
        const res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
        });
        return res.json();
    }

    // Загрузка профиля
    async function loadProfile() {
        try {
            const data = await apiFetch("/api/users/profile/");
            usernameField.textContent = data.username || "—";
            emailField.textContent = data.email || "—";
            roleField.textContent = data.is_staff ? "Администратор" : "Пользователь";

            editUsername.value = data.username || "";
            editEmail.value = data.email || "";
        } catch (err) {
            console.error("Ошибка при загрузке профиля:", err);
        }
    }

    // Сохранение изменений
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const newData = {
            username: editUsername.value,
            email: editEmail.value,
        };

        try {
            const res = await fetch("/api/users/profile/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
                body: JSON.stringify(newData),
            });

            if (!res.ok) throw await res.json();
            messageBox.textContent = "Изменения сохранены ✅";
            messageBox.style.color = "green";
            loadProfile();
        } catch (err) {
            console.error("Ошибка при обновлении профиля:", err);
            messageBox.textContent = "Ошибка при сохранении ❌";
            messageBox.style.color = "red";
        }
    });

    loadProfile();
});
