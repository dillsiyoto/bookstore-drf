document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.getElementById("book-list");
    const categorySelect = document.getElementById("category-filter");
    const priceInput = document.getElementById("price-filter");
    const filterForm = document.getElementById("filters-form");

    const addCategoryForm = document.getElementById("add-category-form");
    const addBookForm = document.getElementById("add-book-form");
    const bookCategorySelect = document.getElementById("book-category");

    // Загружаем категории
    function loadCategories() {
        fetch("/api/categories/")
            .then(res => res.json())
            .then(categories => {
                categorySelect.innerHTML = `<option value="">Все</option>`;
                bookCategorySelect.innerHTML = "";
                categories.forEach(cat => {
                    const option1 = new Option(cat.name, cat.id);
                    const option2 = new Option(cat.name, cat.id);
                    categorySelect.appendChild(option1);
                    bookCategorySelect.appendChild(option2);
                });
            });
    }

    // Загружаем книги
    function loadBooks(filters = {}) {
        let url = "/api/books/";
        const params = new URLSearchParams(filters).toString();
        if (params) url += "?" + params;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                bookList.innerHTML = "";
                data.forEach(book => {
                    const card = document.createElement("div");
                    card.classList.add("book-card");

                    card.innerHTML = `
                        <img src="${book.cover_image || '/static/img/default-cover.png'}" alt="Обложка">
                        <h3>${book.title}</h3>
                        <p><strong>Автор:</strong> ${book.author}</p>
                        <p class="price">${book.price} ₸</p>
                        <a href="/book/${book.id}/">Подробнее</a>
                    `;

                    bookList.appendChild(card);
                });
            });
    }

    // Применение фильтров
    filterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const filters = {};
        if (categorySelect.value) filters.category = categorySelect.value;
        if (priceInput.value) filters.price__lte = priceInput.value;
        loadBooks(filters);
    });

    // Добавление категории (для админов)
    if (addCategoryForm) {
        addCategoryForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("new-category").value;

            fetch("/api/categories/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access")}`
                },
                body: JSON.stringify({ name })
            })
            .then(res => res.json())
            .then(() => {
                alert("Категория добавлена!");
                loadCategories();
                addCategoryForm.reset();
            });
        });
    }

    // Добавление книги (для админов)
    if (addBookForm) {
        addBookForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append("title", document.getElementById("book-title").value);
            formData.append("author", document.getElementById("book-author").value);
            formData.append("description", document.getElementById("book-description").value);
            formData.append("price", document.getElementById("book-price").value);
            formData.append("category", document.getElementById("book-category").value);

            const cover = document.getElementById("book-cover").files[0];
            if (cover) formData.append("cover_image", cover);

            fetch("/api/books/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("access")}`
                },
                body: formData
            })
            .then(res => res.json())
            .then(() => {
                alert("Книга добавлена!");
                loadBooks();
                addBookForm.reset();
            });
        });
    }

    // При загрузке страницы
    loadCategories();
    loadBooks();
});
