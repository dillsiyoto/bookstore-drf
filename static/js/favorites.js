document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("favorites-list");
    if (!container) return;

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favorites.length === 0) {
        container.innerHTML = "<p>У вас пока нет избранных книг ❤️</p>";
        return;
    }

    try {
        // Загружаем все книги и фильтруем только избранные
        const res = await fetch("/api/books/");
        const data = await res.json();
        const books = Array.isArray(data) ? data : data.results || [];

        const favBooks = books.filter(b => favorites.includes(b.id));

        if (favBooks.length === 0) {
            container.innerHTML = "<p>Избранные книги не найдены 😢</p>";
            return;
        }

        favBooks.forEach(book => {
            const card = document.createElement("div");
            card.className = "book-card";
            card.innerHTML = `
                <div class="cover">
                    <img src="${book.cover_image || '/static/img/default-cover.png'}" alt="${book.title}">
                </div>
                <h3>${book.title}</h3>
                <p><strong>Автор:</strong> ${book.author || 'Не указан'}</p>
                <p class="price">${book.price ? book.price + " ₸" : ""}</p>
                <button class="remove-fav">Удалить</button>
            `;

            card.querySelector(".remove-fav").addEventListener("click", (e) => {
                e.stopPropagation();
                removeFromFavorites(book.id);
                card.remove();
                if (container.children.length === 0) {
                    container.innerHTML = "<p>Избранных книг больше нет.</p>";
                }
            });

            card.addEventListener("click", () => {
                window.location.href = `/book/${book.id}/`;
            });

            container.appendChild(card);
        });

    } catch (err) {
        console.error("Ошибка при загрузке избранных:", err);
        container.innerHTML = "<p>Ошибка загрузки данных.</p>";
    }
});

function removeFromFavorites(bookId) {
    let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    favorites = favorites.filter(id => id !== bookId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
}
