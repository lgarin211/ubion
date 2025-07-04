"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const venue = {
  id: 1,
  name: "Badminton Court",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vehicula, lorem in porttitor gravida, libero urna pellentesque odio, a faucibus neque tellus eleifend tellus. Nulla gravida feugiat velit, et mi consequat auctor.",
  images: [
    "https://images.pexels.com/photos/3076516/pexels-photo-3076516.jpeg",
    "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
    "https://images.pexels.com/photos/4720236/pexels-photo-4720236.jpeg",
    "https://images.pexels.com/photos/4720237/pexels-photo-4720237.jpeg",
    "https://images.pexels.com/photos/4720238/pexels-photo-4720238.jpeg",
    "https://images.pexels.com/photos/4720239/pexels-photo-4720239.jpeg",
    "https://images.pexels.com/photos/4720239/pexels-photo-4720239.jpeg",
    "https://images.pexels.com/photos/4720239/pexels-photo-4720239.jpeg",
    "https://images.pexels.com/photos/4720236/pexels-photo-4720236.jpeg",
    "https://images.pexels.com/photos/4720237/pexels-photo-4720237.jpeg",
    "https://images.pexels.com/photos/4720238/pexels-photo-4720238.jpeg",
    "https://images.pexels.com/photos/4720239/pexels-photo-4720239.jpeg",
    "https://images.pexels.com/photos/4720239/pexels-photo-4720239.jpeg",
    "https://images.pexels.com/photos/4720239/pexels-photo-4720239.jpeg"
  ],
  facilities: [
    { icon: "🚻", name: "Restroom" },
    { icon: "📶", name: "WiFi" },
    { icon: "🚪", name: "Changing Room" },
    { icon: "🎾", name: "Equipment Rent" },
    { icon: "🎾", name: "Equipment Rent2" }
  ],
  price: 250000,
  promo: 0.1,
};

export default function VenueDetailPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const promos = [
    {
      id: 1,
      title: "Promo Ramadhan Month",
      description: "10% discount for new users",
      image: "https://images.pexels.com/photos/4393668/pexels-photo-4393668.jpeg"
    },
    {
      id: 2,
      title: "Weekend Special",
      description: "15% off for weekend bookings",
      image: "https://images.pexels.com/photos/3076516/pexels-photo-3076516.jpeg"
    },
    {
      id: 3,
      title: "Early Bird Promo",
      description: "20% discount for morning slots",
      image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"
    },
    {
      id: 4,
      title: "Student Discount",
      description: "25% off with valid student ID",
      image: "https://images.pexels.com/photos/4720236/pexels-photo-4720236.jpeg"
    },
    {
      id: 5,
      title: "Group Booking",
      description: "30% discount for 5+ people",
      image: "https://images.pexels.com/photos/4720237/pexels-photo-4720237.jpeg"
    }
  ];

  const testimonials = [
    { 
      id: 1,
      name: "Andi Mudi", 
      text: "Ngeran banget tempatnya, udah fasilitas, bersih. Dapat fasilitas yang selengkap.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
    },
    { 
      id: 2,
      name: "Elsa", 
      text: "Lorem ipsum is truly dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an...",
      rating: 4,
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg"
    },
    { 
      id: 3,
      name: "Gatot", 
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an...",
      rating: 5,
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
    },
    { 
      id: 4,
      name: "Maji", 
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an...",
      rating: 4,
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg"
    },
    { 
      id: 5,
      name: "Sarah", 
      text: "Tempat yang sangat nyaman untuk bermain badminton. Pelayanannya juga ramah dan profesional.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
    },
    { 
      id: 6,
      name: "Budi", 
      text: "Harga terjangkau dengan fasilitas yang lengkap. Sangat recommend untuk yang suka olahraga badminton.",
      rating: 4,
      avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg"
    }
  ];

  // Auto swipe effect for testimonial carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Auto swipe effect for gallery
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % venue.images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Auto swipe effect for promo carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promos.length);
    }, 4000); // Change promo every 4 seconds

    return () => clearInterval(interval);
  }, [promos.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % venue.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + venue.images.length) % venue.images.length);
  };

  const nextPromo = () => {
    setCurrentPromoIndex((prev) => (prev + 1) % promos.length);
  };

  const prevPromo = () => {
    setCurrentPromoIndex((prev) => (prev - 1 + promos.length) % promos.length);
  };

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <main className="bg-black min-h-screen text-white">
      <div className="container mx-auto px-6 pt-10">
        {/* Gallery */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 mt-15">
          {/* Main Image - Full Width on Mobile, Half on Desktop */}
          <div className="w-full md:flex-1 rounded-lg overflow-hidden relative">
            <div className="relative w-full h-80">
              {venue.images.map((img, index) => (
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
                    alt={venue.name} 
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
              {venue.images.map((_, index) => (
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
          <div className="w-full md:flex-1 grid grid-cols-2 gap-4">
            {venue.images.slice(1, 5).map((img, i) => (
              <div 
                key={i} 
                className="rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setCurrentImageIndex(i + 1)}
              >
                <Image 
                  src={img} 
                  alt={venue.name} 
                  width={400} 
                  height={250} 
                  className="object-cover w-full h-36" 
                />
              </div>
            ))}
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
                <h3 className="text-xl font-bold text-black">All Photos - {venue.name}</h3>
                <button
                  onClick={() => setShowAllPhotos(false)}
                  className="text-black hover:text-gray-600 text-2xl font-bold"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {venue.images.map((img, index) => (
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
                      alt={`${venue.name} - Photo ${index + 1}`} 
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

        {/* Venue Info */}
        <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>
        <p className="mb-6 text-gray-200 max-w-2xl">{venue.description}</p>
        {/* Facilities */}
        <div className="flex flex-wrap gap-3 mb-8">
          {venue.facilities.map((f, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg text-white">
              <span>{f.icon}</span> {f.name}
            </div>
          ))}
        </div>
        {/* Booking & Availability */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Availability Calendar (dummy) */}
          <div className="bg-white rounded-lg p-6 text-black flex-1">
            <h2 className="font-bold text-lg mb-2 text-green-700">Availability</h2>
            <div className="bg-gray-100 rounded p-4 text-center">[Calendar Here]</div>
          </div>
          {/* Booking Form */}
          <div className="bg-white rounded-lg p-6 text-black flex-1">
            <h2 className="font-bold text-lg mb-2 text-green-700">Booking Venue</h2>
            <div className="mb-2">Rp. {venue.price.toLocaleString()}/hour</div>
            <form className="flex flex-col gap-3">
              <input type="date" className="border rounded px-2 py-1" />
              <select className="border rounded px-2 py-1">
                <option>1 hour</option>
                <option>2 hours</option>
              </select>
              <input type="time" className="border rounded px-2 py-1" />
              <div className="text-green-700">Promo: Badminton Month Discount Promo: 10%</div>
              <div className="font-bold">Total: Rp. {(venue.price * (1 - venue.promo)).toLocaleString()}</div>
              <Button className="bg-teal-400 text-black">Submit Payment</Button>
            </form>
          </div>
        </div>
        {/* Promo Section (carousel) */}
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
        {/* Testimonial Section (carousel) */}
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
      </div>
    </main>
  );
}
