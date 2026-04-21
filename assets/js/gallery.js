import { enableDragToScroll } from "./utils.js";

const SVG_NS = "http://www.w3.org/2000/svg";

export function makeChevron(direction, size = 24) {
  const svg = document.createElementNS(SVG_NS, "svg");
  const s = String(size);
  svg.setAttribute("width", s);
  svg.setAttribute("height", s);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "3");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  const line = document.createElementNS(SVG_NS, "polyline");
  line.setAttribute("points", direction === "prev" ? "15 18 9 12 15 6" : "9 18 15 12 9 6");
  svg.appendChild(line);
  return svg;
}

export function initGallery(galleryRoot) {
  if (!galleryRoot) return;
  const scroller = galleryRoot.querySelector(".gallery-scroller");
  if (!scroller) return;
  const items = Array.from(scroller.querySelectorAll(".gallery-item"));
  if (!items.length) return;

  const drag = enableDragToScroll(scroller);

  // Swallow the click that follows a drag so the lightbox doesn't open
  scroller.addEventListener(
    "click",
    (e) => {
      if (drag.wasDragging()) {
        e.stopPropagation();
        e.preventDefault();
        drag.clearDragging();
      }
    },
    true
  );

  items.forEach((it) => {
    it.setAttribute("draggable", "false");
    it.querySelectorAll("img").forEach((img) => img.setAttribute("draggable", "false"));
  });

  const makeArrow = (dir, label) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `gallery-arrow gallery-arrow-${dir}`;
    btn.setAttribute("aria-label", label);
    btn.appendChild(makeChevron(dir));
    galleryRoot.appendChild(btn);
    return btn;
  };

  const prev = makeArrow("prev", "Image précédente");
  const next = makeArrow("next", "Image suivante");

  const step = () => {
    const first = items[0];
    return first ? first.offsetWidth + 13.156 : 180;
  };
  prev.addEventListener("click", () => scroller.scrollBy({ left: -step(), behavior: "smooth" }));
  next.addEventListener("click", () => scroller.scrollBy({ left: step(), behavior: "smooth" }));

  const updateArrowState = () => {
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    prev.classList.toggle("is-hidden", scroller.scrollLeft < 2);
    next.classList.toggle("is-hidden", scroller.scrollLeft >= maxScroll - 2);
  };
  updateArrowState();
  scroller.addEventListener("scroll", updateArrowState, { passive: true });
  let resizeRaf;
  window.addEventListener("resize", () => {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(updateArrowState);
  });
}
