"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { parseAndFormatImageList, getBaseUrl } from "@/lib/imageUtils";

interface FacilityDetail {
  id: number;
  idfacility: number;
  nama_fasilitas: string;
  pricehours: number;
  description: string;
  list_sf: string;
  list_f: string;
  f_type: string;
  f_additional: string | null;
  sf_additional: string | null;
}

interface AvailableTime {
  time: string;
  label: string;
  hour: number;
}

export default function VenueDetailPage() {
  const params = useParams();
  const facilityId = params.id as string;
  
  const [facilityData, setFacilityData] = useState<FacilityDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  
  // New state for sub-facility booking
  const [selectedSubFacility, setSelectedSubFacility] = useState<FacilityDetail | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  });
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);

  useEffect(() => {
    const fetchFacilityData = async () => {
      try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/getlistFasility/${facilityId}`);
        const data = await response.json();
        setFacilityData(data);
        
        // Set the first facility as default selected sub-facility
        if (data.length > 0) {
          setSelectedSubFacility(data[0]);
        }
      } catch (error) {
        console.error('Error fetching facility data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (facilityId) {
      fetchFacilityData();
    }
  }, [facilityId]);

  // Fetch available times when sub-facility or date changes
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!selectedSubFacility || !selectedDate) return;
      
      setLoadingTimes(true);
      try {
        const baseUrl = getBaseUrl();
        // Format date from YYYY-MM-DD to DD-MM-YY
        const formattedDate = formatDateForAPI(selectedDate);
        const response = await fetch(
          `${baseUrl}/api/getlistFasility/${selectedSubFacility.idfacility}/${selectedSubFacility.id}?date_start=${formattedDate}`
        );
        const data = await response.json();
        setAvailableTimes(data.available_times || []);
      } catch (error) {
        console.error('Error fetching available times:', error);
        setAvailableTimes([]);
      } finally {
        setLoadingTimes(false);
      }
    };

    fetchAvailableTimes();
  }, [selectedSubFacility, selectedDate]);

  // Helper function to format date for API
  const formatDateForAPI = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  };

  // Helper function to check if times are consecutive
  const areTimesConsecutive = (times: string[]): boolean => {
    if (times.length <= 1) return true;
    
    const sortedTimes = times.sort((a, b) => {
      const hourA = parseInt(a.split(':')[0]);
      const hourB = parseInt(b.split(':')[0]);
      return hourA - hourB;
    });
    
    for (let i = 1; i < sortedTimes.length; i++) {
      const currentHour = parseInt(sortedTimes[i].split(':')[0]);
      const prevHour = parseInt(sortedTimes[i-1].split(':')[0]);
      if (currentHour !== prevHour + 1) {
        return false;
      }
    }
    return true;
  };

  // Helper function to handle time slot selection
  const handleTimeSlotClick = (clickedTime: string) => {
    setSelectedTimes(prevTimes => {
      const newTimes = prevTimes.includes(clickedTime)
        ? prevTimes.filter(time => time !== clickedTime)
        : [...prevTimes, clickedTime];
      
      // Check if the new selection is consecutive
      if (areTimesConsecutive(newTimes)) {
        return newTimes;
      } else {
        // If not consecutive, start a new selection from the clicked time
        return [clickedTime];
      }
    });
  };

  // Helper function to get formatted time range for display
  const getTimeRangeDisplay = (): string => {
    if (selectedTimes.length === 0) return '';
    if (selectedTimes.length === 1) return selectedTimes[0];
    
    const sortedTimes = selectedTimes.sort((a, b) => {
      const hourA = parseInt(a.split(':')[0]);
      const hourB = parseInt(b.split(':')[0]);
      return hourA - hourB;
    });
    
    return `${sortedTimes[0]} - ${sortedTimes[sortedTimes.length - 1]}`;
  };

  // Calculate total price
  const calculateTotalPrice = (): number => {
    if (!selectedSubFacility || selectedTimes.length === 0) return 0;
    const basePrice = selectedSubFacility.pricehours * selectedTimes.length;
    return basePrice * 0.9; // Apply 10% discount
  };

  // Parse image lists from API data
  const getImages = () => {
    if (!facilityData.length) return [];
    
    const allImages: string[] = [];
    facilityData.forEach(facility => {
      // Parse and format facility images
      const facilityImages = parseAndFormatImageList(facility.list_f);
      const subFacilityImages = parseAndFormatImageList(facility.list_sf);
      
      // Add all images to the array
      allImages.push(...facilityImages, ...subFacilityImages);
    });
    
    return allImages;
  };

  const images = getImages();
  const mainFacility = facilityData[0];

  // Fallback data for demo purposes
  const venue = {
    id: facilityId,
    name: mainFacility?.nama_fasilitas || "Coming Soon",
    description: mainFacility?.description || "Exciting new sports facility coming soon!",
    images: images.length > 0 ? images : [
      "https://images.pexels.com/photos/3076516/pexels-photo-3076516.jpeg"
    ],
    facilities: [
      { icon: "🚻", name: "Restroom" },
      { icon: "📶", name: "WiFi" },
      { icon: "🚪", name: "Changing Room" },
      { icon: "🎾", name: "Equipment Rent" },
    ],
    price: mainFacility?.pricehours || 250000,
    promo: 0.1,
  };

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
    if (venue.images.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % venue.images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [venue.images.length]);

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
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏗️</div>
            <div className="text-gray-300 font-semibold text-2xl mb-2">Coming Soon</div>
            <div className="text-gray-400 text-lg max-w-md mx-auto">
              Exciting sports facilities are being prepared! Stay tuned for amazing experiences.
            </div>
          </div>
        </div>
      ) : (
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
          {/* Side Images - Full Width on Mobile (below main image), Half on Desktop */}
          <div className="w-full md:flex-1">
            <div className="grid grid-cols-4 md:grid-cols-2 gap-4">
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
        <div className="mb-6 text-gray-200 max-w-2xl" 
             dangerouslySetInnerHTML={{ __html: mainFacility?.description || "Exciting new sports facility coming soon!" }} 
        />
        
        {/* Facility Type */}
        {mainFacility?.f_type && (
          <div className="mb-4">
            <span className="bg-teal-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
              {mainFacility.f_type}
            </span>
          </div>
        )}

        {/* Sub-facilities Selection */}
        {facilityData.length > 1 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-teal-400">Available Sub-Facilities:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {facilityData.map((facility) => (
                <div 
                  key={facility.id} 
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedSubFacility?.id === facility.id 
                      ? 'bg-teal-400 text-black' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedSubFacility(facility)}
                >
                  <div className="font-semibold">{facility.nama_fasilitas}</div>
                  <div className={`text-sm ${
                    selectedSubFacility?.id === facility.id ? 'text-black' : 'text-teal-400'
                  }`}>
                    Rp. {facility.pricehours.toLocaleString()}/hour
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
          {/* Available Times Display */}
          {loadingTimes ? (
            <div className="bg-white rounded-lg p-6 text-black flex-1">
              <h2 className="font-bold text-lg mb-4 text-green-700">Available Times</h2>
              <div className="text-center py-4">Loading available times...</div>
            </div>
          ) : availableTimes.length > 0 ? (
            <>
              <div className="bg-white rounded-lg p-6 text-black flex-1">
                <h2 className="font-bold text-lg mb-4 text-green-700">Available Times</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Select Date:</label>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                
                <div>
                  <div className="mb-3 text-sm text-gray-600">
                    Click time slots to select. You can select multiple consecutive hours.
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                    {availableTimes.map((timeSlot) => (
                      <button
                        key={timeSlot.time}
                        onClick={() => handleTimeSlotClick(timeSlot.time)}
                        className={`p-2 rounded text-xs transition-all ${
                          selectedTimes.includes(timeSlot.time)
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                      >
                        <div className="font-semibold">{timeSlot.time}</div>
                        <div className="text-xs">{timeSlot.label}</div>
                      </button>
                    ))}
                  </div>
                  {selectedTimes.length > 0 && (
                    <div className="mt-3 p-2 bg-green-100 rounded text-sm">
                      <strong>Selected:</strong> {getTimeRangeDisplay()} 
                      <span className="text-gray-600"> ({selectedTimes.length} hour{selectedTimes.length > 1 ? 's' : ''})</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Booking Form - Only show when there are available times */}
              <div className="bg-white rounded-lg p-6 text-black flex-1">
                <h2 className="font-bold text-lg mb-4 text-green-700">Booking Venue</h2>
                
                {/* Selected Sub-facility Info */}
                {selectedSubFacility && (
                  <div className="mb-4 p-3 bg-gray-100 rounded">
                    <div className="font-semibold text-green-700">{selectedSubFacility.nama_fasilitas}</div>
                    <div className="text-sm text-gray-600">{selectedSubFacility.f_type}</div>
                    <div className="font-bold">Rp. {selectedSubFacility.pricehours.toLocaleString()}/hour</div>
                  </div>
                )}
                
                <form className="flex flex-col gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Selected Date:</label>
                    <input 
                      type="text" 
                      value={selectedDate}
                      readOnly
                      className="border rounded px-2 py-1 w-full bg-gray-50" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Selected Time(s):</label>
                    <input 
                      type="text" 
                      value={getTimeRangeDisplay()}
                      readOnly
                      placeholder="Select time slot(s) from the left"
                      className="border rounded px-2 py-1 w-full bg-gray-50" 
                    />
                    {selectedTimes.length > 0 && (
                      <div className="text-xs text-gray-600 mt-1">
                        Duration: {selectedTimes.length} hour{selectedTimes.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-green-700 text-sm">Promo: 10% discount available</div>
                  <div className="font-bold">
                    Total: Rp. {calculateTotalPrice().toLocaleString()}
                  </div>
                  
                  <Button 
                    className="bg-teal-400 text-black hover:bg-teal-500"
                    disabled={selectedTimes.length === 0 || !selectedDate}
                  >
                    {selectedTimes.length === 0 ? 'Select Time First' : 'Submit Payment'}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-6 text-black flex-1 flex items-center justify-center">
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🏗️</div>
                <div className="text-gray-500 font-semibold text-lg mb-2">Coming Soon</div>
                <div className="text-gray-400 text-sm max-w-xs mx-auto">
                  New time slots will be available soon! Stay tuned for booking opportunities.
                </div>
              </div>
            </div>
          )}
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
      )}
    </main>
  );
}
