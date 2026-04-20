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
