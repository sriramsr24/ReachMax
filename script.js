(function () {
  "use strict";

  var header = document.querySelector(".header");
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  var menuLinks = document.querySelectorAll(".nav__link");
  var sectionLinks = document.querySelectorAll(".nav__link[data-section]");
  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    document.body.classList.add("reduce-motion");
  }

  function closeMenu() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  function openMenu() {
    if (!nav || !toggle) return;
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  menuLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      closeMenu();
    });
  });

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener(
    "scroll",
    function () {
      if (!header) return;
      if (window.scrollY > 12) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    },
    { passive: true }
  );

  var sectionIds = ["home", "about", "services", "founder", "portfolio", "contact"];
  function updateActiveNav() {
    var scrollPos = window.scrollY + (header ? header.offsetHeight + 16 : 100);
    var current = sectionIds[0];
    for (var i = 0; i < sectionIds.length; i++) {
      var id = sectionIds[i];
      var el = document.getElementById(id);
      if (!el) continue;
      if (el.offsetTop <= scrollPos) {
        current = id;
      }
    }
    sectionLinks.forEach(function (link) {
      var sec = link.getAttribute("data-section");
      if (sec === current) {
        link.classList.add("is-active");
      } else {
        link.classList.remove("is-active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  function initReveal() {
    var reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      reveals.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  function heroEntrance() {
    var heroItems = document.querySelectorAll(".hero .hero-anim");
    if (!heroItems.length) return;
    if (prefersReduced) {
      heroItems.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    heroItems.forEach(function (el) {
      var d = parseInt(el.getAttribute("data-delay"), 10);
      if (isNaN(d)) d = 0;
      window.setTimeout(function () {
        el.classList.add("is-visible");
      }, 120 + d * 140);
    });
  }

  initReveal();
  heroEntrance();

  var filterButtons = document.querySelectorAll(".filter-btn");
  var portfolioItems = document.querySelectorAll(".portfolio-item");

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.getAttribute("data-filter") || "all";
      filterButtons.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      portfolioItems.forEach(function (item) {
        var cat = item.getAttribute("data-category") || "";
        if (filter === "all" || cat === filter) {
          item.classList.remove("is-hidden");
        } else {
          item.classList.add("is-hidden");
        }
      });
    });
  });

  var form = document.getElementById("contact-form");
  var formStatus = document.getElementById("form-status");

  if (form && formStatus) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      formStatus.classList.remove("is-error", "is-success");

      var name = form.querySelector("#contact-name");
      var email = form.querySelector("#contact-email");
      var message = form.querySelector("#contact-message");

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        formStatus.textContent = "Please fill in all fields.";
        formStatus.classList.add("is-error");
        return;
      }

      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      if (!emailOk) {
        formStatus.textContent = "Please enter a valid email address.";
        formStatus.classList.add("is-error");
        return;
      }

      var submitBtn = form.querySelector(".form__submit");
      if (submitBtn) submitBtn.classList.add("is-sent");

      formStatus.textContent = "Thanks — we’ll get back to you shortly.";
      formStatus.classList.add("is-success");
      form.reset();

      window.setTimeout(function () {
        if (submitBtn) submitBtn.classList.remove("is-sent");
      }, 2500);
    });
  }
})();
