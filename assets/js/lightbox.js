export function initLightbox(galleryRoot) {
  if (!galleryRoot) return;

  const items = Array.from(galleryRoot.querySelectorAll(".gallery-item"));
  if (!items.length) return;

  const images = items.map((el) => el.dataset.full || el.querySelector("img").src);

  // Build modal lazily
  let modal = null;
  let stageImg = null;
  let currentIndex = 0;

  const build = () => {
    modal = document.createElement("div");
    modal.className = "lightbox";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Image viewer");
    modal.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Close">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div class="lightbox-stage">
        <button class="lightbox-nav prev" type="button" aria-label="Previous">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="lightbox-img-wrap">
          <img class="lightbox-img" alt="" />
        </div>
        <button class="lightbox-nav next" type="button" aria-label="Next">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    `;
    document.body.appendChild(modal);
    stageImg = modal.querySelector(".lightbox-img");

    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
    modal.querySelector(".lightbox-close").addEventListener("click", close);
    modal.querySelector(".prev").addEventListener("click", (e) => {
      e.stopPropagation();
      go(-1);
    });
    modal.querySelector(".next").addEventListener("click", (e) => {
      e.stopPropagation();
      go(1);
    });

    // Touch swipe
    let touchStartX = 0;
    let touchEndX = 0;
    modal.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );
    modal.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const delta = touchEndX - touchStartX;
        if (Math.abs(delta) > 40) go(delta < 0 ? 1 : -1);
      },
      { passive: true }
    );
  };

  const render = () => {
    if (!stageImg) return;
    stageImg.src = images[currentIndex];
    stageImg.alt = `Screenshot ${currentIndex + 1}`;
  };

  const go = (delta) => {
    currentIndex = (currentIndex + delta + images.length) % images.length;
    render();
  };

  const open = (idx) => {
    if (!modal) build();
    currentIndex = idx;
    render();
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
  };

  const close = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
  };

  const onKey = (e) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
  };

  items.forEach((el, idx) => {
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.addEventListener("click", () => open(idx));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(idx);
      }
    });
  });
}
