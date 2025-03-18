document.addEventListener("DOMContentLoaded", function () {
  // Lấy dữ liệu giỏ hàng từ localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsContainer = document.querySelector(".cart-items");
  const subtotalElement = document.querySelector(".subtotal .amount");
  const totalElement = document.querySelector(".total .amount");
  const checkoutForm = document.querySelector(".checkout-form");
  const placeOrderBtn = document.querySelector(".place-order-btn");

  // Hiển thị sản phẩm trong giỏ hàng
  function displayCartItems() {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Không có sản phẩm trong giỏ hàng</p>";
      return;
    }

    let cartHTML = "";
    cart.forEach((item) => {
      const quantity = item.quantity || 1;
      const price =
        parseFloat(item.price.toString().replace(/[đ₫,]/g, "")) || 0;
      const itemTotal = price * quantity;
      cartHTML += `
                <div class="cart-item">
                    <div class="item-details">
                        <img src="${item.image}" alt="${
        item.name
      }" style="width: 60px; height: 60px; object-fit: cover;">
                        <div>
                            <h4>${item.name}</h4>
                            <p>Số lượng: ${quantity}</p>
                        </div>
                    </div>
                    <div class="item-price">${formatPrice(itemTotal)}₫</div>
                </div>
            `;
    });
    cartItemsContainer.innerHTML = cartHTML;
    updateTotals();
  }

  // Cập nhật tổng tiền
  function updateTotals() {
    const subtotal = cart.reduce((total, item) => {
      const quantity = item.quantity || 1;
      // Chuyển đổi price thành số, loại bỏ ký tự đ và dấu phẩy
      const price =
        parseFloat(item.price.toString().replace(/[đ₫,]/g, "")) || 0;
      return total + price * quantity;
    }, 0);

    const shippingFee = cart.length > 0 ? 30000 : 0;
    const total = subtotal + shippingFee;

    subtotalElement.textContent = `${formatPrice(subtotal)}₫`;
    totalElement.textContent = `${formatPrice(total)}₫`;
  }

  // Cải thiện hàm formatPrice để xử lý các trường hợp đặc biệt
  function formatPrice(price) {
    if (isNaN(price) || price === null) return "0";
    return Math.round(price)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Thêm hàm để validate số tiền
  function validateTotal() {
    const total = cart.reduce((total, item) => {
      const quantity = item.quantity || 1;
      const price =
        parseFloat(item.price.toString().replace(/[đ₫,]/g, "")) || 0;
      return total + price * quantity;
    }, 0);

    if (total <= 0) {
      alert("Giỏ hàng của bạn đang trống");
      return false;
    }
    return true;
  }

  // Cập nhật hàm validateForm
  function validateForm() {
    let isValid = true;
    clearErrors(); // Xóa tất cả thông báo lỗi cũ

    const fullname = document.getElementById("fullname").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const paymentMethod = document.querySelector(
      'input[name="payment"]:checked'
    );

    // Validate fullname
    if (!fullname) {
      showError("fullname", "Vui lòng nhập họ tên");
      isValid = false;
    }

    // Validate phone
    if (!phone) {
      showError("phone", "Vui lòng nhập số điện thoại");
      isValid = false;
    } else {
      const phonePattern = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!phonePattern.test(phone)) {
        showError("phone", "Số điện thoại không hợp lệ");
        isValid = false;
      }
    }

    // Validate email
    if (!email) {
      showError("email", "Vui lòng nhập email");
      isValid = false;
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showError("email", "Email không hợp lệ");
        isValid = false;
      }
    }

    // Validate address
    if (!address) {
      showError("address", "Vui lòng nhập địa chỉ");
      isValid = false;
    }

    // Validate payment method
    if (!paymentMethod) {
      showError("payment", "Vui lòng chọn phương thức thanh toán");
      isValid = false;
    }

    return isValid;
  }

  function showError(fieldId, message) {
    if (fieldId === "payment") {
      // Xử lý đặc biệt cho radio buttons
      const paymentContainer = document.querySelector(".payment-methods");
      if (paymentContainer) {
        const existingError = document.getElementById("payment-error");
        if (existingError) {
          existingError.textContent = message;
        } else {
          const errorDiv = document.createElement("div");
          errorDiv.id = "payment-error";
          errorDiv.className = "error-message";
          errorDiv.textContent = message;
          errorDiv.style.color = "#dc3545";
          errorDiv.style.fontSize = "14px";
          errorDiv.style.marginTop = "5px";
          paymentContainer.appendChild(errorDiv);
        }
      }
      return;
    }

    // Xử lý cho các trường input thông thường
    const field = document.getElementById(fieldId);
    if (!field) return;

    const existingError = field.nextElementSibling;
    if (existingError && existingError.classList.contains("error-message")) {
      existingError.textContent = message;
    } else {
      const errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.textContent = message;
      errorDiv.style.color = "#dc3545";
      errorDiv.style.fontSize = "14px";
      errorDiv.style.marginTop = "5px";
      field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }
    field.style.borderColor = "#dc3545";
  }

  function clearErrors() {
    // Xóa tất cả thông báo lỗi
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach((error) => error.remove());

    // Reset style của các trường input
    const inputs = document.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.style.borderColor = "";
    });
  }

  // Thêm hàm để xóa lỗi cho một trường cụ thể
  function clearErrorForField(field) {
    const errorMessage = field.nextElementSibling;
    if (errorMessage && errorMessage.classList.contains("error-message")) {
      errorMessage.remove();
    }
    field.style.borderColor = "";
  }

  // Thêm event listeners cho các trường input
  function setupValidationListeners() {
    const inputs = document.querySelectorAll(
      'input[type="text"], input[type="email"], textarea'
    );
    inputs.forEach((input) => {
      input.addEventListener("input", function () {
        clearErrorForField(this);
      });
    });

    // Xử lý riêng cho radio buttons
    const radioButtons = document.querySelectorAll('input[name="payment"]');
    radioButtons.forEach((radio) => {
      radio.addEventListener("change", function () {
        const paymentError = document.querySelector("#payment-error");
        if (paymentError) {
          paymentError.remove();
        }
      });
    });
  }

  // Thêm hàm hiển thị modal da thanh toan
  function showNotification(success, orderData = null) {
    const modal = document.getElementById("notificationModal");
    const modalTitle = document.getElementById("modalTitle");
    const statusIcon = document.getElementById("statusIcon");
    const modalMessage = document.getElementById("modalMessage");
    const orderInfo = document.getElementById("orderInfo");
    const primaryButton = document.getElementById("primaryButton");
    const secondaryButton = document.getElementById("secondaryButton");

    if (success) {
      modalTitle.textContent = "Đặt hàng thành công!";
      statusIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
      statusIcon.className = "status-icon success";
      modalMessage.textContent = "Cảm ơn bạn đã đặt hàng tại Eleven Shop";

      // Hiển thị thông tin đơn hàng
      orderInfo.innerHTML = `
        <p>Mã đơn hàng: #${Math.random()
          .toString(36)
          .substr(2, 9)
          .toUpperCase()}</p>
        <p>Tổng tiền: ${orderData.total}₫</p>
        <p>Phương thức thanh toán: ${
          orderData.paymentMethod === "cod"
            ? "Thanh toán khi nhận hàng"
            : "Chuyển khoản ngân hàng"
        }</p>
      `;

      primaryButton.textContent = "Tiếp tục mua sắm";
      secondaryButton.textContent = "Xem đơn hàng";

      primaryButton.onclick = () => {
        window.location.href = "/page/product/clothes/product.html";
      };

      secondaryButton.onclick = () => {
        // Chuyển đến trang đơn hàng (nếu có)
        window.location.href = "/orders.html";
      };
    } else {
      modalTitle.textContent = "Đặt hàng thất bại!";
      statusIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
      statusIcon.className = "status-icon error";
      modalMessage.textContent =
        "Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng thử lại.";
      orderInfo.innerHTML = "";

      primaryButton.textContent = "Thử lại";
      secondaryButton.textContent = "Quay lại";

      primaryButton.onclick = () => {
        modal.style.display = "none";
      };

      secondaryButton.onclick = () => {
        window.location.href = "";
      };
    }

    modal.style.display = "flex";

    // Đóng modal khi click vào nút close
    const closeModal = document.querySelector(".close-modal");
    closeModal.onclick = () => {
      modal.style.display = "none";
    };

    // Đóng modal khi click bên ngoài
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }

  // Cập nhật hàm handlePlaceOrder
  async function handlePlaceOrder(e) {
    e.preventDefault();

    if (!validateForm() || !validateTotal()) {
      return;
    }

    const orderData = {
      id: `ORDER${Date.now()}${Math.floor(Math.random() * 1000)}`,
      customerInfo: {
        fullname: document.getElementById("fullname").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        address: document.getElementById("address").value.trim(),
        note: document.getElementById("note").value.trim(),
      },
      paymentMethod: document.querySelector('input[name="payment"]:checked')
        .value,
      items: cart.map((item) => ({
        ...item,
        price: parseFloat(item.price.toString().replace(/[đ₫,]/g, "")),
        quantity: item.quantity || 1,
      })),
      total: totalElement.textContent,
      status: "pending",
      orderDate: new Date().toISOString(),
    };

    try {
      // Disable nút đặt hàng để tránh submit nhiều lần
      placeOrderBtn.disabled = true;

      // Lưu đơn hàng vào localStorage
      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      orders.push(orderData);
      localStorage.setItem("orders", JSON.stringify(orders));

      // Xóa giỏ hàng
      localStorage.removeItem("cart");

      // Hiển thị thông báo thành công
      showNotification(true, orderData);
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      showNotification(false);
    } finally {
      placeOrderBtn.disabled = false;
    }
  }

  // Thêm event listeners
  placeOrderBtn.addEventListener("click", handlePlaceOrder);

  // Hiển thị sản phẩm khi trang được load
  displayCartItems();

  // Thêm vào cuối đoạn code khởi tạo (trong DOMContentLoaded)
  setupValidationListeners();
});
