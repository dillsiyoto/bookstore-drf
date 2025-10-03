document.addEventListener("DOMContentLoaded", () => {
    const bookDetail = document.getElementById("book-detail");
    const bookId = window.location.pathname.split("/")[2]; // /book/3/

    fetch(`/api/books/${bookId}/`)
        .then(response => response.json())
        .then(book => {
            bookDetail.innerHTML = `
                <h2>${book.title}</h2>
                <img src="${book.cover_image || '/static/img/default-cover.png'}" alt="Обложка">
                <p><strong>Автор:</strong> ${book.author}</p>
                <p><strong>Описание:</strong> ${book.description}</p>
                <p><strong>Цена:</strong> ${book.price} ₸</p>
                <button onclick="addToCart(${book.id})">Добавить в корзину</button>
            `;
        })
        .catch(err => {
            console.error("Ошибка загрузки книги:", err);
            bookDetail.innerHTML = "<p>Не удалось загрузить данные книги</p>";
        });
});

function addToCart(bookId) {
    alert(`Книга с id=${bookId} добавлена в корзину (пока без API)`);
}
