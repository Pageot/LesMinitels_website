import { makeChevron } from "./gallery.js";

const SVG_NS = "http://www.w3.org/2000/svg";

function makeCloseIcon(size = 28) {
  const svg = document.createElementNS(SVG_NS, "svg");
  const s = String(size);
  svg.setAttribute("width", s);
  svg.setAttribute("height", s);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  for (const [x1, y1, x2, y2] of [[18, 6, 6, 18], [6, 6, 18, 18]]) {
    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    svg.appendChild(line);
  }
  return svg;
}

function makeNavButton(cls, label, svg) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = cls;
  btn.setAttribute("aria-label", label);
  btn.appendChild(svg);
  return btn;
}

export function initLightbox(galleryRoot) {
  if (!galleryRoot) return;

  const items = Array.from(galleryRoot.querySelectorAll(".gallery-item"));
  if (!items.length) return;

  const images = items.map((el) => el.dataset.full || el.querySelector("img").src);

  let modal = null;
  let stageImg = null;
  let currentIndex = 0;

  const build = () => {
    modal = document.createElement("div");
    modal.className = "lightbox";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Image viewer");

    const closeBtn = makeNavButton("lightbox-close", "Close", makeCloseIcon(28));
    closeBtn.addEventListener("click", close);

    const prevBtn = makeNavButton("lightbox-nav prev", "Previous", makeChevron("prev", 28));
    prevBtn.addEventListener("click", (e) => { e.stopPropagation(); go(-1); });

    const nextBtn = makeNavButton("lightbox-nav next", "Next", makeChevron("next", 28));
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
    el.addEventListener("click", () => open(idx));
  });
}
