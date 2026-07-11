(function () {
  "use strict";

  // ---- Central config -----------------------------------------------------
  // Edit these lines to point the site at your real handle, demo, and lead
  // form endpoint.
  var CONFIG = {
    telegramHandle: "PhnomPenhinfo",
    demoUrl: "", // TODO: paste the live demo restaurant site URL
    // n8n production webhook URL for the lead form below (see
    // n8n-lead-form-workflow.json / README for setup). Leave blank to
    // disable the form's ability to actually submit (it'll show a
    // friendly error pointing people at Telegram instead).
    formWebhookUrl: ""
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
  // Posts JSON to the n8n webhook in CONFIG.formWebhookUrl. Includes a
  // honeypot field ("website") that real visitors never see or fill in;
  // if it's filled in, the request is almost certainly a bot, so we skip
  // the network call entirely and just show the normal success message.
  // The n8n workflow re-checks the honeypot server-side too, since a bot
  // posting straight to the webhook URL would never run this JS at all.
  function initLeadForm() {
    var form = document.querySelector("[data-lead-form]");
    if (!form) return;

    var status = form.querySelector("[data-lead-status]");
    var submitBtn = form.querySelector(".lead-submit");

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

      var honeypot = form.elements.website ? form.elements.website.value : "";
      var payload = {
        restaurantName: form.elements.restaurantName.value.trim(),
        ownerName: form.elements.ownerName.value.trim(),
        contact: form.elements.contact.value.trim(),
        message: form.elements.message.value.trim(),
        website: honeypot
      };

      if (!payload.ownerName || !payload.contact) {
        setStatus("Please fill in your name and a phone or Telegram contact.", "error");
        return;
      }

      if (honeypot) {
        // Looks like a bot filled the honeypot; pretend it worked and stop.
        setStatus("Thanks! I'll get back to you on Telegram soon.", "success");
        form.reset();
        return;
      }

      if (!CONFIG.formWebhookUrl) {
        setStatus("This form isn't connected yet, please message me on Telegram instead.", "error");
        return;
      }

      submitBtn.disabled = true;
      setStatus("Sending...", null);

      fetch(CONFIG.formWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Request failed");
          return response.json().catch(function () {
            return {};
          });
        })
        .then(function (data) {
          if (data && data.success === false) {
            setStatus(
              data.message || "Please fill in your name and a phone or Telegram contact.",
              "error"
            );
            return;
          }
          setStatus("Thanks! I'll get back to you on Telegram soon.", "success");
          form.reset();
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
