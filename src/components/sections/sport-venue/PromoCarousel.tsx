"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Promo {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface PromoCarouselProps {
  promos: Promo[];
  currentPromoIndex: number;
  nextPromo: () => void;
  prevPromo: () => void;
  setCurrentPromoIndex: (index: number) => void;
}

export function PromoCarousel({
  promos,
  currentPromoIndex,
  nextPromo,
  prevPromo,
  setCurrentPromoIndex,
}: PromoCarouselProps) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Check Promo For This Venue Sport</h2>
      <div className="relative mb-12 flex justify-center">
        <div className="max-w-4xl w-full relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentPromoIndex * 100}%)` }}
          >
            {promos.map((promo) => (
              <div 
                key={promo.id} 
                className="w-full flex-shrink-0 px-2"
              >
                <div className="bg-white rounded-lg p-4 text-black mx-auto max-w-sm">
                  <div className="mb-3 rounded-lg overflow-hidden">
                    <Image 
                      src={promo.image} 
                      alt={promo.title} 
                      width={300} 
                      height={150} 
                      className="object-cover w-full h-32" 
                    />
                  </div>
                  <div className="font-bold mb-2">{promo.title}</div>
                  <div className="mb-3">{promo.description}</div>
                  <Button className="bg-teal-400 text-black w-full">Get Promo</Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={prevPromo}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
          >
            ←
          </button>
          <button 
            onClick={nextPromo}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
          >
            →
          </button>
          
          {/* Dots Indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {promos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPromoIndex(index)}
                aria-label={`Go to promo ${index + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentPromoIndex ? 'bg-teal-400' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
