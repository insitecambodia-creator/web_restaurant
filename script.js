(function () {
  "use strict";

  // ---- Central config -----------------------------------------------------
  // Edit these two lines to point every CTA at the real Telegram handle.
  var CONFIG = {
    telegramHandle: "PhnomPenhinfo",
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

  // ---- Scroll-reveal entry motion --------------------------------------
  // Adds .in-view the first time a .reveal/.reveal-scale element crosses
  // into the viewport, then stops watching it. Falls back to showing
  // everything immediately if IntersectionObserver isn't available, and
  // is skipped entirely for prefers-reduced-motion (CSS already shows
  // those elements at full opacity in that case, so this would be a
  // no-op either way).
  function initScrollReveal() {
    var targets = document.querySelectorAll(".reveal, .reveal-scale");
    if (!targets.length) return;

    var prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      targets.forEach(function (el) {
        el.classList.add("in-view");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireTelegramLinks();
    initScrollReveal();
  });
})();
