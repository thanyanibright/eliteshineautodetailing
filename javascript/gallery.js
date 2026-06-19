/* ============================================================
   gallery.js
   Elite Shine Auto Detailing — Part 3
   Builds a simple, dependency-free LIGHTBOX for the gallery
   images in the "Our Work" section of index.html.

   How it works:
   - Every <img> inside .gallery-wrap becomes clickable
   - Clicking an image opens a full-screen overlay with a
     larger version of that image
   - Previous / Next arrows let the visitor browse the rest of
     the gallery without closing the lightbox
   - Esc key, the close (×) button, or clicking the dark
     background all close the lightbox
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  var galleryImages = document.querySelectorAll(".gallery-wrap img");

  // If this page has no gallery, do nothing.
  if (galleryImages.length === 0) {
    return;
  }

  var currentIndex = 0;

  // Build the lightbox markup once and add it to the page.
  var overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.innerHTML =
    '<button class="lightbox-close" aria-label="Close gallery">&times;</button>' +
    '<button class="lightbox-prev" aria-label="Previous image">&#10094;</button>' +
    '<figure class="lightbox-figure">' +
      '<img class="lightbox-img" src="" alt="">' +
      '<figcaption class="lightbox-caption"></figcaption>' +
    '</figure>' +
    '<button class="lightbox-next" aria-label="Next image">&#10095;</button>';
  document.body.appendChild(overlay);

  var lightboxImg = overlay.querySelector(".lightbox-img");
  var lightboxCaption = overlay.querySelector(".lightbox-caption");

  // Make every gallery image clickable
  galleryImages.forEach(function (img, index) {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", function () {
      currentIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    var img = galleryImages[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.alt; // re-uses the alt text as a caption
    overlay.classList.add("open");
    document.body.classList.add("lightbox-locked"); // stops background scrolling
  }

  function closeLightbox() {
    overlay.classList.remove("open");
    document.body.classList.remove("lightbox-locked");
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    openLightbox();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    openLightbox();
  }

  overlay.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  overlay.querySelector(".lightbox-next").addEventListener("click", showNext);
  overlay.querySelector(".lightbox-prev").addEventListener("click", showPrev);

  // Click on the dark background (not the image itself) also closes it
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      closeLightbox();
    }
  });

  // Keyboard support: Esc to close, arrow keys to browse
  document.addEventListener("keydown", function (e) {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });
});