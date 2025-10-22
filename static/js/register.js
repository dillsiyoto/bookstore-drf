document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("registerForm");
    const loginUrl = form.dataset.loginUrl; 
    const registerMessage = document.getElementById("register-message");

    if (!form || !registerMessage) return;

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        const username = document.getElementById("username")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value.trim();

        if (!username || !email || !password) {
            registerMessage.textContent = "⚠️ Пожалуйста, заполните все поля.";
            registerMessage.style.color = "red";
            return;
        }

        try {
            const response = await fetch("/api/users/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            if (response.ok) {
                form.reset();
                registerMessage.textContent = "✅ Регистрация прошла успешно! Теперь войдите.";
                registerMessage.style.color = "green";

                // Автопереход на страницу логина через 1 секунду
                setTimeout(() => {
                    window.location.href = loginUrl;
                }, 1000);
            } else {
                const error = await response.json();
                registerMessage.textContent = "Ошибка: " + (error.detail || JSON.stringify(error));
                registerMessage.style.color = "red";
            }
        } catch (err) {
            registerMessage.textContent = "Ошибка подключения к серверу!";
            registerMessage.style.color = "red";
        }
    });
});
