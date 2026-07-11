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

  // ---- Translations -----------------------------------------------------
  // Fill in the "km" column with real Khmer copy. Keys mirror the English
  // defaults already sitting in index.html, so nothing breaks if a key is
  // left blank — the English text just stays put.
  var translations = {
    en: {
      "header.cta": "Message on Telegram",
      "hero.eyebrow": "Restaurant websites in Cambodia",
      "hero.h1.pre": "Tourists are searching for you on",
      "hero.h1.accent": "Google.",
      "hero.h1.post": "Can they find you?",
      "hero.sub": "I build fast, mobile-first websites for restaurants in Cambodia — so tourists find you when they search, not just when they scroll Facebook.",
      "hero.cta": "Message me on Telegram",
      "hero.cta2": "See pricing",
      "hero.trust1": "Fast on Cambodian mobile data",
      "hero.trust2": "English + Khmer",
      "hero.trust3": "Set up on Google Maps",

      "problem.eyebrow": "The problem",
      "problem.title": "A Facebook page isn't enough.",
      "problem.sub": "Facebook is where locals already know you. Google is where tourists find you for the first time.",
      "problem.p1.h": "Tourists search Google Maps",
      "problem.p1.p": "Before they even arrive, most travelers already searched “restaurants near me” on Google — not Facebook.",
      "problem.p2.h": "Facebook pages rank poorly",
      "problem.p2.p": "Google rarely shows Facebook pages on the first page of results. Your menu and hours stay invisible to search.",
      "problem.p3.h": "Competitors with sites win",
      "problem.p3.p": "When two restaurants show up and only one has a real website, tourists trust — and choose — the one they can find.",

      "benefits.eyebrow": "What you get",
      "benefits.title": "Everything a small restaurant actually needs",
      "benefits.sub": "No bloated features you'll never use — just what gets tourists in the door.",
      "benefits.b1.h": "Found on Google",
      "benefits.b1.p": "Built and optimized so search engines can actually find and rank your restaurant.",
      "benefits.b2.h": "Looks perfect on phones",
      "benefits.b2.p": "Designed mobile-first, since almost every visitor is holding a phone, not sitting at a laptop.",
      "benefits.b3.h": "Loads fast on local internet",
      "benefits.b3.p": "Optimized to load quickly even on slower mobile data — in a tuk-tuk, at the beach, anywhere.",
      "benefits.b4.h": "Menu & hours always current",
      "benefits.b4.p": "Two free content updates a year keep your menu, hours, and prices accurate.",
      "benefits.b5.h": "Google Maps presence",
      "benefits.b5.p": "I help set up your Google Business Profile so you show up on the map, not just the web.",
      "benefits.b6.h": "Works in English + Khmer",
      "benefits.b6.p": "One site that speaks to tourists and to your Khmer-speaking staff and regulars.",

      "example.eyebrow": "See it live",
      "example.title": "A real example, not just a mockup",
      "example.sub": "Here's what a finished site looks like. Click through and try it on your own phone.",
      "example.note": "Demo link coming soon.",
      "example.link": " Visit the live demo →",

      "pricing.eyebrow": "Simple pricing",
      "pricing.title": "One price. No surprises.",
      "pricing.sub": "Billed yearly. Pay by ABA or Bakong QR — no credit card needed.",
      "pricing.badge": "Most popular",
      "pricing.peryear": " / year",
      "pricing.cta": "Message me on Telegram",
      "pricing.note": "Pay by ABA or Bakong QR. Billed yearly, no setup fees.",
      "pricing.t1.name": "Subdomain Site",
      "pricing.t1.desc": "Live at yourname.restaurant-cambodia.com",
      "pricing.t2.name": "Your Own Domain",
      "pricing.t2.desc": "Everything above, live on yourname.com",
      "pricing.t3.name": "Website + Reports",
      "pricing.t3.desc": "Your own domain, plus monthly insight",
      "pricing.f.mobile": "Mobile-first design",
      "pricing.f.gbp": "Google Business Profile setup help",
      "pricing.f.updates": "2 free content updates / year",
      "pricing.f.bilingual": "English + Khmer ready",
      "pricing.f.domain": "Your own .com domain",
      "pricing.f.report": "Monthly performance report",

      "how.eyebrow": "How it works",
      "how.title": "Three steps. A few days.",
      "how.s1.h": "Message me on Telegram",
      "how.s1.p": "Tell me about your restaurant — name, location, and a few photos. Takes about 5 minutes.",
      "how.s2.h": "I build your site in a few days",
      "how.s2.p": "You review it, ask for tweaks, and approve — no meetings, no back-and-forth calls.",
      "how.s3.h": "Tourists find you on Google",
      "how.s3.p": "Your site goes live, connected to Google Maps, ready for search traffic.",

      "about.eyebrow": "Who's behind this",
      "about.title": "Hi, I'm [Your Name].",
      "about.p1": "I'm a web developer based in Cambodia. I kept watching great restaurants stay invisible to tourists because their only presence online was a Facebook page — so I started building simple, fast websites just for restaurants, at a price that makes sense for a small business.",
      "about.p2": "No agency, no contracts, no jargon. If something breaks or needs to change, you message me directly on Telegram, and I fix it.",
      "about.signature": "— [Your Name], founder",

      "faq.eyebrow": "Questions",
      "faq.title": "Frequently asked questions",
      "faq.q1.q": "I already have Facebook, why do I need this?",
      "faq.q1.a": "Facebook works for people who already know you. Google is how tourists — who've never heard of you — find you while planning where to eat. A website makes you searchable there.",
      "faq.q2.q": "Can I update my menu?",
      "faq.q2.a": "Yes — you get two free content updates a year for your menu, hours, and photos. Need more updates? Just message me; they're quick and affordable.",
      "faq.q3.q": "Do I own the website?",
      "faq.q3.a": "It's built for your restaurant and stays live as long as your plan is active. If you'd like to move it elsewhere later, we can talk through that too.",
      "faq.q4.q": "What about my own .com domain?",
      "faq.q4.a": "Optional, for +$50/year. Your site can launch on a free subdomain (yourname.restaurant-cambodia.com) first, and you can add your own domain any time.",
      "faq.q5.q": "How do I pay?",
      "faq.q5.a": "By ABA or Bakong QR, billed yearly. No credit card needed.",

      "ctaband.title": "Ready to be found on Google?",
      "ctaband.sub": "Message me on Telegram and tell me about your restaurant — I'll reply the same day.",

      "footer.fine": "Built for restaurants, by a restaurant-goer."
    },

    // TODO: fill in real Khmer translations for every key below.
    // Leaving a value as "" keeps the English text on screen for that key.
    km: {
      "header.cta": "",
      "hero.eyebrow": "",
      "hero.h1.pre": "",
      "hero.h1.accent": "",
      "hero.h1.post": "",
      "hero.sub": "",
      "hero.cta": "",
      "hero.cta2": "",
      "hero.trust1": "",
      "hero.trust2": "",
      "hero.trust3": "",

      "problem.eyebrow": "",
      "problem.title": "",
      "problem.sub": "",
      "problem.p1.h": "",
      "problem.p1.p": "",
      "problem.p2.h": "",
      "problem.p2.p": "",
      "problem.p3.h": "",
      "problem.p3.p": "",

      "benefits.eyebrow": "",
      "benefits.title": "",
      "benefits.sub": "",
      "benefits.b1.h": "",
      "benefits.b1.p": "",
      "benefits.b2.h": "",
      "benefits.b2.p": "",
      "benefits.b3.h": "",
      "benefits.b3.p": "",
      "benefits.b4.h": "",
      "benefits.b4.p": "",
      "benefits.b5.h": "",
      "benefits.b5.p": "",
      "benefits.b6.h": "",
      "benefits.b6.p": "",

      "example.eyebrow": "",
      "example.title": "",
      "example.sub": "",
      "example.note": "",
      "example.link": "",

      "pricing.eyebrow": "",
      "pricing.title": "",
      "pricing.sub": "",
      "pricing.badge": "",
      "pricing.peryear": "",
      "pricing.cta": "",
      "pricing.note": "",
      "pricing.t1.name": "",
      "pricing.t1.desc": "",
      "pricing.t2.name": "",
      "pricing.t2.desc": "",
      "pricing.t3.name": "",
      "pricing.t3.desc": "",
      "pricing.f.mobile": "",
      "pricing.f.gbp": "",
      "pricing.f.updates": "",
      "pricing.f.bilingual": "",
      "pricing.f.domain": "",
      "pricing.f.report": "",

      "how.eyebrow": "",
      "how.title": "",
      "how.s1.h": "",
      "how.s1.p": "",
      "how.s2.h": "",
      "how.s2.p": "",
      "how.s3.h": "",
      "how.s3.p": "",

      "about.eyebrow": "",
      "about.title": "",
      "about.p1": "",
      "about.p2": "",
      "about.signature": "",

      "faq.eyebrow": "",
      "faq.title": "",
      "faq.q1.q": "",
      "faq.q1.a": "",
      "faq.q2.q": "",
      "faq.q2.a": "",
      "faq.q3.q": "",
      "faq.q3.a": "",
      "faq.q4.q": "",
      "faq.q4.a": "",
      "faq.q5.q": "",
      "faq.q5.a": "",

      "ctaband.title": "",
      "ctaband.sub": "",

      "footer.fine": ""
    }
  };

  var META = {
    en: {
      title: "Websites for Restaurants in Cambodia — Get Found on Google",
      description: "Fast, mobile-first websites for restaurants in Cambodia. Get found on Google Maps and search — not just Facebook. From $144/year. Message on Telegram."
    },
    km: {
      title: "",
      description: ""
    }
  };

  var STORAGE_KEY = "restaurant-cambodia-lang";
  var KHMER_FONT_HREF =
    "https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;500;600;700&display=swap";
  var khmerFontLoaded = false;

  function loadKhmerFont() {
    if (khmerFontLoaded) return;
    khmerFontLoaded = true;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = KHMER_FONT_HREF;
    document.head.appendChild(link);
  }

  function applyLanguage(lang) {
    var dict = translations[lang] || {};
    var fallback = translations.en;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var value = dict[key];
      if (!value) value = fallback[key];
      if (value) el.textContent = value;
    });

    var meta = META[lang] && META[lang].title ? META[lang] : META.en;
    document.title = meta.title;
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", meta.description);

    document.documentElement.lang = lang;
    document.body.classList.toggle("lang-km", lang === "km");

    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang-btn") === lang;
      btn.setAttribute("aria-pressed", String(isActive));
    });

    if (lang === "km") loadKhmerFont();

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* localStorage unavailable (private mode etc.) — language just won't persist */
    }
  }

  function initLanguage() {
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }
    var lang = saved === "km" ? "km" : "en";
    applyLanguage(lang);

    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLanguage(btn.getAttribute("data-lang-btn"));
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireTelegramLinks();
    initLanguage();
  });
})();
