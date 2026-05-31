import { makeChevron, makeCloseIcon, makeIconButton } from "./utils.js";

export function initLightbox(galleryRoot) {
  if (!galleryRoot) return;

  const items = Array.from(galleryRoot.querySelectorAll(".gallery-item"));
  if (!items.length) return;

  const images = items.map((el) => el.dataset.full || el.querySelector("img")?.src || "");

  let modal = null;
  let stageImg = null;
  let currentIndex = 0;
  let lastFocused = null;

  const build = () => {
    modal = document.createElement("div");
    modal.className = "lightbox";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Image viewer");

    const closeBtn = makeIconButton("lightbox-close", "Close", makeCloseIcon(28));
    closeBtn.addEventListener("click", close);

    const prevBtn = makeIconButton("lightbox-nav prev", "Previous", makeChevron("prev", 28));
    prevBtn.addEventListener("click", (e) => { e.stopPropagation(); go(-1); });

    const nextBtn = makeIconButton("lightbox-nav next", "Next", makeChevron("next", 28));
    nextBtn.addEventListener("click", (e) => { e.stopPropagation(); go(1); });

    stageImg = document.createElement("img");
    stageImg.className = "lightbox-img";
    stageImg.alt = "";

    const imgWrap = document.createElement("div");
    imgWrap.className = "lightbox-img-wrap";
    imgWrap.appendChild(stageImg);

    const stage = document.createElement("div");
    stage.className = "lightbox-stage";
    stage.append(prevBtn, imgWrap, nextBtn);

    modal.append(closeBtn, stage);
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });

    let touchStartX = 0;
    modal.addEventListener(
      "touchstart",
      (e) => { touchStartX = e.changedTouches[0].screenX; },
      { passive: true }
    );
    modal.addEventListener(
      "touchend",
      (e) => {
        const delta = e.changedTouches[0].screenX - touchStartX;
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
    lastFocused = document.activeElement;
    if (!modal) build();
    currentIndex = idx;
    render();
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    modal.querySelector(".lightbox-close")?.focus();
  };

  const close = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  };

  const onKey = (e) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
    else if (e.key === "Tab") {
      // Trap focus within the modal's buttons (Close, Prev, Next)
      const f = modal.querySelectorAll("button");
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
      else if (!modal.contains(active)) { e.preventDefault(); first.focus(); }
    }
  };

  items.forEach((el, idx) => {
    el.addEventListener("click", () => open(idx));
  });
}
