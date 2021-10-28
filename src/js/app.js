import "../scss/style.scss";
window.onload = function () {
  // обработка состояний кастомного select
  document.querySelectorAll(".select__current-value").forEach((item) => {
    item.addEventListener("click", function () {
      const $btn = this;
      $btn.classList.toggle("active");
      if (this.classList.contains("active")) {
        setTimeout(() => {
          document.addEventListener("click", function checkIsClickOutside(e) {
            const $parent = $btn.closest(".select");
            const $clickedEl = e.target.closest(".select");
            if (!$clickedEl && !$parent.isSameNode($clickedEl)) {
              $btn.classList.remove("active");
              document.removeEventListener("click", checkIsClickOutside);
            }
          });
        });
      }
    });
  });

  // копируем содержимое блока в память
  document.querySelectorAll(".link__copy-btn").forEach((item) => {
    item.addEventListener("click", function () {
      const $parent = this.closest(".link");
      const value = $parent.querySelector(".link__text").innerText;
      navigator.clipboard.writeText(value);
    });
  });
};
