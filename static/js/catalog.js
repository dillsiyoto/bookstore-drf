document.addEventListener("DOMContentLoaded", async () => {
    const bookList = document.getElementById("book-list");
    const categoryFilter = document.getElementById("category-filter");
    const bookCategorySelect = document.getElementById("book-category");

    const addCategoryForm = document.getElementById("add-category-form");
    const addBookForm = document.getElementById("add-book-form");
    const filterForm = document.getElementById("filters-form");
    const priceInput = document.getElementById("price-filter");

    const adminPanel = document.querySelector(".admin-panel");

    // -----------------------------
    // Проверка авторизации и прав
    // -----------------------------
    function isAdmin() {
        const token = localStorage.getItem("access");
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.is_staff || payload.is_superuser;
        } catch {
            return false;
        }
    }

    function isAuthenticated() {
        return !!localStorage.getItem("access");
    }

    function updateAdminUI() {
        if (isAdmin()) {
            adminPanel?.classList.remove("hidden");
        } else {
            adminPanel?.classList.add("hidden");
        }
    }

    updateAdminUI();

    // -----------------------------
    // Универсальный fetch
    // -----------------------------
    async function apiFetch(url, options = {}) {
        const headers = { ...(options.headers || {}) };
        const token = localStorage.getItem("access");
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(url, { ...options, headers });
        let data = {};
        try { data = await res.json(); } catch {}
        if (!res.ok) throw data;
        return data;
    }

    // -----------------------------
    // Вспомогательная функция
    // -----------------------------
    function extractResults(data) {
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.results)) return data.results;
        return [];
    }

    // -----------------------------
    // Загрузка категорий
    // -----------------------------
    // -----------------------------
    // Загрузка книг
    // -----------------------------
    async function loadBooks(filters = {}) {
        let url = "/api/books/";
        const params = new URLSearchParams(filters).toString();
        if (params) url += "?" + params;

        try {
            const data = await apiFetch(url);
            const books = extractResults(data);
            if (!bookList) return;

            bookList.innerHTML = "";
            const loggedIn = !!localStorage.getItem("access");
            const favs = JSON.parse(localStorage.getItem("favorites") || "[]");

            books.forEach(book => {
                const card = document.createElement("div");
                card.className = "book-card";

                card.innerHTML = `
                    <div class="cover">
                        <img src="${book.cover_image || '/static/img/default-cover.png'}" 
                            alt="Обложка ${book.title || ''}">
                    </div>
                    <h3>${book.title || "Без названия"}</h3>
                    <p><strong>Автор:</strong> ${book.author || "Не указан"}</p>
                    <p class="price">${book.price != null ? book.price + " ₸" : ""}</p>
                `;

                // переход на детальную страницу
                card.addEventListener("click", () => {
                    window.location.href = `/book/${book.id}/`;
                });

                if (loggedIn) {
                    // делаем контейнер относительным
                    card.style.position = "relative";

                    // ❤️ Кнопка избранного
                    const favBtn = document.createElement("button");
                    favBtn.className = "favorite-btn";
                    favBtn.dataset.id = book.id;
                    favBtn.type = "button";
                    favBtn.textContent = favs.includes(book.id) ? "❤️" : "🤍";

                    favBtn.addEventListener("click", e => {
                        e.stopPropagation();
                        let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
                        if (favorites.includes(book.id)) {
                            favorites = favorites.filter(id => id !== book.id);
                        } else {
                            favorites.push(book.id);
                        }
                        localStorage.setItem("favorites", JSON.stringify(favorites));
                        favBtn.textContent = favorites.includes(book.id) ? "❤️" : "🤍";
                    });

                    card.appendChild(favBtn);

                    // 🛒 Кнопка "в корзину"
                    const cartBtn = document.createElement("button");
                    cartBtn.className = "cart-btn";
                    cartBtn.dataset.id = book.id;

                    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
                    const inCart = cart.some(i => i.id === book.id);
                    cartBtn.textContent = inCart ? "✅ В корзине" : "🛒 В корзину";

                    cartBtn.addEventListener("click", e => {
                        e.stopPropagation();
                        let cart = JSON.parse(localStorage.getItem("cart") || "[]");
                        if (!cart.some(i => i.id === book.id)) {
                            cart.push(book);
                            localStorage.setItem("cart", JSON.stringify(cart));
                            cartBtn.textContent = "✅ В корзине";
                        }
                    });

                    card.appendChild(cartBtn);
                }

                bookList.appendChild(card);
            });

        } catch (err) {
            console.error("Ошибка при загрузке книг:", err);
            console.log("URL:", url);
        }
    }


    // -----------------------------
    // Обработчик фильтра
    // -----------------------------
    if (filterForm) {
        filterForm.addEventListener("submit", e => {
            e.preventDefault();

            const filters = {};
            if (categoryFilter && categoryFilter.value) filters.category = categoryFilter.value;
            if (priceInput && priceInput.value) filters.max_price = priceInput.value;

            const searchInput = document.getElementById("search-filter");
            if (searchInput && searchInput.value.trim())
                filters.search = searchInput.value.trim();

            const params = new URLSearchParams(filters).toString();
            if (params) history.replaceState(null, "", "?" + params);

            loadBooks(filters);
        });
    }

    // -----------------------------
    // Добавление категории (только админ)
    // -----------------------------
    if (addCategoryForm && isAdmin()) {
        addCategoryForm.addEventListener("submit", e => {
            e.preventDefault();
            const name = document.getElementById("new-category")?.value.trim();
            if (!name) return;

            apiFetch("/api/categories/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            })
            .then(() => {
                addCategoryForm.reset();
                loadCategories();
            })
            .catch(err => {
                console.error("Ошибка при добавлении категории:", err);
                alert("Не удалось добавить категорию.");
            });
        });
    }

    // -----------------------------
    // Добавление книги (только админ)
    // -----------------------------
    if (addBookForm && isAdmin()) {
        addBookForm.addEventListener("submit", e => {
            e.preventDefault();

            const formData = new FormData(addBookForm);
            const category = bookCategorySelect?.value;
            if (category) formData.append("category_id", category);

            apiFetch("/api/books/", {
                method: "POST",
                body: formData,
            })
            .then(() => {
                addBookForm.reset();
                loadBooks();
            })
            .catch(err => {
                console.error("Ошибка при добавлении книги:", err);
                alert("Не удалось добавить книгу.");
            });
        });
    }

    // -----------------------------
    // Инициализация
    // -----------------------------
        await loadCategories();
        await loadBooks();
    });

    // ===========================
    // 🔹 ИЗБРАННОЕ (сердечки)
    // ===========================

    function getFavorites() {
        try { return JSON.parse(localStorage.getItem("favorites")) || []; }
        catch { return []; }
    }
    function saveFavorites(favs) {
        localStorage.setItem("favorites", JSON.stringify(favs));
    }
    function toggleFavorite(bookId) {
        let favs = getFavorites();
        if (favs.includes(bookId)) favs = favs.filter(id => id !== bookId);
        else favs.push(bookId);
        saveFavorites(favs);
        updateFavoriteButtons();
    }
    function updateFavoriteButtons() {
        const favs = getFavorites();
        document.querySelectorAll(".favorite-btn").forEach(btn => {
            const id = parseInt(btn.dataset.id);
            btn.textContent = favs.includes(id) ? "❤️" : "🤍";
        });
    }

    // ===========================
    // 🔹 Рендер каталога с избранным
    // ===========================

    async function renderBooks(books) {
        const bookList = document.getElementById("book-list");
        bookList.innerHTML = "";

        const loggedIn = !!localStorage.getItem("access");
        const favs = getFavorites();
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");

        books.forEach(book => {
            const card = document.createElement("div");
            card.className = "book-card";
            card.innerHTML = `
                <div class="cover">
                    <img src="${book.cover_image || '/static/img/default-cover.png'}" alt="${book.title}">
                </div>
                <h3>${book.title}</h3>
                <p><strong>Автор:</strong> ${book.author || 'Не указан'}</p>
                <p class="price">${book.price ? book.price + " ₸" : ""}</p>
            `;

            if (loggedIn) {
                // ❤️ избранное
                const favBtn = document.createElement("button");
                favBtn.className = "favorite-btn";
                favBtn.dataset.id = book.id;
                favBtn.textContent = favs.includes(book.id) ? "❤️" : "🤍";
                favBtn.addEventListener("click", e => {
                    e.stopPropagation();
                    toggleFavorite(book.id);
                    updateFavoriteButtons();
                });
                card.appendChild(favBtn);

                // 🛒 корзина
                const cartBtn = document.createElement("button");
                cartBtn.className = "cart-btn";
                cartBtn.dataset.id = book.id;

                const inCart = cart.some(i => i.id === book.id);
                cartBtn.textContent = inCart ? "✅ В корзине" : "🛒 В корзину";

                cartBtn.addEventListener("click", e => {
                    e.stopPropagation();
                    let currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
                    if (!currentCart.some(i => i.id === book.id)) {
                        currentCart.push(book);
                        localStorage.setItem("cart", JSON.stringify(currentCart));
                        cartBtn.textContent = "✅ В корзине";
                    }
                });

                card.appendChild(cartBtn);
            }

            card.addEventListener("click", () => {
                window.location.href = `/book/${book.id}/`;
            });

            bookList.appendChild(card);
        });

        updateFavoriteButtons();
    }


    // ===============================
    // 🔹 Загрузка каталога
    // ===============================
    fetch("/api/books/")
        .then(res => res.json())
        .then(data => {
            const books = Array.isArray(data) ? data : data.results;
            if (!books?.length) {
                document.getElementById("book-list").innerHTML = "<p>Книг пока нет.</p>";
                return;
            }
            console.log("📚 Рендер каталога пошёл, найдено книг:", books.length);
            renderBooks(books);
        })
        .catch(err => {
            console.error("Ошибка загрузки каталога:", err);
            document.getElementById("book-list").innerHTML = "<p>Ошибка загрузки каталога.</p>";
        });
