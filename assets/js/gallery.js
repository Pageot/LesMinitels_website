import { enableDragToScroll, makeChevron, makeIconButton, onResizeRAF } from "./utils.js";

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
    const btn = makeIconButton(`gallery-arrow gallery-arrow-${dir}`, label, makeChevron(dir));
    galleryRoot.appendChild(btn);
    return btn;
  };

  const prev = makeArrow("prev", "Image précédente");
  const next = makeArrow("next", "Image suivante");

  const step = () => {
    return items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : items[0].offsetWidth;
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
  onResizeRAF(updateArrowState);
}
