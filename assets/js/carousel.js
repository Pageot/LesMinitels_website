import { enableDragToScroll } from "./utils.js";

export function initCarousel(root) {
  if (!root) return;

  const scroller = root.querySelector(".carousel-scroller");
  const cards = Array.from(root.querySelectorAll(".carousel-card"));
  const bg = root.querySelector(".carousel-bg");
  if (!scroller || !cards.length) return;

  // Vertical scroll → glassmorphism background opacity
  let lastOpacity = -1;
  const handleScroll = () => {
    const startScroll = window.innerHeight * 0.1;
    const endScroll = window.innerHeight * 0.45;
    const current = window.scrollY;
    let opacity = 0;
    if (current > startScroll) {
      opacity = Math.min(1, (current - startScroll) / (endScroll - startScroll));
    }
    opacity = Math.round(opacity * 100) / 100;
    if (opacity === lastOpacity || !bg) return;
    lastOpacity = opacity;
    bg.style.backgroundColor = `rgba(255, 255, 255, ${opacity * 0.6})`;
    bg.style.backdropFilter = `blur(${opacity * 5.5}px)`;
    bg.style.webkitBackdropFilter = `blur(${opacity * 5.5}px)`;
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Horizontal scroll → 3D coverflow. Card layout (offsetLeft/offsetWidth) only
  // changes on resize, so we cache it to avoid forcing a layout every frame.
  let cardLayout = [];
  const measure = () => {
    cardLayout = cards.map((c) => ({ center: c.offsetLeft + c.offsetWidth / 2, w: c.offsetWidth }));
  };

  const update3DEffect = () => {
    const containerCenter = scroller.scrollLeft + scroller.clientWidth / 2;
    const isMobile = window.innerWidth < 768;
    const angleRotation = isMobile ? 8 : 10;
    const scaleFalloff = isMobile ? 0.08 : 0.05;
    const translateXFactor = isMobile ? -8 : 10;
    const gap = isMobile ? 8 : 16;

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
