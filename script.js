(function () {
  "use strict";

  // ---- Central config -----------------------------------------------------
  // Edit these lines to point the site at your real handle, demo, and lead
  // form endpoint.
  var CONFIG = {
    telegramHandle: "PhnomPenhinfo",
    demoUrl: "", // TODO: paste the live demo restaurant site URL
    // Formspree form ID (the part after /f/ in the endpoint Formspree
    // gives you, e.g. "mzzevorj" from https://formspree.io/f/mzzevorj).
    // See README for setup. Leave blank to disable the form's ability to
    // actually submit (it'll show a friendly error pointing people at
    // Telegram instead).
    formspreeId: ""
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

  // ---- Lead form -------------------------------------------------------
  // Submits to Formspree (https://formspree.io/f/<CONFIG.formspreeId>) as
  // multipart form data with an Accept: application/json header, which
  // tells Formspree to reply with JSON instead of redirecting the page —
  // see https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax.
  // Formspree has its own built-in honeypot convention: a hidden field
  // named "_gotcha" that it silently discards submissions from server-side.
  // We also short-circuit client-side when it's filled in, so an obvious
  // bot never even triggers the network request.
  function initLeadForm() {
    var form = document.querySelector("[data-lead-form]");
    if (!form) return;

    var status = form.querySelector("[data-lead-status]");
    var submitBtn = form.querySelector(".lead-submit");
    var endpoint = CONFIG.formspreeId
      ? "https://formspree.io/f/" + CONFIG.formspreeId
      : "";

    if (endpoint) {
      form.setAttribute("action", endpoint);
    }

    function setStatus(message, state) {
      status.textContent = message;
      if (state) {
        status.setAttribute("data-state", state);
      } else {
        status.removeAttribute("data-state");
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var honeypot = form.elements["_gotcha"] ? form.elements["_gotcha"].value : "";
      var ownerName = form.elements.ownerName.value.trim();
      var contact = form.elements.contact.value.trim();

      if (!ownerName || !contact) {
        setStatus("Please fill in your name and a phone or Telegram contact.", "error");
        return;
      }

      if (honeypot) {
        // Looks like a bot filled the honeypot; pretend it worked and stop.
        setStatus("Thanks! I'll get back to you on Telegram soon.", "success");
        form.reset();
        return;
      }

      if (!endpoint) {
        setStatus("This form isn't connected yet, please message me on Telegram instead.", "error");
        return;
      }

      submitBtn.disabled = true;
      setStatus("Sending...", null);

      fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (response.ok) {
            setStatus("Thanks! I'll get back to you on Telegram soon.", "success");
            form.reset();
            return;
          }
          return response.json().catch(function () {
            return null;
          }).then(function (data) {
            var message =
              data && data.errors && data.errors.length
                ? data.errors.map(function (e) { return e.message; }).join(", ")
                : "Something went wrong, please message me on Telegram instead.";
            setStatus(message, "error");
          });
        })
        .catch(function () {
          setStatus("Something went wrong, please message me on Telegram instead.", "error");
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireTelegramLinks();
    initScrollReveal();
    initLeadForm();
  });
})();
