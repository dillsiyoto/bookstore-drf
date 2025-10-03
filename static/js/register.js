document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("registerForm");
    const loginUrl = form.dataset.loginUrl; 

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/api/users/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            });

            if (response.ok) {
                alert("Регистрация прошла успешно! Теперь войдите.");
                window.location.href = loginUrl; 
            } else {
                const error = await response.json();
                alert("Ошибка: " + JSON.stringify(error));
            }
        } catch (err) {
            alert("Ошибка подключения к серверу!");
        }
    });
});
