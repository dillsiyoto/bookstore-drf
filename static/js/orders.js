document.addEventListener("DOMContentLoaded", () => {
  const ordersContainer = document.getElementById("orders-list");
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");

  if (orders.length === 0) {
    ordersContainer.innerHTML = "<p>Вы ещё не делали заказов.</p>";
    return;
  }

  orders.forEach(order => {
    const block = document.createElement("div");
    block.className = "order-block";
    block.innerHTML = `
      <h3>Заказ №${order.id}</h3>
      <p>Дата: ${order.date}</p>
      <p>Статус: <strong>${order.status}</strong></p>
      <div class="order-items">
        ${order.items.map(b => `
          <div class="book-card">
            <img src="${b.cover_image || '/static/img/default-cover.png'}" alt="${b.title}">
            <div class="book-info">
              <p><strong>${b.title}</strong></p>
              <p class="price">${b.price} ₸</p>
              <p class="status">📦 ${order.status}</p>
            </div>
          </div>
`).join("")}

      </div>
    `;
    ordersContainer.appendChild(block);
  });
});

