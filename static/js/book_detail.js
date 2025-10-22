document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("book-detail");
    const bookId = window.location.pathname.split("/").filter(Boolean).pop();

    const token = localStorage.getItem("access");
    const isAuthenticated = !!token;

    try {
        const res = await fetch(`/api/books/${bookId}/`);
        if (!res.ok) throw new Error("Не удалось загрузить данные о книге");
        const book = await res.json();

        container.innerHTML = `
            <div class="book-detail-card">
                <img src="${book.cover_image || '/static/img/default-cover.png'}" alt="${book.title}">
                <div class="info">
                    <h1>${book.title}</h1>
                    <h3>${book.author}</h3>
                    <p><strong>Категория:</strong> ${book.category?.name || "Не указана"}</p>
                    <p><strong>Описание:</strong><br>${book.description || "Нет описания"}</p>
                    <p class="price">${book.price ? book.price + " ₸" : ""}</p>
                    ${
                        isAuthenticated
                            ? `<button id="fav-btn" class="favorite-btn">🤍 В избранное</button>`
                            : `<p class="login-hint">💡 Войдите, чтобы добавить в избранное</p>`
                    }
                </div>
            </div>
        `;

        if (isAuthenticated) {
            const favBtn = document.getElementById("fav-btn");
            const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
            const isFavorite = favorites.includes(book.id);

            updateButtonState();

            favBtn.addEventListener("click", async () => {
                toggleFavorite(book.id);
                updateButtonState();
            });

            function toggleFavorite(id) {
                let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
                if (favs.includes(id)) {
                    favs = favs.filter(f => f !== id);
                } else {
                    favs.push(id);
                }
                localStorage.setItem("favorites", JSON.stringify(favs));
            }

            function updateButtonState() {
                const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
                const isFav = favs.includes(book.id);
                favBtn.textContent = isFav ? "❤️ В избранном" : "🤍 В избранное";
                favBtn.classList.toggle("active", isFav);
            }
        }

    } catch (err) {
        console.error("Ошибка загрузки книги:", err);
        container.innerHTML = `<p class="error">Ошибка загрузки данных. Попробуйте позже.</p>`;
    }
});
