export function initReveal(selector = ".reveal") {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  els.forEach((el) => io.observe(el));
}

// Adds mouse drag-to-scroll to a horizontal scroller. Shared by carousel and
// gallery. Returns a `wasDragging()` probe so callers can swallow the click
// that follows a drag.
export function enableDragToScroll(scroller) {
  let isDown = false;
  let dragged = false;
  let startX = 0;
  let startScrollLeft = 0;

  const onDown = (e) => {
    isDown = true;
    dragged = false;
    startX = e.pageX - scroller.offsetLeft;
    startScrollLeft = scroller.scrollLeft;
    scroller.style.cursor = "grabbing";
    scroller.style.scrollSnapType = "none";
  };

  const release = () => {
    if (!isDown) return;
    isDown = false;
    scroller.style.cursor = "";
    scroller.style.scrollSnapType = "";
  };

  const onMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const walk = (e.pageX - scroller.offsetLeft - startX) * 1.5;
    if (Math.abs(walk) > 5) dragged = true;
    scroller.scrollLeft = startScrollLeft - walk;
  };

  scroller.addEventListener("mousedown", onDown);
  scroller.addEventListener("mouseleave", release);
  scroller.addEventListener("mouseup", release);
  scroller.addEventListener("mousemove", onMove);

  return {
    wasDragging: () => dragged,
    clearDragging: () => { dragged = false; },
  };
}

// Debounce a resize handler to a single rAF, cancelling the pending frame on
// each event. Shared by the carousel and the gallery.
export function onResizeRAF(cb) {
  let raf;
  window.addEventListener("resize", () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(cb);
  });
}

// Shared SVG icon + icon-button factories, used by the gallery arrows and the
// lightbox controls.
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

export function makeCloseIcon(size = 28) {
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

// Generic icon button (replaces the duplicated makeNavButton / makeArrow cores).
export function makeIconButton(className, label, svg) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = className;
  btn.setAttribute("aria-label", label);
  btn.appendChild(svg);
  return btn;
}
