(function () {
  var y = document.getElementById("footer-year");
  if (y) y.textContent = String(new Date().getFullYear());

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function closeNav() {
    if (!header || !toggle) return;
    header.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  if (toggle && header && nav) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.querySelectorAll(".hero__tag-link").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  /* ----- Portfolio category filter ---------------------------------------- */
  var workGrid = document.getElementById("work-grid");
  var filterRoot =
    document.querySelector("#work .work-jump") || document.querySelector(".section--work .work-jump");

  if (filterRoot && workGrid) {
    var projectBlocks = workGrid.querySelectorAll(".project-block[data-category]");

    function setActiveTab(active) {
      filterRoot.querySelectorAll("[data-filter]").forEach(function (tab) {
        var on = tab === active;
        tab.classList.toggle("is-active", on);
        if (tab.tagName === "BUTTON") {
          tab.setAttribute("aria-pressed", on ? "true" : "false");
        }
      });
    }

    function applyFilter(filter) {
      projectBlocks.forEach(function (block) {
        var cat = block.getAttribute("data-category");
        var show = filter === "all" || cat === filter;
        block.classList.toggle("is-filtered-out", !show);
        if (show) {
          block.removeAttribute("hidden");
        } else {
          block.setAttribute("hidden", "");
        }
      });
    }

    filterRoot.addEventListener("click", function (e) {
      var tab = e.target && e.target.closest ? e.target.closest("[data-filter]") : null;
      if (!tab || !filterRoot.contains(tab)) return;
      e.preventDefault();
      var f = tab.getAttribute("data-filter");
      if (!f) return;
      setActiveTab(tab);
      applyFilter(f);
      closeNav();
    });

    var defaultTab = filterRoot.querySelector('[data-filter="all"]');
    if (defaultTab) setActiveTab(defaultTab);
    applyFilter("all");
  }

  /* ----- Image lightbox ------------------------------------------------ */
  var work = document.getElementById("work");
  var lightbox = document.getElementById("lightbox");

  if (work && lightbox) {
    var lbImg = lightbox.querySelector(".lightbox__img");
    var lbClose = lightbox.querySelector(".lightbox__close");
    var lbBackdrop = lightbox.querySelector("[data-lightbox-close]");
    var triggerEl = null;

    function resolveUrl(url) {
      try {
        return new URL(url, document.baseURI).href;
      } catch (err) {
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
      var pb = link.closest(".project-block");
      if (pb && (pb.hasAttribute("hidden") || pb.classList.contains("is-filtered-out"))) return;
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
  }

  /* ----- Gallery tilt (subtle pointer parallax) ------------------------- */
  var tiltRoot = document.getElementById("work-grid");
  if (
    tiltRoot &&
    window.matchMedia &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    tiltRoot.querySelectorAll("a.gallery__item").forEach(function (el) {
      el.addEventListener(
        "mousemove",
        function (e) {
          var r = el.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          el.style.setProperty("--tilt-y", (px * 9).toFixed(2) + "deg");
          el.style.setProperty("--tilt-x", (py * -9).toFixed(2) + "deg");
        },
        { passive: true }
      );
      el.addEventListener("mouseleave", function () {
        el.style.removeProperty("--tilt-x");
        el.style.removeProperty("--tilt-y");
      });
    });
  }
})();
