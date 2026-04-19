import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";

const imgConvertShowreel11 = "https://raw.githubusercontent.com/Pageot/WebsiteLesMinitels-assets/refs/heads/main/Convert_Showreel-1.jpg";
const imgConvertShowreel21 = "https://raw.githubusercontent.com/Pageot/WebsiteLesMinitels-assets/refs/heads/main/Convert_Showreel-2.jpg";
const imgConvertShowreel31 = "https://raw.githubusercontent.com/Pageot/WebsiteLesMinitels-assets/refs/heads/main/Convert_Showreel-3.jpg";
const imgConvertShowreel41 = "https://raw.githubusercontent.com/Pageot/WebsiteLesMinitels-assets/refs/heads/main/Convert_Showreel-4.jpg";
const imgConvertShowreel51 = "https://raw.githubusercontent.com/Pageot/WebsiteLesMinitels-assets/refs/heads/main/Convert_Showreel-5.jpg";
const imgConvertShowreel61 = "https://raw.githubusercontent.com/Pageot/WebsiteLesMinitels-assets/refs/heads/main/Convert_Showreel-6.jpg";

const CAROUSEL_ITEMS = [
  { id: 1, image: imgConvertShowreel11, link: "/project/1" },
  { id: 2, image: imgConvertShowreel21, link: "/project/2" },
  { id: 3, image: imgConvertShowreel31, link: "/project/3" },
  { id: 4, image: imgConvertShowreel41, link: "/project/4" },
  { id: 5, image: imgConvertShowreel51, link: "/project/5" },
  { id: 6, image: imgConvertShowreel61, link: "/project/6" },
];

export function ProjectCarousel() {
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // Variables pour le "Drag to Scroll" (Grab)
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);
  const isDragging = useRef(false);

  // 1. Vertical scroll tracking for glassmorphism background
  useEffect(() => {
    const handleScroll = () => {
      // Démarrage de l'effet un peu plus tard (après 10vh de scroll)
      // Atteint son maximum plus rapidement (à 45vh)
      const startScroll = window.innerHeight * 0.1;
      const endScroll = window.innerHeight * 0.45;

      const currentScroll = window.scrollY;

      let opacity = 0;
      if (currentScroll > startScroll) {
        opacity = Math.min(
          1,
          (currentScroll - startScroll) /
            (endScroll - startScroll),
        );
      }

      setScrollOpacity(opacity);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    handleScroll(); // Init check

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Horizontal scroll tracking for 3D Coverflow effect
  const update3DEffect = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;

    // Use scroll position for stable math, ignoring CSS transforms to prevent jitter
    const scrollLeft = container.scrollLeft;
    const containerCenter =
      scrollLeft + container.clientWidth / 2;

    cardsRef.current.forEach((card) => {
      if (!card) return;

      // offsetLeft gives position relative to the scroll container's layout
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = cardCenter - containerCenter;

      const isMobile = window.innerWidth < 768;
      const gap = isMobile ? 8 : 16;

      // Normalize distance (1 = exactly 1 card width + gap away)
      const normalizedDistance =
        distance / (card.offsetWidth + gap);
      const absDist = Math.abs(normalizedDistance);

      // --- PARAMÈTRES DU CARROUSEL ---
      const angleRotation = isMobile ? 8 : 10; // (en degrés) L'inclinaison des cartes
      const reductionTaille = isMobile ? 0.08 : 0.05; // 0.05 = réduction de 5% par carte (95%, 90%...)
      const reculProfondeur = 0; // (en pixels) Profondeur 3D

      // Pour avoir le MÊME espacement partout, il faut compenser l'effet de la rotation
      // et de la 3D qui "élargit" visuellement le trou entre les cartes lointaines.
      // Une petite valeur NÉGATIVE permet de resserrer les cartes des extrémités.
      const decalageHorizontal = isMobile ? -8 : 10; // Ajustement en % pour maintenir un espacement constant

      // Assombrissement progressif au lieu de la transparence
      const luminositeMin = 0.6; // 0 = noir total, 1 = couleur normale.
      // -------------------------------

      // 1. Rotation
      const rotateY =
        Math.sign(normalizedDistance) *
        Math.min(75, absDist * angleRotation);

      // 2. Scale (Réduction à 95%)
      const scale = Math.max(
        0.5,
        1 - absDist * reductionTaille,
      );

      // 3. Depth (Profondeur 3D)
      const translateZ = -absDist * reculProfondeur;

      // 4. Espacement stabilisé
      const translateX =
        Math.sign(normalizedDistance) *
        (absDist * decalageHorizontal);

      // 5. Assombrissement (Brightness) au lieu de Opacity
      const brightness = Math.max(
        luminositeMin,
        1 - absDist * 0.25,
      );

      // Z-index calculation: highest for the center card
      const zIndex = Math.round(100 - absDist * 10);

      // Apply styles dynamically for 60fps performance without React re-renders
      card.style.transform = `perspective(1200px) translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.zIndex = zIndex.toString();
      card.style.opacity = "1"; // Toujours 100% opaque
      card.style.filter = `brightness(${brightness})`; // Effet de filtre sombre
    });
  };

  // 3. Attach horizontal scroll listener using requestAnimationFrame for smoothness
  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update3DEffect);
    };

    const container = carouselRef.current;
    if (container) {
      container.addEventListener("scroll", onScroll, {
        passive: true,
      });

      // Scroll to the 3rd item initially (index 2)
      setTimeout(() => {
        if (cardsRef.current[2] && container) {
          const thirdCard = cardsRef.current[2];
          const targetScrollLeft =
            thirdCard.offsetLeft -
            container.clientWidth / 2 +
            thirdCard.offsetWidth / 2;

          container.scrollTo({
            left: targetScrollLeft,
            behavior: "instant",
          });

          // Initial trigger to position them correctly on load after scroll
          update3DEffect();
        } else {
          update3DEffect();
        }
      }, 50);
    }

    // Update on resize in case card dimensions change
    window.addEventListener("resize", update3DEffect);

    return () => {
      if (container)
        container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update3DEffect);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // 4. Handlers pour le Drag & Drop (Grab)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    isDown.current = true;
    isDragging.current = false;
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeftPos.current = carouselRef.current.scrollLeft;

    // Changement du curseur et désactivation temporaire du "snap" pour la fluidité
    carouselRef.current.style.cursor = "grabbing";
    carouselRef.current.style.scrollSnapType = "none";
  };

  const handleMouseLeave = () => {
    if (!isDown.current) return;
    isDown.current = false;
    if (carouselRef.current) {
      carouselRef.current.style.cursor = "grab";
      carouselRef.current.style.scrollSnapType = "x mandatory";
    }
  };

  const handleMouseUp = () => {
    if (!isDown.current) return;
    isDown.current = false;
    if (carouselRef.current) {
      carouselRef.current.style.cursor = "grab";
      carouselRef.current.style.scrollSnapType = "x mandatory";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !carouselRef.current) return;
    e.preventDefault();

    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Multiplicateur de vitesse de glissement

    if (Math.abs(walk) > 5) {
      isDragging.current = true; // On marque comme "en train de glisser" pour empêcher le clic
    }

    carouselRef.current.scrollLeft =
      scrollLeftPos.current - walk;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isDragging.current) {
      e.preventDefault(); // Annule la redirection si l'utilisateur était en train de glisser
    }
  };

  return (
    <div className="w-full relative z-10 pointer-events-none carousel-root">
      {/* Spacer forcing the container down by 55vh so more of the carousel is visible initially on the Home page.
          On mobile, we reduce it significantly to bring the carousel much higher. */}
      <div className="h-[34vh] md:h-[55vh] w-full" />

      {/* Background container with dynamic glassmorphism opacity based on scroll */}
      <div
        className="w-full pointer-events-none flex flex-col justify-center min-h-[100vh] overflow-hidden"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${scrollOpacity * 0.6})`,
          backdropFilter: `blur(${scrollOpacity * 5.5}px)`,
          WebkitBackdropFilter: `blur(${scrollOpacity * 5.5}px)`,
        }}
      >
        {/* Scrollable Carousel Container */}
        <div className="w-full shrink-0 relative pointer-events-auto">
          <div
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            // On augmente le padding vertical (py-[60px] au lieu de py-[20px])
            // pour donner assez d'espace à l'ombre portée (box-shadow) afin qu'elle ne soit pas coupée
            className="flex w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar items-center py-[60px] relative select-none project-carousel-container"
            style={{
              cursor: "grab",
            }}
          >
            {CAROUSEL_ITEMS.map((item, index) => (
              <Link
                key={item.id}
                to={item.link}
                onClick={handleCardClick}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className={`relative shrink-0 snap-center cursor-pointer project-carousel-card ${index === 0 ? "ml-0" : "ml-[var(--card-gap)]"}`}
                draggable={false} // Empêche le comportement de drag par défaut sur l'image
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity, z-index",
                }}
                aria-label={`View project ${item.id}`}
              >
                <div className="w-full h-full relative rounded-[40px] overflow-hidden shadow-2xl transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                  <img
                    src={item.image}
                    alt={`Project ${item.id}`}
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover max-w-none pointer-events-none"
                  />
                  {/* Inner border style from design */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-[-2px] rounded-[42px] border-[4px] border-[#171717] border-solid pointer-events-none"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .carousel-root {
          --card-h: min(766px, 75vh);
          --card-w: calc(var(--card-h) * (354.047 / 766));
          --card-gap: 16px;
        }

        @media (max-width: 768px) {
          .carousel-root {
            --card-h: min(540px, 66vh);
            --card-gap: 8px;
          }
        }

        .project-carousel-container {
          padding-left: calc(50vw - (var(--card-w) / 2));
          padding-right: calc(50vw - (var(--card-w) / 2));
        }

        .project-carousel-card {
          height: var(--card-h);
          width: var(--card-w);
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}