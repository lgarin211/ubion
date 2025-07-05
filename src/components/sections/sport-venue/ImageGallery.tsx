"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  venueName: string;
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
  nextImage: () => void;
  prevImage: () => void;
}

export function ImageGallery({
  images,
  venueName,
  currentImageIndex,
  setCurrentImageIndex,
  nextImage,
  prevImage,
}: ImageGalleryProps) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  return (
    <>
      {/* Gallery */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 mt-15">
        {/* Main Image - Full Width on Mobile, Half on Desktop */}
        <div className="w-full md:flex-1 rounded-lg overflow-hidden relative">
          <div className="relative w-full h-80">
            {images.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                  index === currentImageIndex 
                    ? 'translate-x-0' 
                    : index < currentImageIndex 
                      ? '-translate-x-full' 
                      : 'translate-x-full'
                }`}
              >
                <Image 
                  src={img} 
                  alt={venueName} 
                  width={400} 
                  height={500} 
                  className="object-cover w-full h-80" 
                />
              </div>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
          >
            ←
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
          >
            →
          </button>
          
          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`Go to image ${index + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Side Images - Full Width on Mobile (below main image), Half on Desktop */}
        <div className="w-full md:flex-1">
          <div className="grid grid-cols-4 md:grid-cols-2 gap-4">
            {images.slice(1, 5).map((img, i) => (
              <div 
                key={i} 
                className="rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setCurrentImageIndex(i + 1)}
              >
                <Image 
                  src={img} 
                  alt={venueName} 
                  width={400} 
                  height={250} 
                  className="object-cover w-full h-36" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center rounded-lg overflow-hidden bg-gray-800 mb-4">
        <Button 
          className="bg-teal-400 text-black text-sm"
          onClick={() => setShowAllPhotos(true)}
        >
          Show all photos
        </Button>
      </div>

      {/* All Photos Modal */}
      {showAllPhotos && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto w-full">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-black">All Photos - {venueName}</h3>
              <button
                onClick={() => setShowAllPhotos(false)}
                className="text-black hover:text-gray-600 text-2xl font-bold"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div 
                  key={index} 
                  className="rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setShowAllPhotos(false);
                  }}
                >
                  <Image 
                    src={img} 
                    alt={`${venueName} - Photo ${index + 1}`} 
                    width={300} 
                    height={200} 
                    className="object-cover w-full h-48" 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
