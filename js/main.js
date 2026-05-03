(function () {
  var y = document.getElementById("footer-year");
  if (y) y.textContent = String(new Date().getFullYear());

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && header && nav) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    function closeNav() {
      header.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }

    nav.querySelectorAll("a[href^='#']").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.querySelectorAll(".work-jump a[href^='#']").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  /* ----- Image lightbox ------------------------------------------------ */
  var work = document.getElementById("work");
  var lightbox = document.getElementById("lightbox");
  if (!work || !lightbox) return;

  var lbImg = lightbox.querySelector(".lightbox__img");
  var lbClose = lightbox.querySelector(".lightbox__close");
  var lbBackdrop = lightbox.querySelector("[data-lightbox-close]");
  var triggerEl = null;

  function resolveUrl(url) {
    try {
      return new URL(url, document.baseURI).href;
    } catch (e) {
      return url;
    }
  }

  function openLightbox(src, altText) {
    if (!lbImg) return;
    triggerEl = document.activeElement;
    lbImg.src = resolveUrl(src);
    lbImg.alt = altText || "";
    lightbox.removeAttribute("hidden");
    document.body.classList.add("lightbox-open");
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox.hasAttribute("hidden")) {
      lightbox.setAttribute("hidden", "");
      document.body.classList.remove("lightbox-open");
      if (lbImg) {
        lbImg.removeAttribute("src");
        lbImg.alt = "";
      }
      if (triggerEl && typeof triggerEl.focus === "function") {
        triggerEl.focus();
      }
      triggerEl = null;
    }
  }

  work.addEventListener("click", function (e) {
    var link = e.target.closest("a.gallery__item");
    if (!link || !work.contains(link)) return;
    e.preventDefault();
    var thumb = link.querySelector("img");
    openLightbox(link.href, thumb ? thumb.getAttribute("alt") : "");
  });

  if (lbClose) {
    lbClose.addEventListener("click", closeLightbox);
  }

  if (lbBackdrop) {
    lbBackdrop.addEventListener("click", closeLightbox);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !lightbox.hasAttribute("hidden")) {
      closeLightbox();
    }
  });
})();
