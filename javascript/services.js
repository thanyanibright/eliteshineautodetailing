/* ============================================================
   services.js
   Elite Shine Auto Detailing — Part 3
   Adds two pieces of functionality to service.html:

   1. DYNAMIC SEARCH / FILTER
      A search box + category buttons let the visitor narrow
      down the four service blocks without reloading the page.
      Filtering checks each <section class="service-block">'s
      data-keywords attribute against whatever the visitor types.

   2. "VIEW FULL DETAILS" MODAL
      Each service has a hidden <template> with extra detail
      (duration, best-for, add-ons). Clicking "View Full Details"
      copies that template's content into a re-usable modal.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  initServiceFilter();
  initServiceModal();
});

/* ---------------------------------------------------------- */
/* 1. SEARCH / FILTER                                          */
/* ---------------------------------------------------------- */
function initServiceFilter() {
  var searchInput = document.getElementById("service-search");
  var filterButtons = document.querySelectorAll(".filter-btn");
  var serviceBlocks = document.querySelectorAll(".service-block");
  var noResultsMsg = document.getElementById("no-results-msg");

  if (!searchInput || serviceBlocks.length === 0) return;

  var activeCategory = "all";

  function applyFilters() {
    var query = searchInput.value.trim().toLowerCase();
    var visibleCount = 0;

    serviceBlocks.forEach(function (block) {
      var keywords = (block.dataset.keywords || "").toLowerCase();
      var category = block.dataset.category || "";

      var matchesCategory = (activeCategory === "all" || category === activeCategory);
      var matchesSearch = (query === "" || keywords.indexOf(query) !== -1);

      if (matchesCategory && matchesSearch) {
        block.style.display = "";
        visibleCount++;
      } else {
        block.style.display = "none";
      }
    });

    if (noResultsMsg) {
      noResultsMsg.style.display = (visibleCount === 0) ? "block" : "none";
    }
  }

  // Re-filter every time the visitor types
  searchInput.addEventListener("input", applyFilters);

  // Re-filter whenever a category button is clicked
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      activeCategory = btn.dataset.category;
      applyFilters();
    });
  });
}

/* ---------------------------------------------------------- */
/* 2. SERVICE DETAILS MODAL                                    */
/* ---------------------------------------------------------- */
function initServiceModal() {
  var detailButtons = document.querySelectorAll(".view-details-btn");
  if (detailButtons.length === 0) return;

  // Build the modal shell once and append it to the page
  var modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML =
    '<div class="modal-box" role="dialog" aria-modal="true">' +
      '<button class="modal-close" aria-label="Close details">&times;</button>' +
      '<div class="modal-content"></div>' +
    '</div>';
  document.body.appendChild(modal);

  var modalContent = modal.querySelector(".modal-content");

  detailButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var templateId = btn.dataset.template;
      var template = document.getElementById(templateId);
      if (!template) return;

      // Clone the hidden template's content into the visible modal
      modalContent.innerHTML = "";
      modalContent.appendChild(template.content.cloneNode(true));
      modal.classList.add("open");
      document.body.classList.add("lightbox-locked");
    });
  });

  function closeModal() {
    modal.classList.remove("open");
    document.body.classList.remove("lightbox-locked");
  }

  modal.querySelector(".modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
}