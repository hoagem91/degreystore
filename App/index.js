//step 1: get DOM
let nextDom = document.getElementById("next");
let prevDom = document.getElementById("prev");

let carouselDom = document.querySelector(".carousel");
let SliderDom = carouselDom.querySelector(".carousel .list");
let thumbnailBorderDom = document.querySelector(".carousel .thumbnail");
let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll(".item");

thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
let timeRunning = 3000;
let timeAutoNext = 7000;

nextDom.onclick = function () {
  showSlider("next");
};

prevDom.onclick = function () {
  showSlider("prev");
};
let runTimeOut;
let runNextAuto = setTimeout(() => {
  next.click();
}, timeAutoNext);
function showSlider(type) {
  let SliderItemsDom = SliderDom.querySelectorAll(".carousel .list .item");
  let thumbnailItemsDom = document.querySelectorAll(
    ".carousel .thumbnail .item"
  );

  if (type === "next") {
    SliderDom.appendChild(SliderItemsDom[0]);
    thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
    carouselDom.classList.add("next");
  } else {
    SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
    thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
    carouselDom.classList.add("prev");
  }
  clearTimeout(runTimeOut);
  runTimeOut = setTimeout(() => {
    carouselDom.classList.remove("next");
    carouselDom.classList.remove("prev");
  }, timeRunning);

  clearTimeout(runNextAuto);
  runNextAuto = setTimeout(() => {
    next.click();
  }, timeAutoNext);
}

// Product Category Interactions
document.addEventListener("DOMContentLoaded", function () {
  const productItems = document.querySelectorAll(".product-item");

  productItems.forEach((item) => {
    // Thêm hiệu ứng hover
    item.addEventListener("mouseenter", function () {
      const arrow = this.querySelector(".arrow-link");
      arrow.style.transform = "translateX(5px)";
    });

    item.addEventListener("mouseleave", function () {
      const arrow = this.querySelector(".arrow-link");
      arrow.style.transform = "translateX(0)";
    });

    // Xử lý click vào sản phẩm
    item.addEventListener("click", function (e) {
      if (!e.target.classList.contains("arrow-link")) {
        const link = this.querySelector(".arrow-link");
        if (link) {
          link.click();
        }
      }
    });
  });
});
