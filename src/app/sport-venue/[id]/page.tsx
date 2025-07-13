"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { parseAndFormatImageList, getBaseUrl } from "@/lib/imageUtils";
import { ImageGallery } from "@/components/sections/sport-venue/ImageGallery";
import { VenueInfo } from "@/components/sections/sport-venue/VenueInfo";
import { BookingSection } from "@/components/sections/sport-venue/BookingSection";
import { CheckoutModal } from "@/components/sections/sport-venue/CheckoutModal";
import { CheckoutTicketHourly } from "@/components/sections/sport-venue/CheckoutTicketHourly";
import { PaymentConfirmationModal } from "@/components/sections/sport-venue/PaymentConfirmationModal";
import { PromoCarousel } from "@/components/sections/sport-venue/PromoCarousel";
import { TestimonialCarousel } from "@/components/sections/sport-venue/TestimonialCarousel";


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

interface CustomerDetails {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
}

interface PaymentMethods {
  success: boolean;
  payment_methods: {
    [key: string]: {
      type: string;
      name: string;
      description: string;
      enabled: boolean;
      icon: string;
      banks?: { [key: string]: { name: string; code: string } };
      providers?: { [key: string]: { name: string; code: string } };
      stores?: { [key: string]: { name: string; code: string } };
    };
  };
}

export default function VenueDetailPage() {
  // Ticket count state for hourly ticket purchase (facilityId==1)
  const [ticketCount, setTicketCount] = useState(0);
  const params = useParams();
  const facilityId = params.id as string;
  
  const [facilityData, setFacilityData] = useState<FacilityDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
  
  // Checkout state
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods | null>(null);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>('');
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState<string>('');
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: ''
  });
  const [submittingTransaction, setSubmittingTransaction] = useState(false);

  // Load customer details from localStorage on component mount
  useEffect(() => {
    const savedCustomerDetails = localStorage.getItem('customerDetails');
    if (savedCustomerDetails) {
      try {
        const parsed = JSON.parse(savedCustomerDetails);
        setCustomerDetails(parsed);
      } catch (error) {
        console.error('Error parsing saved customer details:', error);
      }
    }
  }, []);

  // Save customer details to localStorage whenever they change
  useEffect(() => {
    if (customerDetails.first_name || customerDetails.email) {
      localStorage.setItem('customerDetails', JSON.stringify(customerDetails));
    }
  }, [customerDetails]);

  // Fetch payment methods
  const fetchPaymentMethods = async () => {
    setLoadingPaymentMethods(true);
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/payment-methods`);
      const data = await response.json();
      setPaymentMethods(data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoadingPaymentMethods(false);
    }
  };

  // Handle checkout button click
  // Listen for event from CheckoutTicketHourly to set selectedTimes
  useEffect(() => {
    const handler = (e: CustomEvent<string[]>) => {
      setSelectedTimes(e.detail);
    };
    window.addEventListener('setSelectedTimesForTicket', handler as EventListener);
    return () => window.removeEventListener('setSelectedTimesForTicket', handler as EventListener);
  }, []);

  const handleCheckout = async () => {
    setShowCheckout(true);
    if (!paymentMethods) {
      await fetchPaymentMethods();
    }
  };

  // Handle customer details change
  const handleCustomerDetailsChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Show payment confirmation modal
  const showPaymentConfirmationModal = () => {
    if (!selectedSubFacility || selectedTimes.length === 0) {
      alert('Please select a facility and time slots');
      return;
    }

    if (!customerDetails.first_name || !customerDetails.email || !customerDetails.phone) {
      alert('Please fill in required customer details');
      return;
    }

    if (!selectedPaymentType) {
      alert('Please select a payment method');
      return;
    }

    setShowPaymentConfirmation(true);
  };

  // Submit transaction (after confirmation)
  const submitTransaction = async () => {
    setSubmittingTransaction(true);
    try {
      const baseUrl = getBaseUrl();
      // Only use the base URL (protocol + host) for urlformRq
      const { protocol, host } = window.location;
      const baseUrlOnly = `${protocol}//${host}`;

      const transactionData = {
        idsubfacility: selectedSubFacility!.id,
        time_start: selectedTimes,
        price: calculateTotalPrice(),
        transactionpoin: selectedPaymentType,
        date_start: selectedDate,
        urlformRq: baseUrlOnly,
        detail: {
          payment_type: selectedPaymentType,
          customer_details: customerDetails,
          ...(selectedPaymentDetails && {
            [selectedPaymentType === 'bank_transfer' ? 'bank' : 
              selectedPaymentType === 'e_wallet' ? 'ewallet_provider' : 
              selectedPaymentType === 'convenience_store' ? 'store' : 'provider']: selectedPaymentDetails
          })
        }
      };

      const response = await fetch(`${baseUrl}/api/makeTransaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
      });

      const result = await response.json();

      // Save transaction to history (all statuses)
      const trxid = result.order_id || result.transaction_id || `trx_${Date.now()}`;
      const historyItem = {
        trxid,
        amount: result.midtrans_response?.amount || calculateTotalPrice(),
        method: selectedPaymentType,
        status: result.transaction_status || result.status || (response.ok ? 'success' : 'failed'),
        payment_url: result.payment_url,
        date: new Date().toISOString(),
      };
      let history = [];
      try {
        history = JSON.parse(localStorage.getItem('transaction_history') || '[]');
      } catch {}
      history.unshift(historyItem);
      localStorage.setItem('transaction_history', JSON.stringify(history.slice(0, 50)));

      // Send WhatsApp notification if phone and payment_url are available
      const phone = customerDetails.phone?.replace(/[^0-9]/g, '');
      const waNumber = phone.toString();
      // if (waNumber && waNumber.startsWith('0')) {
      //   waNumber = '08' + waNumber.slice(1); // Ensure starts with 08
      // }
      if (waNumber && result.payment_url) {
        const message = encodeURIComponent(
          `Selamat Pesanan Anda sudah di buat harap melakukan pembayaran pelunasan di link berikut \n\n${result.payment_url}\n\nalam kami Plaza Festival`
        );
        // Fire and forget, don't block UI
        fetch(`https://caseoptheligaandnewligawkwkkw.progesio.my.id/send-message-get?no=${waNumber}&mass=${message}`)
          .catch((err) => console.error('Failed to send WhatsApp notification:', err));
      }

      if (response.ok) {
        // Check if the transaction was created successfully and has payment_url
        if (result.success && result.payment_url) {
          // Show success message with order details
          const orderMessage = `Transaction created successfully!\n\nOrder ID: ${result.order_id}\nTransaction ID: ${result.transaction_id}\nAmount: Rp. ${result.midtrans_response?.amount?.toLocaleString() || calculateTotalPrice().toLocaleString()}\n\nYou will be redirected to payment page.`;
          alert(orderMessage);
          // Reset form and close modals
          setShowPaymentConfirmation(false);
          setShowCheckout(false);
          setSelectedTimes([]);
          setSelectedPaymentType('');
          setSelectedPaymentDetails('');
          // Open payment URL in a new tab/window
          window.open(result.payment_url, '_blank');
        } else {
          alert('Transaction submitted successfully!');
          setShowPaymentConfirmation(false);
          setShowCheckout(false);
          setSelectedTimes([]);
          setSelectedPaymentType('');
          setSelectedPaymentDetails('');
        }
      } else {
        alert(`Transaction failed: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      alert('Failed to submit transaction. Please try again.');
    } finally {
      setSubmittingTransaction(false);
    }
  };

  useEffect(() => {
    const fetchFacilityData = async () => {
      try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/getlistFasility/${facilityId}`);
        let data = await response.json();
        // Fix typo and parse sf_additional if exists
        data.forEach((facility: FacilityDetail) => {
          if (facility.sf_additional) {
            facility.sf_additional = JSON.parse(facility.sf_additional);
          }
          if (facility.f_additional) {
            facility.f_additional = JSON.parse(facility.f_additional);
          }
        });

        // Jika facilityId adalah '1', hanya gunakan sub-fasilitas yang sf_additional (setelah di-parse) memiliki start dan end yang mencakup waktu sekarang
        console.log('Facility ID:', facilityId);
        console.log('Original facility data:', data);
        if (facilityId == "1") {
          const now = new Date();
          const nowMinutes = now.getHours() * 60 + now.getMinutes();
          const tempdata: FacilityDetail[] = data.filter((facility: FacilityDetail) => {
            if (!facility.sf_additional) return false;
            const sf = facility.sf_additional as { start?: string; end?: string };
            if (!sf.start || !sf.end) return false;
            // Normalisasi format jam (titik ke titik dua)
            const start = sf.start.replace('.', ':');
            const end = sf.end.replace('.', ':');
            const [startHour, startMinute] = start.split(':').map(Number);
            const [endHour, endMinute] = end.split(':').map(Number);
            const startTotal = startHour * 60 + startMinute;
            const endTotal = endHour * 60 + endMinute;
            // Support range melewati tengah malam
            if (endTotal < startTotal) {
              return nowMinutes >= startTotal || nowMinutes <= endTotal;
            } else {
              return nowMinutes >= startTotal && nowMinutes <= endTotal;
            }
          });
          console.log('Filtered facility data:', tempdata);
          data = tempdata;
        }

        console.log('Parsed facility data:', data);
        setFacilityData(data);
        // Set the first facility as default selected sub-facility
        if (data.length > 0) {
          setSelectedSubFacility(data[0]);
        } else {
          setSelectedSubFacility(null);
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
        {/* Image Gallery */}
        <ImageGallery
          images={venue.images}
          venueName={venue.name}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
          nextImage={nextImage}
          prevImage={prevImage}
        />

        {/* Venue Information */}
        <VenueInfo
          venue={venue}
          mainFacility={mainFacility}
          facilityData={facilityData}
          selectedSubFacility={selectedSubFacility}
          onSubFacilitySelect={setSelectedSubFacility}
        />

        {/* Booking Section */}
        {facilityId == "1" ? (
          <CheckoutTicketHourly
            pricePerTicket={selectedSubFacility?.pricehours || 0}
            selectedSubFacility={selectedSubFacility}
            ticketCount={ticketCount}
            setTicketCount={setTicketCount}
            onCheckout={handleCheckout}
          />
        ) : (
          <BookingSection
            loadingTimes={loadingTimes}
            availableTimes={availableTimes}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTimes={selectedTimes}
            handleTimeSlotClick={handleTimeSlotClick}
            getTimeRangeDisplay={getTimeRangeDisplay}
            selectedSubFacility={selectedSubFacility}
            calculateTotalPrice={calculateTotalPrice}
            onCheckout={handleCheckout}
          />
        )}

        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          selectedSubFacility={selectedSubFacility}
          selectedDate={selectedDate}
          selectedTimes={selectedTimes}
          getTimeRangeDisplay={getTimeRangeDisplay}
          calculateTotalPrice={calculateTotalPrice}
          customerDetails={customerDetails}
          handleCustomerDetailsChange={handleCustomerDetailsChange}
          paymentMethods={paymentMethods}
          loadingPaymentMethods={loadingPaymentMethods}
          selectedPaymentType={selectedPaymentType}
          setSelectedPaymentType={setSelectedPaymentType}
          selectedPaymentDetails={selectedPaymentDetails}
          setSelectedPaymentDetails={setSelectedPaymentDetails}
          submittingTransaction={submittingTransaction}
          onSubmitTransaction={showPaymentConfirmationModal}
          ticketCount={facilityId == "1" ? ticketCount : undefined}
          ticketTotal={facilityId == "1" ? ticketCount * (selectedSubFacility?.pricehours || 0) : undefined}
        />

        {/* Payment Confirmation Modal */}
        <PaymentConfirmationModal
          isOpen={showPaymentConfirmation}
          onClose={() => setShowPaymentConfirmation(false)}
          onConfirm={submitTransaction}
          selectedSubFacility={selectedSubFacility}
          selectedDate={selectedDate}
          selectedTimes={selectedTimes}
          getTimeRangeDisplay={getTimeRangeDisplay}
          calculateTotalPrice={calculateTotalPrice}
          customerDetails={customerDetails}
          selectedPaymentType={selectedPaymentType}
          selectedPaymentDetails={selectedPaymentDetails}
          submittingTransaction={submittingTransaction}
        />

        {/* Promo Section */}
        <PromoCarousel
          promos={promos}
          currentPromoIndex={currentPromoIndex}
          nextPromo={nextPromo}
          prevPromo={prevPromo}
          setCurrentPromoIndex={setCurrentPromoIndex}
        />
        {/* Testimonial Section */}
        <TestimonialCarousel
          testimonials={testimonials}
          currentTestimonialIndex={currentTestimonialIndex}
          nextTestimonial={nextTestimonial}
          prevTestimonial={prevTestimonial}
          setCurrentTestimonialIndex={setCurrentTestimonialIndex}
        />
        </div>
      )}
    </main>
  );
}
