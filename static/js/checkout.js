document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const address = document.getElementById("address").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const cardNumber = document.getElementById("card-number").value.trim();
    const expiry = document.getElementById("card-expiry").value.trim();
    const cvv = document.getElementById("card-cvv").value.trim();

    // === Валидация ===
    if (!address || !phone || !cardNumber || !expiry || !cvv) {
      alert("Пожалуйста, заполните все поля.");
      return;
    }

    if (!/^\d{16}$/.test(cardNumber)) {
      alert("Номер карты должен содержать ровно 16 цифр.");
      return;
    }

    if (!/^\d{3}$/.test(cvv)) {
      alert("CVV должен содержать ровно 3 цифры.");
      return;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      alert("Введите срок действия в формате MM/YY.");
      return;
    }

    if (!/^\+?\d{10,15}$/.test(phone.replace(/\D/g, ''))) {
      alert("Введите корректный номер телефона.");
      return;
    }

    // === Формирование заказа ===
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length === 0) {
      alert("Корзина пуста!");
      return;
    }

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      status: "В обработке",
      address,
      phone,
      items: cart
    };

    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    // === Очистка корзины ===
    localStorage.removeItem("cart");

    alert("Ваш заказ успешно оформлен!");
    window.location.href = "/orders/";
  });
});
