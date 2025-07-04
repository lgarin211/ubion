import { Button } from "@/components/ui/button"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export function HeroSection() {
  return (
    <section className="relative h-[600px] bg-gradient-to-r from-black to-gray-800">
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 4000 }}
        className="h-full"
      >
        <SwiperSlide>
          <div className="absolute inset-0 bg-black/60">
            <div className="container mx-auto px-6 py-32">
              <h1 className="text-5xl font-bold text-white mb-4">Welcome to<br />Plaza Festival</h1>
              <p className="text-gray-200 mb-8 max-w-xl">Your premiere destination for dining, shopping and entertainment in the city center.</p>
              <Button size="lg" className="bg-[#8BC34A] hover:bg-[#7CB342]">
                Book Now
              </Button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="absolute inset-0 bg-black/60">
            <div className="container mx-auto px-6 py-32">
              <h1 className="text-5xl font-bold text-white mb-4">Discover Our Food Court</h1>
              <p className="text-gray-200 mb-8 max-w-xl">Enjoy a variety of delicious cuisines from around the world.</p>
              <Button size="lg" className="bg-[#8BC34A] hover:bg-[#7CB342]">
                Explore Food
              </Button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="absolute inset-0 bg-black/60">
            <div className="container mx-auto px-6 py-32">
              <h1 className="text-5xl font-bold text-white mb-4">Join Our Events</h1>
              <p className="text-gray-200 mb-8 max-w-xl">Exciting events and activities for everyone, all year round.</p>
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
