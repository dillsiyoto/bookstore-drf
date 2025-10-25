document.addEventListener("DOMContentLoaded", () => {
    const cartList = document.getElementById("cart-list");
    const totalDiv = document.getElementById("cart-total");

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (!cart.length) {
        cartList.innerHTML = `<p class="no-favorites">Ваша корзина пуста 🛒</p>`;
        totalDiv.textContent = "";
        return;
    }

    let total = 0;
    cartList.className = "favorites-grid";
    cartList.style.display = "grid";
    cartList.style.gridTemplateColumns = "repeat(auto-fill, minmax(220px, 1fr))";
    cartList.style.gap = "25px";

    cart.forEach(book => {
        const card = document.createElement("div");
        card.className = "cart-card";

        const price = parseFloat(book.price) || 0;
        total += price;

        card.innerHTML = `
            <img src="${book.cover_image || '/static/img/default-cover.png'}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p><strong>Автор:</strong> ${book.author}</p>
            <p class="price">${price.toLocaleString()} ₸</p>
            <button class="remove-cart-btn">Удалить</button>
        `;

        card.querySelector(".remove-cart-btn").addEventListener("click", () => {
            removeFromCart(book.id);
            card.remove();
            updateTotal();
        });

        cartList.appendChild(card);
    });

    updateTotal();

    function updateTotal() {
        const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const total = currentCart.reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0);
        totalDiv.innerHTML = `<p><strong>Итого:</strong> ${total.toLocaleString()} ₸</p>`;

        if (!currentCart.length) {
            cartList.innerHTML = `<p class="no-favorites">Ваша корзина пуста 🛒</p>`;
            totalDiv.textContent = "";
        }
    }

    function removeFromCart(id) {
        let cart = JSON.parse(localStorage.getItem("cart") || "[]");
        cart = cart.filter(b => b.id !== id);
        localStorage.setItem("cart", JSON.stringify(cart));
    }
});
