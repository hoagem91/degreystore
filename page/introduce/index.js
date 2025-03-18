var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

const tabs = $$(".tab-item");
const line = $(".tabs .line");
const tabActive = $(".tab-item.current");
line.style.left = tabActive.offsetLeft + "px";
line.style.width = tabActive.offsetWidth + "px";

tabs.forEach((tab) => {
  tab.onclick = function () {
    $(".tab-item.current").classList.remove("current");
  };
});
