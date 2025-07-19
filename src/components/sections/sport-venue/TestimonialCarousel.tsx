"use client";

import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
  avatar: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  currentTestimonialIndex: number;
  nextTestimonial: () => void;
  prevTestimonial: () => void;
  setCurrentTestimonialIndex: (index: number) => void;
}

export function TestimonialCarousel({
  testimonials,
  currentTestimonialIndex,
  nextTestimonial,
  prevTestimonial,
  setCurrentTestimonialIndex,
}: TestimonialCarouselProps) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">What do they say about <span className="text-green-400">this place?</span></h2>
      <div className="relative mb-12 flex justify-center">
        <div className="max-w-4xl w-full relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentTestimonialIndex * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="w-full flex-shrink-0 px-2"
              >
                <div className="bg-white rounded-lg p-6 text-black mx-auto max-w-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <Image 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        width={64} 
                        height={64} 
                        className="object-cover w-full h-full" 
                      />
                    </div>
                    <div>
                      <div className="font-bold text-lg">{testimonial.name}</div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-base leading-relaxed">{testimonial.text}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
          >
            ←
          </button>
          <button 
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
          >
            →
          </button>
          
          {/* Dots Indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonialIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentTestimonialIndex ? 'bg-green-400' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
