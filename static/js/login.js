document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/users/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);

            alert("Вы успешно вошли!");
            window.location.href = "/"; // каталог
        } else {
            const error = await response.json();
            alert("Ошибка: " + JSON.stringify(error));
        }
    } catch (err) {
        alert("Ошибка подключения к серверу!");
    }
});
