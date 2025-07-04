import { Button } from "@/components/ui/button"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";

interface HeroSectionProps {
  data?: {
    title: string;
    big_banner: string;
    big_welcome: string;
  };
}

export function HeroSection({ data }: HeroSectionProps) {
  // Default content jika data belum ada
  const title = data?.title || "Welcome to Plaza Festival";
  const banner = data?.big_banner || "";
  const welcomeText = data?.big_welcome || "Your premiere destination for dining, shopping and entertainment in the city center.";

  // Parse HTML content untuk mendapatkan text yang bersih
  const parseHtmlContent = (htmlString: string): string => {
    return htmlString.replace(/<[^>]*>/g, '').replace(/&mdash;/g, '—');
  };

  const cleanWelcomeText = parseHtmlContent(welcomeText);

  return (
    <section className="relative h-[600px] bg-gradient-to-r from-black to-gray-800">
      {/* Background Image dari API */}
      {banner && (
        <div className="absolute inset-0">
          <Image
            src={banner}
            alt="Plaza Festival Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
      )}
      
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 4000 }}
        className="h-full relative z-10"
      >
        <SwiperSlide>
          <div className="container mx-auto px-6 py-32 h-full flex items-center">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold text-white mb-6">
                {title}
              </h1>
              <p className="text-gray-200 mb-8 max-w-xl text-lg leading-relaxed">
                {cleanWelcomeText}
              </p>
              <Button size="lg" className="bg-[#8BC34A] hover:bg-[#7CB342]">
                Book Now
              </Button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="container mx-auto px-6 py-32 h-full flex items-center">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold text-white mb-6">Discover Our Food Court</h1>
              <p className="text-gray-200 mb-8 max-w-xl text-lg">Enjoy a variety of delicious cuisines from around the world.</p>
              <Button size="lg" className="bg-[#8BC34A] hover:bg-[#7CB342]">
                Explore Food
              </Button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="container mx-auto px-6 py-32 h-full flex items-center">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold text-white mb-6">Join Our Events</h1>
              <p className="text-gray-200 mb-8 max-w-xl text-lg">Exciting events and activities for everyone, all year round.</p>
              <Button size="lg" className="bg-[#8BC34A] hover:bg-[#7CB342]">
                View Events
              </Button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  )
}
