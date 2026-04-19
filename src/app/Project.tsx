import React, { useEffect } from "react";
import { useParams, Link } from "react-router";
import { Navbar } from "./components/Navbar";

const imgConvertShowreel11 = "https://raw.githubusercontent.com/Pageot/WebsiteLesMinitels-assets/refs/heads/main/Convert_Showreel-1.jpg";
const imgConvertShowreel21 = "https://raw.githubusercontent.com/Pageot/WebsiteLesMinitels-assets/refs/heads/main/Convert_Showreel-2.jpg";
const imgConvertShowreel31 = "https://raw.githubusercontent.com/Pageot/WebsiteLesMinitels-assets/refs/heads/main/Convert_Showreel-3.jpg";
const imgConvertShowreel41 = "https://raw.githubusercontent.com/Pageot/WebsiteLesMinitels-assets/refs/heads/main/Convert_Showreel-4.jpg";
const imgConvertShowreel51 = "https://raw.githubusercontent.com/Pageot/WebsiteLesMinitels-assets/refs/heads/main/Convert_Showreel-5.jpg";
const imgConvertShowreel61 = "https://raw.githubusercontent.com/Pageot/WebsiteLesMinitels-assets/refs/heads/main/Convert_Showreel-6.jpg";
const imgIconAppConvert1 = "https://raw.githubusercontent.com/Pageot/WebsiteLesMinitels-assets/refs/heads/main/Icon%20app%20Convert.png";

const rawSvgPhoneMockup = "https://raw.githubusercontent.com/Pageot/WebsiteLesMinitels-assets/22c29a6c35142586d513e5b8dba80468b88a0c4e/Main%20screen%20-%20Online%20-%20Light.svg";
const rawAppStoreBadge = "https://raw.githubusercontent.com/Pageot/WebsiteLesMinitels-assets/22c29a6c35142586d513e5b8dba80468b88a0c4e/Download_on_the_App_Store_Badge.svg";
const rawGooglePlayBadge = "https://raw.githubusercontent.com/Pageot/WebsiteLesMinitels-assets/22c29a6c35142586d513e5b8dba80468b88a0c4e/Get_it_on_Google_play.svg";

import { ImageGallery } from "./components/ImageGallery";

import svgPaths from "../imports/svg-2vabhdf4i6";

const CAROUSEL_IMAGES = [
  imgConvertShowreel11,
  imgConvertShowreel21,
  imgConvertShowreel31,
  imgConvertShowreel41,
  imgConvertShowreel51,
  imgConvertShowreel61,
];

export default function Project() {
  const { id } = useParams();
  
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-[#fffffe] w-full font-sans overflow-x-clip flex flex-col items-center">
      <div className="w-full max-w-[1417px] flex flex-col gap-[40px] px-6 lg:px-12 pt-[24px]">
        {/* Navigation */}
        <Navbar />
        
        {/* Line below navbar */}
        <div className="bg-[#c01f2a] h-[3px] opacity-26 shadow-[0px_3px_0px_0px_#f49514] shrink-0 w-full" />

        <main className="w-full flex flex-col lg:flex-row gap-16 xl:gap-[239px] items-center lg:items-start pb-12">
          
          {/* Left Column - Content */}
          <div className="flex flex-col gap-[24px] w-full lg:w-[700px] shrink-0">
            <div className="relative shrink-0 w-[80px] h-[80px]">
              <img 
                src={imgIconAppConvert1} 
                alt="Convert App Icon" 
                className="absolute inset-0 w-full h-full object-cover rounded-[24px] shadow-sm border border-gray-100"
              />
            </div>
            
            <h1 className="font-['Nova_Klasse',_sans-serif] font-semibold text-[#171717] text-3xl sm:text-4xl md:text-[48px] uppercase tracking-[3px] sm:tracking-[4px] md:tracking-[5.76px] leading-none m-0">
              Convert
            </h1>
            
            <div className="font-['Helvetica_Neue',_Arial,_sans-serif] leading-[1.4] min-w-full not-italic relative shrink-0 text-[#636363] text-[14px] tracking-[0.56px] w-full">
              <p className="m-0">Convert is an all-in-one converter that works completely offline.</p>
              <p className="m-0">Convert over 200 world currencies for free with accurate exchange rates.</p>
              <p className="m-0">&nbsp;</p>
              <p className="m-0">Unlock the Pro version with one-time purchase or subscription and get even more:</p>
              <p className="m-0">• Unit conversions (length, weight, volume, temperature, area, speed, and more)</p>
              <p className="m-0">• Precious metals: gold, silver, platinum and others</p>
              <p className="m-0">• Top 200 cryptocurrencies (Bitcoin, Ethereum, and major coins)</p>
              <p className="m-0">&nbsp;</p>
              <p className="m-0">Everything works offline, no internet needed after the initial data download. Perfect for travel, daily use or when you're without signal.</p>
              <p className="m-0">Designed for maximum simplicity and speed: clean interface, quick search, dark mode, and home screen widget (Pro).</p>
              <p className="m-0">One app for all your conversions: currency converter, unit converter, crypto converter, gold & silver converter always available, even offline.</p>
              <p className="m-0">&nbsp;</p>
              <p className="m-0">Download Convert now and never get stuck without the right conversion again.</p>
            </div>
            
            {/* App Store Badges */}
            <div className="flex gap-[16px] items-center shrink-0 flex-wrap mt-[8px]">
              <button 
                className="cursor-pointer h-[40px] relative shrink-0 w-[120px] hover:opacity-80 transition-opacity"
                aria-label="Download on the App Store"
              >
                <img src={rawAppStoreBadge} alt="Download on the App Store" className="w-full h-full block" />
              </button>
              <button 
                className="cursor-pointer h-[40px] relative shrink-0 w-[135px] hover:opacity-80 transition-opacity"
                aria-label="Get it on Google Play"
              >
                <img src={rawGooglePlayBadge} alt="Get it on Google Play" className="w-full h-full block" />
              </button>
            </div>
            
            {/* Gallery Carousel */}
            <ImageGallery images={CAROUSEL_IMAGES} />
          </div>
          
          {/* Right Column - Mockup */}
          <div className="aspect-[341/743] h-auto w-full max-w-[341px] pointer-events-none relative rounded-[32px] sm:rounded-[42px] shrink-0 flex justify-center items-center overflow-hidden bg-white lg:sticky lg:top-[40px]" data-name="Main screen - Online - Light 1 1">
            <div className="absolute inset-0 max-w-none size-full flex justify-center items-center">
              <img src={rawSvgPhoneMockup} alt="Mockup screen" className="w-full h-full object-cover" />
            </div>
            <div aria-hidden="true" className="absolute border-[3px] border-[#171717] border-solid inset-0 rounded-[32px] sm:rounded-[42px]" />
          </div>
          
        </main>

        {/* Footer with Privacy Policy */}
        <footer className="w-full flex justify-center lg:justify-end pb-[24px]">
          <Link 
            to={`/project/${id}/privacy`}
            className="inline-block font-['Helvetica_Neue',_Arial,_sans-serif] normal-case font-medium text-[#171717] text-[14px] tracking-[0.64px] hover:underline hover:opacity-80 transition-all"
          >
            Privacy Policy
          </Link>
        </footer>
      </div>

      <style>{`
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
