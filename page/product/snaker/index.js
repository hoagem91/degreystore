// Khởi tạo giỏ hàng từ localStorage hoặc mảng rỗng
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Cập nhật cart-notice ngay khi trang được tải
document.addEventListener("DOMContentLoaded", () => {
  updateCartNotice();
  updateCartUI();
});

// Xử lý hiển thị/ẩn giỏ hàng
const cartIcon = document.querySelector(".cart-icon");
const cartContent = document.querySelector(".cart-content");

cartIcon.addEventListener("click", () => {
  cartContent.classList.toggle("show");
});

// Đóng giỏ hàng khi click ra ngoài
document.addEventListener("click", (e) => {
  if (
    !cartIcon.contains(e.target) &&
    !cartContent.contains(e.target) &&
    !e.target.closest(".delete-item")
  ) {
    cartContent.classList.remove("show");
  }
});

// Xử lý thêm vào giỏ hàng
const addToCartButtons = document.querySelectorAll(".cart-shopping");
addToCartButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const product = button.closest(
      ".product, .product-one, .product-two, .product-three, .product-four, .product-five, .product-six"
    );
    const productInfo = {
      id: Date.now(),
      name: product.querySelector("h3").textContent,
      price: product.querySelector(".price-sale").textContent,
      image: product.querySelector(".main-img").src,
    };

    addToCart(productInfo);
    updateCartUI();
  });
});

function addToCart(product) {
  cart.push(product);
  updateCartNotice();
  // Lưu giỏ hàng vào localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartNotice() {
  const cartNotice = document.querySelector(".cart-notice");
  cartNotice.textContent = cart.length;
}

function updateCartUI() {
  const cartList = document.querySelector(".cart-list");
  const totalPrice = document.querySelector(".total-price");

  // Lưu trạng thái hiển thị của giỏ hàng
  const isCartVisible = cartContent.classList.contains("show");

  cartList.innerHTML = "";

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${item.price}</p>
      </div>
      <button class="delete-item" data-id="${item.id}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
        </svg>
      </button>
    `;
    cartList.appendChild(cartItem);
  });

  // Thêm event listener cho nút xóa
  const deleteButtons = document.querySelectorAll(".delete-item");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.id;
      removeFromCart(itemId);
      updateCartUI();
    });
  });

  // Tính tổng tiền
  const total = cart.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/[^\d]/g, ""));
    return sum + price;
  }, 0);

  totalPrice.textContent = total.toLocaleString("vi-VN") + "₫";

  // Giữ nguyên trạng thái hiển thị của giỏ hàng nếu đang mở
  if (isCartVisible) {
    cartContent.classList.add("show");
  }
}

// Thêm hàm xóa sản phẩm
function removeFromCart(itemId) {
  cart = cart.filter((item) => item.id != itemId);
  updateCartNotice();
  // Cập nhật localStorage sau khi xóa sản phẩm
  localStorage.setItem("cart", JSON.stringify(cart));
}
