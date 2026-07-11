(function () {
  "use strict";

  // ---- Central config -----------------------------------------------------
  // Edit these two lines to point every CTA at the real Telegram handle.
  var CONFIG = {
    telegramHandle: "restaurant_cambodia", // TODO: replace with the real handle
    demoUrl: "" // TODO: paste the live demo restaurant site URL
  };

  // ---- Telegram links -------------------------------------------------------
  function wireTelegramLinks() {
    var url = "https://t.me/" + CONFIG.telegramHandle;
    document.querySelectorAll("[data-telegram-cta]").forEach(function (el) {
      el.setAttribute("href", url);
    });
    if (CONFIG.demoUrl) {
      document.querySelectorAll("[data-demo-link]").forEach(function (el) {
        el.setAttribute("href", CONFIG.demoUrl);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", wireTelegramLinks);
})();
