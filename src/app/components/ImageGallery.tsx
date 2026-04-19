import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
}

function NextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <button
      className={`absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-[#7d7d7d] hover:bg-[#666666] text-white rounded-full w-12 h-12 transition-all shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 ${className?.includes('slick-disabled') ? 'hidden' : ''}`}
      onClick={onClick}
      aria-label="Next"
    >
      <ChevronRight size={28} strokeWidth={3} />
    </button>
  );
}

function PrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <button
      className={`absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-[#7d7d7d] hover:bg-[#666666] text-white rounded-full w-12 h-12 transition-all shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 ${className?.includes('slick-disabled') ? 'hidden' : ''}`}
      onClick={onClick}
      aria-label="Previous"
    >
      <ChevronLeft size={28} strokeWidth={3} />
    </button>
  );
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const inlineSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    variableWidth: true,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const modalSettings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: selectedIndex || 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="relative group pt-[32px] pb-[16px] w-[100vw] lg:w-[calc(100%+32px)] ml-[-24px] lg:ml-[-16px] pl-[24px] lg:pl-[16px] pr-[24px]">
      <style>{`
        .gallery-slider {
          margin: 0 -6px;
        }
        .gallery-slider .slick-slide {
          padding: 0 6.578px; /* Half of 13.156px gap */
          height: auto;
        }
        .modal-slider .group-hover\\:opacity-100 {
          opacity: 1 !important;
        }

        .modal-slider .absolute.left-4 {
          left: 2rem;
          width: 48px;
          height: 48px;
        }
        .modal-slider .absolute.right-4 {
          right: 2rem;
          width: 48px;
          height: 48px;
        }
      `}</style>
      
      <Slider {...inlineSettings} className="gallery-slider">
        {images.map((img, idx) => (
          <div key={idx} className="outline-none py-1">
            <div 
              className="relative rounded-[16.445px] shrink-0 w-[160px] sm:w-[170px] cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedIndex(idx)}
            >
              <img 
                src={img} 
                alt={`Screenshot ${idx + 1}`} 
                className="w-full h-auto block rounded-[16.445px]"
              />
              <div aria-hidden="true" className="absolute border-[#171717] border-[1.644px] border-solid inset-[-0.822px] rounded-[17.267px] pointer-events-none mix-blend-overlay" />
            </div>
          </div>
        ))}
      </Slider>

      {/* Fullscreen Lightbox Modal */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col justify-center items-center"
          onClick={() => setSelectedIndex(null)}
        >
          <button 
            className="absolute top-6 right-6 z-50 text-white/70 hover:text-white bg-black/50 hover:bg-black p-2 rounded-full transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(null);
            }}
          >
            <X size={32} />
          </button>
          
          <div 
            className="w-full max-w-5xl px-12 group modal-slider"
            onClick={(e) => e.stopPropagation()}
          >
            <Slider {...modalSettings}>
              {images.map((img, idx) => (
                <div key={idx} className="outline-none flex justify-center items-center py-8">
                  <img 
                    src={img} 
                    alt={`Fullscreen Screenshot ${idx + 1}`} 
                    className="max-h-[80vh] w-auto mx-auto object-contain rounded-2xl shadow-2xl"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </div>
  );
}
