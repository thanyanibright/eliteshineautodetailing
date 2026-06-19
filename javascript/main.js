/* ============================================================
   main.js
   Elite Shine Auto Detailing — Part 3
   Shared, site-wide behaviour used on EVERY page:
     1. Highlights the current page in the navigation menu
     2. Reveals sections with a soft fade/slide-in as the user
        scrolls down the page (CSS + JS animation, as required
        by the "Interactive Elements" / "Animations" brief)
     3. Adds a small "Back to top" button once the user scrolls
        down the page
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1. Highlight current page in the nav ---------- */
  highlightActiveNavLink();

  /* ---------- 2. Scroll-reveal animation ---------- */
  initScrollReveal();

  /* ---------- 3. Back-to-top button ---------- */
  initBackToTop();

});

/**
 * Adds a class of "active" to whichever nav link matches the
 * current page, so the user always knows where they are.
 */
function highlightActiveNavLink() {
  // Get the current page's filename, e.g. "service.html"
  var currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "") {
    currentPage = "index.html";
  }

  var navLinks = document.querySelectorAll("nav a");
  navLinks.forEach(function (link) {
    var linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active-link");
    }
  });
}

/**
 * Uses the IntersectionObserver API to add a "visible" class to
 * each <section> as it scrolls into view. The actual fade/slide
 * is handled in CSS (see css/interactive.css -> .fade-in / .visible),
 * this script just decides WHEN to trigger it.
 */
function initScrollReveal() {
  var sections = document.querySelectorAll("section, .step-box, .why-card, .testi-card");

  // Give every section the starting "fade-in" state
  sections.forEach(function (el) {
    el.classList.add("fade-in");
  });

  // If the browser doesn't support IntersectionObserver, just show everything
  if (!("IntersectionObserver" in window)) {
    sections.forEach(function (el) {
      el.classList.add("visible");
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target); // only animate once
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(function (el) {
    observer.observe(el);
  });
}

/**
 * Shows a small round "back to top" button after the user has
 * scrolled down 400px, and smooth-scrolls back to the top of the
 * page when clicked.
 */
function initBackToTop() {
  var btn = document.createElement("button");
  btn.id = "back-to-top";
  btn.type = "button";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = "&uarr;";
  document.body.appendChild(btn);

  window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}