import { Button } from "@/components/ui/button"
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";

interface HeroSlide {
  id: string;
  banner: string;
  title: string;
  desc: string;
  created_at: string;
  updated_at: string;
}

interface HeroSectionProps {
  data?: HeroSlide[];
}

export function HeroSection({ data }: HeroSectionProps) {
  // Parse HTML content untuk mendapatkan text yang bersih
  const parseHtmlContent = (htmlString: string): string => {
    return htmlString.replace(/<[^>]*>/g, '').replace(/&mdash;/g, '—');
  };

  // Helper function untuk mendapatkan full URL gambar
  const getFullImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return "https://images.pexels.com/photos/2861656/pexels-photo-2861656.jpeg";
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
    return `${baseUrl}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
  };

  // Default slides jika data belum tersedia
  const defaultSlides: HeroSlide[] = [
    {
      id: "1",
      banner: "https://images.pexels.com/photos/2861656/pexels-photo-2861656.jpeg",
      title: "Welcome to Plaza Festival",
      desc: "<p>Your premiere destination for dining, shopping and entertainment in the city center.</p>",
      created_at: "",
      updated_at: ""
    },
    {
      id: "2", 
      banner: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
      title: "Discover Our Food Court",
      desc: "<p>Enjoy a variety of delicious cuisines from around the world.</p>",
      created_at: "",
      updated_at: ""
    },
    {
      id: "3",
      banner: "https://images.pexels.com/photos/3076516/pexels-photo-3076516.jpeg", 
      title: "Join Our Events",
      desc: "<p>Exciting events and activities for everyone, all year round.</p>",
      created_at: "",
      updated_at: ""
    }
  ];

  const slides = data && data.length > 0 ? data : defaultSlides;

  return (
    <section className="relative h-[600px] bg-gradient-to-r from-black to-gray-800">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ 
          delay: 5000,
          disableOnInteraction: false 
        }}
        pagination={{ 
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active'
        }}
        navigation={true}
        className="h-full relative z-10"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {/* Background Image untuk setiap slide */}
            <div className="absolute inset-0">
              <Image
                src={getFullImageUrl(slide.banner)}
                alt={parseHtmlContent(slide.title)}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/60"></div>
            </div>
            
            {/* Content untuk setiap slide */}
            <div className="container mx-auto px-6 py-32 h-full flex items-center relative z-10">
              <div className="max-w-3xl">
                <h1 className="text-5xl font-bold text-white mb-6">
                  {parseHtmlContent(slide.title)}
                </h1>
                <div 
                  className="text-gray-200 mb-8 max-w-xl text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: slide.desc }}
                />
                <Button size="lg" className="bg-[#8BC34A] hover:bg-[#7CB342]">
                  Learn More
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Pagination Styles */}
      <style jsx global>{`
        .swiper-pagination {
          bottom: 20px !important;
        }
        .swiper-pagination-bullet {
          width: 12px !important;
          height: 12px !important;
          background: rgba(255, 255, 255, 0.5) !important;
          opacity: 1 !important;
        }
        .swiper-pagination-bullet-active {
          background: #8BC34A !important;
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: white !important;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px !important;
        }
      `}</style>
    </section>
  )
}
