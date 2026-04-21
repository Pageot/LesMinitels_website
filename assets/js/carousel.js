import { enableDragToScroll } from "./utils.js";

export function initCarousel(root) {
  if (!root) return;

  const scroller = root.querySelector(".carousel-scroller");
  const cards = Array.from(root.querySelectorAll(".carousel-card"));
  const bg = root.querySelector(".carousel-bg");
  if (!scroller || !cards.length) return;

  let lastOpacity = -1;
  let startScroll = 0;
  let endScroll = 0;
  const handleScroll = () => {
    const current = window.scrollY;
    let opacity = 0;
    if (current > startScroll) {
      opacity = Math.min(1, (current - startScroll) / (endScroll - startScroll));
    }
    opacity = Math.round(opacity * 100) / 100;
    if (opacity === lastOpacity) return;
    lastOpacity = opacity;
    bg.style.backgroundColor = `rgba(255, 255, 255, ${opacity * 0.6})`;
    bg.style.backdropFilter = `blur(${opacity * 5.5}px)`;
    bg.style.webkitBackdropFilter = `blur(${opacity * 5.5}px)`;
  };
  if (bg) {
    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  // offsetLeft/offsetWidth only change on resize, so cache them to avoid
  // forcing layout every frame during horizontal scroll.
  let cardLayout = [];
  let tuning = { angleRotation: 10, scaleFalloff: 0.05, translateXFactor: 10, gap: 16 };
  const measure = () => {
    cardLayout = cards.map((c) => ({ center: c.offsetLeft + c.offsetWidth / 2, w: c.offsetWidth }));
    const isMobile = window.innerWidth < 768;
    tuning = isMobile
      ? { angleRotation: 8, scaleFalloff: 0.08, translateXFactor: -8, gap: 8 }
      : { angleRotation: 10, scaleFalloff: 0.05, translateXFactor: 10, gap: 16 };
    const viewportH = window.innerHeight;
    startScroll = viewportH * 0.1;
    endScroll = viewportH * 0.45;
  };

  const update3DEffect = () => {
    const containerCenter = scroller.scrollLeft + scroller.clientWidth / 2;
    const { angleRotation, scaleFalloff, translateXFactor, gap } = tuning;

    cards.forEach((card, i) => {
      const layout = cardLayout[i];
      const distance = layout.center - containerCenter;
      const norm = distance / (layout.w + gap);
      const abs = Math.abs(norm);
      const rotateY = Math.sign(norm) * Math.min(75, abs * angleRotation);
      const scale = Math.max(0.5, 1 - abs * scaleFalloff);
      const translateX = Math.sign(norm) * (abs * translateXFactor);
      const brightness = Math.max(0.6, 1 - abs * 0.25);
      const zIndex = Math.round(100 - abs * 10);

      card.style.transform = `perspective(1200px) translateX(${translateX}%) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.zIndex = String(zIndex);
      card.style.filter = `brightness(${brightness})`;
    });
  };

  let rafId;
  const onHScroll = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(update3DEffect);
  };
  scroller.addEventListener("scroll", onHScroll, { passive: true });

  let resizeRaf;
  window.addEventListener("resize", () => {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      measure();
      update3DEffect();
    });
  });

  measure();
  if (bg) handleScroll();
  const third = cards[2];
  if (third) {
    const target = third.offsetLeft - scroller.clientWidth / 2 + third.offsetWidth / 2;
    scroller.scrollTo({ left: target, behavior: "instant" });
  }
  update3DEffect();

  const drag = enableDragToScroll(scroller);

  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (drag.wasDragging()) e.preventDefault();
    });
    card.querySelectorAll("img").forEach((img) => img.setAttribute("draggable", "false"));
    card.setAttribute("draggable", "false");
  });
}
