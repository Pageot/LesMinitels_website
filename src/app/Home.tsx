import React, { useState, useEffect } from "react";
import { GrainGradient } from "@paper-design/shaders-react";
import svgPaths from "../imports/svg-m067nzhc74";
import { ProjectCarousel } from "./components/ProjectCarousel";

export default function Home() {
  const [windowDimensions, setWindowDimensions] = useState({ width: 1280, height: 720 });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-full font-sans overflow-x-hidden">
      {/* Fixed Background */}
      <div className="fixed inset-0 -z-20 w-full h-full pointer-events-none">
        <GrainGradient
          width={windowDimensions.width}
          height={windowDimensions.height}
          colors={["#fff0fc75", "#ffd6b34f"]}
          colorBack="#ffffff"
          softness={0}
          intensity={0.58}
          noise={0.51}
          shape="corners"
          speed={0.46}
          scale={1.04}
          rotation={176}
          offsetX={0.1}
          offsetY={-0.3}
        />
      </div>

      {/* Fixed Header Section (stays behind the carousel) */}
      <div className="fixed inset-0 w-full flex flex-col p-6 md:p-8 lg:p-10 z-0 pointer-events-auto">
        <div className="flex flex-row flex-wrap justify-between items-start lg:items-end w-full gap-6 lg:gap-10 xl:gap-16">
          
          {/* Left Section */}
          <div className="flex flex-col gap-10 md:gap-12 items-start w-full lg:w-auto max-w-full shrink-0">
            
            {/* Logo - Clickable link to home */}
            <a href="/" className="block h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 transition-transform hover:scale-105" aria-label="Retour à l'accueil">
              <img 
                src="https://raw.githubusercontent.com/Pageot/WebsiteLesMinitels-assets/312f6b5dbe50f5492d92c2653abdca6385bde886/Logo_LesMinitels.svg" 
                alt="Logo Les Minitels" 
                className="block size-full"
              />
            </a>

            {/* Texts Left */}
            <div className="flex flex-col gap-2 md:gap-[8px] items-start uppercase w-full">
              <h1 className="font-['Nova_Klasse',_sans-serif] font-semibold text-[#171717] text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-[86px] tracking-[0.05em] lg:tracking-[6px] 2xl:tracking-[12px] leading-none">
                Les Minitels
              </h1>
              <h2 className="font-['Changa_One',_sans-serif] italic text-[#8a8a8a] text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-[60px] tracking-[0.02em] lg:tracking-[1.5px] 2xl:tracking-[2.72px] leading-tight lg:leading-[1.2]">
                Facilitateur de vie
              </h2>
            </div>
          </div>

          {/* Right Section */}
          <div className="relative flex flex-col gap-2 md:gap-[8px] items-end text-right uppercase w-full lg:w-auto ml-auto shrink-0">
            <p className="font-['Changa_One',_sans-serif] italic text-[#8a8a8a] text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-[60px] tracking-[0.02em] lg:tracking-[1.5px] 2xl:tracking-[2.72px] leading-tight lg:leading-[1.2]">
              Créateur
            </p>
            <p className="font-['Nova_Klasse',_sans-serif] font-semibold text-[#171717] text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-[86px] leading-none">
              D’apps
            </p>
            <p className="font-['Changa_One',_sans-serif] italic text-[#8a8a8a] text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-[60px] tracking-[0.02em] lg:tracking-[1.5px] 2xl:tracking-[2.72px] leading-tight lg:leading-[1.2]">
              Depuis 2026
            </p>
          </div>
        </div>
      </div>

      {/* Overlapping Carousel Section */}
      <ProjectCarousel />
    </div>
  );
}
